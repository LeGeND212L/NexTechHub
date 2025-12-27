const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');
const generatePayslip = require('../utils/generatePayslip');

// All routes are protected
router.use(protect);

// @route   GET /api/payments
// @desc    Get all payments (admin sees all, employee sees own)
// @access  Private
router.get('/', async (req, res) => {
    try {
        let query = {};

        // If employee, only show own payments
        if (req.user.role === 'employee') {
            query = { employee: req.user._id };
        }

        // Filter by employee ID (admin only)
        if (req.query.employee && req.user.role === 'admin') {
            query.employee = req.query.employee;
        }

        // Filter by month and year
        if (req.query.month) {
            query.month = req.query.month;
        }
        if (req.query.year) {
            query.year = req.query.year;
        }

        const payments = await Payment.find(query)
            .populate('employee', 'name email designation salary')
            .populate('processedBy', 'name email')
            .sort({ paymentDate: -1 });

        res.json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payments',
            error: error.message
        });
    }
});

// @route   GET /api/payments/:id
// @desc    Get single payment
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('employee', 'name email designation salary')
            .populate('processedBy', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check if employee has access to this payment
        if (req.user.role === 'employee' && payment.employee._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this payment'
            });
        }

        res.json({
            success: true,
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment',
            error: error.message
        });
    }
});

// @route   POST /api/payments
// @desc    Create new payment
// @access  Private/Admin
router.post('/', authorize('admin'), async (req, res) => {
    try {
        const { employee, amount, month, year, bonus, deductions, paymentMethod, transactionId, notes } = req.body;

        // Verify employee exists
        const employeeData = await User.findById(employee);
        if (!employeeData) {
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }

        // Check if payment already exists for this employee, month, and year
        const existingPayment = await Payment.findOne({ employee, month, year });
        if (existingPayment) {
            return res.status(400).json({
                success: false,
                message: 'Payment for this employee in this month already exists'
            });
        }

        const payment = await Payment.create({
            employee,
            amount: amount || employeeData.salary,
            month,
            year,
            bonus: bonus || 0,
            deductions: deductions || 0,
            paymentMethod,
            transactionId,
            notes,
            processedBy: req.user._id,
            status: 'paid'
        });

        // Generate payslip
        try {
            const payslipPath = await generatePayslip({
                ...payment.toObject(),
                employee: employeeData
            });

            payment.payslipGenerated = true;
            payment.payslipPath = payslipPath;
            await payment.save();
        } catch (error) {
            console.error('Payslip generation failed:', error);
        }

        const populatedPayment = await Payment.findById(payment._id)
            .populate('employee', 'name email designation')
            .populate('processedBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            data: populatedPayment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create payment',
            error: error.message
        });
    }
});

// @route   PUT /api/payments/:id
// @desc    Update payment
// @access  Private/Admin
router.put('/:id', authorize('admin'), async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('employee', 'name email designation')
            .populate('processedBy', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            message: 'Payment updated successfully',
            data: payment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update payment',
            error: error.message
        });
    }
});

// @route   DELETE /api/payments/:id
// @desc    Delete payment
// @access  Private/Admin
router.delete('/:id', authorize('admin'), async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        res.json({
            success: true,
            message: 'Payment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete payment',
            error: error.message
        });
    }
});

// @route   GET /api/payments/:id/payslip
// @desc    Download payslip
// @access  Private
router.get('/:id/payslip', async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('employee', 'name email designation department');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Check if employee has access to this payslip
        if (req.user.role === 'employee' && payment.employee._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this payslip'
            });
        }

        // Generate payslip if not already generated
        if (!payment.payslipGenerated || !payment.payslipPath) {
            const payslipPath = await generatePayslip({
                ...payment.toObject(),
                employee: payment.employee
            });

            payment.payslipGenerated = true;
            payment.payslipPath = payslipPath;
            await payment.save();
        }

        // Send file
        res.download(payment.payslipPath);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to download payslip',
            error: error.message
        });
    }
});

// @route   GET /api/payments/employee/:employeeId/history
// @desc    Get payment history for an employee
// @access  Private/Admin
router.get('/employee/:employeeId/history', authorize('admin'), async (req, res) => {
    try {
        const payments = await Payment.find({ employee: req.params.employeeId })
            .sort({ year: -1, month: -1 })
            .populate('processedBy', 'name email');

        res.json({
            success: true,
            count: payments.length,
            data: payments
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment history',
            error: error.message
        });
    }
});

module.exports = router;
