import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import Navbar from '../../components/Navbar';
import HeroParticles from '../../components/HeroParticles';
import Footer from '../../components/Footer';
import { FaCode, FaPenFancy, FaChartLine, FaMobileAlt, FaLaptopCode, FaRocket, FaUsers } from 'react-icons/fa';
import './Home.css';

const Home = () => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const services = [
        { name: 'Research Writing', icon: <FaPenFancy />, color: '#667eea', description: 'Academic & Professional Research' },
        { name: 'Medical Writing', icon: <FaPenFancy />, color: '#f093fb', description: 'Healthcare Documentation' },
        { name: 'Business Writing', icon: <FaChartLine />, color: '#4facfe', description: 'Business Plans & Reports' },
        { name: 'SEO', icon: <FaRocket />, color: '#43e97b', description: 'Search Engine Optimization' },
        { name: 'Web Development', icon: <FaLaptopCode />, color: '#fa709a', description: 'Responsive Websites' },
        { name: 'Web App Development', icon: <FaMobileAlt />, color: '#fee140', description: 'Custom Web Applications' },
        { name: 'Python', icon: <FaCode />, color: '#30cfd0', description: 'Python Development' },
        { name: 'Power BI', icon: <FaChartLine />, color: '#a8edea', description: 'Data Visualization' },
        { name: 'DevOps', icon: <FaRocket />, color: '#ff6b6b', description: 'CI/CD & Cloud Solutions' },
        { name: 'Financial Analysis', icon: <FaChartLine />, color: '#feca57', description: 'Financial Modeling' },
        { name: 'Social Media Marketing', icon: <FaUsers />, color: '#ff9ff3', description: 'Digital Marketing' },
        { name: 'UI/UX', icon: <FaMobileAlt />, color: '#54a0ff', description: 'User Interface Design' },
        { name: 'Networking', icon: <FaRocket />, color: '#00d2d3', description: 'Network Solutions' },
        { name: 'All Coding Projects', icon: <FaCode />, color: '#5f27cd', description: 'Custom Development' }
    ];

    const stats = [
        { number: 500, label: 'Projects Completed', suffix: '+' },
        { number: 350, label: 'Happy Clients', suffix: '+' },
        { number: 50, label: 'Expert Team', suffix: '+' },
        { number: 98, label: 'Success Rate', suffix: '%' }
    ];

    return (
        <div>
            <Navbar />

            {/* Hero Section with Floating Shapes */}
            <section className="hero">
                <HeroParticles />
                <div className="floating-shape shape1"></div>
                <div className="floating-shape shape2"></div>
                <div className="floating-shape shape3"></div>

                <div className="container">
                    <div className="hero-content">
                        <h1>Welcome to NexTechHubs</h1>
                        <p>Your Trusted Partner for Professional IT Services</p>
                        <p>We deliver excellence in Research Writing, Web Development, SEO, and more</p>
                        <div className="hero-buttons">
                            <a href="/services" className="btn btn-primary">Explore Services</a>
                            <a href="/contact" className="btn btn-secondary">Contact Us</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section with CountUp Animation */}
            <section className="stats-section" ref={ref}>
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="stat-card"
                            >
                                <div className="stat-number">
                                    {inView && (
                                        <CountUp
                                            end={stat.number}
                                            duration={2.5}
                                            suffix={stat.suffix}
                                        />
                                    )}
                                </div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
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
                            <motion.div
                                key={index}
                                className="service-card"
                                style={{ borderTop: `4px solid ${service.color}` }}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="service-icon" style={{ color: service.color }}>
                                    {service.icon}
                                </div>
                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center">
                        <a href="/services" className="btn btn-primary">View All Services</a>
                    </div>
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
                            <div className="tech-grid">
                                <div className="tech-item">
                                    <div className="tech-icon">⚛️</div>
                                    <span>React</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">📱</div>
                                    <span>React Native</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">🎨</div>
                                    <span>Tailwind CSS</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">🅰️</div>
                                    <span>Next.js</span>
                                </div>
                            </div>
                        </div>

                        <div className="tech-category">
                            <h3>Backend Development</h3>
                            <div className="tech-grid">
                                <div className="tech-item">
                                    <div className="tech-icon">🟢</div>
                                    <span>Node.js</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">🚂</div>
                                    <span>Express</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">🐍</div>
                                    <span>Python</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">🔷</div>
                                    <span>MongoDB</span>
                                </div>
                            </div>
                        </div>

                        <div className="tech-category">
                            <h3>Tools & Platforms</h3>
                            <div className="tech-grid">
                                <div className="tech-item">
                                    <div className="tech-icon">☁️</div>
                                    <span>AWS</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">🐳</div>
                                    <span>Docker</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">🔧</div>
                                    <span>Kubernetes</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">📊</div>
                                    <span>Power BI</span>
                                </div>
                            </div>
                        </div>

                        <div className="tech-category">
                            <h3>Design & Marketing</h3>
                            <div className="tech-grid">
                                <div className="tech-item">
                                    <div className="tech-icon">🎨</div>
                                    <span>Figma</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">📈</div>
                                    <span>Google Analytics</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">🔍</div>
                                    <span>SEMrush</span>
                                </div>
                                <div className="tech-item">
                                    <div className="tech-icon">✉️</div>
                                    <span>Mailchimp</span>
                                </div>
                            </div>
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
                            <h3>✔ 100% Plagiarism-Free</h3>
                            <p>Original content guaranteed with quality assurance</p>
                        </div>
                        <div className="why-us-card">
                            <h3>✔ On-Time Delivery</h3>
                            <p>We respect deadlines and deliver punctually</p>
                        </div>
                        <div className="why-us-card">
                            <h3>✔ Expert Team</h3>
                            <p>Experienced professionals in every domain</p>
                        </div>
                        <div className="why-us-card">
                            <h3>✔ Confidential & Secure</h3>
                            <p>Your data and projects are safe with us</p>
                        </div>
                        <div className="why-us-card">
                            <h3>✔ Revision Support</h3>
                            <p>Free revisions until you're satisfied</p>
                        </div>
                        <div className="why-us-card">
                            <h3>✔ Affordable Pricing</h3>
                            <p>Quality services at competitive rates</p>
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
                        Contact Us Today
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
