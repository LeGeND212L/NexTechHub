import React from 'react';
import { FaCcVisa, FaCcMastercard, FaPaypal, FaUniversity } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                {/* Payment Methods Section */}
                <div className="payment-section">
                    <h4 className="payment-title">🛡️ We Accept</h4>
                    <div className="payment-methods">
                        <div className="payment-item">
                            <FaCcVisa className="payment-icon visa" />
                            <span>Visa</span>
                        </div>
                        <div className="payment-item">
                            <FaCcMastercard className="payment-icon mastercard" />
                            <span>Mastercard</span>
                        </div>
                        <div className="payment-item">
                            <FaPaypal className="payment-icon paypal" />
                            <span>PayPal</span>
                        </div>
                        <div className="payment-item">
                            <FaUniversity className="payment-icon bank" />
                            <span>Bank Transfer</span>
                        </div>
                    </div>
                </div>

                <div className="footer-content">
                    <div className="footer-section">
                        <h4>Services</h4>
                        <ul>
                            <li>Research Writing</li>
                            <li>Web Development</li>
                            <li>SEO Services</li>
                            <li>UI/UX Design</li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li><a href="/services">Services</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact</h4>
                        <ul>
                            <li>Email: info@nextechhubs.com</li>
                            <li>Phone: +92 XXX XXXXXXX</li>
                            <li>Address: Pakistan</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2024 NexTechHubs. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
