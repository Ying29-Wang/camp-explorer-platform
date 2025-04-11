const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables with explicit path
try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (error) {
    console.log('No .env file found, using environment variables');
}

const app = express();

// CORS middleware
app.use(cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log('=== New Request ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('==================');
    next();
});

// Routes
app.use('/api/camps', require('./routes/camps'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/maps', require('./routes/maps'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/bookmarks', require('./routes/bookmarks'));
app.use('/api/recently-viewed', require('./routes/recentlyViewed'));
app.use('/api/ai', require('./routes/ai'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
});

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Camp Explorer API' });
});

// Test route for debugging
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// DB check route
app.get('/api/dbcheck', async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (mongoose.connection.readyState !== 1) {
            return res.status(500).json({ message: 'Database not connected', state: mongoose.connection.readyState });
        }
        
        // Return success if connected
        res.json({ message: 'Database connected successfully', state: mongoose.connection.readyState });
    } catch (err) {
        console.error('Database check error:', err);
        res.status(500).json({ message: 'Error checking database connection', error: err.message });
    }
});

// Set port from environment variable only
const PORT = process.env.PORT;
app.set('port', PORT);

// Export the app - server startup is handled by bin/www
module.exports = app;
