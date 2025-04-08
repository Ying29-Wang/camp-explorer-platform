const mongoose = require('mongoose');
const { create } = require('./user');
const Schema = mongoose.Schema;

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

const CampSchema = new Schema({
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

// Add query helper for non-deleted camps
CampSchema.query.nonDeleted = function() {
    return this.where({ isDeleted: false });
};

// Override the remove method to implement soft delete
CampSchema.methods.remove = async function(deletedBy = null) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
};

// Modify the pre-remove middleware to handle soft delete
CampSchema.pre('remove', async function(next) {
    try {
        // Only perform cascading deletes if this is a hard delete
        if (!this.isDeleted) {
            // Delete all reviews associated with this camp
            await mongoose.model('Review').deleteMany({ campId: this._id });
            
            // Delete all recently viewed entries for this camp
            await mongoose.model('RecentlyViewed').deleteMany({ campId: this._id });
        }
        next();
    } catch (error) {
        next(error);
    }
});

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