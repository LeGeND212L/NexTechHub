import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        setTimeout(() => {
            alert('Thank you for contacting us! We will get back to you soon.');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setIsSubmitting(false);
        }, 1500);
    };

    const contactInfo = [
        {
            icon: <FaPhone />,
            title: 'Phone',
            details: '+1 (555) 123-4567',
            link: 'tel:+15551234567',
            color: '#10b981'
        },
        {
            icon: <FaEnvelope />,
            title: 'Email',
            details: 'info@nextechhubs.com',
            link: 'mailto:info@nextechhubs.com',
            color: '#082A4E'
        },
        {
            icon: <FaMapMarkerAlt />,
            title: 'Location',
            details: '123 Tech Street, Silicon Valley, CA 94025',
            link: '#',
            color: '#ef4444'
        },
        {
            icon: <FaClock />,
            title: 'Business Hours',
            details: 'Mon - Fri: 9:00 AM - 6:00 PM',
            link: '#',
            color: '#f59e0b'
        }
    ];

    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <motion.section
                className="contact-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="container">
                    <h1>Get In Touch</h1>
                    <p>We'd love to hear from you. Let's discuss your project!</p>
                </div>
            </motion.section>

            {/* Contact Info Cards */}
            <section className="contact-info-section">
                <div className="container">
                    <div className="contact-info-grid">
                        {contactInfo.map((info, index) => (
                            <motion.a
                                key={index}
                                href={info.link}
                                className="contact-info-card"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="contact-icon" style={{ color: info.color }}>
                                    {info.icon}
                                </div>
                                <h3>{info.title}</h3>
                                <p>{info.details}</p>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="contact-form-section">
                <div className="container">
                    <div className="contact-form-grid">
                        <motion.div
                            className="form-content"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2>Send Us a Message</h2>
                            <p>Fill out the form below and we'll get back to you within 24 hours.</p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Full Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="Project Inquiry"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        placeholder="Tell us about your project..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        </motion.div>

                        <motion.div
                            className="map-content"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="map-placeholder">
                                <iframe
                                    title="Location Map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3168.6395726230723!2d-122.08424968469284!3d37.42199997982571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02425dad8f%3A0x6c296c66619367e0!2sGoogleplex!5e0!3m2!1sen!2sus!4v1609459200000!5m2!1sen!2sus"
                                    width="100%"
                                    height="400"
                                    style={{ border: 0, borderRadius: '15px' }}
                                    allowFullScreen=""
                                    loading="lazy"
                                ></iframe>
                            </div>

                            <div className="social-links">
                                <h3>Follow Us</h3>
                                <div className="social-icons">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                                        <FaFacebook />
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
                                        <FaTwitter />
                                    </a>
                                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
                                        <FaLinkedin />
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                                        <FaInstagram />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Contact;
