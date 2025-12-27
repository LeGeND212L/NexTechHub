const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: [true, 'Please provide payment amount']
    },
    month: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
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
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netSalary: {
        type: Number,
        required: true
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

// Calculate net salary before saving
paymentSchema.pre('save', function (next) {
    this.netSalary = this.amount + this.bonus - this.deductions;
    next();
});

module.exports = mongoose.model('Payment', paymentSchema);
