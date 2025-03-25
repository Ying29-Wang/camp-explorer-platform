const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// Load environment variables with explicit path
try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
  } catch (error) {
    console.log('No .env file found, using environment variables');
  }

const app = express();
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: '*', 
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

if (require.main === module) {
    const PORT = normalizePort(process.env.PORT || 5000);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }

module.exports = app;
