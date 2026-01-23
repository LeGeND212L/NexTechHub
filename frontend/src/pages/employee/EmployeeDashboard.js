import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
    FaTasks,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaCalendar,
    FaArrowRight,
    FaChartLine,
    FaSignOutAlt,
    FaUser
} from 'react-icons/fa';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [stats, setStats] = useState(() => {
        // Try to load cached stats for instant display
        const cached = sessionStorage.getItem('employeeDashboardStats');
        return cached ? JSON.parse(cached) : {
            totalTasks: 0,
            pendingTasks: 0,
            inProgressTasks: 0,
            completedTasks: 0,
            overdueTasks: 0
        };
    });
    const [recentTasks, setRecentTasks] = useState(() => {
        const cached = sessionStorage.getItem('employeeRecentTasks');
        return cached ? JSON.parse(cached) : [];
    });
    const [loading, setLoading] = useState(() => {
        // If we have cached data, don't show loading
        return !sessionStorage.getItem('employeeDashboardStats');
    });

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        // Clear cached dashboard data on logout
        sessionStorage.removeItem('employeeDashboardStats');
        sessionStorage.removeItem('employeeRecentTasks');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Use the employee-specific dashboard endpoint
            const res = await axios.get('/api/employees/dashboard', config);
            const dashboardData = res.data.data;

            const newStats = {
                totalTasks: dashboardData.statistics.total,
                pendingTasks: dashboardData.statistics.pending,
                inProgressTasks: dashboardData.statistics.inProgress,
                completedTasks: dashboardData.statistics.completed,
                overdueTasks: dashboardData.statistics.overdue
            };

            setStats(newStats);
            setRecentTasks(dashboardData.upcomingTasks || []);

            // Cache for instant display on next visit
            sessionStorage.setItem('employeeDashboardStats', JSON.stringify(newStats));
            sessionStorage.setItem('employeeRecentTasks', JSON.stringify(dashboardData.upcomingTasks || []));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return '#10b981';
            case 'in-progress': return '#082A4E';
            default: return '#f59e0b';
        }
    };

    if (loading) {
        return (
            <div className="employee-loading">
                <div className="spinner-large"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="employee-dashboard">
            <div className="dashboard-welcome">
                <div>
                    <h1>Welcome back, {user?.name}! 👋</h1>
                    <p>Here's an overview of your tasks and progress</p>
                </div>
                <div className="welcome-actions">
                    <Link to="/employee/profile" className="btn-profile">
                        <FaUser /> Profile
                    </Link>
                    <button className="btn-logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                <div
                    className="stat-card clickable"
                    style={{ '--card-color': '#667eea', cursor: 'pointer' }}
                    onClick={() => navigate('/employee/tasks', { state: { filter: 'all' } })}
                >
                    <div className="stat-icon" style={{ background: '#667eea' }}>
                        <FaTasks />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.totalTasks}</h3>
                        <p>Total Tasks</p>
                    </div>
                </div>

                <div
                    className="stat-card clickable"
                    style={{ '--card-color': '#f59e0b', cursor: 'pointer' }}
                    onClick={() => navigate('/employee/tasks', { state: { filter: 'pending' } })}
                >
                    <div className="stat-icon" style={{ background: '#f59e0b' }}>
                        <FaClock />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.pendingTasks}</h3>
                        <p>Pending</p>
                    </div>
                </div>

                <div
                    className="stat-card clickable"
                    style={{ '--card-color': '#082A4E', cursor: 'pointer' }}
                    onClick={() => navigate('/employee/tasks', { state: { filter: 'in-progress' } })}
                >
                    <div className="stat-icon" style={{ background: '#082A4E' }}>
                        <FaChartLine />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.inProgressTasks}</h3>
                        <p>In Progress</p>
                    </div>
                </div>

                <div
                    className="stat-card clickable"
                    style={{ '--card-color': '#10b981', cursor: 'pointer' }}
                    onClick={() => navigate('/employee/tasks', { state: { filter: 'completed' } })}
                >
                    <div className="stat-icon" style={{ background: '#10b981' }}>
                        <FaCheckCircle />
                    </div>
                    <div className="stat-content">
                        <h3>{stats.completedTasks}</h3>
                        <p>Completed</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-tasks-card">
                    <div className="card-header">
                        <h2>Recent Tasks</h2>
                        <Link to="/employee/tasks" className="view-all-link">
                            View All <FaArrowRight />
                        </Link>
                    </div>
                    <div className="tasks-list">
                        {recentTasks.length > 0 ? (
                            recentTasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="task-item clickable"
                                    onClick={() => navigate('/employee/tasks', { state: { taskId: task._id } })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="task-status-indicator" style={{ background: getStatusColor(task.status) }}></div>
                                    <div className="task-info">
                                        <h4>{task.title}</h4>
                                        <p>{task.description?.substring(0, 60)}...</p>
                                    </div>
                                    <div className="task-meta">
                                        <span className={`task-status ${task.status}`}>
                                            {task.status === 'completed' && <FaCheckCircle />}
                                            {task.status === 'in-progress' && <FaClock />}
                                            {task.status === 'pending' && <FaExclamationTriangle />}
                                            {task.status}
                                        </span>
                                        <span className="task-deadline">
                                            <FaCalendar />
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-tasks-message">
                                <FaTasks />
                                <p>No tasks assigned yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Logout Confirmation Modal */}
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

export default EmployeeDashboard;
