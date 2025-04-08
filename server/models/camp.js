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
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: false
        }
    },
    formattedAddress: {
        type: String,
        required: false
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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    isSeedCamp: {
        type: Boolean,
        default: false
    },
    // Essential status and tracking fields
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    viewCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
});

// Add 2dsphere index for geospatial queries
CampSchema.index({ coordinates: '2dsphere' });
// Add index for status
CampSchema.index({ status: 1 });

// Static method to increment view count
CampSchema.statics.incrementViewCount = async function(campId) {
    return this.findByIdAndUpdate(
        campId,
        { $inc: { viewCount: 1 } },
        { new: true }
    );
};

CampSchema.statics.CATEGORIES = CAMP_CATEGORIES;

const Camp = mongoose.model('Camp', CampSchema);

// Ensure index exists when model is initialized
Camp.on('index', function(err) {
    if (err) {
        console.error('Error creating indexes:', err);
    } else {
        console.log('Indexes created successfully');
    }
});

module.exports = Camp;