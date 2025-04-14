const mongoose = require('mongoose');
const { create } = require('./user');
const Schema = mongoose.Schema;
const { CAMP_CATEGORIES } = require('../constants/campConstants');

const CampSchema = new Schema({
    name: {
        type: String,
        required: true,
        text: true
    },
    description: {
        type: String,
        text: true
    },
    location: {
        type: String,
        required: true,
        text: true
    },
    latitude: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
        default: 0
    },
    formattedAddress: {
        type: String
    },
    ageRange: {
        min: {
            type: Number
        },
        max: {
            type: Number
        }
    },
    category: {
        type: String,
        enum: CAMP_CATEGORIES
    },
    activities: {
        type: [String],
        default: []
    },
    price: {
        type: Number
    },
    image: {
        type: [String],
        default: []
    },
    source: {
        type: String,
        enum: ['direct', 'external'],
        default: 'direct'
    },
    website: {
        type: String
    },
    contact: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    capacity: {
        type: Number
    },
    registered: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isSeedCamp: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    viewCount: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, { timestamps: true });

// Add text index for search
CampSchema.index({ name: 'text', description: 'text', location: 'text' });

// Query helper for non-deleted camps
CampSchema.query.nonDeleted = function() {
    return this.where({ isDeleted: false });
};

// Soft delete method
CampSchema.methods.softDelete = async function(deletedBy = null) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
};

module.exports = mongoose.model('Camp', CampSchema);