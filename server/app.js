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

// CORS middleware with specific configuration
const corsOptions = {
    origin: function (origin, callback) {
        // 允许的源列表
        const allowedOrigins = [
            'https://camp-explorer-client.onrender.com',
            'http://localhost:5173',
            'http://127.0.0.1:5173'
        ];
        
        // 在开发环境中允许所有源
        if (process.env.NODE_ENV === 'development') {
            callback(null, true);
            return;
        }
        
        // 在生产环境中检查源
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 生产环境日志中间件
if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        const start = Date.now();
        console.log('=== Production Request Details ===');
        console.log('Time:', new Date().toISOString());
        console.log('Method:', req.method);
        console.log('Path:', req.path);
        console.log('Headers:', req.headers);
        console.log('Body:', req.body);
        console.log('Node Version:', process.version);
        console.log('Memory Usage:', JSON.stringify(process.memoryUsage()));
        console.log('Environment:', {
            NODE_ENV: process.env.NODE_ENV,
            MONGODB_URI: process.env.MONGODB_URI ? 'exists' : 'missing'
        });
        
        // 记录响应时间
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log('Response Time:', duration, 'ms');
            console.log('Status Code:', res.statusCode);
            console.log('==============================');
        });
        
        next();
    });
} else {
    // 开发环境保持简单的日志
    app.use((req, res, next) => {
        console.log('=== New Request ===');
        console.log('Method:', req.method);
        console.log('Path:', req.path);
        console.log('Body:', req.body);
        console.log('==================');
        next();
    });
}

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

// 增强的错误处理中间件
app.use((err, req, res, next) => {
    console.error('=== Error Details ===');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Request path:', req.path);
    console.error('Request method:', req.method);
    console.error('Request body:', req.body);
    console.error('Request headers:', req.headers);
    console.error('==================');

    // 如果是数据库连接错误
    if (err.name === 'MongoError' || err.name === 'MongooseError') {
        return res.status(500).json({ 
            error: 'Database error',
            message: err.message,
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    // 如果是验证错误
    if (err.name === 'ValidationError') {
        return res.status(400).json({ 
            error: 'Validation error',
            message: err.message,
            details: err.errors
        });
    }

    // 如果是 JWT 错误
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
            error: 'Authentication error',
            message: 'Invalid token'
        });
    }

    // 默认错误响应
    res.status(500).json({ 
        error: 'Server error',
        message: err.message,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
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
