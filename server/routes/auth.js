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
                _id: user._id,
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
                _id: user._id,
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

// Test email route
router.post('/test-email', async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: req.body.email || process.env.EMAIL_USER,
            subject: 'Test Email from Camp Explorer',
            text: 'This is a test email from the Camp Explorer application.'
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Test email sent successfully' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
// @access  Public
router.post('/forgot-password', passwordResetLimiter, async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'Email is required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            // Return success even if user not found (security through obscurity)
            return res.status(200).json({ 
                success: true,
                message: 'If an account exists, a password reset email has been sent'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpires = Date.now() + 3600000; // 1 hour from now

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpires;
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Password Reset Request - Camp Explorer',
            html: `
                <h2>Password Reset Request</h2>
                <p>You are receiving this because you (or someone else) have requested the reset of the password for your Camp Explorer account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <p><a href="${resetUrl}">${resetUrl}</a></p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                <p>This link will expire in 1 hour.</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent to:', user.email);

        res.status(200).json({ 
            success: true,
            message: 'If an account exists, a password reset email has been sent'
        });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error processing password reset request',
            error: error.message
        });
    }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                success: false,
                message: 'Token and new password are required'
            });
        }

        // Find user with valid reset token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Password reset token is invalid or has expired'
            });
        }

        // Update password and clear reset token
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Send confirmation email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Password Reset Confirmation - Camp Explorer',
            html: `
                <h2>Password Reset Successful</h2>
                <p>Your password has been successfully reset.</p>
                <p>If you did not make this change, please contact us immediately.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Password reset completion error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
});

module.exports = router;