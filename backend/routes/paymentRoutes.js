const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Payment = require('../models/Payment');
const User = require('../models/User');
const generatePayslip = require('../utils/generatePayslip');

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

const normalizeMonth = (value) => {
    if (!value) return value;
    const asString = String(value).trim();
    const match = MONTHS.find((m) => m.toLowerCase() === asString.toLowerCase());
    return match || asString;
};

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
        console.log('=== Payment Creation Request ===');
        console.log('Request body:', JSON.stringify(req.body, null, 2));

        const { employee, amount, month, year, bonus, deductions, paymentMethod, transactionId, notes } = req.body;
        const normalizedMonth = normalizeMonth(month);
        const normalizedYear = Number(year);

        // Validation
        if (!employee) {
            console.error('Validation failed: employee is required');
            return res.status(400).json({
                success: false,
                message: 'Employee is required'
            });
        }

        if (!normalizedMonth || !year) {
            console.error('Validation failed: month and year are required');
            return res.status(400).json({
                success: false,
                message: 'Month and year are required'
            });
        }

        if (!MONTHS.includes(normalizedMonth)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid month'
            });
        }

        if (!Number.isInteger(normalizedYear) || normalizedYear < 2000 || normalizedYear > 2100) {
            return res.status(400).json({
                success: false,
                message: 'Invalid year'
            });
        }

        // Verify employee exists
        console.log('Looking up employee:', employee);
        const employeeData = await User.findById(employee);
        if (!employeeData) {
            console.error('Employee not found:', employee);
            return res.status(404).json({
                success: false,
                message: 'Employee not found'
            });
        }
        console.log('Employee found:', employeeData.name);

        // Check if payment already exists for this employee, month, and year
        const existingPayment = await Payment.findOne({ employee, month: normalizedMonth, year: normalizedYear });
        if (existingPayment) {
            console.error('Duplicate payment found for:', { employee, month, year });
            return res.status(400).json({
                success: false,
                message: 'This month is locked for this employee (salary already recorded)'
            });
        }

        const resolvedAmount = amount !== undefined && amount !== null && String(amount).trim() !== ''
            ? Number(amount)
            : Number(employeeData.salary);

        if (!Number.isFinite(resolvedAmount) || resolvedAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a valid positive number'
            });
        }

        const paymentData = {
            employee,
            amount: resolvedAmount,
            month: normalizedMonth,
            year: normalizedYear,
            bonus: Number(bonus) || 0,
            deductions: Number(deductions) || 0,
            paymentMethod: paymentMethod || 'bank-transfer',
            transactionId,
            notes,
            processedBy: req.user._id,
            status: 'paid'
        };

        console.log('Creating payment with data:', JSON.stringify(paymentData, null, 2));

        const payment = await Payment.create(paymentData);
        console.log('Payment created successfully:', payment._id);

        // Populate the payment with employee data
        const populatedPayment = await Payment.findById(payment._id)
            .populate('employee', 'name email designation salary')
            .populate('processedBy', 'name email');

        // Generate payslip asynchronously (don't block payment creation)
        setImmediate(async () => {
            try {
                const payslipPath = await generatePayslip({
                    ...payment.toObject(),
                    employee: employeeData.toObject()
                });

                payment.payslipGenerated = true;
                payment.payslipPath = payslipPath;
                await payment.save();
                console.log('Payslip generated successfully:', payslipPath);
            } catch (error) {
                console.error('Payslip generation failed (non-blocking):', error.message);
            }
        });

        res.status(201).json({
            success: true,
            message: 'Payment recorded successfully',
            data: populatedPayment
        });
    } catch (error) {
        if (error && (error.code === 11000 || error.name === 'MongoServerError')) {
            return res.status(400).json({
                success: false,
                message: 'This month is locked for this employee (salary already recorded)'
            });
        }
        console.error('=== Payment creation error ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error details:', error);
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
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        // Locked month: once paid, don't allow changing the identity of the salary record
        if (payment.status === 'paid') {
            const forbiddenKeys = ['employee', 'month', 'year'];
            const attempted = forbiddenKeys.find((k) => req.body[k] !== undefined);
            if (attempted) {
                return res.status(400).json({
                    success: false,
                    message: 'This salary month is locked and cannot be changed'
                });
            }
        }

        const updates = { ...req.body };
        if (updates.month !== undefined) updates.month = normalizeMonth(updates.month);
        if (updates.year !== undefined) updates.year = Number(updates.year);

        // If any of the unique keys change, prevent duplicates
        const nextEmployee = updates.employee !== undefined ? updates.employee : payment.employee;
        const nextMonth = updates.month !== undefined ? updates.month : payment.month;
        const nextYear = updates.year !== undefined ? updates.year : payment.year;

        if (updates.month !== undefined && !MONTHS.includes(nextMonth)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid month'
            });
        }
        if (updates.year !== undefined && (!Number.isInteger(nextYear) || nextYear < 2000 || nextYear > 2100)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid year'
            });
        }

        const duplicate = await Payment.findOne({
            _id: { $ne: payment._id },
            employee: nextEmployee,
            month: nextMonth,
            year: nextYear
        });
        if (duplicate) {
            return res.status(400).json({
                success: false,
                message: 'This month is locked for this employee (salary already recorded)'
            });
        }

        Object.assign(payment, updates);
        await payment.save();

        const populated = await Payment.findById(payment._id)
            .populate('employee', 'name email designation')
            .populate('processedBy', 'name email');

        res.json({
            success: true,
            message: 'Payment updated successfully',
            data: populated
        });
    } catch (error) {
        if (error && (error.code === 11000 || error.name === 'MongoServerError')) {
            return res.status(400).json({
                success: false,
                message: 'This month is locked for this employee (salary already recorded)'
            });
        }
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
        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        if (payment.status === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Paid salary records are locked and cannot be deleted'
            });
        }

        await payment.deleteOne();

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
