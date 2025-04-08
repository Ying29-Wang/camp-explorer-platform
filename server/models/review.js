const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Add indexes for efficient querying
ReviewSchema.index({ campId: 1, status: 1 });
ReviewSchema.index({ userId: 1, status: 1 });

// Static method to add helpful vote
ReviewSchema.statics.addHelpfulVote = async function(reviewId) {
    return this.findByIdAndUpdate(
        reviewId,
        { $inc: { helpfulVotes: 1 } },
        { new: true }
    );
};

module.exports = mongoose.model('Review', ReviewSchema);