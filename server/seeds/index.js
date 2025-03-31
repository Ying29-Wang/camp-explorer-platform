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
        
        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Camp.deleteMany({});
        await Review.deleteMany({});

        // Seed new data
        console.log('Seeding users...');
        const users = await seedUsers();

        console.log('Seeding camps...');
        const camps = await seedCamps();

        console.log('Seeding reviews...');
        await seedReviews(users, camps);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
};

seedDB().then(() => {
    process.exit();
});