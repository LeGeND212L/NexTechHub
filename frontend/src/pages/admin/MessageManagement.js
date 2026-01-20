import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import {
    FaInbox,
    FaEnvelope,
    FaEnvelopeOpen,
    FaReply,
    FaTrash,
    FaSearch,
    FaArrowLeft,
    FaPhone,
    FaClock,
    FaUser,
    FaSignOutAlt,
    FaStickyNote,
    FaFileDownload,
    FaPaperclip,
    FaEye
} from 'react-icons/fa';
import './MessageManagement.css';

const MessageManagement = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [messageToDelete, setMessageToDelete] = useState(null);
    const [statusCounts, setStatusCounts] = useState({
        unread: 0,
        read: 0,
        replied: 0,
        total: 0
    });
    const [notes, setNotes] = useState('');

    useEffect(() => {
        fetchMessages();
    },);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = {};

            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }

            if (searchTerm) {
                params.search = searchTerm;
            }

            const response = await axios.get('/api/contacts', {
                headers: { Authorization: `Bearer ${token}` },
                params
            });

            if (response.data.success) {
                setMessages(response.data.data);
                setStatusCounts(response.data.counts);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast.error('Failed to fetch messages');
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchMessages();
    };

    const handleViewMessage = async (message) => {
        setSelectedMessage(message);
        setNotes(message.notes || '');
        setShowModal(true);

        // Mark as read if unread
        if (message.status === 'unread') {
            try {
                const token = localStorage.getItem('token');
                await axios.put(
                    `/api/contacts/${message._id}`,
                    { status: 'read' },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                fetchMessages();
            } catch (error) {
                console.error('Error updating message status:', error);
            }
        }
    };

    const handleUpdateStatus = async (messageId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                `/api/contacts/${messageId}`,
                { status: newStatus, notes },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success('Message status updated successfully');
                fetchMessages();
                setShowModal(false);
                setSelectedMessage(null);
            }
        } catch (error) {
            console.error('Error updating message:', error);
            toast.error('Failed to update message status');
        }
    };

    const handleDeleteClick = (messageId) => {
        setMessageToDelete(messageId);
        setShowDeleteModal(true);
    };

    const confirmDeleteMessage = async () => {
        if (!messageToDelete) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`/api/contacts/${messageToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                toast.success('Message deleted successfully');
                fetchMessages();
                setShowModal(false);
                setSelectedMessage(null);
            }
            setShowDeleteModal(false);
            setMessageToDelete(null);
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        }
    };

    const handleDownloadFile = async (messageId, fileName) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/contacts/${messageId}/download`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'download');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            toast.success('File downloaded successfully');
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Failed to download file');
        }
    };

    const handleViewFile = async (messageId, fileName) => {
        try {
            const token = localStorage.getItem('token');
            // Open file in new tab using the view endpoint
            // Use full backend URL since window.open doesn't go through proxy
            const baseUrl = 'http://localhost:5000';
            const viewUrl = `${baseUrl}/api/contacts/${messageId}/view`;

            // For viewing, we'll open the URL directly with token in query
            window.open(`${viewUrl}?token=${token}`, '_blank');

            toast.success('Opening file in new tab');
        } catch (error) {
            console.error('Error viewing file:', error);
            toast.error('Failed to view file');
        }
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            unread: { icon: <FaEnvelope />, class: 'status-unread', label: 'Unread' },
            read: { icon: <FaEnvelopeOpen />, class: 'status-read', label: 'Read' },
            replied: { icon: <FaReply />, class: 'status-replied', label: 'Replied' }
        };

        const config = statusConfig[status] || statusConfig.unread;

        return (
            <span className={`status-badge ${config.class}`}>
                {config.icon}
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return 'Today at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday at ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays < 7) {
            return diffDays + ' days ago';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    const filteredMessages = messages.filter(message => {
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            return (
                message.name.toLowerCase().includes(search) ||
                message.email.toLowerCase().includes(search) ||
                message.subject.toLowerCase().includes(search) ||
                message.message.toLowerCase().includes(search)
            );
        }
        return true;
    });

    return (
        <div className="message-management">
            {/* Header */}
            <div className="message-header">
                <div className="header-left">
                    <button className="btn-back" onClick={() => navigate('/admin/dashboard')}>
                        <FaArrowLeft /> Back to Dashboard
                    </button>
                    <div className="header-title">
                        <FaInbox />
                        <h1>Messages & Inquiries</h1>
                    </div>
                </div>
                <button className="btn-logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {/* Stats Cards */}
            <div className="message-stats">
                <div className="stat-card stat-total">
                    <div className="stat-icon"><FaInbox /></div>
                    <div className="stat-info">
                        <h3>{statusCounts.total}</h3>
                        <p>Total Messages</p>
                    </div>
                </div>
                <div className="stat-card stat-unread">
                    <div className="stat-icon"><FaEnvelope /></div>
                    <div className="stat-info">
                        <h3>{statusCounts.unread}</h3>
                        <p>Unread</p>
                    </div>
                </div>
                <div className="stat-card stat-read">
                    <div className="stat-icon"><FaEnvelopeOpen /></div>
                    <div className="stat-info">
                        <h3>{statusCounts.read}</h3>
                        <p>Read</p>
                    </div>
                </div>
                <div className="stat-card stat-replied">
                    <div className="stat-icon"><FaReply /></div>
                    <div className="stat-info">
                        <h3>{statusCounts.replied}</h3>
                        <p>Replied</p>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="message-controls">
                <div className="filter-tabs">
                    <button
                        className={`filter-tab ${statusFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >
                        All ({statusCounts.total})
                    </button>
                    <button
                        className={`filter-tab ${statusFilter === 'unread' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('unread')}
                    >
                        Unread ({statusCounts.unread})
                    </button>
                    <button
                        className={`filter-tab ${statusFilter === 'read' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('read')}
                    >
                        Read ({statusCounts.read})
                    </button>
                    <button
                        className={`filter-tab ${statusFilter === 'replied' ? 'active' : ''}`}
                        onClick={() => setStatusFilter('replied')}
                    >
                        Replied ({statusCounts.replied})
                    </button>
                </div>

                <form className="search-form" onSubmit={handleSearch}>
                    <div className="search-bar">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            {/* Messages List */}
            <div className="messages-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading messages...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="empty-state">
                        <FaInbox />
                        <h3>No messages found</h3>
                        <p>There are no messages matching your criteria</p>
                    </div>
                ) : (
                    <div className="messages-grid">
                        {filteredMessages.map((message) => (
                            <div
                                key={message._id}
                                className={`message-card ${message.status === 'unread' ? 'unread' : ''}`}
                                onClick={() => handleViewMessage(message)}
                            >
                                <div className="message-card-header">
                                    <div className="sender-info">
                                        <FaUser className="user-icon" />
                                        <div>
                                            <h4>{message.name}</h4>
                                            <p className="sender-email">{message.email}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(message.status)}
                                </div>

                                <div className="message-subject">
                                    <strong>Subject:</strong> {message.subject}
                                </div>

                                <div className="message-preview">
                                    {message.message.substring(0, 120)}
                                    {message.message.length > 120 && '...'}
                                </div>

                                <div className="message-card-footer">
                                    <div className="message-meta">
                                        <FaClock /> {formatDate(message.createdAt)}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {message.phone && (
                                            <div className="message-phone">
                                                <FaPhone /> {message.phone}
                                            </div>
                                        )}
                                        {message.file && (
                                            <div className="message-attachment" title="Has attachment">
                                                <FaPaperclip style={{ color: '#082A4E' }} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Detail Modal */}
            {showModal && selectedMessage && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content message-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Message Details</h2>
                            <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
                        </div>

                        <div className="modal-body">
                            <div className="message-detail-section">
                                <div className="detail-row">
                                    <label><FaUser /> Name:</label>
                                    <span>{selectedMessage.name}</span>
                                </div>
                                <div className="detail-row">
                                    <label><FaEnvelope /> Email:</label>
                                    <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                                </div>
                                {selectedMessage.phone && (
                                    <div className="detail-row">
                                        <label><FaPhone /> Phone:</label>
                                        <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a>
                                    </div>
                                )}
                                <div className="detail-row">
                                    <label><FaClock /> Status:</label>
                                    {getStatusBadge(selectedMessage.status)}
                                </div>
                            </div>

                            <div className="message-detail-section">
                                <label className="section-label">Subject:</label>
                                <div className="message-subject-full">{selectedMessage.subject}</div>
                            </div>

                            <div className="message-detail-section">
                                <label className="section-label">Message:</label>
                                <div className="message-full">{selectedMessage.message}</div>
                            </div>

                            {selectedMessage.file && (
                                <div className="message-detail-section">
                                    <label className="section-label"><FaPaperclip /> Attached File:</label>
                                    <div className="file-info">
                                        <span className="file-name">{selectedMessage.originalFileName || 'Attachment'}</span>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button
                                                className="btn btn-primary btn-view"
                                                onClick={() => handleViewFile(selectedMessage._id, selectedMessage.originalFileName)}
                                                title="View file in browser"
                                            >
                                                <FaEye /> View
                                            </button>
                                            <button
                                                className="btn btn-primary btn-download"
                                                onClick={() => handleDownloadFile(selectedMessage._id, selectedMessage.originalFileName)}
                                                title="Download file"
                                            >
                                                <FaFileDownload /> Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="message-detail-section">
                                <label className="section-label"><FaStickyNote /> Admin Notes:</label>
                                <textarea
                                    className="notes-textarea"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add internal notes..."
                                    rows="4"
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Close
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleDeleteClick(selectedMessage._id)}
                            >
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Logout Modal */}
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="logout-modal-header" style={{ color: '#ef4444' }}>
                            <FaTrash />
                            <h2>Delete Message</h2>
                        </div>
                        <p className="logout-modal-message">
                            Are you sure you want to delete this message? This action cannot be undone.
                        </p>
                        <div className="logout-modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                Cancel
                            </button>
                            <button className="btn btn-danger" onClick={confirmDeleteMessage}>
                                <FaTrash /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MessageManagement;
