import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
    FaUser,
    FaEnvelope,
    FaBuilding,
    FaDollarSign,
    FaDownload,
    FaCalendar,
    FaCheckCircle,
    FaHistory,
    FaArrowLeft,
    FaSignOutAlt
} from 'react-icons/fa';
import './EmployeeProfile.css';

const EmployeeProfile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState(null);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
        setShowLogoutModal(false);
    };

    useEffect(() => {
        fetchProfileData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            console.log('Fetching employee profile...');

            const [employeeRes, paymentsRes] = await Promise.all([
                axios.get('/api/employees/profile', config),
                axios.get('/api/payments', config)
            ]);

            console.log('Employee data:', employeeRes.data);
            setEmployeeData(employeeRes.data.data);

            // Filter payments for current user
            const currentUserId = employeeRes.data.data._id;
            const myPayments = paymentsRes.data.data?.filter(
                payment => {
                    const paymentEmployeeId = payment.employee?._id || payment.employee;
                    return paymentEmployeeId && paymentEmployeeId.toString() === currentUserId?.toString();
                }
            ) || [];

            setPayments(myPayments);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile data:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to fetch profile data');
            setLoading(false);
        }
    };

    const downloadPayslip = async (paymentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/payments/${paymentId}/payslip`, {
                headers: { Authorization: `Bearer ${token}` },
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

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner-large"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="employee-profile">
            <div className="profile-header">
                <div className="header-left">
                    <h1><FaUser /> My Profile</h1>
                    <p>View your personal information and payment history</p>
                </div>
                <div className="header-actions">
                    <button
                        className="back-btn"
                        onClick={() => navigate('/employee/dashboard')}
                        title="Back to Dashboard"
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-info-card">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar">
                            {employeeData?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h2>{employeeData?.name}</h2>
                        <span className="role-badge">{employeeData?.role}</span>
                    </div>

                    <div className="profile-details">
                        <div className="detail-item">
                            <div className="detail-icon">
                                <FaEnvelope />
                            </div>
                            <div className="detail-content">
                                <label>Email</label>
                                <p>{employeeData?.email}</p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <FaBuilding />
                            </div>
                            <div className="detail-content">
                                <label>Department</label>
                                <p>{employeeData?.department || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="detail-item">
                            <div className="detail-icon">
                                <FaDollarSign />
                            </div>
                            <div className="detail-content">
                                <label>Monthly Salary</label>
                                <p className="salary-amount">
                                    PKR {employeeData?.salary ? Number(employeeData.salary).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="payment-history-card">
                    <div className="card-header">
                        <h2><FaHistory /> Payment History</h2>
                    </div>

                    {payments.length > 0 ? (
                        <div className="payments-table-container">
                            <table className="payments-table">
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Amount</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment) => (
                                        <tr key={payment._id}>
                                            <td>{payment.month} {payment.year}</td>
                                            <td className="amount">PKR {Number(payment.amount).toLocaleString()}</td>
                                            <td>
                                                <div className="date-cell">
                                                    <FaCalendar />
                                                    {new Date(payment.paymentDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td>
                                                <span className="status-badge paid">
                                                    <FaCheckCircle /> Paid
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="download-btn"
                                                    onClick={() => downloadPayslip(payment._id)}
                                                    title="Download Payslip"
                                                >
                                                    <FaDownload /> Download
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="no-payments">
                            <FaHistory />
                            <p>No payment history available</p>
                        </div>
                    )}
                </div>
            </div>

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

export default EmployeeProfile;
