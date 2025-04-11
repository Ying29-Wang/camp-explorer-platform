const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();

const API_BASE_URL = 'http://localhost:5001/api';

// Function to get admin user email
async function getAdminEmail() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const User = require('../models/user');
        console.log('Looking for admin user...');
        
        // First check if any admin users exist
        const allUsers = await User.find({});
        console.log('Total users:', allUsers.length);
        console.log('Users with admin role:', allUsers.filter(u => u.role === 'admin').length);
        console.log('Seed users:', allUsers.filter(u => u.isSeedUser).length);
        
        const adminUser = await User.findOne({ role: 'admin', isSeedUser: true });
        console.log('Found admin user:', adminUser);
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        
        return adminUser.email;
    } catch (error) {
        console.error('Error getting admin email:', error);
        throw error;
    }
}

const testPreferences = {
    ageRange: "8-12",
    interests: ["sports", "arts", "nature"],
    location: "Toronto",
    budgetRange: "500-1000",
    userId: null  // We'll set this after login
};

async function testAIEndpoints() {
    try {
        // Get admin email
        const adminEmail = await getAdminEmail();
        const adminUser = {
            email: adminEmail,
            password: 'password123'
        };

        // Step 1: Login to get JWT token
        console.log('Logging in as admin...');
        console.log('Attempting to login with:', adminUser);
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: adminUser.email,
            password: adminUser.password
        });
        
        const token = loginResponse.data.token;
        console.log('Admin login successful, token received:', token);

        // Get user ID from token
        const tokenParts = token.split('.');
        const tokenPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        testPreferences.userId = tokenPayload.user._id;
        console.log('Set userId in preferences:', testPreferences.userId);

        // Step 2: Test Camp Recommendations
        console.log('\nTesting Camp Recommendations...');
        console.log('Sending request to:', `${API_BASE_URL}/ai/recommendations`);
        console.log('With preferences:', testPreferences);
        const recommendationsResponse = await axios.post(
            `${API_BASE_URL}/ai/recommendations`,
            testPreferences,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Recommendations Response:', recommendationsResponse.data);

        // Step 3: Test Review Analysis
        // First, get a camp ID that has reviews
        console.log('\nTesting Review Analysis...');
        console.log('Fetching camps...');
        const campsResponse = await axios.get(`${API_BASE_URL}/camps`);
        console.log('Camps fetched:', campsResponse.data.length);
        const campWithReviews = campsResponse.data.find(camp => camp.reviews && camp.reviews.length > 0);
        
        if (campWithReviews) {
            console.log('Found camp with reviews:', campWithReviews._id);
            const analysisResponse = await axios.get(
                `${API_BASE_URL}/ai/analyze-reviews/${campWithReviews._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Review Analysis Response:', analysisResponse.data);
        } else {
            console.log('No camps with reviews found to test review analysis');
        }

    } catch (error) {
        console.error('Error during testing:');
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        console.error('Full error:', error);
    }
}

// Run the tests
testAIEndpoints(); 