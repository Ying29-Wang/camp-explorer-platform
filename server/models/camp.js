const mongoose = require('mongoose');
const { create } = require('./user');

const CAMP_CATEGORIES = [
    'Adventure',
    'Arts',
    'Science',
    'Technology',
    'Sports',
    'Music',
    'Academic',
    'Nature',
    'Leadership',
    'Special Needs',
    'Language',
    'Religious',
    'Cooking',
    'General'
  ];

const CampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
        enum: CAMP_CATEGORIES,
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
        type: [String],
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
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

CampSchema.statics.CATEGORIES = CAMP_CATEGORIES;

module.exports = mongoose.model('Camp', CampSchema);