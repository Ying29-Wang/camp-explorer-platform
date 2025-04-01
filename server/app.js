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
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], // Allow both localhost and 127.0.0.1 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight requests
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow cookies if you need authentication
}));

// Log requests for debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(logger('dev'));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/camps', require('./routes/camps'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

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

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

// We're going to let bin/www handle server creation
// const PORT = normalizePort(process.env.PORT || 4000);
// const server = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Add error handling for the server
// server.on('error', (error) => {
//   if (error.syscall !== 'listen') {
//     throw error;
//   }

//   const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

//   // Handle specific listen errors with friendly messages
//   switch (error.code) {
//     case 'EACCES':
//       console.error(bind + ' requires elevated privileges');
//       process.exit(1);
//       break;
//     case 'EADDRINUSE':
//       console.error(bind + ' is already in use');
//       // Try a different port
//       const newPort = PORT + 1;
//       console.log(`Trying port ${newPort} instead`);
//       app.listen(newPort);
//       break;
//     default:
//       throw error;
//   }
// });

module.exports = app;
