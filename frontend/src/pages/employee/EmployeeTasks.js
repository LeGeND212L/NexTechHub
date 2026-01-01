import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
    FaTasks,
    FaCalendar,
    FaFlag,
    FaUpload,
    FaFile,
    FaArrowLeft,
    FaSignOutAlt
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
    const [selectedTask, setSelectedTask] = useState(null);
    const [file, setFile] = useState(null);

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
        if (window.confirm('Are you sure you want to logout?')) {
            logout();
            navigate('/login');
            toast.success('Logged out successfully');
        }
    };

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Use the employee-specific tasks endpoint
            const res = await axios.get('/api/employees/tasks', config);
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
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            // Use the employee-specific status update endpoint
            await axios.put(`/api/employees/tasks/${taskId}/status`, { status: newStatus }, config);

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

    const handleFileUpload = async (taskId) => {
        if (!file) {
            toast.error('Please select a file');
            return;
        }

        const formData = new FormData();
        formData.append('taskFile', file);

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            await axios.post(`/api/employees/tasks/${taskId}/upload`, formData, config);
            toast.success('File uploaded successfully!');
            setFile(null);
            setSelectedTask(null);
            fetchTasks();
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error(error.response?.data?.message || 'Failed to upload file');
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

                            <div className="task-info">
                                <div className="info-item">
                                    <FaCalendar />
                                    <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                                {task.files?.length > 0 && (
                                    <div className="info-item">
                                        <FaFile />
                                        <span>Uploads: {task.files.length}</span>
                                    </div>
                                )}
                            </div>

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

                                <button
                                    className="upload-btn"
                                    onClick={() => setSelectedTask(task._id)}
                                >
                                    <FaUpload /> Upload File
                                </button>
                            </div>

                            {selectedTask === task._id && (
                                <div className="file-upload-section">
                                    <input
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="file-input"
                                    />
                                    <div className="upload-actions">
                                        <button
                                            className="btn-upload"
                                            onClick={() => handleFileUpload(task._id)}
                                        >
                                            Upload
                                        </button>
                                        <button
                                            className="btn-cancel"
                                            onClick={() => { setSelectedTask(null); setFile(null); }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-tasks">
                        <FaTasks />
                        <p>No tasks found for this filter</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeTasks;
