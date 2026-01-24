const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Service = require('../models/Service');

// Optional auth middleware - populates req.user if token provided, but doesn't require it
const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            const jwt = require('jsonwebtoken');
            const User = require('../models/User');
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id).select('-password');
            } catch (err) {
                // Token invalid, continue without user
                req.user = null;
            }
        } else {
            req.user = null;
        }
        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

// @route   GET /api/services
// @desc    Get all services (active only for public)
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
    try {
        let query = {};

        // Check if user is authenticated and is admin
        const isAdmin = req.user && req.user.role === 'admin';

        // Only show active services to public
        if (!isAdmin) {
            query.isActive = true;
        }

        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }

        // Filter by featured
        if (req.query.featured === 'true') {
            query.isFeatured = true;
        }

        const services = await Service.find(query).sort({ displayOrder: 1, createdAt: -1 });

        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch services',
            error: error.message
        });
    }
});

// @route   GET /api/services/:slug
// @desc    Get single service by slug
// @access  Public
router.get('/:slug', async (req, res) => {
    try {
        const service = await Service.findOne({ slug: req.params.slug });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch service',
            error: error.message
        });
    }
});

// @route   POST /api/services
// @desc    Create new service
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const service = await Service.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create service',
            error: error.message
        });
    }
});

// @route   PUT /api/services/:id
// @desc    Update service
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.json({
            success: true,
            message: 'Service updated successfully',
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update service',
            error: error.message
        });
    }
});

// @route   DELETE /api/services/:id
// @desc    Delete service
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete service',
            error: error.message
        });
    }
});

// @route   PUT /api/services/:id/toggle-status
// @desc    Toggle service active status
// @access  Private/Admin
router.put('/:id/toggle-status', protect, authorize('admin'), async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        service.isActive = !service.isActive;
        await service.save();

        res.json({
            success: true,
            message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to toggle service status',
            error: error.message
        });
    }
});

// @route   PUT /api/services/:id/toggle-featured
// @desc    Toggle service featured status
// @access  Private/Admin
router.put('/:id/toggle-featured', protect, authorize('admin'), async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        service.isFeatured = !service.isFeatured;
        await service.save();

        res.json({
            success: true,
            message: `Service ${service.isFeatured ? 'featured' : 'unfeatured'} successfully`,
            data: service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to toggle featured status',
            error: error.message
        });
    }
});

module.exports = router;
