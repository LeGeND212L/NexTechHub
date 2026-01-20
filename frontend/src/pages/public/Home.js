import React, { useCallback, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaPhoneAlt } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import HeroParticles from '../../components/HeroParticles';
import Footer from '../../components/Footer';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const services = useMemo(() => ([
        { name: 'Research & Academic Writing', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop&q=80', color: '#082A4E', description: 'Professional Research Papers & Dissertations', slug: 'research-writing' },
        { name: 'Web Development', image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop&q=80', color: '#10b981', description: 'Custom Websites & Web Apps', slug: 'web-development' },
        { name: 'Mobile App Development', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&q=80', color: '#8b5cf6', description: 'iOS & Android Apps', slug: 'web-app-development' },
        { name: 'SEO Services', image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=400&h=300&fit=crop&q=80', color: '#082A4E', description: 'Search Engine Optimization', slug: 'seo' },
        { name: 'Medical Writing', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&q=80', color: '#f093fb', description: 'Healthcare Documentation', slug: 'medical-writing' },
        { name: 'Digital Marketing', image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&h=300&fit=crop&q=80', color: '#ef4444', description: 'Social Media & PPC Campaigns', slug: 'social-media-marketing' },
        { name: 'Data Analytics', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&q=80', color: '#082A4E', description: 'Business Intelligence & Visualization', slug: 'power-bi' },
        { name: 'API Development', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop&q=80', color: '#082A4E', description: 'Robust RESTful APIs', slug: 'python' },
        { name: 'Database Management', image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop&q=80', color: '#6366f1', description: 'Database Design & Optimization', slug: 'networking' },
        { name: 'Tech Support & Maintenance', image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop&q=80', color: '#84cc16', description: '24/7 Technical Support', slug: 'devops' },
        { name: 'Google Ads Management', image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400&h=300&fit=crop&q=80', color: '#f97316', description: 'PPC Campaign Management', slug: 'financial-analysis' },
        { name: 'E-commerce Solutions', image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=400&h=300&fit=crop&q=80', color: '#a855f7', description: 'Shopping Platforms & Integration', slug: 'all-coding-projects' },
        { name: 'Content Writing', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&q=80', color: '#22c55e', description: 'Blog & Website Content', slug: 'business-writing' },
        { name: 'UI/UX Design', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop&q=80', color: '#54a0ff', description: 'User Interface Design', slug: 'ui-ux' }
    ]), []);

    const [selectedService, setSelectedService] = useState(null);
    const [selectedServiceIndex, setSelectedServiceIndex] = useState(null);
    const detailRef = useRef(null);
    const serviceRefs = useRef([]);

    const handleSelectService = useCallback((service, index) => {
        setSelectedService(service);
        setSelectedServiceIndex(index);
        // Smooth scroll to detail section after state update
        setTimeout(() => {
            if (detailRef.current) {
                const yOffset = -100; // offset for fixed navbar
                const element = detailRef.current;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        }, 100);
    }, []);

    const handleCloseDetail = useCallback(() => {
        // Scroll back to the selected service card
        if (selectedServiceIndex !== null && serviceRefs.current[selectedServiceIndex]) {
            const yOffset = -120; // offset for fixed navbar
            const element = serviceRefs.current[selectedServiceIndex];
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
        // Close detail after scroll
        setTimeout(() => {
            setSelectedService(null);
            setSelectedServiceIndex(null);
        }, 100);
    }, [selectedServiceIndex]);

    const handleGetStarted = useCallback(() => {
        navigate('/contact');
    }, [navigate]);

    return (
        <div className="home-page">
            <Navbar />

            {/* Hero Section with Floating Shapes */}
            <section className="hero">
                <HeroParticles />
                <div className="bg-glow" aria-hidden="true"></div>
                <div className="floating-shape shape1"></div>
                <div className="floating-shape shape2"></div>
                <div className="floating-shape shape3"></div>

                <div className="container">
                    <div className="hero-content">
                        <h1>Welcome to NexTechHubs</h1>
                        <p>Your Trusted Partner for Professional IT Services</p>
                        <p>We deliver excellence in Research Writing, Web Development, SEO, and more</p>
                        <div className="hero-buttons">
                            <a href="/services" className="btn btn-primary">Get Started</a>
                            <a href="/contact" className="btn btn-secondary">Contact Us</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="container">
                    <div>
                        <h2 className="section-title">Our Services</h2>
                        <p className="section-subtitle">Comprehensive IT solutions tailored to your needs</p>
                    </div>

                    <div className="services-grid">
                        {services.map((service, index) => (
                            <button
                                key={index}
                                ref={(el) => (serviceRefs.current[index] = el)}
                                type="button"
                                onClick={() => handleSelectService(service, index)}
                                className="service-card-link"
                                aria-label={`View details for ${service.name}`}
                            >
                                <motion.div
                                    className="service-card"
                                    style={{ borderTop: `4px solid ${service.color}` }}
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="service-image">
                                        <img src={service.image} alt={service.name} className="service-img" />
                                    </div>
                                    <h3>{service.name}</h3>
                                    <p>{service.description}</p>
                                </motion.div>
                            </button>
                        ))}
                    </div>

                    {/* Service Detail Section (inline - renders right here when service selected) */}
                    {selectedService && (
                        <motion.div
                            ref={detailRef}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4 }}
                            className="service-detail-inline"
                        >
                            <div className="service-detail-content">
                                <h3 className="service-detail-title">{selectedService.name}</h3>
                                <p className="service-detail-description">{selectedService.description}</p>
                                <ul className="service-detail-features">
                                    <li>✓ Tailored solutions aligned to your business goals</li>
                                    <li>✓ Transparent timelines and milestone-based delivery</li>
                                    <li>✓ Scalable architecture and future-proof design</li>
                                    <li>✓ Dedicated support and maintenance</li>
                                </ul>
                                <div className="service-detail-actions">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleGetStarted}
                                    >
                                        Get Started
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseDetail}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Technologies Section */}
            <section className="technologies-section">
                <div className="container">
                    <div>
                        <h2 className="section-title">Technologies We Master</h2>
                        <p className="section-subtitle">Cutting-edge tools and frameworks for exceptional results</p>
                    </div>

                    <div className="tech-categories">
                        <div className="tech-category">
                            <h3>Frontend Development</h3>
                            <ul className="tech-list" style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
                                <li className="tech-list-item"><span className="tech-icon">⚛️</span> <span>React</span></li>
                                <li className="tech-list-item"><span className="tech-icon">📱</span> <span>React Native</span></li>
                                <li className="tech-list-item"><span className="tech-icon">🎨</span> <span>Tailwind CSS</span></li>
                                <li className="tech-list-item"><span className="tech-icon">🅰️</span> <span>Next.js</span></li>
                            </ul>
                        </div>

                        <div className="tech-category">
                            <h3>Backend Development</h3>
                            <ul className="tech-list" style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
                                <li className="tech-list-item"><span className="tech-icon">🟢</span> <span>Node.js</span></li>
                                <li className="tech-list-item"><span className="tech-icon">🚂</span> <span>Express</span></li>
                                <li className="tech-list-item"><span className="tech-icon">🐍</span> <span>Python</span></li>
                                <li className="tech-list-item"><span className="tech-icon">🔷</span> <span>MongoDB</span></li>
                            </ul>
                        </div>

                        <div className="tech-category">
                            <h3>Tools & Platforms</h3>
                            <ul className="tech-list" style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
                                <li className="tech-list-item"><span className="tech-icon">☁️</span> <span>AWS</span></li>
                                <li className="tech-list-item"><span className="tech-icon">🐳</span> <span>Docker</span></li>
                                <li className="tech-list-item"><span className="tech-icon">🔧</span> <span>Kubernetes</span></li>
                                <li className="tech-list-item"><span className="tech-icon">📊</span> <span>Power BI</span></li>
                            </ul>
                        </div>

                        <div className="tech-category">
                            <h3>Design & Marketing</h3>
                            <ul className="tech-list" style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
                                <li className="tech-list-item"><span className="tech-icon">🎨</span> <span>Figma</span></li>
                                <li className="tech-list-item"><span className="tech-icon">📈</span> <span>Google Analytics</span></li>
                                <li className="tech-list-item"><span className="tech-icon">🔍</span> <span>SEMrush</span></li>
                                <li className="tech-list-item"><span className="tech-icon">✉️</span> <span>Mailchimp</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-us-section">
                <div className="container">
                    <div>
                        <h2 className="section-title">Why Choose NexTechHubs?</h2>
                        <p className="section-subtitle">Excellence in every aspect of our service</p>
                    </div>

                    <div className="why-us-grid">
                        <div className="why-us-card">
                            <div className="why-us-icon">💰</div>
                            <h3>Cost Efficient</h3>
                        </div>
                        <div className="why-us-card">
                            <div className="why-us-icon">⏱️</div>
                            <h3>Minimal Timelines</h3>

                        </div>
                        <div className="why-us-card">
                            <div className="why-us-icon">✅</div>
                            <h3>Quality Standards</h3>

                        </div>
                        <div className="why-us-card">
                            <div className="why-us-icon">⚙️</div>
                            <h3>Project Management</h3>

                        </div>
                        <div className="why-us-card">
                            <div className="why-us-icon">🎯</div>
                            <h3>Lifetime Support</h3>

                        </div>
                    </div>
                </div>
            </section>

            {/* Customer Feedback Section */}
            <section className="feedback-section" id="feedback">
                <div className="container">
                    <h2 className="section-title">What Our Clients Say</h2>
                    <p className="section-subtitle">Trusted by businesses worldwide - Real stories from real clients</p>

                    <div className="feedback-grid">
                        <motion.div
                            className="feedback-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="feedback-quote">"</div>
                            <p className="feedback-text">
                                NexTechHubs transformed our outdated website into a modern, responsive platform.
                                Their attention to detail and commitment to deadlines exceeded our expectations.
                            </p>
                            <div className="feedback-author">
                                <div className="author-avatar">JM</div>
                                <div className="author-info">
                                    <h4>James Mitchell</h4>
                                    <span>CEO, TechVentures Inc.</span>
                                </div>
                            </div>
                            <div className="feedback-rating">
                                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="feedback-card featured"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            <div className="feedback-quote">"</div>
                            <p className="feedback-text">
                                The mobile app they developed for us has received incredible feedback from our users.
                                Professional team, excellent communication, and outstanding results. Highly recommended!
                            </p>
                            <div className="feedback-author">
                                <div className="author-avatar">SK</div>
                                <div className="author-info">
                                    <h4>Sarah Khan</h4>
                                    <span>Founder, HealthPlus App</span>
                                </div>
                            </div>
                            <div className="feedback-rating">
                                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                            </div>
                        </motion.div>

                        <motion.div
                            className="feedback-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            <div className="feedback-quote">"</div>
                            <p className="feedback-text">
                                Their SEO and digital marketing services boosted our online visibility by 300%.
                                The team is knowledgeable, responsive, and truly cares about client success.
                            </p>
                            <div className="feedback-author">
                                <div className="author-avatar">RA</div>
                                <div className="author-info">
                                    <h4>Robert Anderson</h4>
                                    <span>Marketing Director, GlobalTrade</span>
                                </div>
                            </div>
                            <div className="feedback-rating">
                                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                            </div>
                        </motion.div>
                    </div>

                    <div className="feedback-stats">
                        <div className="stat-item">
                            <span className="stat-number">500+</span>
                            <span className="stat-label">Projects Completed</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">98%</span>
                            <span className="stat-label">Client Satisfaction</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">50+</span>
                            <span className="stat-label">Countries Served</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Support Available</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <h2>Ready to Get Started?</h2>
                    <p>Let's discuss your project and bring your ideas to life</p>
                    <a
                        href="/contact"
                        className="btn btn-primary btn-large"
                    >
                        <FaPhoneAlt /> Contact Us Today
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
