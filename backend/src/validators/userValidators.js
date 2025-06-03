const { body } = require('express-validator');

module.exports = {
    changeEmail: [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email')
    ],

    resetPassword: [
        body('oldPassword')
            .exists().withMessage('Old password is required')
            .isLength({ min: 6 }).withMessage('Old password must be at least 6 characters long'),
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('New password must be at least 6 characters long')
    ]
};
