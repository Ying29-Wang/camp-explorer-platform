const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

async function updateAdminPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find admin user
        const adminUser = await User.findOne({ email: 'admin@example.com' });
        if (!adminUser) {
            console.log('Admin user not found');
            await mongoose.connection.close();
            return;
        }

        // Update password
        adminUser.password = 'admin123';
        await adminUser.save();
        console.log('Admin password updated successfully');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error updating admin password:', error);
        process.exit(1);
    }
}

updateAdminPassword(); 