const { body, param } = require('express-validator');

const GENDERS = ['male', 'female', 'nonbinary'];
const CHILDREN = ['doesnt_want', 'want', 'has', 'maybe'];
const EDUCATION = ['HS', 'BS', 'MS', 'PhD', 'Other'];
const BODY_TYPES = ['slim', 'average', 'athletic', 'curvy', 'fat', 'other'];

module.exports = {
    createOrUpdateProfile: [
        body('name')
            .optional()
            .isLength({ min: 2, max: 20 }).withMessage('Name must be 2–20 characters')
            .matches(/^[\p{L}]+$/u).withMessage('Name must contain only letters'),

        body('age')
            .optional()
            .isInt({ min: 18, max: 120 }).withMessage('Age must be a number between 18 and 120'),

        body('gender')
            .optional()
            .isIn(GENDERS).withMessage(`Gender must be one of: ${GENDERS.join(', ')}`),

        body('city')
            .optional()
            .isString().withMessage('City must be a string'),

        body('about')
            .optional()
            .isLength({ min: 2, max: 250 }).withMessage('About must be 2-250 characters'),

        body('interests')
            .optional()
            .isArray().withMessage('Interests must be an array of strings'),
        body('interests.*')
            .optional()
            .isString().isLength({ min: 2 }).withMessage('Each interest must be at least 2 characters'),

        body('havingChildren')
            .optional()
            .isIn(CHILDREN).withMessage(`Having children must be one of: ${CHILDREN.join(', ')}`),

        body('education')
            .optional()
            .isIn(EDUCATION).withMessage(`Education must be one of: ${EDUCATION.join(', ')}`),

        body('height')
            .optional()
            .isInt({ min: 120, max: 250 }).withMessage('Height must be a number between 120 and 250'),

        body('bodyType')
            .optional()
            .isIn(BODY_TYPES).withMessage(`Body type must be one of: ${BODY_TYPES.join(', ')}`)
    ],
    userIdParam: [
        param('userId')
            .isMongoId().withMessage('userId must be a valid Mongo ID')
    ]
};
