import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaChevronDown, FaUpload, FaTimes } from 'react-icons/fa';
import './Contact.css';

// Country codes database with validation rules
const COUNTRY_CODES = [
    { name: 'Pakistan', code: '+92', flag: '🇵🇰', digitLength: 10, pattern: /^\d{10}$/ },
    { name: 'United States', code: '+1', flag: '🇺🇸', digitLength: 10, pattern: /^\d{10}$/ },
    { name: 'United Kingdom', code: '+44', flag: '🇬🇧', digitLength: 10, pattern: /^\d{10}$/ },
    { name: 'Canada', code: '+1', flag: '🇨🇦', digitLength: 10, pattern: /^\d{10}$/ },
    { name: 'Australia', code: '+61', flag: '🇦🇺', digitLength: 9, pattern: /^\d{9}$/ },
    { name: 'Germany', code: '+49', flag: '🇩🇪', digitLength: 11, pattern: /^\d{11}$/ },
    { name: 'France', code: '+33', flag: '🇫🇷', digitLength: 9, pattern: /^\d{9}$/ },
    { name: 'India', code: '+91', flag: '🇮🇳', digitLength: 10, pattern: /^\d{10}$/ },
    { name: 'Japan', code: '+81', flag: '🇯🇵', digitLength: 10, pattern: /^\d{10}$/ },
    { name: 'China', code: '+86', flag: '🇨🇳', digitLength: 11, pattern: /^\d{11}$/ },
    { name: 'Dubai/UAE', code: '+971', flag: '🇦🇪', digitLength: 9, pattern: /^\d{9}$/ },
    { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', digitLength: 9, pattern: /^\d{9}$/ },
];

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        countryCode: COUNTRY_CODES[0], // Default to Pakistan
        phone: '',
        subject: '',
        message: '',
        file: null
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCountryDropdown, setShowCountryDropdown] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [fileName, setFileName] = useState('');

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (formData.name.trim().length > 100) {
            newErrors.name = 'Name cannot exceed 100 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(formData.name)) {
            newErrors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }

        // Email validation - stronger regex
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else {
            const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(formData.email.trim())) {
                newErrors.email = 'Please enter a valid email address (e.g., user@example.com)';
            }
        }

        // Phone validation (optional but validated if provided)
        if (formData.phone.trim()) {
            const phoneDigits = formData.phone.trim().replace(/\D/g, '');

            // Check if phone matches the selected country's digit length
            if (phoneDigits.length !== formData.countryCode.digitLength) {
                newErrors.phone = `Please enter exactly ${formData.countryCode.digitLength} digits for ${formData.countryCode.name}`;
            }
            // Check if all characters are digits or allowed formatting characters
            else if (!/^[0-9\s\-()]+$/.test(formData.phone)) {
                newErrors.phone = 'Phone can only contain numbers, spaces, hyphens, and parentheses';
            }
        }

        // Subject validation
        if (!formData.subject.trim()) {
            newErrors.subject = 'Subject is required';
        } else if (formData.subject.trim().length < 3) {
            newErrors.subject = 'Subject must be at least 3 characters';
        } else if (formData.subject.trim().length > 200) {
            newErrors.subject = 'Subject cannot exceed 200 characters';
        }

        // Message validation
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters';
        } else if (formData.message.trim().length > 2000) {
            newErrors.message = 'Message cannot exceed 2000 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Format phone input - only allow digits and formatting characters
        if (name === 'phone') {
            // Remove non-digit characters to get clean number
            const digitsOnly = value.replace(/\D/g, '');
            // Limit to the selected country's digit length
            const limitedDigits = digitsOnly.slice(0, formData.countryCode.digitLength);

            // Format intelligently based on digit length
            if (formData.countryCode.digitLength === 10) {
                // Format as: XXX-XXXX-XXXX
                if (limitedDigits.length <= 3) {
                    formattedValue = limitedDigits;
                } else if (limitedDigits.length <= 6) {
                    formattedValue = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3);
                } else {
                    formattedValue = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3, 6) + '-' + limitedDigits.slice(6);
                }
            } else if (formData.countryCode.digitLength === 9) {
                // Format as: XXX-XXXX-XXX
                if (limitedDigits.length <= 3) {
                    formattedValue = limitedDigits;
                } else if (limitedDigits.length <= 6) {
                    formattedValue = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3);
                } else {
                    formattedValue = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3, 6) + '-' + limitedDigits.slice(6);
                }
            } else if (formData.countryCode.digitLength === 11) {
                // Format as: XXX-XXXX-XXXX-X
                if (limitedDigits.length <= 3) {
                    formattedValue = limitedDigits;
                } else if (limitedDigits.length <= 6) {
                    formattedValue = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3);
                } else if (limitedDigits.length <= 9) {
                    formattedValue = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3, 6) + '-' + limitedDigits.slice(6);
                } else {
                    formattedValue = limitedDigits.slice(0, 3) + '-' + limitedDigits.slice(3, 6) + '-' + limitedDigits.slice(6, 9) + '-' + limitedDigits.slice(9);
                }
            } else {
                formattedValue = limitedDigits;
            }
        }

        setFormData({ ...formData, [name]: formattedValue });

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleCountrySelect = (country) => {
        setFormData({ ...formData, countryCode: country, phone: '' });
        setShowCountryDropdown(false);
        if (errors.phone) {
            setErrors({ ...errors, phone: '' });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setErrors({ ...errors, file: 'File size must be less than 5MB' });
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setErrors({ ...errors, file: 'Only images (JPG, PNG) and documents (PDF, DOC, DOCX) are allowed' });
                return;
            }

            setFormData({ ...formData, file: file });
            setFileName(file.name);
            if (errors.file) {
                setErrors({ ...errors, file: '' });
            }
        }
    };

    const handleRemoveFile = () => {
        setFormData({ ...formData, file: null });
        setFileName('');
        if (errors.file) {
            setErrors({ ...errors, file: '' });
        }
    };

    const handleUploadClick = () => {
        document.getElementById('file').click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setIsSubmitting(true);

        try {
            // Format phone number with country code prefix
            const formattedPhone = formData.phone.trim()
                ? formData.countryCode.code + formData.phone.replace(/\D/g, '')
                : null;

            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append('name', formData.name.trim());
            submitData.append('email', formData.email.trim().toLowerCase());
            submitData.append('subject', formData.subject.trim());
            submitData.append('message', formData.message.trim());

            if (formattedPhone) {
                submitData.append('phone', formattedPhone);
            }
            submitData.append('countryCode', formData.countryCode.code);

            // Add file if exists
            if (formData.file) {
                submitData.append('contactFile', formData.file);
            }

            const response = await api.post('/contacts', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                setShowSuccessModal(true);
                setFormData({
                    name: '',
                    email: '',
                    countryCode: COUNTRY_CODES[0],
                    phone: '',
                    subject: '',
                    message: '',
                    file: null
                });
                setFileName('');
                setErrors({});
            }

        } catch (error) {
            console.error('Contact form error:', error);

            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.response?.status === 429) {
                toast.error('Too many requests. Please wait a few minutes before trying again.');
            } else {
                toast.error('Failed to send message. Please try again later.');
            }
        } finally {
            setIsSubmitting(false);
        }
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
                                        placeholder="John Doe"
                                        className={errors.name ? 'error' : ''}
                                        maxLength="100"
                                    />
                                    {errors.name && <span className="error-message">{errors.name}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <div className="phone-input-group">
                                        {/* Country Code Dropdown */}
                                        <div className="country-select-container">
                                            <button
                                                type="button"
                                                className="country-select-button"
                                                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                                                title="Select country"
                                            >
                                                <span className="country-flag">{formData.countryCode.flag}</span>
                                                <span className="country-code">{formData.countryCode.code}</span>
                                                <FaChevronDown className={`dropdown-icon ${showCountryDropdown ? 'open' : ''}`} />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {showCountryDropdown && (
                                                <motion.div
                                                    className="country-dropdown-menu"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {COUNTRY_CODES.map((country, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            className={`country-option ${formData.countryCode.code === country.code && formData.countryCode.name === country.name ? 'active' : ''}`}
                                                            onClick={() => handleCountrySelect(country)}
                                                        >
                                                            <span className="option-flag">{country.flag}</span>
                                                            <span className="option-name">{country.name}</span>
                                                            <span className="option-code">{country.code}</span>
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Phone Input */}
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="300-123-4567"
                                            className={`phone-input ${errors.phone ? 'error' : ''}`}
                                            title={`Enter phone number for ${formData.countryCode.name}`}
                                        />
                                    </div>
                                    <small className="form-helper">
                                        Enter {formData.countryCode.digitLength} digits for {formData.countryCode.name}. Country code {formData.countryCode.code} will be added automatically.
                                    </small>
                                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject *</label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Project Inquiry"
                                        className={errors.subject ? 'error' : ''}
                                        maxLength="200"
                                    />
                                    {errors.subject && <span className="error-message">{errors.subject}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Tell us about your project..."
                                        className={errors.message ? 'error' : ''}
                                        maxLength="2000"
                                    ></textarea>
                                    <div className="char-count">{formData.message.length}/2000</div>
                                    {errors.message && <span className="error-message">{errors.message}</span>}
                                </div>

                                {/* File Upload Section */}
                                <div className="form-group">
                                    <label htmlFor="file">Attach File (Optional)</label>
                                    <div className="file-upload-wrapper">
                                        <input
                                            type="file"
                                            id="file"
                                            name="file"
                                            onChange={handleFileChange}
                                            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                                            style={{ display: 'none' }}
                                        />
                                        {fileName && (
                                            <div className="file-selected">
                                                <span className="file-name">{fileName}</span>
                                                <button
                                                    type="button"
                                                    className="remove-file-btn"
                                                    onClick={handleRemoveFile}
                                                    title="Remove file"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <small className="form-helper">
                                        Accepted formats: JPG, PNG, PDF, DOC, DOCX (Max 5MB)
                                    </small>
                                    {errors.file && <span className="error-message">{errors.file}</span>}
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn-upload-file"
                                        onClick={handleUploadClick}
                                    >
                                        <FaUpload className="upload-icon" />
                                        Click here to upload a file
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary btn-submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : 'Send Message'}
                                    </button>
                                </div>
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

            {/* Success Modal */}
            {showSuccessModal && (
                <motion.div
                    className="success-modal-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowSuccessModal(false)}
                >
                    <motion.div
                        className="success-modal-content"
                        initial={{ scale: 0.5, opacity: 0, y: -50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.5, opacity: 0, y: 50 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            className="success-icon-wrapper"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 10 }}
                        >
                            <motion.div
                                className="success-circle"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                            >
                                <motion.svg
                                    className="success-tick"
                                    viewBox="0 0 24 24"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{ pathLength: 1, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
                                >
                                    <motion.path
                                        d="M5 13l4 4L19 7"
                                        fill="none"
                                        stroke="#ffffff"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </motion.svg>
                            </motion.div>
                        </motion.div>
                        <motion.h2
                            className="success-modal-title"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                        >
                            Message Sent Successfully!
                        </motion.h2>
                        <motion.p
                            className="success-modal-message"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.85, duration: 0.4 }}
                        >
                            Thank you for contacting us! We have received your message and will get back to you within 24 hours.
                        </motion.p>
                        <motion.button
                            className="success-modal-button"
                            onClick={() => setShowSuccessModal(false)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Got it!
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}

            <Footer />
        </div>
    );
};

export default Contact;
