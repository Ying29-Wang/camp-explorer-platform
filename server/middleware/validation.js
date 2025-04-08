const { validationResult } = require('express-validator');

// Common validation rules
const commonValidationRules = {
    status: {
        in: ['body'],
        isIn: {
            options: [['active', 'inactive']],
            errorMessage: 'Status must be either active or inactive'
        },
        optional: true
    }
};

// Camp validation rules
const campValidationRules = {
    ...commonValidationRules,
    viewCount: {
        in: ['body'],
        isInt: {
            options: { min: 0 },
            errorMessage: 'View count must be a non-negative integer'
        },
        optional: true
    },
    owner: {
        in: ['body'],
        isMongoId: {
            errorMessage: 'Invalid owner ID format'
        },
        optional: true
    }
};

// Review validation rules
const reviewValidationRules = {
    ...commonValidationRules,
    helpfulVotes: {
        in: ['body'],
        isInt: {
            options: { min: 0 },
            errorMessage: 'Helpful votes must be a non-negative integer'
        },
        optional: true
    },
    rating: {
        in: ['body'],
        isInt: {
            options: { min: 1, max: 5 },
            errorMessage: 'Rating must be between 1 and 5'
        }
    },
    reviewText: {
        in: ['body'],
        isLength: {
            options: { min: 10, max: 1000 },
            errorMessage: 'Review text must be between 10 and 1000 characters'
        }
    }
};

// User validation rules
const userValidationRules = {
    ...commonValidationRules,
    lastLogin: {
        in: ['body'],
        isISO8601: {
            errorMessage: 'Invalid date format for last login'
        },
        optional: true
    },
    role: {
        in: ['body'],
        isIn: {
            options: [['parent', 'camp_owner', 'admin']],
            errorMessage: 'Invalid role'
        },
        optional: true
    }
};

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Validation middleware for specific routes
const validateCamp = (req, res, next) => {
    req.check(campValidationRules);
    validate(req, res, next);
};

const validateReview = (req, res, next) => {
    req.check(reviewValidationRules);
    validate(req, res, next);
};

const validateUser = (req, res, next) => {
    req.check(userValidationRules);
    validate(req, res, next);
};

module.exports = {
    validateCamp,
    validateReview,
    validateUser,
    commonValidationRules,
    campValidationRules,
    reviewValidationRules,
    userValidationRules
}; 