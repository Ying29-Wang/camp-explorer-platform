const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');
const mongoose = require('mongoose');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// Load environment variables with explicit path
try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
  } catch (error) {
    console.log('No .env file found, using environment variables');
  }

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://camp-explorer-l03o.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use(express.urlencoded({ extended: false }));
// app.use(logger('dev'));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/camps', require('./routes/camps'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/maps', require('./routes/maps'));

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
