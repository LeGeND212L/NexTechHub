const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Project = require('../models/Project');
const Contact = require('../models/Contact');
const upload = require('../middleware/upload');
const fs = require('fs');

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

// @route   GET /api/projects/contact-documents
// @desc    Get all documents from contact messages
// @access  Private/Admin
router.get('/contact-documents', authorize('admin'), async (req, res) => {
    try {
        const contacts = await Contact.find({
            fileData: { $exists: true, $ne: null }
        }).select('_id name email subject originalFileName fileMimeType createdAt');

        const documents = contacts.map(contact => ({
            _id: contact._id,
            name: contact.name,
            email: contact.email,
            subject: contact.subject,
            fileName: contact.originalFileName,
            mimeType: contact.fileMimeType,
            uploadedAt: contact.createdAt
        }));

        res.json({
            success: true,
            count: documents.length,
            data: documents
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contact documents',
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

        // Read file and store in MongoDB
        const filePath = req.file.path;
        const fileData = fs.readFileSync(filePath);

        project.files.push({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            fileData: fileData,
            fileMimeType: req.file.mimetype,
            source: 'local',
            uploadedBy: req.user._id
        });

        await project.save();

        // Delete file from disk after storing in MongoDB
        fs.unlinkSync(filePath);

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

// @route   POST /api/projects/:id/attach-contact-document
// @desc    Attach a contact document to a project
// @access  Private/Admin
router.post('/:id/attach-contact-document', authorize('admin'), async (req, res) => {
    try {
        const { contactId } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        const contact = await Contact.findById(contactId);
        if (!contact || !contact.fileData) {
            return res.status(404).json({
                success: false,
                message: 'Contact document not found'
            });
        }

        // Check if document is already attached
        const alreadyAttached = project.files.some(
            file => file.contactId && file.contactId.toString() === contactId
        );

        if (alreadyAttached) {
            return res.status(400).json({
                success: false,
                message: 'This document is already attached to the project'
            });
        }

        project.files.push({
            originalName: contact.originalFileName,
            fileData: contact.fileData,
            fileMimeType: contact.fileMimeType,
            source: 'contact',
            contactId: contact._id,
            uploadedBy: req.user._id
        });

        await project.save();

        res.json({
            success: true,
            message: 'Contact document attached successfully',
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to attach contact document',
            error: error.message
        });
    }
});

// @route   GET /api/projects/:id/files/:fileId/view
// @desc    View project file
// @access  Private (both admin and assigned employees)
router.get('/:id/files/:fileId/view', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if employee has access to this project
        if (req.user.role === 'employee') {
            const isAssigned = project.assignedTo.some(
                emp => emp.toString() === req.user._id.toString()
            );
            if (!isAssigned) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to access this file'
                });
            }
        }

        const file = project.files.id(req.params.fileId);
        if (!file || !file.fileData) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.setHeader('Content-Type', file.fileMimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `inline; filename="${file.originalName || 'file'}"`);
        res.send(file.fileData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to view file',
            error: error.message
        });
    }
});

// @route   GET /api/projects/:id/files/:fileId/download
// @desc    Download project file
// @access  Private (both admin and assigned employees)
router.get('/:id/files/:fileId/download', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if employee has access to this project
        if (req.user.role === 'employee') {
            const isAssigned = project.assignedTo.some(
                emp => emp.toString() === req.user._id.toString()
            );
            if (!isAssigned) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to download this file'
                });
            }
        }

        const file = project.files.id(req.params.fileId);
        if (!file || !file.fileData) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.setHeader('Content-Type', file.fileMimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${file.originalName || 'download'}"`);
        res.setHeader('Content-Length', file.fileData.length);
        res.send(file.fileData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to download file',
            error: error.message
        });
    }
});

module.exports = router;
