const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, 'Please provide client name'],
        trim: true
    },
    clientCompany: {
        type: String,
        trim: true
    },
    clientPosition: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: [true, 'Please provide review text'],
        minlength: [10, 'Review must be at least 10 characters']
    },
    service: {
        type: String,
        required: true,
        enum: [
            'Research Writing',
            'Medical Writing',
            'Business Writing',
            'SEO',
            'Web Development',
            'Web App Development',
            'Python',
            'Power BI',
            'DevOps',
            'Financial Analysis',
            'Social Media Marketing',
            'UI/UX',
            'Networking',
            'Coding Projects'
        ]
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    approvedAt: {
        type: Date
    },
    featured: {
        type: Boolean,
        default: false
    },
    clientImage: {
        type: String,
        default: ''
    },
    displayOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
