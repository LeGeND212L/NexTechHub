import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
    FaDollarSign,
    FaPlus,
    FaDownload,
    FaTimes,
    FaUser,
    FaCalendar,
    FaCheckCircle,
    FaHistory,
    FaFileInvoiceDollar,
    FaArrowLeft,
    FaSignOutAlt
} from 'react-icons/fa';
import './PaymentManagement.css';

const PaymentManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [payments, setPayments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [formData, setFormData] = useState({
        employee: '',
        amount: '',
        month: '',
        year: new Date().getFullYear().toString()
    });

    useEffect(() => {
        fetchData();
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
        setShowLogoutModal(false);
    };

    const fetchData = async () => {
        try {
            const [paymentsRes, employeesRes] = await Promise.all([
                api.get('/payments'),
                api.get('/admin/employees')
            ]);
            setPayments(paymentsRes.data.data || []);
            setEmployees(employeesRes.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setFormData({
            employee: '',
            amount: '',
            month: '',
            year: new Date().getFullYear().toString()
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'employee') {
            const selectedEmp = employees.find(emp => emp._id === value);
            setFormData({
                ...formData,
                employee: value,
                amount: selectedEmp?.salary || ''
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // === VALIDATION 1: Check all required fields are filled ===
        if (!formData.employee || !formData.amount || !formData.month || !formData.year) {
            toast.error('❌ Please fill in all required fields');
            return;
        }

        // === VALIDATION 2: Validate payment amount ===
        const amount = Number(formData.amount);
        if (isNaN(amount) || amount <= 0) {
            toast.error('❌ Please enter a valid payment amount (must be greater than 0)');
            return;
        }

        if (amount > 500000) {
            toast.error('❌ Payment amount cannot exceed 500,000 PKR');
            return;
        }

        // === VALIDATION 3: Prevent future year payments ===
        const currentYear = new Date().getFullYear();
        const year = Number(formData.year);
        if (year > currentYear) {
            toast.error('❌ Cannot record payment for future years');
            return;
        }

        // === VALIDATION 4: Prevent payments for current future months ===
        const currentMonth = new Date().getMonth(); // 0-11
        const monthIndex = months.indexOf(formData.month);
        if (year === currentYear && monthIndex > currentMonth) {
            toast.error('❌ Cannot record payment for future months in the current year');
            return;
        }

        // === VALIDATION 5: Check if same month salary already recorded (DUPLICATE MONTH) ===
        const isLocked = payments.some((p) => {
            const sameEmployee = (p.employee?._id || p.employee) === formData.employee;
            const sameMonth = String(p.month) === String(formData.month);
            const sameYear = String(p.year) === String(formData.year);
            const isPaid = (p.status || 'paid') === 'paid';
            return sameEmployee && sameMonth && sameYear && isPaid;
        });

        if (isLocked) {
            toast.error('🔒 This month is locked for this employee (salary already recorded)');
            return;
        }

        // === VALIDATION 6: Prevent multiple payments in same month (pending) ===
        const hasPendingPayment = payments.some((p) => {
            const sameEmployee = (p.employee?._id || p.employee) === formData.employee;
            const sameMonth = String(p.month) === String(formData.month);
            const sameYear = String(p.year) === String(formData.year);
            return sameEmployee && sameMonth && sameYear;
        });

        if (hasPendingPayment) {
            toast.error('⚠️ A payment for this employee in this month already exists');
            return;
        }

        // === VALIDATION 7: Check if employee still exists (not deleted) ===
        const selectedEmployee = employees.find(emp => emp._id === formData.employee);
        if (!selectedEmployee) {
            toast.error('❌ Selected employee no longer exists');
            return;
        }

        try {
            // Prepare payment data with proper types and required fields
            const paymentData = {
                employee: formData.employee,
                amount: Number(formData.amount),
                month: formData.month,
                year: Number(formData.year),
                bonus: 0,
                deductions: 0,
                paymentMethod: 'bank-transfer',
                status: 'paid'
            };

            console.log('Creating payment with data:', paymentData);

            const response = await api.post('/payments', paymentData);
            console.log('Payment response:', response.data);

            // Add new payment to state immediately
            setPayments(prevPayments => [response.data.data, ...prevPayments]);

            toast.success('Payment recorded successfully!');
            handleCloseModal();
        } catch (error) {
            console.error('Error recording payment:', error);
            toast.error(error.response?.data?.message || 'Failed to record payment');
        }
    };

    const downloadPayslip = async (paymentId) => {
        try {
            const response = await api.get(`/payments/${paymentId}/payslip`, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `payslip-${paymentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success('Payslip downloaded successfully!');
        } catch (error) {
            console.error('Error downloading payslip:', error);
            toast.error('Failed to download payslip');
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (loading) {
        return (
            <div className="payment-loading">
                <div className="spinner-large"></div>
                <p>Loading payments...</p>
            </div>
        );
    }

    return (
        <div className="payment-management">
            <div className="payment-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1><FaDollarSign /> Payment Management</h1>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={handleOpenModal}>
                        <FaPlus /> Record Payment
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            <div className="payment-table-container">
                <table className="payment-table">
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Amount</th>
                            <th>Period</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length > 0 ? (
                            payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td>
                                        <div className="employee-info">
                                            <div className="employee-avatar">
                                                {payment.employee?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="employee-name">{payment.employee?.name}</div>
                                                <div className="employee-email">{payment.employee?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="amount">PKR {Number(payment.amount).toLocaleString()}</td>
                                    <td>{payment.month} {payment.year}</td>
                                    <td>{new Date(payment.paymentDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className="status-badge paid">
                                            <FaCheckCircle /> Paid
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-icon btn-download"
                                            onClick={() => downloadPayslip(payment._id)}
                                            title="Download Payslip"
                                        >
                                            <FaDownload />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    <FaHistory />
                                    <p>No payment records found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2><FaFileInvoiceDollar /> Record Payment</h2>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label><FaUser /> Select Employee</label>
                                <select
                                    name="employee"
                                    value={formData.employee}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Choose an employee</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp._id}>
                                            {emp.name} - {emp.department} (PKR {Number(emp.salary).toLocaleString()}/month)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label><FaDollarSign /> Payment Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter amount"
                                    min="0"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label><FaCalendar /> Month *</label>
                                    <select
                                        name="month"
                                        value={formData.month}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Month</option>
                                        {months.map((month, idx) => {
                                            const currentMonth = new Date().getMonth();
                                            const currentYear = new Date().getFullYear();
                                            const isDisabled = Number(formData.year) === currentYear && idx > currentMonth;
                                            return (
                                                <option key={month} value={month} disabled={isDisabled}>
                                                    {month} {isDisabled ? '(Future)' : ''}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label><FaCalendar /> Year *</label>
                                    <input
                                        type="number"
                                        name="year"
                                        value={formData.year}
                                        onChange={handleChange}
                                        required
                                        min="2020"
                                        max={new Date().getFullYear()}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Record Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showLogoutModal && (
                <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
                    <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="logout-modal-header">
                            <FaSignOutAlt />
                            <h2>Confirm Logout</h2>
                        </div>
                        <p className="logout-modal-message">Are you sure you want to logout?</p>
                        <div className="logout-modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={confirmLogout}>
                                <FaSignOutAlt /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentManagement;
