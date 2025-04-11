const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecentlyViewedSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    campId: {
        type: Schema.Types.ObjectId,
        ref: 'Camp',
        required: true
    },
    viewedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Create a compound index to ensure unique entries
RecentlyViewedSchema.index({ userId: 1, campId: 1 }, { unique: true });

module.exports = mongoose.model('recentlyViewed', RecentlyViewedSchema);
