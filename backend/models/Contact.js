const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please provide a valid email address']
    },
    countryCode: {
        type: String,
        trim: true,
        default: '+92',
        enum: ['+1', '+44', '+61', '+49', '+33', '+91', '+81', '+86', '+971', '+966', '+92'],
        validate: {
            validator: function (v) {
                return ['+1', '+44', '+61', '+49', '+33', '+91', '+81', '+86', '+971', '+966', '+92'].includes(v);
            },
            message: 'Invalid country code'
        }
    },
    phone: {
        type: String,
        trim: true,
        default: null,
        validate: {
            validator: function (v) {
                if (!v) return true; // Allow null/empty
                // Accept any valid international phone format
                const cleaned = v.replace(/[\s\-()]/g, '');
                // Must start with + and contain only digits after that
                return /^\+[1-9]\d{6,14}$/.test(cleaned);
            },
            message: 'Invalid phone format. Must start with country code (e.g., +92300-1234567)'
        }
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true,
        minlength: [3, 'Subject must be at least 3 characters'],
        maxlength: [200, 'Subject cannot exceed 200 characters']
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
        minlength: [10, 'Message must be at least 10 characters'],
        maxlength: [2000, 'Message cannot exceed 2000 characters']
    },
    status: {
        type: String,
        enum: ['unread', 'read', 'replied'],
        default: 'unread'
    },
    notes: {
        type: String,
        trim: true,
        maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
}, {
    timestamps: true
});

// Index for faster queries
contactSchema.index({ status: 1, createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ countryCode: 1 });

module.exports = mongoose.model('Contact', contactSchema);

