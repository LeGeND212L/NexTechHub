import React, { useState, useEffect } from 'react';
import {
    FaTwitter,
    FaFacebookF,
    FaInstagram,
    FaYoutube,
    FaLinkedinIn,
    FaCcVisa,
    FaCcMastercard,
    FaPaypal,
    FaUniversity,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt
} from 'react-icons/fa';
import { SiPayoneer } from 'react-icons/si';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo_img.png';
import jazzcashLogo from '../assets/Jazzcash.png';
import './Footer.css';

const footerServices = [
    { name: 'Web Development', description: 'Custom Websites & Web Apps', slug: 'web-development' },
    { name: 'SEO Services', description: 'Search Engine Optimization', slug: 'seo' },
    { name: 'Digital Marketing', description: 'Social Media & PPC Campaigns', slug: 'social-media-marketing' },
    { name: 'UI/UX Design', description: 'User Interface Design', slug: 'ui-ux' },
    { name: 'Data Analytics', description: 'Business Intelligence & Visualization', slug: 'power-bi' }
];

const Footer = () => {
    const [hoveredService, setHoveredService] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Handle hash navigation on component mount or location change
    useEffect(() => {
        if (location.hash) {
            const sectionId = location.hash.substring(1); // Remove the '#' from hash
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const offsetTop = element.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, [location]);

    // Smooth scroll to section
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offsetTop = element.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    };

    // Handle navigation with smooth scroll
    const handleSectionClick = (e, path, sectionId) => {
        e.preventDefault();

        // If we're already on the target page, just scroll
        if (location.pathname === path) {
            scrollToSection(sectionId);
        } else {
            // Navigate to the page first, then scroll after navigation
            navigate(path + '#' + sectionId);
        }
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Main Footer Content */}
                <div className="footer-content">
                    {/* Brand Section */}
                    <div className="footer-section brand-section">
                        <div className="brand-header">
                            <img src={logo} alt="NexTechHubs" className="brand-logo" />
                            <div className="brand-titles">
                                <h2 className="brand-name">NEXTECHHUBS</h2>
                                <p className="brand-tagline">From Code to Content</p>
                            </div>
                        </div>
                        <p className="brand-description">
                            NexTechHubs is a premier digital solutions provider, specializing in custom software development,
                            cutting-edge web applications, mobile app development, and innovative content strategies.
                            We bridge the gap between technical code and engaging content, delivering seamless digital experiences
                            that drive business growth.
                        </p>

                        {/* Social Media Section */}
                        <div className="social-section">
                            <h4 className="social-title">Connect With Us</h4>
                            <div className="social-media" aria-label="Social links">
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link twitter">
                                    <FaTwitter className="social-icon" />
                                </a>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-link facebook">
                                    <FaFacebookF className="social-icon" />
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-link instagram">
                                    <FaInstagram className="social-icon" />
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="social-link youtube">
                                    <FaYoutube className="social-icon" />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-link linkedin">
                                    <FaLinkedinIn className="social-icon" />

                                </a>
                            </div>
                            <p className="social-tagline">Follow us for the latest updates, tech insights, and industry news!</p>
                        </div>
                    </div>

                    {/* Combined Links and Contact Section */}
                    <div className="footer-section combined-section">
                        <div className="links-columns">
                            {/* Home Column */}
                            <div className="links-column">
                                <h4>Home</h4>
                                <ul>
                                    <li><Link to="/">Welcome</Link></li>
                                    <li>
                                        <a
                                            href="/#services"
                                            onClick={(e) => handleSectionClick(e, '/', 'services')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Our Services
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/#technologies"
                                            onClick={(e) => handleSectionClick(e, '/', 'technologies')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Technologies
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/#why-choose"
                                            onClick={(e) => handleSectionClick(e, '/', 'why-choose')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Why Choose Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/#feedback"
                                            onClick={(e) => handleSectionClick(e, '/', 'feedback')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Client Feedback
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            {/* Services Column */}
                            <div className="links-column services-column">
                                <h4>Services</h4>
                                <ul className="footer-services-list">
                                    {footerServices.map((service, index) => (
                                        <li
                                            key={index}
                                            className="footer-service-item"
                                            onMouseEnter={() => setHoveredService(index)}
                                            onMouseLeave={() => setHoveredService(null)}
                                        >
                                            <Link to={`/services/${service.slug}`}>
                                                {service.name}
                                            </Link>
                                            {hoveredService === index && (
                                                <div className="service-tooltip">
                                                    <span className="tooltip-title">{service.name}</span>
                                                    <span className="tooltip-desc">{service.description}</span>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="links-column">
                                <h4>About</h4>
                                <ul>
                                    <li><Link to="/about">About Us</Link></li>
                                    <li>
                                        <a
                                            href="/about#mission"
                                            onClick={(e) => handleSectionClick(e, '/about', 'mission')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Our Mission
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/about#vision"
                                            onClick={(e) => handleSectionClick(e, '/about', 'vision')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Our Vision
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="/about#team"
                                            onClick={(e) => handleSectionClick(e, '/about', 'team')}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            Our Team
                                        </a>
                                    </li>
                                    <li><Link to="/contact">Contact Us</Link></li>
                                </ul>
                            </div>

                            <div className="links-column contact-column">
                                <h4>Contact</h4>
                                <ul>
                                    <li>
                                        <a href="https://maps.google.com/?q=123+Tech+Street,+Silicon+Valley,+CA+94025" target="_blank" rel="noopener noreferrer" className="contact-link">
                                            <FaMapMarkerAlt className="contact-icon" />
                                            <span>123 Tech Street, Silicon Valley, CA 94025</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="tel:+15551234567" className="contact-link">
                                            <FaPhone className="contact-icon" />
                                            <span>+1 (555) 123-4567</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="mailto:info@nextechhubs.com" className="contact-link">
                                            <FaEnvelope className="contact-icon" />
                                            <span>info@nextechhubs.com</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Payment Methods - Positioned Here */}
                        <div className="payment-methods-wrapper">
                            <h4 className="payment-title">WE ACCEPT</h4>
                            <div className="payment-methods" aria-label="Payment methods">
                                <div className="payment-item">
                                    <FaCcVisa className="payment-icon pay-visa" title="Visa" aria-label="Visa" />
                                    <span className="payment-label">Visa</span>
                                </div>
                                <div className="payment-item">
                                    <FaCcMastercard className="payment-icon pay-mastercard" title="Mastercard" aria-label="Mastercard" />
                                    <span className="payment-label">Mastercard</span>
                                </div>
                                <div className="payment-item">
                                    <SiPayoneer className="payment-icon pay-payoneer" title="Payoneer" aria-label="Payoneer" />
                                    <span className="payment-label">Payoneer</span>
                                </div>
                                <div className="payment-item">
                                    <FaPaypal className="payment-icon pay-paypal" title="PayPal" aria-label="PayPal" />
                                    <span className="payment-label">PayPal</span>
                                </div>
                                <div className="payment-item">
                                    <FaUniversity className="payment-icon pay-bank" title="Bank Transfer" aria-label="Bank Transfer" />
                                    <span className="payment-label">Bank</span>
                                </div>
                                <div className="payment-item">
                                    <img
                                        src={jazzcashLogo}
                                        alt="JazzCash"
                                        className="jazzcash-logo"
                                        title="JazzCash"
                                    />
                                    <span className="payment-label">JazzCash</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottombar">
                    <div className="copyright">
                        <p>&copy; {new Date().getFullYear()} NexTechHubs. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
