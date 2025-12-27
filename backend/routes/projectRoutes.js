const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Project = require('../models/Project');
const upload = require('../middleware/upload');

// All routes are protected
router.use(protect);

// @route   GET /api/projects
// @desc    Get all projects (admin sees all, employee sees assigned)
// @access  Private
router.get('/', async (req, res) => {
    try {
        let query = {};

        // If employee, only show assigned projects
        if (req.user.role === 'employee') {
            query = { assignedTo: req.user._id };
        }

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by service
        if (req.query.service) {
            query.service = req.query.service;
        }

        const projects = await Project.find(query)
            .populate('assignedTo', 'name email designation')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
});

// @route   GET /api/projects/:id
// @desc    Get single project
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('assignedTo', 'name email designation department')
            .populate('createdBy', 'name email')
            .populate('files.uploadedBy', 'name email');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if employee has access to this project
        if (req.user.role === 'employee') {
            const isAssigned = project.assignedTo.some(
                emp => emp._id.toString() === req.user._id.toString()
            );

            if (!isAssigned) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to access this project'
                });
            }
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project',
            error: error.message
        });
    }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private/Admin
router.post('/', authorize('admin'), async (req, res) => {
    try {
        const project = await Project.create({
            ...req.body,
            createdBy: req.user._id
        });

        const populatedProject = await Project.findById(project._id)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: populatedProject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create project',
            error: error.message
        });
    }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private/Admin
router.put('/:id', authorize('admin'), async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            message: 'Project updated successfully',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update project',
            error: error.message
        });
    }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private/Admin
router.delete('/:id', authorize('admin'), async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete project',
            error: error.message
        });
    }
});

// @route   POST /api/projects/:id/upload
// @desc    Upload file for a project
// @access  Private
router.post('/:id/upload', upload.single('projectFile'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        project.files.push({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            uploadedBy: req.user._id
        });

        await project.save();

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to upload file',
            error: error.message
        });
    }
});

module.exports = router;
