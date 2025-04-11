const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookmarkSchema = new Schema({
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
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Create a compound index to ensure unique bookmarks
BookmarkSchema.index({ userId: 1, campId: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', BookmarkSchema); 