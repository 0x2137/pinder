const express = require('express');
const { body } = require('express-validator');
const { register, login, logout } = require('../controllers/authController');
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');

const router = express.Router();

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        validate
    ],
    register
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Invalid email'),
        body('password').exists().withMessage('Password required'),
        validate
    ],
    login
);

router.post(
    '/logout',
    auth,
    logout
);

module.exports = router;