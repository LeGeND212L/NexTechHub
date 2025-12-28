import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaConciergeBell, FaInfoCircle, FaPhoneAlt, FaSignInAlt } from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);

    const isActive = (path) => (location.pathname === path ? 'active' : '');

    const toggleMenu = () => setOpen((s) => !s);
    const closeMenu = () => setOpen(false);
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
        };
    }, [open]);

    return (
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
                        <li>
                            <Link to="/services" className={isActive('/services')} onClick={closeMenu}>
                                Services
                            </Link>
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
    );
};

export default Navbar;
