import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import HeroParticles from '../../components/HeroParticles';
import Footer from '../../components/Footer';
import './Home.css';

const Home = () => {
    const services = [
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
    ];

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
                            <a
                                key={index}
                                href={`/services?service=${service.slug}`}
                                className="service-card-link"
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
                            </a>
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
                            <div className="why-us-icon">💰</div>
                            <h3>Cost Efficient</h3>
                            <p>Premium quality at competitive rates</p>
                        </div>
                        <div className="why-us-card">
                            <div className="why-us-icon">⏱️</div>
                            <h3>Minimal Timelines</h3>
                            <p>Fast turnaround without compromising quality</p>
                        </div>
                        <div className="why-us-card">
                            <div className="why-us-icon">✅</div>
                            <h3>Quality Standards</h3>
                            <p>100% plagiarism-free & thoroughly tested</p>
                        </div>
                        <div className="why-us-card">
                            <div className="why-us-icon">⚙️</div>
                            <h3>Project Management</h3>
                            <p>Professional approach to every project</p>
                        </div>
                        <div className="why-us-card">
                            <div className="why-us-icon">🎯</div>
                            <h3>Lifetime Support</h3>
                            <p>Dedicated support after project completion</p>
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
