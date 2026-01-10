import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FaLightbulb, FaUsers, FaRocket, FaHeart, FaAward, FaGlobeAmericas, FaLinkedin, FaGithub, FaTwitter, FaHandshake, FaShieldAlt } from 'react-icons/fa';
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
        },
        {
            icon: <FaHandshake />,
            title: 'Integrity',
            color: '#3b82f6'
        },
        {
            icon: <FaShieldAlt />,
            title: 'Trust',
            color: '#06b6d4'
        }
    ];

    const teamMembers = [
        {
            name: 'John Anderson',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
            social: {
                linkedin: '#',
                twitter: '#',
                github: '#'
            }
        },
        {
            name: 'Sarah Mitchell',
            role: 'CTO',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
            social: {
                linkedin: '#',
                twitter: '#',
                github: '#'
            }
        },
        {
            name: 'Michael Chen',
            role: 'Lead Developer',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
            social: {
                linkedin: '#',
                twitter: '#',
                github: '#'
            }
        },
        {
            name: 'Emily Roberts',
            role: 'Design Director',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
            social: {
                linkedin: '#',
                twitter: '#',
                github: '#'
            }
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

            {/* Our Aim Section */}
            <section className="about-aim">
                <div className="container">
                    <div className="aim-grid">
                        <motion.div
                            className="aim-content"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2>Our Aim</h2>
                            <p className="aim-highlight">
                                Empowering businesses through innovative technology solutions
                            </p>
                            <div className="aim-features">
                                <motion.div
                                    className="aim-feature"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                >
                                    <div className="feature-icon">
                                        <FaRocket />
                                    </div>
                                    <div className="feature-text">
                                        <h4>Innovation First</h4>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="aim-feature"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    <div className="feature-icon">
                                        <FaAward />
                                    </div>
                                    <div className="feature-text">
                                        <h4>Quality Assured</h4>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="aim-feature"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    <div className="feature-icon">
                                        <FaUsers />
                                    </div>
                                    <div className="feature-text">
                                        <h4>Client-Centric</h4>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="aim-feature"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    <div className="feature-icon">
                                        <FaGlobeAmericas />
                                    </div>
                                    <div className="feature-text">
                                        <h4>Global Impact</h4>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="aim-feature"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    <div className="feature-icon">
                                        <FaLightbulb />
                                    </div>
                                    <div className="feature-text">
                                        <h4>Creative Solutions</h4>
                                    </div>
                                </motion.div>
                                <motion.div
                                    className="aim-feature"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.6 }}
                                >
                                    <div className="feature-icon">
                                        <FaHeart />
                                    </div>
                                    <div className="feature-text">
                                        <h4>Passionate Team</h4>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                        <motion.div
                            className="aim-image"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="image-wrapper">
                                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop" alt="Our Aim" />
                                <div className="image-overlay"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

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
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="about-team">
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="section-title">Meet Our Team</h2>
                        <p className="section-subtitle">The talented people behind our success</p>
                    </motion.div>

                    <div className="team-grid">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                className="team-card"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ y: -10 }}
                            >
                                <div className="team-image">
                                    <img src={member.image} alt={member.name} />
                                </div>
                                <div className="team-info">
                                    <h3>{member.name}</h3>
                                    <p>{member.role}</p>
                                    <div className="team-social">
                                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer">
                                            <FaLinkedin />
                                        </a>
                                        <a href={member.social.twitter} target="_blank" rel="noopener noreferrer">
                                            <FaTwitter />
                                        </a>
                                        <a href={member.social.github} target="_blank" rel="noopener noreferrer">
                                            <FaGithub />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default About;
