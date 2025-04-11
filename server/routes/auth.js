const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const { passwordResetLimiter } = require('../middleware/rateLimit');
const User = require('../models/user');
const nodemailer = require('nodemailer');

// Helper function to send JSON response
const sendJsonResponse = (res, status, data) => {
    res.set('Content-Type', 'application/json');
    return res.status(status).json(data);
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return sendJsonResponse(res, 400, { msg: 'Please provide all required fields' });
        }

        // Validate role - only allow parent or camp_owner roles
        if (role && !['parent', 'camp_owner'].includes(role)) {
            return sendJsonResponse(res, 400, { msg: 'Invalid role specified. Only parent and camp owner roles are allowed.' });
        }

        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return sendJsonResponse(res, 400, { 
                msg: 'User already exists',
                field: user.email === email ? 'email' : 'username'
            });
        }

        // Create a new user
        user = new User({
            username,
            email,
            password,
            role: role || 'parent', // Default to 'parent' if no role is provided
        });

        await user.save();

        // Create a JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        // Sign the JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return sendJsonResponse(res, 500, { msg: 'Server error during token generation' });
                }
                sendJsonResponse(res, 200, { token });
            }
        );
    } catch (err) {
        console.error('Registration error:', err.message);
        sendJsonResponse(res, 500, { msg: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return sendJsonResponse(res, 400, { msg: 'Please provide both email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return sendJsonResponse(res, 400, { msg: 'User not found' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return sendJsonResponse(res, 400, { msg: 'Invalid password' });
        }

        // Create a JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        // Sign the JWT
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) {
                    console.error('JWT signing error:', err);
                    return sendJsonResponse(res, 500, { msg: 'Server error during token generation' });
                }
                sendJsonResponse(res, 200, { token });
            }
        );
    } catch (err) {
        console.error('Login error:', err.message);
        sendJsonResponse(res, 500, { msg: 'Server error during login' });
    }
});

// @route   GET /api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return sendJsonResponse(res, 404, { msg: 'User not found' });
        }
        sendJsonResponse(res, 200, user);
    } catch (err) {
        console.error('Get user error:', err.message);
        sendJsonResponse(res, 500, { msg: 'Server error while fetching user data' });
    }
});

// @route   GET /api/auth/users
// @desc    Get all users (admin only)
// @access  Private (Admin only)
router.get('/users', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return sendJsonResponse(res, 403, { msg: 'Access denied. Admin only.' });
        }

        // Get all users, excluding passwords
        const users = await User.find().select('-password');
        sendJsonResponse(res, 200, users);
    } catch (err) {
        console.error('Get users error:', err.message);
        sendJsonResponse(res, 500, { msg: 'Server error while fetching users' });
    }
});

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is working' });
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', (req, res) => {
    console.log('Received request:', req.body);
    res.json({ message: 'Received your request', body: req.body });
});

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return sendJsonResponse(res, 400, { msg: 'Token and new password are required' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return sendJsonResponse(res, 400, { msg: 'Password reset token is invalid or has expired' });
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        sendJsonResponse(res, 200, { msg: 'Password has been reset successfully' });
    } catch (err) {
        console.error('Reset password error:', err.message);
        sendJsonResponse(res, 500, { msg: 'Server error during password reset' });
    }
});

module.exports = router;