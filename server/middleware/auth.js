const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    let token = null;

    // Check Authorization header first
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        console.log('Token from Authorization header:', token);
    }

    // If no Authorization header, check x-auth-token
    if (!token) {
        token = req.header('x-auth-token');
        console.log('Token from x-auth-token:', token);
    }

    // Check if not token
    if (!token) {
        console.error('No token found in request');
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    
    try {
        // Verify token
        console.log('Verifying token with secret:', process.env.JWT_SECRET ? 'exists' : 'missing');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded successfully:', {
            user: decoded.user,
            role: decoded.user?.role,
            id: decoded.user?.id || decoded.user?._id
        });
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification error:', {
            name: err.name,
            message: err.message,
            stack: err.stack
        });
        res.status(401).json({ msg: 'Token is not valid' });
    }
};