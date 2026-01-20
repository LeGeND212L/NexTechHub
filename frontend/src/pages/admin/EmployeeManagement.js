import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
    FaUsers,
    FaPlus,
    FaEdit,
    FaTrash,
    FaSearch,
    FaTimes,
    FaEnvelope,
    FaUserTag,
    FaBuilding,
    FaDollarSign,
    FaLock,
    FaArrowLeft,
    FaSignOutAlt,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';
import './EmployeeManagement.css';

const EmployeeManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);
    const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'employee',
        department: '',
        salary: ''
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const res = await axios.get('/api/admin/employees', config);
            setEmployees(res.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching employees:', error);
            toast.error('Failed to fetch employees');
            setLoading(false);
        }
    };

    const handleOpenModal = (type, employee = null) => {
        setModalType(type);
        if (type === 'edit' && employee) {
            setCurrentEmployee(employee);
            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                password: '',
                role: employee.role || 'employee',
                department: employee.department || '',
                salary: employee.salary || ''
            });
        } else {
            setCurrentEmployee(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'employee',
                department: '',
                salary: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentEmployee(null);
        setFormData({
            name: '',
            email: '',
            password: '',
            role: 'employee',
            department: '',
            salary: ''
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation: Check all required fields
        if (!formData.name || !formData.email || !formData.role || !formData.department || !formData.salary) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (modalType === 'add' && !formData.password) {
            toast.error('Password is required for new employee');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (modalType === 'add') {
                const response = await axios.post('/api/admin/employees', formData, config);
                toast.success('Employee added successfully!');
                // Add new employee to state immediately
                setEmployees(prevEmployees => [...prevEmployees, response.data.data]);
            } else {
                const updateData = { ...formData };
                if (!updateData.password) {
                    delete updateData.password;
                }
                const response = await axios.put(`/api/admin/employees/${currentEmployee._id}`, updateData, config);
                toast.success('Employee updated successfully!');
                // Update employee in state immediately
                setEmployees(prevEmployees =>
                    prevEmployees.map(emp =>
                        emp._id === currentEmployee._id ? response.data.data : emp
                    )
                );
            }

            handleCloseModal();
        } catch (error) {
            console.error('Error saving employee:', error);
            toast.error(error.response?.data?.message || 'Failed to save employee');
        }
    };

    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!employeeToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.delete(`/api/admin/employees/${employeeToDelete._id}`, config);
            toast.success('Employee deleted successfully!');
            // Remove employee from state immediately
            setEmployees(prevEmployees => prevEmployees.filter(emp => emp._id !== employeeToDelete._id));
            setShowDeleteModal(false);
            setEmployeeToDelete(null);
        } catch (error) {
            console.error('Error deleting employee:', error);
            toast.error('Failed to delete employee');
        }
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
        setShowLogoutModal(false);
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="employee-loading">
                <div className="spinner-large"></div>
                <p>Loading employees...</p>
            </div>
        );
    }

    return (
        <div className="employee-management">
            <div className="employee-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/admin/dashboard')} title="Back to Dashboard">
                        <FaArrowLeft /> Back
                    </button>
                    <div className="header-title">
                        <h1><FaUsers /> Employee Management</h1>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                        <FaPlus /> Add Employee
                    </button>
                    <button className="btn btn-logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            <div className="search-bar">
                <FaSearch />
                <input
                    type="text"
                    placeholder="Search employees by name, email, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="employee-table-container">
                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Department</th>
                            <th>Salary</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.length > 0 ? (
                            filteredEmployees.map((employee) => (
                                <tr key={employee._id}>
                                    <td>
                                        <div className="employee-name">
                                            <div className="employee-avatar">
                                                {employee.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <span>{employee.name}</span>
                                        </div>
                                    </td>
                                    <td>{employee.email}</td>
                                    <td>
                                        <span className={`role-badge ${employee.role}`}>
                                            {employee.role}
                                        </span>
                                    </td>
                                    <td>{employee.department || 'N/A'}</td>
                                    <td className="salary-cell">PKR {employee.salary ? Number(employee.salary).toLocaleString() : 'N/A'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="btn-icon btn-edit"
                                                onClick={() => handleOpenModal('edit', employee)}
                                                title="Edit Employee"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="btn-icon btn-delete"
                                                onClick={() => handleDeleteClick(employee)}
                                                title="Delete Employee"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="no-data">
                                    No employees found
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
                            <h2>{modalType === 'add' ? 'Add New Employee' : 'Edit Employee'}</h2>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label><FaUsers /> Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter full name"
                                />
                            </div>

                            <div className="form-group">
                                <label><FaEnvelope /> Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className="form-group">
                                <label><FaLock /> Password {modalType === 'edit' && '(Leave blank to keep current)'}</label>
                                <div className="password-input-wrapper">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required={modalType === 'add'}
                                        placeholder={modalType === 'add' ? 'Enter password (min 6 characters)' : 'Leave blank to keep current'}
                                        minLength="6"
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle-btn"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label><FaUserTag /> Role</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label><FaBuilding /> Department</label>
                                    <select
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Research Writing">Research Writing</option>
                                        <option value="Medical Writing">Medical Writing</option>
                                        <option value="Business Writing">Business Writing</option>
                                        <option value="SEO">SEO</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="Web App Development">Web App Development</option>
                                        <option value="Python">Python</option>
                                        <option value="Power BI">Power BI</option>
                                        <option value="DevOps">DevOps</option>
                                        <option value="Financial Analysis">Financial Analysis</option>
                                        <option value="Social Media Marketing">Social Media Marketing</option>
                                        <option value="UI/UX">UI/UX</option>
                                        <option value="Networking">Networking</option>
                                        <option value="Coding Projects">Coding Projects</option>
                                        <option value="Admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label><FaDollarSign /> Monthly Salary (PKR)</label>
                                <input
                                    type="number"
                                    name="salary"
                                    value={formData.salary}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter monthly salary in Pakistani Rupees"
                                    min="0"
                                    step="1000"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {modalType === 'add' ? 'Add Employee' : 'Update Employee'}
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

            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="logout-modal-header" style={{ color: '#ef4444' }}>
                            <FaTrash />
                            <h2>Delete Employee</h2>
                        </div>
                        <p className="logout-modal-message">
                            Are you sure you want to delete <strong>{employeeToDelete?.name}</strong>? This action cannot be undone.
                        </p>
                        <div className="logout-modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={confirmDelete}>
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeManagement;
