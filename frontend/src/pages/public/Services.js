import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaCode, FaPenFancy, FaChartLine, FaMobileAlt, FaLaptopCode, FaRocket, FaUsers, FaSearch, FaArrowRight } from 'react-icons/fa';
import { MdDesignServices, MdAnalytics, MdSupportAgent } from 'react-icons/md';
import { AiOutlineApi, AiFillDatabase } from 'react-icons/ai';
import { SiGoogleads } from 'react-icons/si';
import './Services.css';

const Services = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const allServices = [
        {
            id: 1,
            name: 'Research & Academic Writing',
            category: 'Writing',
            icon: <FaPenFancy />,
            color: '#3b82f6',
            description: 'Professional research papers, dissertations, theses, and academic content with plagiarism-free guarantee.',
            features: ['Original Research', 'Citation Management', 'Multiple Formats', 'Unlimited Revisions'],
            technologies: ['EndNote', 'Zotero', 'Mendeley', 'Turnitin', 'Grammarly'],
            popular: true
        },
        {
            id: 2,
            name: 'Web Development',
            category: 'Development',
            icon: <FaCode />,
            color: '#10b981',
            description: 'Custom websites and web applications built with modern technologies. Responsive, fast, and secure solutions.',
            features: ['Responsive Design', 'Custom Development', 'SEO Optimized', 'Maintenance Support'],
            technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind CSS'],
            popular: true
        },
        {
            id: 3,
            name: 'Mobile App Development',
            category: 'Development',
            icon: <FaMobileAlt />,
            color: '#8b5cf6',
            description: 'Native and cross-platform mobile applications for iOS and Android with stunning user interfaces.',
            features: ['iOS & Android', 'Cross-Platform', 'API Integration', 'App Store Deployment'],
            technologies: ['React Native', 'Flutter', 'Firebase', 'Redux', 'Expo'],
            popular: false
        },
        {
            id: 4,
            name: 'SEO Services',
            category: 'Marketing',
            icon: <FaChartLine />,
            color: '#f59e0b',
            description: 'Comprehensive SEO strategies to improve your search engine rankings and drive organic traffic.',
            features: ['Keyword Research', 'On-Page SEO', 'Link Building', 'Monthly Reports'],
            technologies: ['Google Analytics', 'SEMrush', 'Ahrefs', 'Yoast SEO', 'Moz'],
            popular: true
        },
        {
            id: 5,
            name: 'UI/UX Design',
            category: 'Design',
            icon: <MdDesignServices />,
            color: '#ec4899',
            description: 'Beautiful and intuitive user interfaces that provide exceptional user experiences.',
            features: ['User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
            technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Framer'],
            popular: false
        },
        {
            id: 6,
            name: 'Digital Marketing',
            category: 'Marketing',
            icon: <FaRocket />,
            color: '#ef4444',
            description: 'Complete digital marketing solutions including social media, PPC, and content marketing.',
            features: ['Social Media Marketing', 'PPC Campaigns', 'Content Strategy', 'Analytics'],
            technologies: ['HubSpot', 'Hootsuite', 'Buffer', 'Google Ads', 'Mailchimp'],
            popular: false
        },
        {
            id: 7,
            name: 'Data Analytics',
            category: 'Analytics',
            icon: <MdAnalytics />,
            color: '#06b6d4',
            description: 'Transform your data into actionable insights with advanced analytics and visualization.',
            features: ['Data Visualization', 'Predictive Analytics', 'Custom Dashboards', 'Business Intelligence'],
            technologies: ['Power BI', 'Tableau', 'Python', 'SQL', 'Excel'],
            popular: false
        },
        {
            id: 8,
            name: 'API Development',
            category: 'Development',
            icon: <AiOutlineApi />,
            color: '#14b8a6',
            description: 'Robust and scalable RESTful APIs with comprehensive documentation and security.',
            features: ['RESTful APIs', 'API Documentation', 'Authentication', 'Rate Limiting'],
            technologies: ['Node.js', 'Express', 'JWT', 'Swagger', 'Postman'],
            popular: false
        },
        {
            id: 9,
            name: 'Database Management',
            category: 'Development',
            icon: <AiFillDatabase />,
            color: '#6366f1',
            description: 'Professional database design, optimization, and management services for any scale.',
            features: ['Database Design', 'Query Optimization', 'Backup Solutions', 'Migration Services'],
            technologies: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'DynamoDB'],
            popular: false
        },
        {
            id: 10,
            name: 'Tech Support & Maintenance',
            category: 'Support',
            icon: <MdSupportAgent />,
            color: '#84cc16',
            description: '24/7 technical support and maintenance services to keep your systems running smoothly.',
            features: ['24/7 Support', 'Bug Fixes', 'Performance Monitoring', 'Security Updates'],
            technologies: ['Jenkins', 'Docker', 'Kubernetes', 'AWS', 'New Relic'],
            popular: false
        },
        {
            id: 11,
            name: 'Google Ads Management',
            category: 'Marketing',
            icon: <SiGoogleads />,
            color: '#f97316',
            description: 'Expert Google Ads campaign management to maximize your ROI and reach target customers.',
            features: ['Campaign Setup', 'Ad Copywriting', 'Bid Management', 'Conversion Tracking'],
            technologies: ['Google Ads', 'Google Tag Manager', 'Google Analytics', 'Optimize', 'Data Studio'],
            popular: false
        },
        {
            id: 12,
            name: 'E-commerce Solutions',
            category: 'Development',
            icon: <FaLaptopCode />,
            color: '#a855f7',
            description: 'Complete e-commerce platforms with payment integration, inventory management, and more.',
            features: ['Shopping Cart', 'Payment Gateway', 'Inventory Management', 'Order Tracking'],
            technologies: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal', 'Magento'],
            popular: true
        },
        {
            id: 13,
            name: 'Content Writing',
            category: 'Writing',
            icon: <FaPenFancy />,
            color: '#22c55e',
            description: 'High-quality content for blogs, websites, and marketing materials that engage your audience.',
            features: ['Blog Posts', 'Website Copy', 'Product Descriptions', 'SEO Content'],
            technologies: ['WordPress', 'Grammarly', 'Hemingway', 'SurferSEO', 'Jasper AI'],
            popular: false
        },
        {
            id: 14,
            name: 'Team Training',
            category: 'Support',
            icon: <FaUsers />,
            color: '#f43f5e',
            description: 'Comprehensive training programs to upskill your team in latest technologies and best practices.',
            features: ['Custom Curriculum', 'Hands-on Training', 'Certification', 'Follow-up Support'],
            technologies: ['Zoom', 'Microsoft Teams', 'Google Classroom', 'Udemy Business', 'Coursera'],
            popular: false
        }
    ];

    const categories = ['All', 'Development', 'Writing', 'Marketing', 'Design', 'Analytics', 'Support'];

    const filteredServices = allServices.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <motion.section
                className="services-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <div className="container">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Our Professional Services
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Comprehensive IT solutions tailored to your business needs
                    </motion.p>
                </div>
            </motion.section>

            {/* Search and Filter Section */}
            <section className="services-filter-section">
                <div className="container">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="category-filters">
                        {categories.map((category, index) => (
                            <motion.button
                                key={index}
                                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {category}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="services-grid-section">
                <div className="container">
                    <div className="services-grid-full">
                        {filteredServices.map((service, index) => (
                            <motion.div
                                key={service.id}
                                className="service-detail-card"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                whileHover={{ y: -10 }}
                            >
                                {service.popular && (
                                    <div className="popular-badge">Most Popular</div>
                                )}
                                <div className="service-header" style={{ borderTopColor: service.color }}>
                                    <div className="service-icon-large" style={{ color: service.color }}>
                                        {service.icon}
                                    </div>
                                    <h3>{service.name}</h3>
                                    <p className="service-category">{service.category}</p>
                                </div>
                                <p className="service-description">{service.description}</p>
                                <ul className="service-features">
                                    {service.features.map((feature, i) => (
                                        <li key={i}>✓ {feature}</li>
                                    ))}
                                </ul>
                                <div className="service-footer">
                                    <div className="service-technologies">
                                        <strong>Technologies:</strong>
                                        <div className="tech-tags">
                                            {service.technologies.map((tech, i) => (
                                                <span key={i} className="tech-tag">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <Link to="/contact" className="btn-service">
                                        Get Started <FaArrowRight />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredServices.length === 0 && (
                        <motion.div
                            className="no-results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <h3>No services found</h3>
                            <p>Try adjusting your search or filter criteria</p>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <motion.section
                className="services-cta"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <div className="container">
                    <h2>Need a Custom Solution?</h2>
                    <p>We can tailor our services to meet your specific requirements</p>
                    <Link to="/contact" className="btn btn-primary btn-large">
                        Contact Us for Custom Quote
                    </Link>
                </div>
            </motion.section>

            <Footer />
        </div>
    );
};

export default Services;
