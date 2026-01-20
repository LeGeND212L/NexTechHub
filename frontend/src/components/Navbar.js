import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaPhoneAlt, FaLaptopCode, FaChevronDown } from 'react-icons/fa';
import logo from '../assets/logo_img.png';
import './Navbar.css';

const services = [
    { name: 'Research & Academic Writing', description: 'Professional Research Papers & Dissertations', slug: 'research-writing' },
    { name: 'Web Development', description: 'Custom Websites & Web Apps', slug: 'web-development' },
    { name: 'Mobile App Development', description: 'iOS & Android Apps', slug: 'web-app-development' },
    { name: 'SEO Services', description: 'Search Engine Optimization', slug: 'seo' },
    { name: 'Medical Writing', description: 'Healthcare Documentation', slug: 'medical-writing' },
    { name: 'Digital Marketing', description: 'Social Media & PPC Campaigns', slug: 'social-media-marketing' },
    { name: 'Data Analytics', description: 'Business Intelligence & Visualization', slug: 'power-bi' },
    { name: 'API Development', description: 'Robust RESTful APIs', slug: 'python' },
    { name: 'Database Management', description: 'Database Design & Optimization', slug: 'networking' },
    { name: 'Tech Support & Maintenance', description: '24/7 Technical Support', slug: 'devops' },
    { name: 'Google Ads Management', description: 'PPC Campaign Management', slug: 'financial-analysis' },
    { name: 'E-commerce Solutions', description: 'Shopping Platforms & Integration', slug: 'all-coding-projects' },
    { name: 'Content Writing', description: 'Blog & Website Content', slug: 'business-writing' },
    { name: 'UI/UX Design', description: 'User Interface Design', slug: 'ui-ux' }
];

const Navbar = () => {
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [servicesOpen, setServicesOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

    const isActive = (path) => (location.pathname === path ? 'active' : '');

    const toggleMenu = () => setOpen((s) => !s);
    const closeMenu = () => {
        setOpen(false);
        setMobileServicesOpen(false);
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
        };
    }, [open]);

    return (
        <>
            {/* Professional Contact Header */}
            <div className="header-top">
                <div className="container">
                    <div className="header-top-content">
                        <div className="header-info">
                            <a href="mailto:info@nextechhubs.com" className="header-item">
                                <svg className="header-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                                info@nextechhubs.com
                            </a>
                            <a href="tel:+923001234567" className="header-item">
                                <svg className="header-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                </svg>
                                +92 300 1234567
                            </a>
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

                        <ul className="nav-links">
                            <li>
                                <Link to="/" className={isActive('/')} onClick={closeMenu}>
                                    Home
                                </Link>
                            </li>
                            <li
                                className="services-dropdown"
                                onMouseEnter={() => setServicesOpen(true)}
                                onMouseLeave={() => setServicesOpen(false)}
                            >
                                <Link to="/services" className={`services-link ${isActive('/services')}`} onClick={closeMenu}>
                                    Services <FaChevronDown className="dropdown-arrow" />
                                </Link>
                                {servicesOpen && (
                                    <div className="mega-menu">
                                        <div className="mega-menu-grid">
                                            {services.map((service, index) => (
                                                <Link
                                                    key={index}
                                                    to={`/services/${service.slug}`}
                                                    className="mega-menu-item"
                                                    onClick={() => {
                                                        closeMenu();
                                                        setServicesOpen(false);
                                                    }}
                                                >
                                                    <span className="mega-menu-title">{service.name}</span>
                                                    <span className="mega-menu-desc">{service.description}</span>
                                                </Link>
                                            ))}
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
                        </ul>

                        <div className="nav-right">
                            <Link to="/login" className="login-btn" onClick={closeMenu}>
                                Login
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
                        </div>

                        <div className={`drawer-backdrop ${open ? 'visible' : ''}`} onClick={backdropClick}>
                            <aside className={`mobile-menu ${open ? 'show' : ''}`} role="dialog" aria-modal="true" aria-hidden={!open}>
                                <div className="drawer-header">
                                    <Link to="/" className="drawer-logo" onClick={closeMenu}>
                                        <img src={logo} alt="NexTechHubs Logo" className="drawer-logo-image" />
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
                                        <li className="mobile-services-dropdown">
                                            <button
                                                className={`mobile-services-toggle ${mobileServicesOpen ? 'open' : ''}`}
                                                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                            >
                                                <FaLaptopCode className="drawer-icon" /> Services
                                                <FaChevronDown className="mobile-dropdown-arrow" />
                                            </button>
                                            {mobileServicesOpen && (
                                                <ul className="mobile-services-list">
                                                    {services.map((service, index) => (
                                                        <li key={index}>
                                                            <Link to={`/services/${service.slug}`} onClick={closeMenu}>
                                                                {service.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
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
