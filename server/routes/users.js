const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');

// @route GET api/users
// @desc Get all users
// @access Private/Admin
router.get('/', auth, async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const users = await User.find().nonDeleted();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route GET api/users/:id
// @desc Get user by id
// @access Private
router.get('/:id', auth, async (req, res) => {
    try {
        // Check if the user is an admin or the user themselves
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findById(req.params.id).nonDeleted();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// @route POST api/users
// @desc Create a user
// @access Public
router.post('/', async (req, res) => {
  try {
    const { username, email, password, role, children } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      username,
      email,
      password,
      role,
      children,
      status: 'active',
      lastLogin: new Date()
    });

    await user.save();
    res.json({ message: 'User created' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT api/users/:id
// @desc Update a user
// @access Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if the user is an admin or the user themselves
    if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Role change not allowed unless admin
    if (req.body.role && req.user.role !== 'admin') {
      delete req.body.role;
    }

    // Don't allow updating lastLogin through this route
    if (req.body.lastLogin) {
      delete req.body.lastLogin;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT api/users/:id/status
// @desc Update user status
// @access Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    // Only admin can change user status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route PUT api/users/:id/last-login
// @desc Update user's last login time
// @access Private
router.put('/:id/last-login', auth, async (req, res) => {
  try {
    // Only the user themselves can update their last login
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { lastLogin: new Date() } },
      { new: true }
    ).select('-password');
    res.json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc Delete a user
// @route DELETE /api/users/:id
// @access Private
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if the user is deleting their own account or is an admin
        if (req.user.id !== req.params.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Perform soft delete
        await user.softDelete(req.user._id);
        res.json({ message: 'User soft deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
