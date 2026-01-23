import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
    FaTasks,
    FaCalendar,
    FaFlag,
    FaFile,
    FaArrowLeft,
    FaSignOutAlt,
    FaEye,
    FaDownload,
    FaFolderOpen,
    FaProjectDiagram,
    FaFileAlt
} from 'react-icons/fa';
import './EmployeeTasks.css';
import { getSocket } from '../../utils/socket';

const EmployeeTasks = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(location.state?.filter || 'all');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [expandedProjectDocs, setExpandedProjectDocs] = useState({});
    const [expandedTaskDocs, setExpandedTaskDocs] = useState({});

    const toggleProjectDocs = (taskId) => {
        setExpandedProjectDocs(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const toggleTaskDocs = (taskId) => {
        setExpandedTaskDocs(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
    };

    const handleViewFile = (projectId, fileId) => {
        const token = localStorage.getItem('token');
        // Use hardcoded base URL to avoid double /api issue
        const baseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : 'https://vender-hao6.onrender.com';
        const url = `${baseUrl}/api/projects/${projectId}/files/${fileId}/view?token=${token}`;
        window.open(url, '_blank');
    };

    const handleDownloadFile = (projectId, fileId, fileName) => {
        const token = localStorage.getItem('token');
        const baseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : 'https://vender-hao6.onrender.com';
        const url = `${baseUrl}/api/projects/${projectId}/files/${fileId}/download?token=${token}`;

        // Create a temporary anchor to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleViewTaskFile = (taskId, fileId) => {
        const token = localStorage.getItem('token');
        const baseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : 'https://vender-hao6.onrender.com';
        const url = `${baseUrl}/api/employees/tasks/${taskId}/files/${fileId}/view?token=${token}`;
        window.open(url, '_blank');
    };

    const handleDownloadTaskFile = (taskId, fileId, fileName) => {
        const token = localStorage.getItem('token');
        const baseUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:5000'
            : 'https://vender-hao6.onrender.com';
        const url = `${baseUrl}/api/employees/tasks/${taskId}/files/${fileId}/download?token=${token}`;

        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        fetchTasks();

        const socket = getSocket();

        const onTaskCreated = ({ task }) => {
            if (!task?._id) return;
            setTasks((prev) => {
                const exists = prev.some((t) => t._id === task._id);
                return exists ? prev : [task, ...prev];
            });
        };

        const onTaskUpdated = ({ task }) => {
            if (!task?._id) return;
            setTasks((prev) => prev.map((t) => (t._id === task._id ? task : t)));
        };

        const onTaskDeleted = ({ taskId }) => {
            if (!taskId) return;
            setTasks((prev) => prev.filter((t) => t._id !== taskId));
        };

        socket.on('task:created', onTaskCreated);
        socket.on('task:updated', onTaskUpdated);
        socket.on('task:deleted', onTaskDeleted);

        // Scroll to specific task if provided
        if (location.state?.taskId) {
            setTimeout(() => {
                const element = document.getElementById(`task-${location.state.taskId}`);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 500);
        }

        return () => {
            socket.off('task:created', onTaskCreated);
            socket.off('task:updated', onTaskUpdated);
            socket.off('task:deleted', onTaskDeleted);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const fetchTasks = async () => {
        try {
            // Use the employee-specific tasks endpoint
            const res = await api.get('/employees/tasks');
            const myTasks = res.data.data || [];

            console.log('Employee tasks:', myTasks);

            setTasks(myTasks);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to fetch tasks');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            // Use the employee-specific status update endpoint
            await api.put(`/employees/tasks/${taskId}/status`, { status: newStatus });

            // Update state immediately without refetching
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? { ...task, status: newStatus } : task
                )
            );

            toast.success('Task status updated successfully!');
        } catch (error) {
            console.error('Error updating task:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Failed to update task status');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#10b981';
            default: return '#64748b';
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        return task.status === filter;
    });

    if (loading) {
        return (
            <div className="tasks-loading">
                <div className="spinner-large"></div>
                <p>Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="employee-tasks">
            <div className="tasks-header">
                <div className="header-left">
                    <h1><FaTasks /> My Tasks</h1>
                    <p>Manage your assigned tasks and track progress</p>
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

            <div className="filter-tabs">
                <button
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    All ({tasks.length})
                </button>
                <button
                    className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    Pending ({tasks.filter(t => t.status === 'pending').length})
                </button>
                <button
                    className={`filter-tab ${filter === 'in-progress' ? 'active' : ''}`}
                    onClick={() => setFilter('in-progress')}
                >
                    In Progress ({tasks.filter(t => t.status === 'in-progress').length})
                </button>
                <button
                    className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilter('completed')}
                >
                    Completed ({tasks.filter(t => t.status === 'completed').length})
                </button>
            </div>

            <div className="tasks-grid">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <div key={task._id} className="task-card">
                            <div className="task-header">
                                <h3>{task.title}</h3>
                                <div className="task-badges">
                                    <span className="priority-badge" style={{ background: getPriorityColor(task.priority) }}>
                                        <FaFlag /> {task.priority}
                                    </span>
                                </div>
                            </div>

                            <p className="task-description">{task.description}</p>

                            {/* Project Info */}
                            {task.project && (
                                <div className="task-project-info">
                                    <FaProjectDiagram />
                                    <span>Project: {task.project.title}</span>
                                </div>
                            )}

                            <div className="task-info">
                                <div className="info-item">
                                    <FaCalendar />
                                    <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                                {task.files?.length > 0 && (
                                    <div className="info-item">
                                        <FaFileAlt />
                                        <span>Task Attachments: {task.files.length}</span>
                                    </div>
                                )}
                            </div>

                            {/* Task Documents Section (Admin Attachments) */}
                            {task.files && task.files.length > 0 && (
                                <div className="project-documents-section">
                                    <button
                                        className="toggle-docs-btn"
                                        onClick={() => toggleTaskDocs(task._id)}
                                    >
                                        <FaFileAlt />
                                        Task Attachments ({task.files.length})
                                        <span className={`toggle-arrow ${expandedTaskDocs[task._id] ? 'expanded' : ''}`}>▼</span>
                                    </button>

                                    {expandedTaskDocs[task._id] && (
                                        <div className="project-docs-list">
                                            {task.files.map((file) => (
                                                <div key={file._id} className="project-doc-item">
                                                    <div className="doc-info">
                                                        <FaFile />
                                                        <span className="doc-name">{file.originalName}</span>
                                                        <span className="doc-source">
                                                            {file.source === 'contact' ? '(Client Upload)' : '(Admin Upload)'}
                                                        </span>
                                                    </div>
                                                    <div className="doc-actions">
                                                        <button
                                                            className="btn-view-doc"
                                                            onClick={() => handleViewTaskFile(task._id, file._id)}
                                                            title="View File"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            className="btn-download-doc"
                                                            onClick={() => handleDownloadTaskFile(task._id, file._id, file.originalName)}
                                                            title="Download File"
                                                        >
                                                            <FaDownload />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Project Documents Section */}
                            {task.project?.files && task.project.files.length > 0 && (
                                <div className="project-documents-section">
                                    <button
                                        className="toggle-docs-btn"
                                        onClick={() => toggleProjectDocs(task._id)}
                                    >
                                        <FaFolderOpen />
                                        Project Documents ({task.project.files.length})
                                        <span className={`toggle-arrow ${expandedProjectDocs[task._id] ? 'expanded' : ''}`}>▼</span>
                                    </button>

                                    {expandedProjectDocs[task._id] && (
                                        <div className="project-docs-list">
                                            {task.project.files.map((file) => (
                                                <div key={file._id} className="project-doc-item">
                                                    <div className="doc-info">
                                                        <FaFile />
                                                        <span className="doc-name">{file.originalName}</span>
                                                        <span className="doc-source">
                                                            {file.source === 'contact' ? '(Client Upload)' : '(Admin Upload)'}
                                                        </span>
                                                    </div>
                                                    <div className="doc-actions">
                                                        <button
                                                            className="btn-view-doc"
                                                            onClick={() => handleViewFile(task.project._id, file._id)}
                                                            title="View File"
                                                        >
                                                            <FaEye />
                                                        </button>
                                                        <button
                                                            className="btn-download-doc"
                                                            onClick={() => handleDownloadFile(task.project._id, file._id, file.originalName)}
                                                            title="Download File"
                                                        >
                                                            <FaDownload />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="task-actions">
                                <select
                                    value={task.status}
                                    onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                                    className="status-select"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-tasks">
                        <FaTasks />
                        <p>No tasks found for this filter</p>
                    </div>
                )}
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

export default EmployeeTasks;
