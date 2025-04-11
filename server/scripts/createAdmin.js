const mongoose = require('mongoose');
const User = require('../models/user');
require('dotenv').config();

async function createAdminUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            await mongoose.connection.close();
            return;
        }

        // Create admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
}

createAdminUser(); 