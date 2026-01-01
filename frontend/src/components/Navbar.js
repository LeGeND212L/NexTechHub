import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaConciergeBell, FaInfoCircle, FaPhoneAlt } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const dropdownTimer = useRef(null);

    const isActive = (path) => (location.pathname === path ? 'active' : '');

    const toggleMenu = () => setOpen((s) => !s);
    const closeMenu = () => setOpen(false);

    const handleMouseEnterServices = () => {
        if (dropdownTimer.current) {
            clearTimeout(dropdownTimer.current);
        }
        setServicesOpen(true);
    };

    const handleMouseLeaveServices = () => {
        dropdownTimer.current = setTimeout(() => {
            setServicesOpen(false);
        }, 300);
    };

    const backdropClick = (e) => {
        if (e.target.classList.contains('drawer-backdrop')) closeMenu();
    };

    useEffect(() => {
        // lock body scroll when menu open
        document.body.style.overflow = open ? 'hidden' : '';
        const onKey = (e) => {
            if (e.key === 'Escape') closeMenu();
        };
        window.addEventListener('keydown', onKey);
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
            if (dropdownTimer.current) {
                clearTimeout(dropdownTimer.current);
            }
        };
    }, [open]);

    return (
        <>
            {/* Professional Contact & Info Header */}
            <div className="header-top">
                <div className="container">
                    <div className="header-top-content">
                        <div className="header-left">
                            <a href="mailto:info@nextechhubs.com" className="header-link">
                                <span className="header-icon">✉</span>
                                <span className="header-value">info@nextechhubs.com</span>
                            </a>
                            <a href="tel:+923001234567" className="header-link">
                                <span className="header-icon">☎</span>
                                <span className="header-value">+92 300 1234567</span>
                            </a>
                        </div>
                        <div className="header-right">
                            <span className="header-tagline">Your Trusted IT Solutions Partner</span>
                        </div>
                    </div>
                </div>
            </div>
            <nav className="navbar">
                <div className="container">
                    <div className="navbar-content">
                        <Link to="/" className="logo" onClick={closeMenu}>
                            <img src={logo} alt="NexTechHubs Logo" className="logo-image" />
                            <h2>NexTechHubs</h2>
                        </Link>

                        <button
                            className={`hamburger ${open ? 'open' : ''}`}
                            aria-label={open ? 'Close menu' : 'Open menu'}
                            aria-expanded={open}
                            onClick={toggleMenu}
                        >
                            <span />
                            <span />
                            <span />
                        </button>

                        <ul className="nav-links">
                            <li>
                                <Link to="/" className={isActive('/')} onClick={closeMenu}>
                                    Home
                                </Link>
                            </li>
                            <li className="services-dropdown"
                                onMouseEnter={handleMouseEnterServices}
                                onMouseLeave={handleMouseLeaveServices}>
                                <Link to="/services" className={isActive('/services')}>
                                    Services <span className="dropdown-arrow">▼</span>
                                </Link>
                                {servicesOpen && (
                                    <div className="mega-menu"
                                        onMouseEnter={handleMouseEnterServices}
                                        onMouseLeave={handleMouseLeaveServices}>
                                        <div className="mega-menu-content">
                                            <div className="mega-column">
                                                <h4>Writing Services</h4>
                                                <a href="/services?service=research-writing">Research & Academic Writing</a>
                                                <a href="/services?service=medical-writing">Medical Writing</a>
                                                <a href="/services?service=business-writing">Content Writing</a>
                                            </div>
                                            <div className="mega-column">
                                                <h4>Web Development</h4>
                                                <a href="/services?service=web-development">Web Development</a>
                                                <a href="/services?service=web-app-development">Mobile App Development</a>
                                                <a href="/services?service=ui-ux">Team Training</a>
                                            </div>
                                            <div className="mega-column">
                                                <h4>Digital Marketing</h4>
                                                <a href="/services?service=seo">SEO Services</a>
                                                <a href="/services?service=social-media-marketing">Digital Marketing</a>
                                                <a href="/services?service=financial-analysis">Google Ads Management</a>
                                            </div>
                                            <div className="mega-column">
                                                <h4>Technical Services</h4>
                                                <a href="/services?service=python">API Development</a>
                                                <a href="/services?service=devops">Tech Support & Maintenance</a>
                                                <a href="/services?service=networking">Database Management</a>
                                                <a href="/services?service=power-bi">Data Analytics</a>
                                                <a href="/services?service=all-coding-projects">E-commerce Solutions</a>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </li>
                            <li>
                                <Link to="/about" className={isActive('/about')} onClick={closeMenu}>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className={isActive('/contact')} onClick={closeMenu}>
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link to="/login" className="login-btn" onClick={closeMenu}>
                                    Login
                                </Link>
                            </li>
                        </ul>

                        <div className={`drawer-backdrop ${open ? 'visible' : ''}`} onClick={backdropClick}>
                            <aside className={`mobile-menu ${open ? 'show' : ''}`} role="dialog" aria-modal="true" aria-hidden={!open}>
                                <div className="drawer-header">
                                    <Link to="/" className="drawer-logo" onClick={closeMenu}>
                                        <div className="logo-icon">N</div>
                                        <span className="drawer-title">NexTechHubs</span>
                                    </Link>
                                    <button className="drawer-close" onClick={closeMenu} aria-label="Close menu">✕</button>
                                </div>

                                <nav className="drawer-nav">
                                    <ul>
                                        <li>
                                            <Link to="/" onClick={closeMenu} className={isActive('/')}>
                                                <FaHome className="drawer-icon" /> Home
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/services" onClick={closeMenu} className={isActive('/services')}>
                                                <FaConciergeBell className="drawer-icon" /> Services
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/about" onClick={closeMenu} className={isActive('/about')}>
                                                <FaInfoCircle className="drawer-icon" /> About
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/contact" onClick={closeMenu} className={isActive('/contact')}>
                                                <FaPhoneAlt className="drawer-icon" /> Contact
                                            </Link>
                                        </li>
                                    </ul>

                                    <div className="drawer-cta">
                                        <Link to="/login" className="login-btn" onClick={closeMenu}>Login</Link>
                                    </div>
                                </nav>

                                <div className="drawer-footer">
                                    <small>© {new Date().getFullYear()} NexTechHubs</small>
                                </div>
                            </aside>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
