const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');
const Project = require('../models/Project');
const upload = require('../middleware/upload');

// All routes are protected
router.use(protect);

// @route   GET /api/employees/profile
// @desc    Get logged in employee profile
// @access  Private/Employee
router.get('/profile', async (req, res) => {
    try {
        const employee = await User.findById(req.user._id).select('-password');

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile',
            error: error.message
        });
    }
});

// @route   GET /api/employees/tasks
// @desc    Get all tasks for logged in employee
// @access  Private/Employee
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate({
                path: 'project',
                select: 'title client service files',
                populate: { path: 'service', select: 'name' }
            })
            .populate('assignedBy', 'name email')
            .sort({ deadline: 1 });

        // Transform files to exclude binary data (for both project and task files)
        const tasksWithFileMeta = tasks.map(task => {
            const taskObj = task.toObject();

            // Transform project files
            if (taskObj.project && taskObj.project.files && taskObj.project.files.length > 0) {
                taskObj.project.files = taskObj.project.files.map(file => ({
                    _id: file._id,
                    originalName: file.originalName,
                    fileMimeType: file.fileMimeType,
                    source: file.source,
                    uploadedAt: file.uploadedAt
                }));
            }

            // Transform task files (admin attachments)
            if (taskObj.files && taskObj.files.length > 0) {
                taskObj.files = taskObj.files.map(file => ({
                    _id: file._id,
                    originalName: file.originalName,
                    fileMimeType: file.fileMimeType,
                    source: file.source || 'admin',
                    uploadedAt: file.uploadedAt
                }));
            }

            return taskObj;
        });

        res.json({
            success: true,
            count: tasksWithFileMeta.length,
            data: tasksWithFileMeta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tasks',
            error: error.message
        });
    }
});

// @route   GET /api/employees/tasks/:id/files/:fileId/view
// @desc    View task file inline (for employees)
// @access  Private/Employee
router.get('/tasks/:id/files/:fileId/view', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

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

        const file = task.files.id(req.params.fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        if (!file.fileData) {
            return res.status(404).json({
                success: false,
                message: 'File data not available'
            });
        }

        res.set('Content-Type', file.fileMimeType || 'application/octet-stream');
        res.set('Content-Disposition', `inline; filename="${file.originalName}"`);
        res.send(file.fileData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to view file',
            error: error.message
        });
    }
});

// @route   GET /api/employees/tasks/:id/files/:fileId/download
// @desc    Download task file (for employees)
// @access  Private/Employee
router.get('/tasks/:id/files/:fileId/download', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

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

        const file = task.files.id(req.params.fileId);

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        if (!file.fileData) {
            return res.status(404).json({
                success: false,
                message: 'File data not available'
            });
        }

        res.set('Content-Type', file.fileMimeType || 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename="${file.originalName}"`);
        res.send(file.fileData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to download file',
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

        const populatedTask = await Task.findById(task._id)
            .populate('project', 'title client service')
            .populate('assignedBy', 'name email')
            .populate('assignedTo', 'name email designation')
            .populate('comments.user', 'name email');

        const io = req.app.get('io');
        if (io && populatedTask) {
            io.to('admins').emit('task:updated', { task: populatedTask });
            io.to(`user:${task.assignedTo.toString()}`).emit('task:updated', { task: populatedTask });
        }

        res.json({
            success: true,
            message: 'Task status updated successfully',
            data: populatedTask || task
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

        const populatedTask = await Task.findById(task._id)
            .populate('project', 'title client service')
            .populate('assignedBy', 'name email')
            .populate('assignedTo', 'name email designation')
            .populate('comments.user', 'name email');

        const io = req.app.get('io');
        if (io && populatedTask) {
            io.to('admins').emit('task:updated', { task: populatedTask });
            io.to(`user:${task.assignedTo.toString()}`).emit('task:updated', { task: populatedTask });
        }

        res.json({
            success: true,
            message: 'File uploaded successfully',
            data: populatedTask || task
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

// @route   GET /api/employees/projects
// @desc    Get all projects assigned to the logged in employee
// @access  Private/Employee
router.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find({ assignedTo: req.user._id })
            .select('title client service status startDate deadline files')
            .populate('service', 'name')
            .sort({ createdAt: -1 });

        // Transform files to exclude binary data (just send metadata)
        const projectsWithFileMeta = projects.map(project => {
            const projectObj = project.toObject();
            if (projectObj.files && projectObj.files.length > 0) {
                projectObj.files = projectObj.files.map(file => ({
                    _id: file._id,
                    originalName: file.originalName,
                    fileMimeType: file.fileMimeType,
                    source: file.source,
                    uploadedAt: file.uploadedAt
                }));
            }
            return projectObj;
        });

        res.json({
            success: true,
            count: projectsWithFileMeta.length,
            data: projectsWithFileMeta
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects',
            error: error.message
        });
    }
});

// @route   GET /api/employees/projects/:id
// @desc    Get single project with files for assigned employee
// @access  Private/Employee
router.get('/projects/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('service', 'name')
            .populate('assignedTo', 'name email');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        // Check if employee is assigned to this project
        const isAssigned = project.assignedTo.some(
            emp => emp._id.toString() === req.user._id.toString()
        );

        if (!isAssigned && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this project'
            });
        }

        // Transform files to exclude binary data
        const projectObj = project.toObject();
        if (projectObj.files && projectObj.files.length > 0) {
            projectObj.files = projectObj.files.map(file => ({
                _id: file._id,
                originalName: file.originalName,
                fileMimeType: file.fileMimeType,
                source: file.source,
                uploadedAt: file.uploadedAt
            }));
        }

        res.json({
            success: true,
            data: projectObj
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project',
            error: error.message
        });
    }
});

module.exports = router;
