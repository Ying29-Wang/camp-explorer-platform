import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
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
  notes: {
    type: String,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  },
  list: {
    type: String,
    default: 'default',
    trim: true
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
favoriteSchema.index({ user: 1, camp: 1 }, { unique: true });
favoriteSchema.index({ user: 1, status: 1 });
favoriteSchema.index({ user: 1, list: 1 });

// Static method to add a favorite
favoriteSchema.statics.addFavorite = async function(userId, campId, data = {}) {
  try {
    const existingFavorite = await this.findOne({ user: userId, camp: campId });
    
    if (existingFavorite) {
      if (existingFavorite.status === 'archived') {
        existingFavorite.status = 'active';
        if (data.notes) existingFavorite.notes = data.notes;
        if (data.tags) existingFavorite.tags = data.tags;
        if (data.list) existingFavorite.list = data.list;
        return existingFavorite.save();
      }
      throw new Error('Camp is already in favorites');
    }

    return this.create({
      user: userId,
      camp: campId,
      ...data
    });
  } catch (error) {
    throw new Error(`Error adding favorite: ${error.message}`);
  }
};

// Static method to get user's favorites
favoriteSchema.statics.getUserFavorites = async function(userId, options = {}) {
  try {
    const { status = 'active', list, limit = 20, skip = 0 } = options;
    
    const query = { user: userId, status };
    if (list) query.list = list;

    return this.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('camp', 'name location images rating price')
      .lean();
  } catch (error) {
    throw new Error(`Error fetching favorites: ${error.message}`);
  }
};

// Static method to update favorite
favoriteSchema.statics.updateFavorite = async function(userId, campId, data) {
  try {
    const favorite = await this.findOne({ user: userId, camp: campId });
    if (!favorite) {
      throw new Error('Favorite not found');
    }

    if (data.notes !== undefined) favorite.notes = data.notes;
    if (data.tags) favorite.tags = data.tags;
    if (data.status) favorite.status = data.status;
    if (data.list) favorite.list = data.list;

    return favorite.save();
  } catch (error) {
    throw new Error(`Error updating favorite: ${error.message}`);
  }
};

// Static method to remove favorite
favoriteSchema.statics.removeFavorite = async function(userId, campId) {
  try {
    const result = await this.deleteOne({ user: userId, camp: campId });
    if (result.deletedCount === 0) {
      throw new Error('Favorite not found');
    }
    return result;
  } catch (error) {
    throw new Error(`Error removing favorite: ${error.message}`);
  }
};

// Static method to get user's favorite lists
favoriteSchema.statics.getUserLists = async function(userId) {
  try {
    return this.distinct('list', { user: userId, status: 'active' });
  } catch (error) {
    throw new Error(`Error fetching favorite lists: ${error.message}`);
  }
};

// Static method to check if camp is favorited
favoriteSchema.statics.isFavorited = async function(userId, campId) {
  try {
    const favorite = await this.findOne({ 
      user: userId, 
      camp: campId,
      status: 'active'
    });
    return !!favorite;
  } catch (error) {
    throw new Error(`Error checking favorite status: ${error.message}`);
  }
};

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;