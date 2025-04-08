const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    campId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Camp',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true
    },
    // Essential review management fields
    status: {
        type: String,
        enum: ['active', 'flagged'],
        default: 'active'
    },
    helpfulVotes: {
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

// Add indexes for efficient querying
ReviewSchema.index({ campId: 1, status: 1 });
ReviewSchema.index({ userId: 1, status: 1 });

// Add query helper for non-deleted reviews
ReviewSchema.query.nonDeleted = function() {
    return this.where({ isDeleted: false });
};

// Override the remove method to implement soft delete
ReviewSchema.methods.remove = async function(deletedBy = null) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
};

// Static method to add helpful vote
ReviewSchema.statics.addHelpfulVote = async function(reviewId) {
    return this.findByIdAndUpdate(
        reviewId,
        { $inc: { helpfulVotes: 1 } },
        { new: true }
    );
};

module.exports = mongoose.model('Review', ReviewSchema);