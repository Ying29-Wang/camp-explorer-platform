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

// @route PUT api/users/:id/basic-info
// @desc Update user's basic information
// @access Private
router.put('/:id/basic-info', auth, async (req, res) => {
    try {
        // Check if the user is an admin or the user themselves
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only allow updating specific fields
        const allowedUpdates = ['username', 'email'];
        const updates = Object.keys(req.body)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        // Check if email is being changed and if it's already taken
        if (updates.email && updates.email !== user.email) {
            const existingUser = await User.findOne({ email: updates.email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route PUT api/users/:id/preferences
// @desc Update user's preferences
// @access Private
router.put('/:id/preferences', auth, async (req, res) => {
    try {
        // Check if the user is an admin or the user themselves
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Only allow updating preferences
        const allowedUpdates = ['notifications', 'emailPreferences', 'language', 'timezone'];
        const updates = Object.keys(req.body)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.body[key];
                return obj;
            }, {});

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true }
        ).select('-password');
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route PUT api/users/:id/profile-picture
// @desc Update user's profile picture
// @access Private
router.put('/:id/profile-picture', auth, async (req, res) => {
    try {
        // Check if the user is an admin or the user themselves
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { profilePicture } = req.body;
        if (!profilePicture) {
            return res.status(400).json({ message: 'Profile picture is required' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { profilePicture } },
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

// @route POST api/users/:id/children
// @desc Add a new child to user
// @access Private
router.post('/:id/children', auth, async (req, res) => {
    try {
        // Check if the user is an admin or the user themselves
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { firstName, lastName, dateOfBirth, interests } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !dateOfBirth) {
            return res.status(400).json({ message: 'First name, last name, and date of birth are required' });
        }

        // Add new child to the children array
        user.children.push({
            firstName,
            lastName,
            dateOfBirth,
            interests: interests || []
        });

        await user.save();
        res.json(user.children[user.children.length - 1]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route PUT api/users/:id/children/:childId
// @desc Update a child's information
// @access Private
router.put('/:id/children/:childId', auth, async (req, res) => {
    try {
        // Check if the user is an admin or the user themselves
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const childIndex = user.children.findIndex(
            child => child._id.toString() === req.params.childId
        );

        if (childIndex === -1) {
            return res.status(404).json({ message: 'Child not found' });
        }

        const { firstName, lastName, dateOfBirth, interests } = req.body;

        // Update child information
        if (firstName) user.children[childIndex].firstName = firstName;
        if (lastName) user.children[childIndex].lastName = lastName;
        if (dateOfBirth) user.children[childIndex].dateOfBirth = dateOfBirth;
        if (interests) user.children[childIndex].interests = interests;

        await user.save();
        res.json(user.children[childIndex]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route DELETE api/users/:id/children/:childId
// @desc Remove a child from user
// @access Private
router.delete('/:id/children/:childId', auth, async (req, res) => {
    try {
        // Check if the user is an admin or the user themselves
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const childIndex = user.children.findIndex(
            child => child._id.toString() === req.params.childId
        );

        if (childIndex === -1) {
            return res.status(404).json({ message: 'Child not found' });
        }

        // Remove the child from the array
        user.children.splice(childIndex, 1);
        await user.save();
        res.json({ message: 'Child removed successfully' });
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
