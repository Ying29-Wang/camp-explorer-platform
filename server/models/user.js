const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['parent', 'camp_owner', 'admin'],
        default: 'parent',
    },
    status: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    // Embedded children array
    children: [{
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        dateOfBirth: {
            type: Date,
            required: true
        },
        interests: {
            type: [String],
            default: []
        }
    }],
    date: {
        type: Date,
        default: Date.now,
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

// Pre-save hook to hash passwords
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error);
    }
};

// Add query helper for non-deleted users
UserSchema.query.nonDeleted = function() {
    return this.where({ isDeleted: false });
};

// Override the remove method to implement soft delete
UserSchema.methods.softDelete = async function(deletedBy = null) {
    this.isDeleted = true;
    this.deletedAt = new Date();
    this.deletedBy = deletedBy;
    return this.save();
};

// Modify the pre-remove middleware to handle soft delete
UserSchema.pre('remove', async function(next) {
    try {
        // Only perform cascading deletes if this is a hard delete
        if (!this.isDeleted) {
            // Delete all reviews by this user
            await mongoose.model('Review').deleteMany({ userId: this._id });
            
            // Delete all recently viewed entries by this user
            await mongoose.model('RecentlyViewed').deleteMany({ userId: this._id });
            
            // If user is a camp owner, handle their camps
            if (this.role === 'camp_owner') {
                await mongoose.model('Camp').updateMany(
                    { ownerId: this._id },
                    { ownerId: null, status: 'inactive' }
                );
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);