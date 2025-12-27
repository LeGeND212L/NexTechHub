const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Review = require('../models/Review');

// @route   GET /api/reviews
// @desc    Get all approved reviews (public) or all reviews (admin)
// @access  Public / Private
router.get('/', async (req, res) => {
    try {
        let query = {};

        // Check if user is authenticated and is admin
        const isAdmin = req.headers.authorization && req.user && req.user.role === 'admin';

        // Only show approved reviews to public
        if (!isAdmin) {
            query.isApproved = true;
        }

        // Filter by service
        if (req.query.service) {
            query.service = req.query.service;
        }

        // Filter by featured
        if (req.query.featured === 'true') {
            query.featured = true;
        }

        const reviews = await Review.find(query)
            .populate('project', 'title')
            .populate('approvedBy', 'name')
            .sort({ displayOrder: 1, createdAt: -1 });

        res.json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
});

// @route   GET /api/reviews/:id
// @desc    Get single review
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('project', 'title service')
            .populate('approvedBy', 'name email');

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch review',
            error: error.message
        });
    }
});

// @route   POST /api/reviews
// @desc    Create new review
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const review = await Review.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create review',
            error: error.message
        });
    }
});

// @route   PUT /api/reviews/:id
// @desc    Update review
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            message: 'Review updated successfully',
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update review',
            error: error.message
        });
    }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message
        });
    }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve/reject a review
// @access  Private/Admin
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
    try {
        const { isApproved } = req.body;

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.isApproved = isApproved;
        if (isApproved) {
            review.approvedBy = req.user._id;
            review.approvedAt = new Date();
        }

        await review.save();

        res.json({
            success: true,
            message: `Review ${isApproved ? 'approved' : 'rejected'} successfully`,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update review status',
            error: error.message
        });
    }
});

// @route   PUT /api/reviews/:id/feature
// @desc    Toggle featured status
// @access  Private/Admin
router.put('/:id/feature', protect, authorize('admin'), async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.featured = !review.featured;
        await review.save();

        res.json({
            success: true,
            message: `Review ${review.featured ? 'featured' : 'unfeatured'} successfully`,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to toggle featured status',
            error: error.message
        });
    }
});

// @route   GET /api/reviews/stats/ratings
// @desc    Get rating statistics
// @access  Public
router.get('/stats/ratings', async (req, res) => {
    try {
        const stats = await Review.aggregate([
            { $match: { isApproved: true } },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 },
                    fiveStars: {
                        $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] }
                    },
                    fourStars: {
                        $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] }
                    },
                    threeStars: {
                        $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] }
                    },
                    twoStars: {
                        $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] }
                    },
                    oneStar: {
                        $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats.length > 0 ? stats[0] : {
                averageRating: 0,
                totalReviews: 0,
                fiveStars: 0,
                fourStars: 0,
                threeStars: 0,
                twoStars: 0,
                oneStar: 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch rating statistics',
            error: error.message
        });
    }
});

module.exports = router;
