const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/contacts
// @desc    Submit a contact form (public)
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, countryCode, subject, message } = req.body;

        // Input validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: '⚠️ Please provide all required fields (name, email, subject, message)'
            });
        }

        // Name validation
        if (name.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: '⚠️ Name must be at least 2 characters long'
            });
        }
        if (name.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: '⚠️ Name cannot exceed 100 characters'
            });
        }

        // Email validation - stronger regex
        const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: '⚠️ Please provide a valid email address (e.g., user@example.com)'
            });
        }

        // Phone validation (if provided)
        // Accept international phone formats
        if (phone && phone.trim().length > 0) {
            const phoneData = phone.trim();
            const phoneDigits = phoneData.replace(/\D/g, '');

            // Check if phone starts with +
            if (!phoneData.startsWith('+')) {
                return res.status(400).json({
                    success: false,
                    message: '⚠️ Phone must start with + and country code'
                });
            }

            // Check minimum length (country code + digits)
            if (phoneDigits.length < 7) {
                return res.status(400).json({
                    success: false,
                    message: '⚠️ Phone number is too short'
                });
            }

            // Check maximum length
            if (phoneDigits.length > 15) {
                return res.status(400).json({
                    success: false,
                    message: '⚠️ Phone number is too long'
                });
            }

            // Validate country code if provided
            const validCountryCodes = ['+1', '+44', '+61', '+49', '+33', '+91', '+81', '+86', '+971', '+966', '+92'];
            if (countryCode && !validCountryCodes.includes(countryCode)) {
                return res.status(400).json({
                    success: false,
                    message: '⚠️ Invalid country code'
                });
            }
        }

        // Subject validation
        if (subject.trim().length < 3) {
            return res.status(400).json({
                success: false,
                message: '⚠️ Subject must be at least 3 characters long'
            });
        }
        if (subject.trim().length > 200) {
            return res.status(400).json({
                success: false,
                message: '⚠️ Subject cannot exceed 200 characters'
            });
        }

        // Message validation
        if (message.trim().length < 10) {
            return res.status(400).json({
                success: false,
                message: '⚠️ Message must be at least 10 characters long'
            });
        }
        if (message.trim().length > 2000) {
            return res.status(400).json({
                success: false,
                message: '⚠️ Message cannot exceed 2000 characters'
            });
        }

        // Check for spam - duplicate messages within 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const recentDuplicate = await Contact.findOne({
            email: email.toLowerCase(),
            subject: subject.trim(),
            createdAt: { $gte: fiveMinutesAgo }
        });

        if (recentDuplicate) {
            return res.status(429).json({
                success: false,
                message: '⚠️ You have already submitted a similar message recently. Please wait a few minutes before submitting again.'
            });
        }

        // Create contact message
        const contact = await Contact.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            phone: phone ? phone.trim() : null,
            countryCode: countryCode || '+92',
            subject: subject.trim(),
            message: message.trim()
        });

        res.status(201).json({
            success: true,
            message: '✅ Thank you for contacting us! We will get back to you within 24 hours.',
            data: {
                id: contact._id,
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                countryCode: contact.countryCode,
                createdAt: contact.createdAt
            }
        });

    } catch (error) {
        console.error('Contact submission error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: errors[0]
            });
        }

        res.status(500).json({
            success: false,
            message: '❌ An error occurred while submitting your message. Please try again later.'
        });
    }
});

// @route   GET /api/contacts
// @desc    Get all contact messages
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { status, search, page = 1, limit = 20 } = req.query;

        // Build query
        let query = {};

        // Filter by status
        if (status && ['unread', 'read', 'replied'].includes(status)) {
            query.status = status;
        }

        // Search functionality
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { subject: searchRegex },
                { message: searchRegex }
            ];
        }

        // Get total count for pagination
        const total = await Contact.countDocuments(query);

        // Get paginated contacts
        const contacts = await Contact.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-__v');

        // Get status counts
        const statusCounts = await Contact.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const counts = {
            unread: 0,
            read: 0,
            replied: 0,
            total: total
        };

        statusCounts.forEach(item => {
            counts[item._id] = item.count;
        });

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                current: parseInt(page),
                total: Math.ceil(total / limit),
                count: contacts.length,
                totalRecords: total
            },
            counts
        });

    } catch (error) {
        console.error('Get contacts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact messages'
        });
    }
});

// @route   GET /api/contacts/:id
// @desc    Get single contact message
// @access  Private (Admin only)
router.get('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });

    } catch (error) {
        console.error('Get contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching contact message'
        });
    }
});

// @route   PUT /api/contacts/:id
// @desc    Update contact message status
// @access  Private (Admin only)
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const { status, notes } = req.body;

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        // Update fields
        if (status && ['unread', 'read', 'replied'].includes(status)) {
            contact.status = status;
        }

        if (notes !== undefined) {
            contact.notes = notes.trim();
        }

        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Contact message updated successfully',
            data: contact
        });

    } catch (error) {
        console.error('Update contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating contact message'
        });
    }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete contact message
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Contact message deleted successfully'
        });

    } catch (error) {
        console.error('Delete contact error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting contact message'
        });
    }
});

module.exports = router;
