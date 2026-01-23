import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import {
    FaStar,
    FaCheck,
    FaTimes,
    FaCalendar,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaQuoteLeft
} from 'react-icons/fa';
import './ReviewManagement.css';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await api.get('/reviews');
            setReviews(res.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching reviews:', error);
            toast.error('Failed to fetch reviews');
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/reviews/${id}`, { status });
            toast.success(`Review ${status} successfully!`);
            fetchReviews();
        } catch (error) {
            console.error('Error updating review:', error);
            toast.error('Failed to update review');
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} className={index < rating ? 'star-filled' : 'star-empty'} />
        ));
    };

    const filteredReviews = reviews.filter(review => {
        if (filter === 'all') return true;
        return review.status === filter;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="status-badge approved"><FaCheckCircle /> Approved</span>;
            case 'rejected':
                return <span className="status-badge rejected"><FaTimesCircle /> Rejected</span>;
            default:
                return <span className="status-badge pending"><FaClock /> Pending</span>;
        }
    };

    if (loading) {
        return (
            <div className="review-loading">
                <div className="spinner-large"></div>
                <p>Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="review-management">
            <div className="review-header">
                <div>
                    <h1><FaStar /> Review Management</h1>
                    <p>Approve or reject client reviews</p>
                </div>
                <div className="filter-buttons">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({reviews.length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilter('pending')}
                    >
                        Pending ({reviews.filter(r => r.status === 'pending').length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                        onClick={() => setFilter('approved')}
                    >
                        Approved ({reviews.filter(r => r.status === 'approved').length})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                        onClick={() => setFilter('rejected')}
                    >
                        Rejected ({reviews.filter(r => r.status === 'rejected').length})
                    </button>
                </div>
            </div>

            <div className="reviews-grid">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <div key={review._id} className="review-card">
                            <div className="review-card-header">
                                <div className="reviewer-info">
                                    <div className="reviewer-avatar">
                                        {review.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3>{review.name}</h3>
                                        <p>{review.company}</p>
                                    </div>
                                </div>
                                {getStatusBadge(review.status)}
                            </div>

                            <div className="rating-section">
                                <div className="stars">
                                    {renderStars(review.rating)}
                                </div>
                                <span className="rating-number">{review.rating}.0</span>
                            </div>

                            <div className="review-content">
                                <FaQuoteLeft className="quote-icon" />
                                <p>{review.comment}</p>
                            </div>

                            <div className="review-footer">
                                <div className="review-date">
                                    <FaCalendar />
                                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                </div>
                                {review.status === 'pending' && (
                                    <div className="action-buttons">
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleStatusUpdate(review._id, 'approved')}
                                        >
                                            <FaCheck /> Approve
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => handleStatusUpdate(review._id, 'rejected')}
                                        >
                                            <FaTimes /> Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-reviews">
                        <FaStar />
                        <p>No reviews found for this filter</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewManagement;
