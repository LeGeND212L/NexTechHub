import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import {
    FaUsers,
    FaProjectDiagram,
    FaTasks,
    FaUserTie,
    FaClock,
    FaDollarSign,
    FaArrowUp,
    FaArrowDown,
    FaSignOutAlt,
    FaExclamationTriangle
} from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [stats, setStats] = useState({
        totalEmployees: 0,
        activeProjects: 0,
        pendingTasks: 0,
        totalClients: 0,
        employeeTrend: 0,
        projectTrend: 0,
        taskTrend: 0,
        clientTrend: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        setShowLogoutDialog(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const cancelLogout = () => {
        setShowLogoutDialog(false);
    };

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const [employeesRes, projectsRes, tasksRes, reviewsRes] = await Promise.all([
                axios.get('/api/admin/employees', config),
                axios.get('/api/projects', config),
                axios.get('/api/tasks', config),
                axios.get('/api/reviews', config)
            ]);

            const employees = employeesRes.data.data || [];
            const projects = projectsRes.data.data || [];
            const tasks = tasksRes.data.data || [];
            const reviews = reviewsRes.data.data || [];

            setStats({
                totalEmployees: employees.length,
                activeProjects: projects.filter(p => p.status !== 'completed').length,
                pendingTasks: tasks.filter(t => t.status === 'pending').length,
                totalClients: reviews.length,
                employeeTrend: 12,
                projectTrend: 8,
                taskTrend: -5,
                clientTrend: 15
            });

            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setStats({
                totalEmployees: 0,
                activeProjects: 0,
                pendingTasks: 0,
                totalClients: 0,
                employeeTrend: 0,
                projectTrend: 0,
                taskTrend: 0,
                clientTrend: 0
            });
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
            title: 'Total Clients',
            value: stats.totalClients,
            icon: <FaUserTie />,
            color: '#ef4444',
            link: '/admin/reviews',
            trend: stats.clientTrend
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

            {/* Logout Confirmation Dialog */}
            {showLogoutDialog && (
                <div className="logout-modal-overlay" onClick={cancelLogout}>
                    <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="logout-modal-icon">
                            <FaExclamationTriangle />
                        </div>
                        <h3 className="logout-modal-title">Confirm Logout</h3>
                        <p className="logout-modal-message">
                            Are you sure you want to logout from the admin panel?
                        </p>
                        <div className="logout-modal-actions">
                            <button className="logout-btn-cancel" onClick={cancelLogout}>
                                Cancel
                            </button>
                            <button className="logout-btn-confirm" onClick={confirmLogout}>
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
