const mongoose = require('mongoose');

const recentlyViewedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  camp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Camp',
    required: true,
    index: true
  },
  viewCount: {
    type: Number,
    default: 1,
    min: 1
  },
  lastViewedAt: {
    type: Date,
    default: Date.now
  },
  metadata: {
    deviceType: String,
    browser: String,
    location: String
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
recentlyViewedSchema.index({ user: 1, lastViewedAt: -1 });

// Static method to track a view
recentlyViewedSchema.statics.trackView = async function(userId, campId, metadata = {}) {
  try {
    const existingView = await this.findOne({ user: userId, camp: campId });
    
    if (existingView) {
      // Update existing view
      existingView.viewCount += 1;
      existingView.lastViewedAt = new Date();
      if (metadata) {
        existingView.metadata = { ...existingView.metadata, ...metadata };
      }
      return existingView.save();
    } else {
      // Create new view
      return this.create({
        user: userId,
        camp: campId,
        metadata
      });
    }
  } catch (error) {
    throw new Error(`Error tracking view: ${error.message}`);
  }
};

// Static method to get user's recently viewed camps
recentlyViewedSchema.statics.getUserRecentViews = async function(userId, limit = 10) {
  try {
    return this.find({ user: userId })
      .sort({ lastViewedAt: -1 })
      .limit(limit)
      .populate('camp', 'name location images rating')
      .lean();
  } catch (error) {
    throw new Error(`Error fetching recent views: ${error.message}`);
  }
};

// Static method to clear user's viewing history
recentlyViewedSchema.statics.clearUserHistory = async function(userId) {
  try {
    return this.deleteMany({ user: userId });
  } catch (error) {
    throw new Error(`Error clearing viewing history: ${error.message}`);
  }
};

// Pre-save middleware to update lastViewedAt
recentlyViewedSchema.pre('save', function(next) {
  this.lastViewedAt = new Date();
  next();
});

const RecentlyViewed = mongoose.model('RecentlyViewed', recentlyViewedSchema);

module.exports = RecentlyViewed;
