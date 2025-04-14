const { body, validationResult } = require('express-validator');
const { CAMP_CATEGORIES } = require('../constants/campConstants');

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
    name: {
        in: ['body'],
        isString: {
            errorMessage: 'Name must be a string'
        },
        notEmpty: {
            errorMessage: 'Name is required'
        }
    },
    location: {
        in: ['body'],
        isString: {
            errorMessage: 'Location must be a string'
        },
        notEmpty: {
            errorMessage: 'Location is required'
        }
    },
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
    },
    description: {
        in: ['body'],
        isString: {
            errorMessage: 'Description must be a string'
        },
        optional: true
    },
    price: {
        in: ['body'],
        isNumeric: {
            errorMessage: 'Price must be a number'
        },
        optional: true
    },
    ageRange: {
        in: ['body'],
        isObject: {
            errorMessage: 'Age range must be an object'
        },
        optional: true
    },
    category: {
        in: ['body'],
        isIn: {
            options: [CAMP_CATEGORIES],
            errorMessage: 'Invalid category'
        },
        optional: true
    },
    website: {
        in: ['body'],
        isURL: {
            errorMessage: 'Invalid website URL'
        },
        optional: true
    },
    contact: {
        in: ['body'],
        isString: {
            errorMessage: 'Contact must be a string'
        },
        optional: true
    },
    email: {
        in: ['body'],
        isEmail: {
            errorMessage: 'Invalid email format'
        },
        optional: true
    },
    phone: {
        in: ['body'],
        isString: {
            errorMessage: 'Phone must be a string'
        },
        optional: true
    },
    startDate: {
        in: ['body'],
        isISO8601: {
            errorMessage: 'Invalid start date format'
        },
        optional: true
    },
    endDate: {
        in: ['body'],
        isISO8601: {
            errorMessage: 'Invalid end date format'
        },
        optional: true
    },
    capacity: {
        in: ['body'],
        isInt: {
            options: { min: 0 },
            errorMessage: 'Capacity must be a non-negative integer'
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

// Camp validation middleware
const validateCamp = [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),
    body('location')
        .notEmpty()
        .withMessage('Location is required')
        .isString()
        .withMessage('Location must be a string'),
    body('status')
        .optional()
        .isIn(['active', 'inactive'])
        .withMessage('Status must be either active or inactive'),
    body('viewCount')
        .optional()
        .isInt({ min: 0 })
        .withMessage('View count must be a non-negative integer'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    body('price')
        .optional()
        .isNumeric()
        .withMessage('Price must be a number'),
    body('ageRange')
        .optional()
        .isObject()
        .withMessage('Age range must be an object'),
    body('category')
        .optional({ nullable: true })
        .isIn(CAMP_CATEGORIES)
        .withMessage('Invalid category'),
    body('website')
        .optional({ nullable: true })
        .isURL()
        .withMessage('Invalid website URL'),
    body('contact')
        .optional({ nullable: true })
        .isString()
        .withMessage('Contact must be a string'),
    body('email')
        .optional({ nullable: true })
        .isEmail()
        .withMessage('Invalid email format'),
    body('phone')
        .optional({ nullable: true })
        .isString()
        .withMessage('Phone must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// Review validation middleware
const validateReview = [
    body('rating')
        .isInt({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    body('reviewText')
        .isLength({ min: 10, max: 1000 })
        .withMessage('Review text must be between 10 and 1000 characters'),
    body('helpfulVotes')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Helpful votes must be a non-negative integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

// User validation middleware
const validateUser = [
    body('lastLogin')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format for last login'),
    body('role')
        .optional()
        .isIn(['parent', 'camp_owner', 'admin'])
        .withMessage('Invalid role'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateCamp,
    validateReview,
    validateUser,
    commonValidationRules,
    campValidationRules,
    reviewValidationRules,
    userValidationRules
}; 