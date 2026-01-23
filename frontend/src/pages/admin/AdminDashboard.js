import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
    FaUsers,
    FaProjectDiagram,
    FaTasks,
    FaArrowUp,
    FaArrowDown,
    FaSignOutAlt,
    FaInbox,
    FaDollarSign,
    FaClock
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [stats, setStats] = useState(() => {
        // Try to load cached stats for instant display
        const cached = sessionStorage.getItem('adminDashboardStats');
        return cached ? JSON.parse(cached) : {
            totalEmployees: 0,
            activeProjects: 0,
            pendingTasks: 0,
            unreadMessages: 0,
            employeeTrend: 0,
            projectTrend: 0,
            taskTrend: 0,
            messageTrend: 0
        };
    });
    const [loading, setLoading] = useState(() => {
        // If we have cached data, don't show loading
        return !sessionStorage.getItem('adminDashboardStats');
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        // Clear cached dashboard data on logout
        sessionStorage.removeItem('adminDashboardStats');
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const fetchDashboardData = async () => {
        try {
            // Use single optimized dashboard endpoint
            const res = await api.get('/admin/dashboard');
            const data = res.data.data;

            const newStats = {
                totalEmployees: data.statistics.employees.total,
                activeProjects: data.statistics.projects.active,
                pendingTasks: data.statistics.tasks.pending,
                unreadMessages: data.statistics.messages?.unread || 0,
                employeeTrend: 12,
                projectTrend: 8,
                taskTrend: -5,
                messageTrend: data.statistics.messages?.unread > 0 ? 100 : 0
            };

            setStats(newStats);
            // Cache for instant display on next visit
            sessionStorage.setItem('adminDashboardStats', JSON.stringify(newStats));
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setLoading(false);
        }
    };

    const statsCards = [
        {
            title: 'Total Employees',
            value: stats.totalEmployees,
            icon: <FaUsers />,
            color: '#667eea',
            link: '/admin/employees',
            trend: stats.employeeTrend
        },
        {
            title: 'Active Projects',
            value: stats.activeProjects,
            icon: <FaProjectDiagram />,
            color: '#10b981',
            link: '/admin/projects',
            trend: stats.projectTrend
        },
        {
            title: 'Pending Tasks',
            value: stats.pendingTasks,
            icon: <FaTasks />,
            color: '#f59e0b',
            link: '/admin/tasks',
            trend: stats.taskTrend
        },
        {
            title: 'New Messages',
            value: stats.unreadMessages,
            icon: <FaInbox />,
            color: '#ef4444',
            link: '/admin/messages',
            trend: stats.messageTrend
        }
    ];

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner-large"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Welcome back! Here's what's happening today.</p>
                </div>
                <div className="header-actions">
                    <Link to="/admin/employees" className="btn btn-primary">
                        <FaUsers /> Manage Team
                    </Link>
                    <button className="btn btn-logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            <div className="stats-grid">
                {statsCards.map((stat, index) => (
                    <Link
                        to={stat.link}
                        key={index}
                        className="stat-card"
                        style={{ '--card-color': stat.color }}
                    >
                        <div className="stat-icon" style={{ background: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <h3>{stat.value}</h3>
                            <p>{stat.title}</p>
                            <div className={`stat-trend ${stat.trend >= 0 ? 'positive' : 'negative'}`}>
                                {stat.trend >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                                <span>{Math.abs(stat.trend)}%</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>Quick Actions</h2>
                    </div>
                    <div className="quick-actions">
                        <Link to="/admin/employees" className="action-btn">
                            <div className="action-icon" style={{ background: '#667eea' }}>
                                <FaUsers />
                            </div>
                            <span>Add Employee</span>
                        </Link>
                        <Link to="/admin/projects" className="action-btn">
                            <div className="action-icon" style={{ background: '#10b981' }}>
                                <FaProjectDiagram />
                            </div>
                            <span>Create Project</span>
                        </Link>
                        <Link to="/admin/tasks" className="action-btn">
                            <div className="action-icon" style={{ background: '#f59e0b' }}>
                                <FaTasks />
                            </div>
                            <span>Assign Task</span>
                        </Link>
                        <Link to="/admin/payments" className="action-btn">
                            <div className="action-icon" style={{ background: '#8b5cf6' }}>
                                <FaDollarSign />
                            </div>
                            <span>Process Payment</span>
                        </Link>
                        <Link to="/admin/messages" className="action-btn">
                            <div className="action-icon" style={{ background: '#3b82f6' }}>
                                <FaInbox />
                            </div>
                            <span>View Messages</span>
                        </Link>
                    </div>
                </div>

                <div className="dashboard-card">
                    <div className="card-header">
                        <h2>System Overview</h2>
                    </div>
                    <div className="system-overview">
                        <div className="overview-item">
                            <div className="overview-label">
                                <FaClock />
                                <span>This Month</span>
                            </div>
                            <div className="overview-stats">
                                <div className="overview-stat">
                                    <h4>{stats.activeProjects}</h4>
                                    <p>Projects</p>
                                </div>
                                <div className="overview-stat">
                                    <h4>{stats.pendingTasks}</h4>
                                    <p>Tasks</p>
                                </div>
                                <div className="overview-stat">
                                    <h4>{stats.totalEmployees}</h4>
                                    <p>Active Staff</p>
                                </div>
                            </div>
                        </div>
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

export default AdminDashboard;
