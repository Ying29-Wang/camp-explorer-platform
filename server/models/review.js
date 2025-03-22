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
        required: true
        min: 1,
        max: 5
    },
    reviewText: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Review', ReviewSchema);