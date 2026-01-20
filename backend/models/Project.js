const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a project title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide project description']
    },
    client: {
        name: {
            type: String,
            required: true
        },
        email: String,
        phone: String,
        company: String
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
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed', 'on-hold', 'cancelled'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    deadline: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    budget: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    completedDate: {
        type: Date
    },
    files: [{
        filename: String,
        originalName: String,
        path: String,
        fileData: Buffer,
        fileMimeType: String,
        source: {
            type: String,
            enum: ['local', 'contact'],
            default: 'local'
        },
        contactId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Contact'
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    notes: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
