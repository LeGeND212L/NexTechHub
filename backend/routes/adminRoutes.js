const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Payment = require('../models/Payment');

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/dashboard', async (req, res) => {
    try {
        const totalEmployees = await User.countDocuments({ role: 'employee' });
        const activeEmployees = await User.countDocuments({ role: 'employee', isActive: true });
        const totalProjects = await Project.countDocuments();
        const activeProjects = await Project.countDocuments({ status: 'in-progress' });
        const completedProjects = await Project.countDocuments({ status: 'completed' });
        const pendingTasks = await Task.countDocuments({ status: 'pending' });
        const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
        const completedTasks = await Task.countDocuments({ status: 'completed' });

        // Calculate total salary paid this month
        const currentMonth = new Date().toLocaleString('default', { month: 'long' });
        const currentYear = new Date().getFullYear();
        const monthlyPayments = await Payment.aggregate([
            {
                $match: {
                    month: currentMonth,
                    year: currentYear,
                    status: 'paid'
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$netSalary' }
                }
            }
        ]);

        const totalSalaryPaid = monthlyPayments.length > 0 ? monthlyPayments[0].total : 0;

        // Get recent projects
        const recentProjects = await Project.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name');

        // Get recent tasks
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('assignedTo', 'name email')
            .populate('project', 'title');

        res.json({
            success: true,
            data: {
                statistics: {
                    employees: {
                        total: totalEmployees,
                        active: activeEmployees
                    },
                    projects: {
                        total: totalProjects,
                        active: activeProjects,
                        completed: completedProjects
                    },
                    tasks: {
                        pending: pendingTasks,
                        inProgress: inProgressTasks,
                        completed: completedTasks
                    },
                    payments: {
                        monthlyTotal: totalSalaryPaid
                    }
                },
                recentProjects,
                recentTasks
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

// @route   GET /api/admin/employees
// @desc    Get all employees
// @access  Private/Admin
router.get('/employees', async (req, res) => {
    try {
        const employees = await User.find({ role: 'employee' }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: employees.length,
            data: employees
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch employees',
            error: error.message
        });
    }
});

// @route   POST /api/admin/employees
// @desc    Create new employee
// @access  Private/Admin
router.post('/employees', async (req, res) => {
    try {
        const employee = await User.create({
            ...req.body,
            role: 'employee'
        });

        res.status(201).json({
            success: true,
            message: 'Employee created successfully',
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create employee',
            error: error.message
        });
    }
});

// @route   PUT /api/admin/employees/:id
// @desc    Update employee
// @access  Private/Admin
router.put('/employees/:id', async (req, res) => {
    try {
        const employee = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            message: 'Employee updated successfully',
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update employee',
            error: error.message
        });
    }
});

// @route   DELETE /api/admin/employees/:id
// @desc    Delete employee
// @access  Private/Admin
router.delete('/employees/:id', async (req, res) => {
    try {
        const employee = await User.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        res.json({
            success: true,
            message: 'Employee deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete employee',
            error: error.message
        });
    }
});

// @route   PUT /api/admin/employees/:id/toggle-status
// @desc    Toggle employee active status
// @access  Private/Admin
router.put('/employees/:id/toggle-status', async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        employee.isActive = !employee.isActive;
        await employee.save();

        res.json({
            success: true,
            message: `Employee ${employee.isActive ? 'activated' : 'deactivated'} successfully`,
            data: employee
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to toggle employee status',
            error: error.message
        });
    }
});

module.exports = router;
