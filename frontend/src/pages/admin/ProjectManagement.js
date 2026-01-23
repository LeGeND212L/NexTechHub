import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
    FaProjectDiagram,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaUser,
    FaCalendar,
    FaCheckCircle,
    FaClock,
    FaExclamationCircle,
    FaArrowLeft,
    FaSignOutAlt
} from 'react-icons/fa';
import './ProjectManagement.css';

const ProjectManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [modalType, setModalType] = useState('add');
    const [currentProject, setCurrentProject] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        client: '',
        deadline: '',
        status: 'pending',
        service: 'Web Development',
        price: ''
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
            const projectsRes = await api.get('/projects');
            setProjects(projectsRes.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch data');
            setLoading(false);
        }
    };

    const handleOpenModal = (type, project = null) => {
        setModalType(type);
        if (type === 'edit' && project) {
            setCurrentProject(project);
            setFormData({
                name: project.title || project.name || '',
                description: project.description || '',
                client: project.client?.name || project.client || '',
                deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
                status: project.status || 'pending',
                service: project.service || 'Web Development',
                price: project.price || ''
            });
        } else {
            setCurrentProject(null);
            setFormData({
                name: '',
                description: '',
                client: '',
                deadline: '',
                status: 'pending',
                service: 'Web Development',
                price: ''
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentProject(null);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.client || !formData.deadline) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const projectData = {
                title: formData.name,
                description: formData.description,
                client: { name: formData.client },
                service: formData.service,
                status: formData.status,
                deadline: formData.deadline,
                price: formData.price ? parseFloat(formData.price) : 0
            };

            if (modalType === 'add') {
                await api.post('/projects', projectData);
                toast.success('Project created successfully!');
            } else {
                await api.put(`/projects/${currentProject._id}`, projectData);
                toast.success('Project updated successfully!');
            }

            fetchData();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving project:', error);
            toast.error(error.response?.data?.message || 'Failed to save project');
        }
    };

    const handleDeleteClick = (project) => {
        setProjectToDelete(project);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        try {
            await api.delete(`/projects/${projectToDelete._id}`);
            toast.success('Project deleted successfully!');
            // Remove project from state immediately
            setProjects(prevProjects => prevProjects.filter(proj => proj._id !== projectToDelete._id));
            setShowDeleteModal(false);
            setProjectToDelete(null);
        } catch (error) {
            console.error('Error deleting project:', error);
            toast.error('Failed to delete project');
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FaCheckCircle />;
            case 'in-progress': return <FaClock />;
            default: return <FaExclamationCircle />;
        }
    };

    if (loading) {
        return (
            <div className="project-loading">
                <div className="spinner-large"></div>
                <p>Loading projects...</p>
            </div>
        );
    }

    return (
        <div className="project-management">
            <div className="project-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
                        <FaArrowLeft />
                    </button>
                    <div>
                        <h1><FaProjectDiagram /> Project Management</h1>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => handleOpenModal('add')}>
                        <FaPlus /> Create Project
                    </button>
                    <button className="btn-logout" onClick={handleLogout}>
                        <FaSignOutAlt /> Logout
                    </button>
                </div>
            </div>

            <div className="projects-grid">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <div key={project._id} className="project-card">
                            <div className="project-card-header">
                                <div>
                                    <h3>{project.title || project.name}</h3>
                                    <span className={`status-badge ${project.status}`}>
                                        {getStatusIcon(project.status)}
                                        {project.status}
                                    </span>
                                </div>
                                <div className="project-actions">
                                    <button className="btn-icon btn-edit" onClick={() => handleOpenModal('edit', project)}>
                                        <FaEdit />
                                    </button>
                                    <button className="btn-icon btn-delete" onClick={() => handleDeleteClick(project)}>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                            <p className="project-description">{project.description}</p>
                            <div className="project-info">
                                <div className="info-item">
                                    <FaUser />
                                    <span>{project.client?.name || project.client}</span>
                                </div>
                                <div className="info-item">
                                    <FaCalendar />
                                    <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-projects">
                        <FaProjectDiagram />
                        <p>No projects yet. Create your first project!</p>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{modalType === 'add' ? 'Create New Project' : 'Edit Project'}</h2>
                            <button className="modal-close" onClick={handleCloseModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Project Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter project name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter project description"
                                    rows="4"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Client Name</label>
                                    <input
                                        type="text"
                                        name="client"
                                        value={formData.client}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter client name"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Service Type</label>
                                    <select
                                        name="service"
                                        value={formData.service}
                                        onChange={handleChange}
                                        required
                                    >
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
                                    </select>
                                </div>
                            </div>

                            <div className="form-row status-deadline-row">
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
                                        <option value="on-hold">On Hold</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>

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

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Project Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Enter project price"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {modalType === 'add' ? 'Create Project' : 'Update Project'}
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
                            <h2>Delete Project</h2>
                        </div>
                        <p className="logout-modal-message">
                            Are you sure you want to delete <strong>{projectToDelete?.title || projectToDelete?.name}</strong>? This action cannot be undone.
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

export default ProjectManagement;
