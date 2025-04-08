const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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
});

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

module.exports = mongoose.model('User', UserSchema);