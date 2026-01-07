import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaLightbulb, FaUsers, FaRocket, FaHeart, FaAward, FaGlobeAmericas } from 'react-icons/fa';
import './About.css';

const About = () => {
    const values = [
        {
            icon: <FaLightbulb />,
            title: 'Innovation',
            color: '#f59e0b'
        },
        {
            icon: <FaHeart />,
            title: 'Passion',
            color: '#ef4444'
        },
        {
            icon: <FaAward />,
            title: 'Excellence',
            color: '#8b5cf6'
        },
        {
            icon: <FaUsers />,
            title: 'Collaboration',
            color: '#082A4E'
        },
        {
            icon: <FaRocket />,
            title: 'Growth',
            color: '#10b981'
        },
        {
            icon: <FaGlobeAmericas />,
            title: 'Global Reach',
            color: '#082A4E'
        }
    ];

    return (
        <div>
            <Navbar />

            {/* Hero Section */}
            <motion.section
                className="about-hero"
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
                        About NexTechHubs
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Transforming Ideas into Digital Reality Since 2016
                    </motion.p>
                </div>
            </motion.section>

            {/* Story Section */}
            <section className="about-story">
                <div className="container">
                    <div className="story-content">
                        <motion.div
                            className="story-text"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2>Our Story</h2>
                            <p>
                                Founded in 2016, NexTechHubs began with a simple mission: to deliver exceptional IT services
                                that help businesses thrive in the digital age. What started as a small team of passionate
                                developers has grown into a full-service technology company serving clients worldwide.
                            </p>
                            <p>
                                Today, we specialize in 14 different IT services, from research writing and web development
                                to SEO and digital marketing. Our diverse team of experts brings together decades of combined
                                experience to solve complex challenges and deliver innovative solutions.
                            </p>
                            <p>
                                We pride ourselves on our commitment to quality, transparency, and client satisfaction.
                                Every project we undertake is treated with the same level of care and attention to detail,
                                regardless of size or complexity.
                            </p>
                        </motion.div>
                        <motion.div
                            className="story-image"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" alt="Our Story" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            {/* REMOVED - Stats section removed */}

            {/* Values Section */}
            <section className="about-values">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title">Our Core Values</h2>
                        <p className="section-subtitle">The principles that guide everything we do</p>
                    </motion.div>

                    <div className="values-grid">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                className="value-card"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="value-icon" style={{ color: value.color }}>
                                    {value.icon}
                                </div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            {/* REMOVED - Meet Our Team section has been removed */}

            {/* Mission & Vision Section */}
            <section className="mission-vision">
                <div className="container">
                    <div className="mv-grid">
                        <motion.div
                            className="mv-card mission"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2>Our Mission</h2>
                            <p>
                                To empower businesses and individuals with innovative technology solutions that drive
                                growth, efficiency, and success in the digital world. We are committed to delivering
                                exceptional quality, fostering long-term partnerships, and continuously exceeding
                                client expectations.
                            </p>
                        </motion.div>
                        <motion.div
                            className="mv-card vision"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2>Our Vision</h2>
                            <p>
                                To become the world's most trusted technology partner, known for our innovation,
                                integrity, and impact. We envision a future where every business, regardless of size,
                                has access to world-class technology solutions that enable them to compete and thrive
                                in the global marketplace.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
