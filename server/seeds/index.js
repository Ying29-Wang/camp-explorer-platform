const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../db');
const seedUsers = require('./userSeeds');
const seedCamps = require('./campSeeds');
const seedReviews = require('./reviewSeeds');

// Models
const User = require('../models/user');
const Camp = require('../models/camp');
const Review = require('../models/review');

const seedDB = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');
        
        // Get existing registered users before clearing data
        const registeredUsers = await User.find({ isSeedUser: { $ne: true } });
        console.log(`Found ${registeredUsers.length} registered users to preserve`);

        // Clear only seed data
        console.log('Clearing seed data...');
        await Camp.deleteMany({ isSeedCamp: true });
        await Review.deleteMany({ isSeedReview: true });
        await User.deleteMany({ isSeedUser: true });

        // Seed new data
        console.log('Seeding users...');
        const seedUsersList = await seedUsers();
        if (!seedUsersList || seedUsersList.length === 0) {
            throw new Error('Failed to seed users');
        }

        console.log('Seeding camps...');
        const camps = await seedCamps();
        if (!camps || camps.length === 0) {
            throw new Error('Failed to seed camps');
        }

        console.log('Seeding reviews...');
        await seedReviews([...seedUsersList, ...registeredUsers], camps);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

seedDB()
    .then(() => {
        console.log('Seeding completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    });