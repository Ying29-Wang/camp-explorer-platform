const mongoose = require('mongoose');

const CampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    ageRange: {
        min: {
            type: Number,
            required: true,
        },
        max: {
            type: Number,
            required: true,
        },
    },
    category: {
        type: String,
        required: true,
    },
    activities: {
        type: [String],
        default: [],
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: [],
    },
    source: {
        type: String,
        enum: ['direct', 'external'],
        default: 'direct',
    },
    website: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    registered: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Camp', CampSchema);