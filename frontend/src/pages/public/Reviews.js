import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaStar, FaQuoteLeft, FaFilter } from 'react-icons/fa';
import './Reviews.css';

const Reviews = () => {
    const [filterRating, setFilterRating] = useState('all');
    const [filterService, setFilterService] = useState('all');

    const allReviews = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'CEO, TechStart Inc.',
            service: 'Web Development',
            rating: 5,
            date: 'December 15, 2024',
            text: 'Absolutely outstanding work! The team delivered a beautiful, responsive website that exceeded our expectations. Their attention to detail and commitment to quality is unmatched.',
            image: 'https://via.placeholder.com/80x80/667eea/ffffff?text=SJ'
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Marketing Director, GrowthLab',
            service: 'SEO Services',
            rating: 5,
            date: 'December 10, 2024',
            text: 'Our organic traffic increased by 300% in just 3 months! The SEO strategy they implemented was comprehensive and effective. Highly recommended!',
            image: 'https://via.placeholder.com/80x80/10b981/ffffff?text=MC'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            role: 'Product Manager, InnovateCo',
            service: 'Mobile App Development',
            rating: 5,
            date: 'December 5, 2024',
            text: 'The mobile app they built is incredible! Smooth performance, beautiful UI, and exactly what we envisioned. The team was professional throughout.',
            image: 'https://via.placeholder.com/80x80/f59e0b/ffffff?text=ER'
        },
        {
            id: 4,
            name: 'David Kumar',
            role: 'Founder, DataViz Solutions',
            service: 'Data Analytics',
            rating: 5,
            date: 'November 28, 2024',
            text: 'Their data analytics solution transformed how we understand our business. The dashboards are intuitive and the insights are invaluable.',
            image: 'https://via.placeholder.com/80x80/8b5cf6/ffffff?text=DK'
        },
        {
            id: 5,
            name: 'Lisa Thompson',
            role: 'Director, ContentFirst Media',
            service: 'Content Writing',
            rating: 5,
            date: 'November 20, 2024',
            text: 'Best content writing service we have used! Every piece is well-researched, engaging, and perfectly optimized for SEO. Our blog traffic doubled!',
            image: 'https://via.placeholder.com/80x80/ef4444/ffffff?text=LT'
        },
        {
            id: 6,
            name: 'Robert Martinez',
            role: 'CTO, CloudSync Inc.',
            service: 'API Development',
            rating: 5,
            date: 'November 15, 2024',
            text: 'The API they developed is rock solid. Clean code, excellent documentation, and perfect integration with our existing systems.',
            image: 'https://via.placeholder.com/80x80/06b6d4/ffffff?text=RM'
        },
        {
            id: 7,
            name: 'Amanda White',
            role: 'Marketing Manager, ShopSmart',
            service: 'Digital Marketing',
            rating: 4,
            date: 'November 8, 2024',
            text: 'Great results from their digital marketing campaigns. Our conversion rate improved significantly and the ROI has been excellent.',
            image: 'https://via.placeholder.com/80x80/ec4899/ffffff?text=AW'
        },
        {
            id: 8,
            name: 'James Wilson',
            role: 'Business Owner, LocalEats',
            service: 'UI/UX Design',
            rating: 5,
            date: 'October 30, 2024',
            text: 'The UI/UX design they created for our app is stunning! User engagement increased by 200% after the redesign. Truly talented team!',
            image: 'https://via.placeholder.com/80x80/14b8a6/ffffff?text=JW'
        },
        {
            id: 9,
            name: 'Patricia Garcia',
            role: 'Academic Researcher',
            service: 'Research & Academic Writing',
            rating: 5,
            date: 'October 22, 2024',
            text: 'Outstanding research and writing quality! They helped me complete my dissertation with thorough research and impeccable writing. Thank you!',
            image: 'https://via.placeholder.com/80x80/a855f7/ffffff?text=PG'
        },
        {
            id: 10,
            name: 'Christopher Lee',
            role: 'E-commerce Manager, StyleHub',
            service: 'E-commerce Solutions',
            rating: 5,
            date: 'October 15, 2024',
            text: 'Our online store has never performed better! The e-commerce platform they built is fast, secure, and easy to manage. Sales are up 150%!',
            image: 'https://via.placeholder.com/80x80/22c55e/ffffff?text=CL'
        },
        {
            id: 11,
            name: 'Jennifer Brown',
            role: 'HR Director, TalentFirst',
            service: 'Team Training',
            rating: 5,
            date: 'October 8, 2024',
            text: 'The training program they delivered was exceptional! Our team learned cutting-edge technologies and best practices. Money well spent!',
            image: 'https://via.placeholder.com/80x80/f43f5e/ffffff?text=JB'
        },
        {
            id: 12,
            name: 'Daniel Anderson',
            role: 'Operations Manager, LogiTech',
            service: 'Tech Support & Maintenance',
            rating: 4,
            date: 'September 28, 2024',
            text: 'Reliable 24/7 support that keeps our systems running smoothly. Quick response times and knowledgeable technicians. Very satisfied!',
            image: 'https://via.placeholder.com/80x80/84cc16/ffffff?text=DA'
        }
    ];

    const services = ['all', 'Web Development', 'SEO Services', 'Mobile App Development', 'Data Analytics', 'Content Writing', 'API Development', 'Digital Marketing', 'UI/UX Design', 'Research & Academic Writing', 'E-commerce Solutions', 'Team Training', 'Tech Support & Maintenance'];

    const filteredReviews = allReviews.filter(review => {
        const matchesRating = filterRating === 'all' || review.rating.toString() === filterRating;
        const matchesService = filterService === 'all' || review.service === filterService;
        return matchesRating && matchesService;
    });

    const averageRating = (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1);
    const totalReviews = allReviews.length;
    const fiveStarCount = allReviews.filter(r => r.rating === 5).length;

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} className={index < rating ? 'star-filled' : 'star-empty'} />
        ));
    };

    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <motion.section
                className="reviews-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="container">
                    <h1>Client Reviews</h1>
                    <p>See what our clients say about our services</p>
                </div>
            </motion.section>

            {/* Stats Section */}
            <section className="reviews-stats">
                <div className="container">
                    <div className="stats-cards">
                        <motion.div
                            className="stat-card"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="stat-value">{averageRating}</div>
                            <div className="stat-stars">{renderStars(5)}</div>
                            <div className="stat-label">Average Rating</div>
                        </motion.div>
                        <motion.div
                            className="stat-card"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="stat-value">{totalReviews}</div>
                            <div className="stat-label">Total Reviews</div>
                        </motion.div>
                        <motion.div
                            className="stat-card"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="stat-value">{fiveStarCount}</div>
                            <div className="stat-label">5-Star Reviews</div>
                        </motion.div>
                        <motion.div
                            className="stat-card"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="stat-value">{Math.round((fiveStarCount / totalReviews) * 100)}%</div>
                            <div className="stat-label">5-Star Rate</div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Filter Section */}
            <section className="reviews-filter">
                <div className="container">
                    <div className="filter-header">
                        <FaFilter /> <span>Filter Reviews</span>
                    </div>
                    <div className="filter-controls">
                        <div className="filter-group">
                            <label>Rating:</label>
                            <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
                                <option value="all">All Ratings</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Service:</label>
                            <select value={filterService} onChange={(e) => setFilterService(e.target.value)}>
                                {services.map((service, index) => (
                                    <option key={index} value={service}>
                                        {service === 'all' ? 'All Services' : service}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Reviews Grid */}
            <section className="reviews-grid-section">
                <div className="container">
                    <div className="reviews-grid">
                        {filteredReviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                className="review-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <div className="review-header">
                                    <img src={review.image} alt={review.name} className="reviewer-image" />
                                    <div className="reviewer-info">
                                        <h3>{review.name}</h3>
                                        <p className="reviewer-role">{review.role}</p>
                                        <p className="review-date">{review.date}</p>
                                    </div>
                                </div>
                                <div className="review-rating">
                                    {renderStars(review.rating)}
                                </div>
                                <div className="review-service-badge">{review.service}</div>
                                <FaQuoteLeft className="quote-icon" />
                                <p className="review-text">{review.text}</p>
                            </motion.div>
                        ))}
                    </div>

                    {filteredReviews.length === 0 && (
                        <div className="no-reviews">
                            <h3>No reviews found</h3>
                            <p>Try adjusting your filters</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Reviews;
