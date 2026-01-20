const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Task = require('../models/Task');
const Contact = require('../models/Contact');
const upload = require('../middleware/upload');
const fs = require('fs');

// All routes are protected
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks (admin sees all, employee sees assigned)
// @access  Private
router.get('/', async (req, res) => {
    try {
        let query = {};

        // If employee, only show assigned tasks
        if (req.user.role === 'employee') {
            query = { assignedTo: req.user._id };
        }

        // Filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // Filter by project
        if (req.query.project) {
            query.project = req.query.project;
        }

        const tasks = await Task.find(query)
            .populate('assignedTo', 'name email designation')
            .populate('assignedBy', 'name email')
            .populate('project', 'title service')
            .sort({ deadline: 1 });

        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tasks',
            error: error.message
        });
    }
});

// @route   GET /api/tasks/:id
// @desc    Get single task
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email designation')
            .populate('assignedBy', 'name email')
            .populate('project', 'title service client')
            .populate('comments.user', 'name email');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if employee has access to this task
        if (req.user.role === 'employee' && task.assignedTo._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this task'
            });
        }

        res.json({
            success: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch task',
            error: error.message
        });
    }
});

// @route   POST /api/tasks
// @desc    Create new task
// @access  Private/Admin
router.post('/', authorize('admin'), async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            assignedBy: req.user._id
        });

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email')
            .populate('assignedBy', 'name email')
            .populate('project', 'title service');

        const io = req.app.get('io');
        if (io && populatedTask) {
            io.to('admins').emit('task:created', { task: populatedTask });
            if (task.assignedTo) {
                io.to(`user:${task.assignedTo.toString()}`).emit('task:created', { task: populatedTask });
            }
        }

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: populatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create task',
            error: error.message
        });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private/Admin
router.put('/:id', authorize('admin'), async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('assignedTo', 'name email')
            .populate('assignedBy', 'name email')
            .populate('project', 'title service');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const io = req.app.get('io');
        if (io) {
            io.to('admins').emit('task:updated', { task });
            if (task.assignedTo?._id) {
                io.to(`user:${task.assignedTo._id.toString()}`).emit('task:updated', { task });
            }
        }

        res.json({
            success: true,
            message: 'Task updated successfully',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update task',
            error: error.message
        });
    }
});

// @route   PUT /api/tasks/:id/status
// @desc    Update task status (for employees)
// @access  Private/Employee
router.put('/:id/status', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if the user is assigned to this task or is an admin
        if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task'
            });
        }

        task.status = req.body.status;
        await task.save();

        const populatedTask = await Task.findById(task._id)
            .populate('assignedTo', 'name email')
            .populate('assignedBy', 'name email')
            .populate('project', 'title service');

        const io = req.app.get('io');
        if (io && populatedTask) {
            io.to('admins').emit('task:updated', { task: populatedTask });
            io.to(`user:${task.assignedTo.toString()}`).emit('task:updated', { task: populatedTask });
        }

        res.json({
            success: true,
            message: 'Task status updated successfully',
            data: populatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update task status',
            error: error.message
        });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private/Admin
router.delete('/:id', authorize('admin'), async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        const io = req.app.get('io');
        if (io) {
            io.to('admins').emit('task:deleted', { taskId: task._id.toString() });
            if (task.assignedTo) {
                io.to(`user:${task.assignedTo.toString()}`).emit('task:deleted', { taskId: task._id.toString() });
            }
        }

        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete task',
            error: error.message
        });
    }
});

// @route   POST /api/tasks/:id/upload
// @desc    Upload file to task (admin)
// @access  Private/Admin
router.post('/:id/upload', authorize('admin'), upload.single('taskFile'), async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        // Read file data and store in MongoDB
        const fileData = fs.readFileSync(req.file.path);

        task.files.push({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            fileData: fileData,
            fileMimeType: req.file.mimetype,
            source: 'admin',
            uploadedBy: req.user._id
        });

        await task.save();

        // Delete the file from disk after storing in MongoDB
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to upload file',
            error: error.message
        });
    }
});

// @route   POST /api/tasks/:id/attach-contact-document
// @desc    Attach a contact document to a task
// @access  Private/Admin
router.post('/:id/attach-contact-document', authorize('admin'), async (req, res) => {
    try {
        const { contactId } = req.body;

        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
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
        const alreadyAttached = task.files.some(
            file => file.contactId && file.contactId.toString() === contactId
        );

        if (alreadyAttached) {
            return res.status(400).json({
                success: false,
                message: 'Document already attached to this task'
            });
        }

        // Add the contact document to task files
        task.files.push({
            originalName: contact.originalFileName,
            fileData: contact.fileData,
            fileMimeType: contact.fileMimeType,
            source: 'contact',
            contactId: contact._id,
            uploadedBy: req.user._id
        });

        await task.save();

        res.json({
            success: true,
            message: 'Contact document attached successfully',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to attach document',
            error: error.message
        });
    }
});

// @route   GET /api/tasks/:id/files/:fileId/view
// @desc    View task file
// @access  Private (both admin and assigned employee)
router.get('/:id/files/:fileId/view', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if employee has access to this task
        if (req.user.role === 'employee') {
            if (task.assignedTo.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to access this file'
                });
            }
        }

        const file = task.files.id(req.params.fileId);
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

// @route   GET /api/tasks/:id/files/:fileId/download
// @desc    Download task file
// @access  Private (both admin and assigned employee)
router.get('/:id/files/:fileId/download', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if employee has access to this task
        if (req.user.role === 'employee') {
            if (task.assignedTo.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to download this file'
                });
            }
        }

        const file = task.files.id(req.params.fileId);
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
