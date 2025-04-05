const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/user');


// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ msg: 'Please provide all required fields' });
        }

        // Validate role - only allow parent or camp_owner roles
        if (role && !['parent', 'camp_owner'].includes(role)) {
            return res.status(400).json({ msg: 'Invalid role specified. Only parent and camp owner roles are allowed.' });
        }

        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ 
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
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ msg: 'Server error during registration' });
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
            return res.status(400).json({ msg: 'Please provide both email and password' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
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
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ msg: 'Server error during login' });
    }
});

// @route   GET /api/auth/me
// @desc    Get logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error('Get user error:', err.message);
        res.status(500).json({ msg: 'Server error while fetching user data' });
    }
});

// @route   GET /api/auth/users
// @desc    Get all users (admin only)
// @access  Private (Admin only)
router.get('/users', auth, async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied. Admin only.' });
        }

        // Get all users, excluding passwords
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error('Get users error:', err.message);
        res.status(500).json({ msg: 'Server error while fetching users' });
    }
});

module.exports = router;