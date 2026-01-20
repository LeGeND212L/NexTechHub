import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaClock, FaDollarSign, FaRocket, FaArrowLeft, FaPhoneAlt } from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './Services.css';

const ServiceDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const servicesData = useMemo(() => ({
        'research-writing': {
            name: 'Research & Academic Writing',
            tagline: 'Professional Research Papers & Dissertations',
            image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&h=600&fit=crop&q=80',
            color: '#082A4E',
            description: 'Comprehensive research and academic writing services delivered by experts with advanced degrees. We ensure originality, rigorous methodology, and adherence to academic standards.',
            features: [
                'PhD-level researchers and writers',
                'Original content with plagiarism checks',
                'APA, MLA, Chicago style formatting',
                'Unlimited revisions included',
                'Data analysis and visualization',
                'Literature review and citation management'
            ],
            benefits: [
                'On-time delivery guaranteed',
                'Confidential and secure process',
                '24/7 customer support',
                'Direct communication with writers'
            ],
            process: [
                { step: 'Consultation', desc: 'Discuss your requirements and objectives' },
                { step: 'Planning', desc: 'Outline structure and research methodology' },
                { step: 'Research', desc: 'Conduct thorough literature review and data collection' },
                { step: 'Writing', desc: 'Draft with proper citations and formatting' },
                { step: 'Review', desc: 'Quality check and revisions as needed' },
                { step: 'Delivery', desc: 'Final document with formatting and references' }
            ]
        },
        'web-development': {
            name: 'Web Development',
            tagline: 'Custom Websites & Web Applications',
            image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=1200&h=600&fit=crop&q=80',
            color: '#10b981',
            description: 'Build responsive, modern websites and web applications with cutting-edge technologies. From simple landing pages to complex enterprise solutions.',
            features: [
                'Responsive design for all devices',
                'Modern frameworks (React, Next.js)',
                'SEO-optimized architecture',
                'Fast loading performance',
                'Secure authentication systems',
                'API integration and development'
            ],
            benefits: [
                'Scalable and maintainable code',
                'Cross-browser compatibility',
                'Lifetime technical support',
                'Regular updates and maintenance'
            ],
            process: [
                { step: 'Discovery' },
                { step: 'Design' },
                { step: 'Development' },
                { step: 'Testing' },
                { step: 'Deployment' },
                { step: 'Support' }
            ]
        },
        'web-app-development': {
            name: 'Mobile App Development',
            tagline: 'iOS & Android Applications',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=600&fit=crop&q=80',
            color: '#8b5cf6',
            description: 'Native and cross-platform mobile applications designed for performance and user experience. We create apps that users love.',
            features: [
                'Native iOS and Android development',
                'Cross-platform with React Native',
                'Intuitive user interfaces',
                'Push notifications and real-time features',
                'Offline functionality',
                'App Store submission and optimization'
            ],
            benefits: [
                'Performance-optimized applications',
                'Regular updates and bug fixes',
                'Analytics and user tracking',
                'Cloud backend integration'
            ],
            process: [
                { step: 'Concept', desc: 'Define app vision and core features' },
                { step: 'Design', desc: 'Create stunning UI/UX for mobile' },
                { step: 'Development', desc: 'Build with native or cross-platform tech' },
                { step: 'Testing', desc: 'Rigorous QA on real devices' },
                { step: 'Launch', desc: 'Submit to App Store and Google Play' },
                { step: 'Maintain', desc: 'Monitor performance and release updates' }
            ]
        },
        'seo': {
            name: 'SEO Services',
            tagline: 'Search Engine Optimization',
            image: 'https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=1200&h=600&fit=crop&q=80',
            color: '#082A4E',
            description: 'Improve your search rankings and drive organic traffic with proven SEO strategies. We optimize every aspect of your online presence.',
            features: [
                'Comprehensive keyword research',
                'On-page and technical SEO',
                'Quality backlink building',
                'Content optimization',
                'Local SEO and Google My Business',
                'Monthly performance reports'
            ],
            benefits: [
                'Increased organic traffic',
                'Higher search rankings',
                'Better conversion rates',
                'Long-term sustainable results'
            ],
            process: [
                { step: 'Audit', desc: 'Analyze current SEO performance' },
                { step: 'Strategy', desc: 'Develop customized SEO roadmap' },
                { step: 'Optimize', desc: 'Implement on-page and technical improvements' },
                { step: 'Content', desc: 'Create SEO-optimized content' },
                { step: 'Build', desc: 'Acquire quality backlinks' },
                { step: 'Monitor', desc: 'Track rankings and adjust strategy' }
            ]
        },
        'social-media-marketing': {
            name: 'Digital Marketing',
            tagline: 'Social Media & PPC Campaigns',
            image: 'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=1200&h=600&fit=crop&q=80',
            color: '#ef4444',
            description: 'Comprehensive digital marketing strategies across all major platforms. Increase brand awareness and drive conversions with targeted campaigns.',
            features: [
                'Social media management (Facebook, Instagram, LinkedIn)',
                'PPC advertising (Google Ads, Facebook Ads)',
                'Content creation and scheduling',
                'Influencer marketing campaigns',
                'Email marketing automation',
                'Analytics and ROI tracking'
            ],
            benefits: [
                'Increased brand visibility',
                'Higher engagement rates',
                'Better lead generation',
                'Measurable ROI'
            ],
            process: [
                { step: 'Research', desc: 'Understand target audience and competitors' },
                { step: 'Strategy', desc: 'Plan campaigns across channels' },
                { step: 'Create', desc: 'Develop engaging content and creatives' },
                { step: 'Launch', desc: 'Execute campaigns with precise targeting' },
                { step: 'Optimize', desc: 'A/B test and refine for performance' },
                { step: 'Report', desc: 'Provide detailed analytics and insights' }
            ]
        },
        'medical-writing': {
            name: 'Medical Writing',
            tagline: 'Healthcare Documentation',
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=600&fit=crop&q=80',
            color: '#f093fb',
            description: 'Specialized medical and healthcare writing services by qualified medical professionals. Accurate, compliant, and scientifically sound documentation.',
            features: [
                'Medical research papers and manuscripts',
                'Clinical trial documentation',
                'Healthcare content writing',
                'Regulatory documents and submissions',
                'Patient education materials',
                'Medical device documentation'
            ],
            benefits: [
                'Expert medical writers',
                'Regulatory compliance',
                'Scientific accuracy',
                'Peer-review ready content'
            ],
            process: [
                { step: 'Brief', desc: 'Understand medical topic and requirements' },
                { step: 'Research', desc: 'Review literature and clinical data' },
                { step: 'Draft', desc: 'Create scientifically accurate content' },
                { step: 'Review', desc: 'Medical expert review and validation' },
                { step: 'Edit', desc: 'Refine for clarity and compliance' },
                { step: 'Submit', desc: 'Deliver publication-ready document' }
            ]
        },
        'power-bi': {
            name: 'Data Analytics',
            tagline: 'Business Intelligence & Visualization',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop&q=80',
            color: '#082A4E',
            description: 'Transform raw data into actionable insights with powerful analytics and visualization. Make data-driven decisions with confidence.',
            features: [
                'Power BI dashboard development',
                'Data modeling and ETL',
                'Interactive reports and visualizations',
                'Real-time data analytics',
                'Predictive analytics and forecasting',
                'Custom KPI tracking'
            ],
            benefits: [
                'Clear data visualization',
                'Faster decision making',
                'Automated reporting',
                'Improved business intelligence'
            ],
            process: [
                { step: 'Discovery', desc: 'Identify data sources and KPIs' },
                { step: 'Extract', desc: 'Collect and integrate data' },
                { step: 'Model', desc: 'Structure data for analysis' },
                { step: 'Visualize', desc: 'Create interactive dashboards' },
                { step: 'Deploy', desc: 'Implement and train users' },
                { step: 'Maintain', desc: 'Monitor and update analytics' }
            ]
        },
        'python': {
            name: 'API Development',
            tagline: 'Robust RESTful APIs',
            image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=600&fit=crop&q=80',
            color: '#082A4E',
            description: 'Build scalable, secure, and well-documented APIs for your applications. RESTful and GraphQL APIs with best practices.',
            features: [
                'RESTful API design and development',
                'GraphQL implementation',
                'API authentication and security',
                'Comprehensive API documentation',
                'Rate limiting and caching',
                'Third-party API integrations'
            ],
            benefits: [
                'Scalable architecture',
                'Enhanced security',
                'Clear documentation',
                'Easy integration'
            ],
            process: [
                { step: 'Plan', desc: 'Define API endpoints and data models' },
                { step: 'Design', desc: 'Create API architecture and schema' },
                { step: 'Develop', desc: 'Build with modern frameworks' },
                { step: 'Test', desc: 'Comprehensive API testing' },
                { step: 'Document', desc: 'Create detailed API documentation' },
                { step: 'Deploy', desc: 'Launch with monitoring' }
            ]
        },
        'networking': {
            name: 'Database Management',
            tagline: 'Database Design & Optimization',
            image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=600&fit=crop&q=80',
            color: '#6366f1',
            description: 'Professional database design, optimization, and management services. Ensure data integrity, performance, and scalability.',
            features: [
                'Database design and architecture',
                'SQL and NoSQL databases',
                'Performance optimization and indexing',
                'Data migration and integration',
                'Backup and disaster recovery',
                'Database security and compliance'
            ],
            benefits: [
                'Improved query performance',
                'Data security and reliability',
                'Scalable infrastructure',
                'Reduced downtime'
            ],
            process: [
                { step: 'Assess', desc: 'Analyze current database setup' },
                { step: 'Design', desc: 'Create optimal database schema' },
                { step: 'Implement', desc: 'Deploy database solution' },
                { step: 'Optimize', desc: 'Tune queries and indexes' },
                { step: 'Secure', desc: 'Implement security measures' },
                { step: 'Monitor', desc: 'Ongoing performance tracking' }
            ]
        },
        'devops': {
            name: 'Tech Support & Maintenance',
            tagline: '24/7 Technical Support',
            image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop&q=80',
            color: '#84cc16',
            description: 'Round-the-clock technical support and maintenance services. Keep your systems running smoothly with proactive monitoring and quick issue resolution.',
            features: [
                '24/7 helpdesk support',
                'System monitoring and alerts',
                'Bug fixes and patches',
                'Software updates and upgrades',
                'Performance optimization',
                'Security audits and hardening'
            ],
            benefits: [
                'Minimal downtime',
                'Quick issue resolution',
                'Proactive maintenance',
                'Peace of mind'
            ],
            process: [
                { step: 'Setup', desc: 'Configure monitoring and alerts' },
                { step: 'Monitor', desc: 'Track system health 24/7' },
                { step: 'Respond', desc: 'Quick incident response' },
                { step: 'Fix', desc: 'Resolve issues efficiently' },
                { step: 'Update', desc: 'Regular maintenance and updates' },
                { step: 'Report', desc: 'Monthly performance reports' }
            ]
        },
        'financial-analysis': {
            name: 'Google Ads Management',
            tagline: 'PPC Campaign Management',
            image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&h=600&fit=crop&q=80',
            color: '#f97316',
            description: 'Maximize your ROI with expertly managed Google Ads campaigns. Targeted advertising that drives conversions and grows your business.',
            features: [
                'Campaign strategy and setup',
                'Keyword research and bidding',
                'Ad copywriting and A/B testing',
                'Landing page optimization',
                'Conversion tracking and analytics',
                'Remarketing campaigns'
            ],
            benefits: [
                'Increased website traffic',
                'Higher conversion rates',
                'Lower cost per acquisition',
                'Detailed ROI tracking'
            ],
            process: [
                { step: 'Analyze', desc: 'Understand business goals and audience' },
                { step: 'Setup', desc: 'Create campaigns and ad groups' },
                { step: 'Launch', desc: 'Start campaigns with optimal bids' },
                { step: 'Optimize', desc: 'Refine targeting and bids' },
                { step: 'Test', desc: 'A/B test ad copy and landing pages' },
                { step: 'Scale', desc: 'Expand successful campaigns' }
            ]
        },
        'all-coding-projects': {
            name: 'E-commerce Solutions',
            tagline: 'Shopping Platforms & Integration',
            image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=600&fit=crop&q=80',
            color: '#a855f7',
            description: 'Complete e-commerce solutions from store setup to payment integration. Build your online store with powerful features and seamless user experience.',
            features: [
                'Custom e-commerce platforms',
                'Shopping cart and checkout',
                'Payment gateway integration',
                'Inventory management',
                'Order tracking and fulfillment',
                'Multi-currency and multi-language support'
            ],
            benefits: [
                'Increased online sales',
                'Seamless shopping experience',
                'Secure payment processing',
                'Easy inventory management'
            ],
            process: [
                { step: 'Plan', desc: 'Define store requirements and features' },
                { step: 'Design', desc: 'Create attractive storefront UI' },
                { step: 'Develop', desc: 'Build e-commerce functionality' },
                { step: 'Integrate', desc: 'Connect payment and shipping' },
                { step: 'Test', desc: 'Comprehensive checkout testing' },
                { step: 'Launch', desc: 'Deploy and start selling' }
            ]
        },
        'business-writing': {
            name: 'Content Writing',
            tagline: 'Blog & Website Content',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop&q=80',
            color: '#22c55e',
            description: 'Engaging, SEO-optimized content that attracts and converts. From blog posts to website copy, we create content that resonates with your audience.',
            features: [
                'Blog posts and articles',
                'Website copy and landing pages',
                'Product descriptions',
                'Email newsletters',
                'Social media content',
                'SEO content optimization'
            ],
            benefits: [
                'Improved search rankings',
                'Higher engagement',
                'Brand authority',
                'Consistent voice'
            ],
            process: [
                { step: 'Brief', desc: 'Understand brand and target audience' },
                { step: 'Research', desc: 'Topic research and keyword analysis' },
                { step: 'Write', desc: 'Create compelling content' },
                { step: 'Optimize', desc: 'SEO optimization and formatting' },
                { step: 'Edit', desc: 'Proofread and refine' },
                { step: 'Publish', desc: 'Deliver ready-to-publish content' }
            ]
        },
        'ui-ux': {
            name: 'UI/UX Design',
            tagline: 'User Interface Design',
            image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop&q=80',
            color: '#54a0ff',
            description: 'Beautiful, intuitive user interfaces that delight users. We design experiences that are both aesthetically pleasing and highly functional.',
            features: [
                'User research and personas',
                'Wireframing and prototyping',
                'Visual design and branding',
                'Responsive design',
                'Usability testing',
                'Design systems and style guides'
            ],
            benefits: [
                'Better user experience',
                'Higher conversion rates',
                'Reduced development costs',
                'Consistent brand identity'
            ],
            process: [
                { step: 'Research', desc: 'User research and competitive analysis' },
                { step: 'Wireframe', desc: 'Create low-fidelity wireframes' },
                { step: 'Design', desc: 'High-fidelity visual design' },
                { step: 'Prototype', desc: 'Interactive prototypes' },
                { step: 'Test', desc: 'User testing and feedback' },
                { step: 'Handoff', desc: 'Developer-ready design files' }
            ]
        }
    }), []);

    const service = servicesData[slug] || servicesData['research-writing'];

    return (
        <div style={{ background: '#000000', minHeight: '100vh' }}>
            <Navbar />

            {/* Hero Section */}
            <motion.section
                className="service-detail-hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${service.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '120px 0 80px',
                    color: '#fff'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
            >
                <div className="container">
                    <button
                        onClick={() => navigate(-1)}
                        className="back-button"
                        style={{
                            background: 'rgba(0, 100, 255, 0.2)',
                            border: '2px solid rgba(0, 100, 255, 0.5)',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            marginBottom: '30px',
                            fontSize: '1rem',
                            textAlign: 'center'
                        }}
                    >
                        <FaArrowLeft /> Back
                    </button>
                    <motion.h1
                        style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            marginBottom: '20px',
                            textShadow: '0 0 30px rgba(0, 100, 255, 0.8)'
                        }}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {service.name}
                    </motion.h1>
                    <motion.p
                        style={{
                            fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)',
                            color: 'rgba(255, 255, 255, 0.9)',
                            maxWidth: '700px'
                        }}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {service.tagline}
                    </motion.p>
                </div>
            </motion.section>

            {/* Description Section */}
            <section style={{ padding: '80px 0', background: '#000' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                            color: '#fff',
                            marginBottom: '25px',
                            textShadow: '0 0 20px rgba(0, 100, 255, 0.6)'
                        }}>
                            What We Offer
                        </h2>
                        <p style={{
                            fontSize: '1.15rem',
                            lineHeight: '1.8',
                            color: 'rgba(255, 255, 255, 0.85)',
                            maxWidth: '900px'
                        }}>
                            {service.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Features & Benefits Grid */}
            <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, #000 0%, #0a0e27 100%)' }}>
                <div className="container">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{
                                background: 'rgba(0, 80, 200, 0.1)',
                                padding: '40px',
                                borderRadius: '20px',
                                border: '2px solid rgba(0, 100, 255, 0.3)',
                                boxShadow: '0 10px 40px rgba(0, 100, 255, 0.2)'
                            }}
                        >
                            <h3 style={{
                                fontSize: '1.8rem',
                                color: '#fff',
                                marginBottom: '25px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FaCheckCircle style={{ color: service.color }} /> Key Features
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {service.features.map((feature, index) => (
                                    <li key={index} style={{
                                        padding: '12px 0',
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '1.05rem',
                                        borderBottom: '1px solid rgba(0, 100, 255, 0.2)',
                                        display: 'flex',
                                        alignItems: 'start',
                                        gap: '10px'
                                    }}>
                                        <span style={{ color: service.color, marginTop: '3px' }}>✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            style={{
                                background: 'rgba(0, 80, 200, 0.1)',
                                padding: '40px',
                                borderRadius: '20px',
                                border: '2px solid rgba(0, 100, 255, 0.3)',
                                boxShadow: '0 10px 40px rgba(0, 100, 255, 0.2)'
                            }}
                        >
                            <h3 style={{
                                fontSize: '1.8rem',
                                color: '#fff',
                                marginBottom: '25px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FaRocket style={{ color: service.color }} /> Benefits
                            </h3>
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {service.benefits.map((benefit, index) => (
                                    <li key={index} style={{
                                        padding: '12px 0',
                                        color: 'rgba(255, 255, 255, 0.9)',
                                        fontSize: '1.05rem',
                                        borderBottom: '1px solid rgba(0, 100, 255, 0.2)',
                                        display: 'flex',
                                        alignItems: 'start',
                                        gap: '10px'
                                    }}>
                                        <span style={{ color: service.color, marginTop: '3px' }}>✓</span>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>

                            {/* Additional Info Cards */}
                            <div style={{ marginTop: '30px', display: 'grid', gap: '15px' }}>
                                <div style={{
                                    background: 'rgba(0, 100, 255, 0.15)',
                                    padding: '15px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(0, 150, 255, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <FaClock style={{ fontSize: '1.5rem', color: service.color }} />
                                    <span style={{ color: '#fff', fontSize: '1rem' }}>Flexible timelines</span>
                                </div>
                                <div style={{
                                    background: 'rgba(0, 100, 255, 0.15)',
                                    padding: '15px 20px',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(0, 150, 255, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <FaDollarSign style={{ fontSize: '1.5rem', color: service.color }} />
                                    <span style={{ color: '#fff', fontSize: '1rem' }}>Competitive pricing</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Process Timeline */}
            <section style={{ padding: '80px 0', background: '#000' }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        style={{ textAlign: 'center', marginBottom: '60px' }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                            color: '#fff',
                            marginBottom: '15px',
                            textShadow: '0 0 20px rgba(0, 100, 255, 0.6)'
                        }}>
                            Our Process
                        </h2>
                        <p style={{
                            fontSize: '1.15rem',
                            color: 'rgba(255, 255, 255, 0.8)',
                            maxWidth: '700px',
                            margin: '0 auto'
                        }}>
                            A proven workflow to deliver exceptional results
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '30px',
                        maxWidth: '1200px',
                        margin: '0 auto'
                    }}>
                        {service.process.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                style={{
                                    background: 'rgba(0, 80, 200, 0.1)',
                                    padding: '30px',
                                    borderRadius: '15px',
                                    border: '2px solid rgba(0, 100, 255, 0.3)',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    background: service.color,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    fontSize: '1.5rem',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    boxShadow: `0 0 20px ${service.color}`
                                }}>
                                    {index + 1}
                                </div>
                                <h4 style={{
                                    fontSize: '1.3rem',
                                    color: '#fff',
                                    marginBottom: '10px'
                                }}>
                                    {item.step}
                                </h4>
                                <p style={{
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6'
                                }}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '80px 0',
                background: 'linear-gradient(135deg, #000 0%, #0a0e27 100%)',
                textAlign: 'center'
            }}>
                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            color: '#fff',
                            marginBottom: '20px',
                            textShadow: '0 0 30px rgba(0, 100, 255, 0.6)'
                        }}>
                            Ready to Get Started?
                        </h2>
                        <p style={{
                            fontSize: '1.2rem',
                            color: 'rgba(255, 255, 255, 0.85)',
                            marginBottom: '40px',
                            maxWidth: '600px',
                            margin: '0 auto 40px'
                        }}>
                            Let's discuss your project and bring your vision to life
                        </p>
                        <button
                            onClick={() => navigate('/contact')}
                            className="btn btn-primary btn-large"
                            style={{ marginTop: '10px' }}
                        >
                            <FaPhoneAlt /> Contact Us Today
                        </button>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ServiceDetail;
