const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide service name'],
        trim: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Please provide service description']
    },
    shortDescription: {
        type: String,
        maxlength: 200
    },
    icon: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['Writing', 'Development', 'Analytics', 'Marketing', 'Design', 'Other'],
        required: true
    },
    features: [{
        title: String,
        description: String
    }],
    pricing: {
        startingPrice: Number,
        currency: {
            type: String,
            default: 'USD'
        },
        pricingModel: {
            type: String,
            enum: ['fixed', 'hourly', 'project-based', 'custom'],
            default: 'project-based'
        }
    },
    deliveryTime: {
        min: Number,
        max: Number,
        unit: {
            type: String,
            enum: ['hours', 'days', 'weeks', 'months'],
            default: 'days'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    displayOrder: {
        type: Number,
        default: 0
    },
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
}, {
    timestamps: true
});

// Generate slug from name before saving
serviceSchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});

module.exports = mongoose.model('Service', serviceSchema);
