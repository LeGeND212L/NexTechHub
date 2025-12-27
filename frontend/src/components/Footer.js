import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>NexTechHubs</h3>
                        <p>Professional IT services provider delivering excellence in technology solutions.</p>
                    </div>

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
