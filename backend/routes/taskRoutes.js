const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Task = require('../models/Task');

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

module.exports = router;
