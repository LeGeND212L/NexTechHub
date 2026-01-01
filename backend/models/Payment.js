const mongoose = require('mongoose');

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

const paymentSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide payment amount'],
        min: [0, 'Amount cannot be negative']
    },
    month: {
        type: String,
        required: true,
        enum: MONTHS
    },
    year: {
        type: Number,
        required: true,
        min: [2000, 'Year is invalid'],
        max: [2100, 'Year is invalid']
    },
    paymentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'bank-transfer', 'cheque', 'online'],
        default: 'bank-transfer'
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'paid'
    },
    transactionId: {
        type: String,
        trim: true
    },
    bonus: {
        type: Number,
        default: 0,
        min: [0, 'Bonus cannot be negative']
    },
    deductions: {
        type: Number,
        default: 0,
        min: [0, 'Deductions cannot be negative']
    },
    netSalary: {
        type: Number,
        required: true,
        min: [0, 'Net salary cannot be negative']
    },
    notes: {
        type: String
    },
    payslipGenerated: {
        type: Boolean,
        default: false
    },
    payslipPath: {
        type: String
    },
    processedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Calculate net salary before validation so `required` passes on create()
paymentSchema.pre('validate', function (next) {
    const amount = Number(this.amount) || 0;
    const bonus = Number(this.bonus) || 0;
    const deductions = Number(this.deductions) || 0;

    if (deductions > amount + bonus) {
        this.invalidate('deductions', 'Deductions cannot be greater than amount + bonus');
    }

    this.netSalary = amount + bonus - deductions;
    next();
});

// Prevent duplicate salary records for the same employee/month/year
paymentSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Payment', paymentSchema);
