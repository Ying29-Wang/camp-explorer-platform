const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

require('dotenv').config({ path: path.join(__dirname, '.env') });

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(logger('dev'));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/camps', require('./routes/camps'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Camp Explorer API' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
