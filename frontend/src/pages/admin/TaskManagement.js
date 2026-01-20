import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
    FaTasks,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaUser,
    FaCalendar,
    FaCheckCircle,
    FaClock,
    FaExclamationCircle,
    FaFlag,
    FaFile,
    FaArrowLeft,
    FaSignOutAlt,
    FaProjectDiagram,
    FaFileAlt,
    FaUpload,
    FaCloudUploadAlt
} from 'react-icons/fa';
import './TaskManagement.css';
import { getSocket } from '../../utils/socket';

const TaskManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [projects, setProjects] = useState([]);
    const [contactDocuments, setContactDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const [modalType, setModalType] = useState('add');
    const [currentTask, setCurrentTask] = useState(null);
    const [selectedContactDocs, setSelectedContactDocs] = useState([]);
    const [localFiles, setLocalFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        project: '',
        priority: 'medium',
        deadline: '',
        status: 'pending'
    });

    useEffect(() => {
        fetchData();

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

        return () => {
            socket.off('task:created', onTaskCreated);
            socket.off('task:updated', onTaskUpdated);
            socket.off('task:deleted', onTaskDeleted);
        };
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
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const [tasksRes, employeesRes, projectsRes] = await Promise.all([
                axios.get('/api/tasks', config),
                axios.get('/api/admin/employees', config),
                axios.get('/api/projects', config)
            ]);
            setTasks(tasksRes.data.data || []);
            setEmployees(employeesRes.data.data || []);
            setProjects(projectsRes.data.data || []);

            // Fetch contact documents separately (optional)
            try {
                const contactDocsRes = await axios.get('/api/projects/contact-documents', config);
                setContactDocuments(contactDocsRes.data.data || []);
            } catch (docError) {
                console.error('Error fetching contact documents:', docError);
                setContactDocuments([]);
            }

            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to fetch data');
            setLoading(false);
        }
    };

    const getFileUrl = (file) => {
        const rawPath = file?.path || '';
        if (!rawPath) return '#';
        const normalized = rawPath.replace(/\\/g, '/');

        if (normalized.startsWith('/uploads/')) return normalized;
        if (normalized.startsWith('uploads/')) return `/${normalized}`;

        // Fallback for any other stored path formats
        return `/uploads/${normalized.replace(/^\/+/, '')}`;
    };

    const handleOpenModal = (type, task = null) => {
        setModalType(type);
        setSelectedContactDocs([]);
        setLocalFiles([]);
        if (type === 'edit' && task) {
            setCurrentTask(task);
            setFormData({
                title: task.title || '',
                description: task.description || '',
                assignedTo: task.assignedTo?._id || task.assignedTo || '',
                project: task.project?._id || task.project || '',
                priority: task.priority || 'medium',
                deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '',
                status: task.status || 'pending'
            });
        } else {
            setCurrentTask(null);
            setFormData({
                title: '',
                description: '',
                assignedTo: '',
                project: '',
                priority: 'medium',
                deadline: '',
                status: 'pending'
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentTask(null);
        setSelectedContactDocs([]);
        setLocalFiles([]);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleContactDocSelect = (docId) => {
        setSelectedContactDocs(prev => {
            if (prev.includes(docId)) {
                return prev.filter(id => id !== docId);
            } else {
                return [...prev, docId];
            }
        });
    };

    const handleLocalFileChange = (e) => {
        const files = Array.from(e.target.files);
        setLocalFiles(prev => [...prev, ...files]);
    };

    const removeLocalFile = (index) => {
        setLocalFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.description || !formData.assignedTo || !formData.deadline || !formData.project) {
            toast.error('Please fill in all required fields including project selection');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const taskData = { ...formData };
            let taskId;

            if (modalType === 'add') {
                const response = await axios.post('/api/tasks', taskData, config);
                taskId = response.data.data._id;
                toast.success('Task created successfully!');

                // Upload files after task creation
                if (localFiles.length > 0 || selectedContactDocs.length > 0) {
                    setUploadingFiles(true);

                    // Upload local files
                    for (const file of localFiles) {
                        const formDataUpload = new FormData();
                        formDataUpload.append('taskFile', file);
                        await axios.post(`/api/tasks/${taskId}/upload`, formDataUpload, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    }

                    // Attach contact documents
                    for (const contactId of selectedContactDocs) {
                        await axios.post(`/api/tasks/${taskId}/attach-contact-document`,
                            { contactId },
                            config
                        );
                    }

                    setUploadingFiles(false);
                }

                // Refresh to get updated task with files
                fetchData();
            } else {
                await axios.put(`/api/tasks/${currentTask._id}`, taskData, config);
                taskId = currentTask._id;
                toast.success('Task updated successfully!');

                // Upload any new files
                if (localFiles.length > 0 || selectedContactDocs.length > 0) {
                    setUploadingFiles(true);

                    // Upload local files
                    for (const file of localFiles) {
                        const formDataUpload = new FormData();
                        formDataUpload.append('taskFile', file);
                        await axios.post(`/api/tasks/${taskId}/upload`, formDataUpload, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    }

                    // Attach contact documents
                    for (const contactId of selectedContactDocs) {
                        await axios.post(`/api/tasks/${taskId}/attach-contact-document`,
                            { contactId },
                            config
                        );
                    }

                    setUploadingFiles(false);
                }

                // Refresh to get updated task with files
                fetchData();
            }

            handleCloseModal();
        } catch (error) {
            console.error('Error saving task:', error);
            toast.error(error.response?.data?.message || 'Failed to save task');
        }
    };

    const handleDeleteClick = (task) => {
        setTaskToDelete(task);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!taskToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            await axios.delete(`/api/tasks/${taskToDelete._id}`, config);
            toast.success('Task deleted successfully!');
            // Remove task from state immediately
            setTasks(prevTasks => prevTasks.filter(task => task._id !== taskToDelete._id));
            setShowDeleteModal(false);
            setTaskToDelete(null);
        } catch (error) {
            console.error('Error deleting task:', error);
            toast.error('Failed to delete task');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FaCheckCircle />;
            case 'in-progress': return <FaClock />;
            default: return <FaExclamationCircle />;
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

    if (loading) {
        return (
            <div className="task-loading">
                <div className="spinner-large"></div>
                <p>Loading tasks...</p>
            </div>
        );
    }

    return (
        <div className="task-management">
            <div className="task-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1><FaTasks /> Task Management</h1>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                        <FaPlus /> Assign Task
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            <div className="tasks-grid">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div key={task._id} className="task-card">
                            <div className="task-card-header">
                                <div className="task-title-section">
                                    <h3>{task.title}</h3>
                                    <div className="task-badges">
                                        <span className={`status-badge ${task.status}`}>
                                            {getStatusIcon(task.status)}
                                            {task.status}
                                        </span>
                                        <span className="priority-badge" style={{ background: getPriorityColor(task.priority) }}>
                                            <FaFlag />
                                            {task.priority}
                                        </span>
                                    </div>
                                </div>
                                <div className="task-actions">
                                    <button className="btn-icon btn-edit" onClick={() => handleOpenModal('edit', task)}>
                                        <FaEdit />
                                    </button>
                                    <button className="btn-icon btn-delete" onClick={() => handleDeleteClick(task)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <p className="task-description">{task.description}</p>
                            <div className="task-info">
                                <div className="info-item">
                                    <FaUser />
                                    <span>{task.assignedTo?.name || 'Not assigned'}</span>
                                </div>
                                <div className="info-item">
                                    <FaCalendar />
                                    <span>{new Date(task.deadline).toLocaleDateString()}</span>
                                </div>
                                {task.files?.length > 0 && (
                                    <div className="info-item">
                                        <FaFile />
                                        <span>Uploads: {task.files.length}</span>
                                    </div>
                                )}
                            </div>

                            {task.files?.length > 0 && (
                                <div className="task-files">
                                    <div className="task-files-title">
                                        <FaFile /> Uploaded Files
                                    </div>
                                    <div className="task-files-list">
                                        {task.files
                                            .slice()
                                            .reverse()
                                            .map((f, idx) => (
                                                <a
                                                    key={`${task._id}-file-${idx}`}
                                                    href={getFileUrl(f)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="task-file-link"
                                                    title={f.originalName || f.filename}
                                                >
                                                    {f.originalName || f.filename}
                                                </a>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="no-tasks">
                        <FaTasks />
                        <p>No tasks yet. Create your first task!</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{modalType === 'add' ? 'Assign New Task' : 'Edit Task'}</h2>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Task Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter task title"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter task description"
                                    rows="4"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label><FaProjectDiagram /> Select Project</label>
                                    <select
                                        name="project"
                                        value={formData.project}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Project</option>
                                        {projects.map(proj => (
                                            <option key={proj._id} value={proj._id}>
                                                {proj.title} - {proj.client?.name || proj.client}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Assign To</label>
                                    <select
                                        name="assignedTo"
                                        value={formData.assignedTo}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map(emp => (
                                            <option key={emp._id} value={emp._id}>
                                                {emp.name} - {emp.department}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Priority</label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Deadline</label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Document Upload Section */}
                            <div className="form-section document-section">
                                <h3 className="section-title"><FaFileAlt /> Task Documents</h3>

                                {/* Local File Upload */}
                                <div className="form-group">
                                    <label><FaUpload /> Upload from Computer</label>
                                    <div className="file-upload-area">
                                        <input
                                            type="file"
                                            id="taskLocalFileUpload"
                                            onChange={handleLocalFileChange}
                                            multiple
                                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip"
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="taskLocalFileUpload" className="file-upload-btn">
                                            <FaCloudUploadAlt />
                                            <span>Click to upload files</span>
                                        </label>
                                    </div>
                                    {localFiles.length > 0 && (
                                        <div className="selected-files-list">
                                            {localFiles.map((file, index) => (
                                                <div key={index} className="selected-file-item">
                                                    <FaFile />
                                                    <span>{file.name}</span>
                                                    <button
                                                        type="button"
                                                        className="remove-file-btn"
                                                        onClick={() => removeLocalFile(index)}
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Contact Documents Selection */}
                                {contactDocuments.length > 0 && (
                                    <div className="form-group">
                                        <label><FaFileAlt /> Select from Client Submissions</label>
                                        <div className="contact-documents-list">
                                            {contactDocuments.map(doc => (
                                                <div
                                                    key={doc._id}
                                                    className={`contact-doc-item ${selectedContactDocs.includes(doc._id) ? 'selected' : ''}`}
                                                    onClick={() => handleContactDocSelect(doc._id)}
                                                >
                                                    <div className="doc-checkbox">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedContactDocs.includes(doc._id)}
                                                            onChange={() => { }}
                                                        />
                                                    </div>
                                                    <div className="doc-info">
                                                        <span className="doc-name">{doc.fileName}</span>
                                                        <span className="doc-meta">
                                                            From: {doc.name} ({doc.email}) - {doc.subject}
                                                        </span>
                                                        <span className="doc-date">
                                                            Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={uploadingFiles}>
                                    {uploadingFiles ? 'Uploading Files...' : (modalType === 'add' ? 'Assign Task' : 'Update Task')}
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
                            <h2>Delete Task</h2>
                        </div>
                        <p className="logout-modal-message">
                            Are you sure you want to delete <strong>{taskToDelete?.title}</strong>? This action cannot be undone.
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

export default TaskManagement;
