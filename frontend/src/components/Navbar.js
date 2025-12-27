import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="logo">
                        <div className="logo-icon">N</div>
                        <h2>NexTechHubs</h2>
                    </Link>

                    <ul className="nav-links">
                        <li><Link to="/" className={isActive('/')}>Home</Link></li>
                        <li><Link to="/services" className={isActive('/services')}>Services</Link></li>
                        <li><Link to="/about" className={isActive('/about')}>About</Link></li>
                        <li><Link to="/contact" className={isActive('/contact')}>Contact</Link></li>
                        <li><Link to="/login" className="login-btn">Login</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
