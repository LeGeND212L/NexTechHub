const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Task = require('../models/Task');
const upload = require('../middleware/upload');

// All routes are protected
router.use(protect);

// @route   GET /api/employees/tasks
// @desc    Get all tasks for logged in employee
// @access  Private/Employee
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate('project', 'title client service')
            .populate('assignedBy', 'name email')
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

// @route   GET /api/employees/tasks/:id
// @desc    Get single task details
// @access  Private/Employee
router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('project', 'title client service')
            .populate('assignedBy', 'name email')
            .populate('comments.user', 'name email');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if task belongs to logged in employee
        if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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

// @route   PUT /api/employees/tasks/:id/status
// @desc    Update task status
// @access  Private/Employee
router.put('/tasks/:id/status', async (req, res) => {
    try {
        const { status, progressPercentage } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if task belongs to logged in employee
        if (task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task'
            });
        }

        task.status = status || task.status;
        task.progressPercentage = progressPercentage !== undefined ? progressPercentage : task.progressPercentage;

        if (status === 'completed') {
            task.completedDate = new Date();
        }

        await task.save();

        res.json({
            success: true,
            message: 'Task status updated successfully',
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update task status',
            error: error.message
        });
    }
});

// @route   POST /api/employees/tasks/:id/upload
// @desc    Upload file for a task
// @access  Private/Employee
router.post('/tasks/:id/upload', upload.single('taskFile'), async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Check if task belongs to logged in employee
        if (task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to upload files for this task'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        task.files.push({
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path
        });

        await task.save();

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

// @route   POST /api/employees/tasks/:id/comment
// @desc    Add comment to a task
// @access  Private/Employee
router.post('/tasks/:id/comment', async (req, res) => {
    try {
        const { text } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        task.comments.push({
            user: req.user._id,
            text
        });

        await task.save();

        const updatedTask = await Task.findById(req.params.id).populate('comments.user', 'name email');

        res.json({
            success: true,
            message: 'Comment added successfully',
            data: updatedTask
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to add comment',
            error: error.message
        });
    }
});

// @route   GET /api/employees/dashboard
// @desc    Get employee dashboard statistics
// @access  Private/Employee
router.get('/dashboard', async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({ assignedTo: req.user._id });
        const pendingTasks = await Task.countDocuments({ assignedTo: req.user._id, status: 'pending' });
        const inProgressTasks = await Task.countDocuments({ assignedTo: req.user._id, status: 'in-progress' });
        const completedTasks = await Task.countDocuments({ assignedTo: req.user._id, status: 'completed' });

        // Get upcoming deadlines
        const upcomingTasks = await Task.find({
            assignedTo: req.user._id,
            status: { $in: ['pending', 'in-progress'] },
            deadline: { $gte: new Date() }
        })
            .sort({ deadline: 1 })
            .limit(5)
            .populate('project', 'title');

        // Get overdue tasks
        const overdueTasks = await Task.find({
            assignedTo: req.user._id,
            status: { $in: ['pending', 'in-progress'] },
            deadline: { $lt: new Date() }
        })
            .sort({ deadline: 1 })
            .populate('project', 'title');

        res.json({
            success: true,
            data: {
                statistics: {
                    total: totalTasks,
                    pending: pendingTasks,
                    inProgress: inProgressTasks,
                    completed: completedTasks,
                    overdue: overdueTasks.length
                },
                upcomingTasks,
                overdueTasks
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data',
            error: error.message
        });
    }
});

module.exports = router;
