import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUserCircle } from 'react-icons/fa';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    // Auto-redirect removed - user wants to see login page every time
    // React.useEffect(() => {
    //     if (isAuthenticated) {
    //         navigate(isAdmin ? '/admin/dashboard' : '/employee/dashboard');
    //     }
    // }, [isAuthenticated, isAdmin, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        const result = await login(email, password);

        if (result.success) {
            toast.success('Login successful!');
            navigate(result.data.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard');
        } else {
            setErrorMessage(result.message || 'Invalid email or password');
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>
            </div>

            <div className="login-content">
                <div className="login-box">
                    <div className="login-header">
                        <div className="logo-circle">
                            <FaUserCircle />
                        </div>
                        <h2>Welcome Back!</h2>
                        <p>Login to access your dashboard</p>
                    </div>

                    {errorMessage && (
                        <div className="login-error" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">
                                <FaEnvelope /> Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); if (errorMessage) setErrorMessage(''); }}
                                required
                                placeholder="Enter your email"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <FaLock /> Password
                            </label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); if (errorMessage) setErrorMessage(''); }}
                                    required
                                    placeholder="Enter your password"
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-login"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Logging in...
                                </>
                            ) : (
                                'Login to Dashboard'
                            )}
                        </button>
                    </form>

                    <div className="login-footer">
                        <a href="/" className="back-link">← Back to Home</a>
                    </div>
                </div>

                <div className="login-info">
                    <h3>Employee & Admin Portal</h3>
                    <ul>
                        <li>✓ Secure Access</li>
                        <li>✓ Real-time Task Tracking</li>
                        <li>✓ Project Management</li>
                        <li>✓ Salary & Payment Records</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Login;
