const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validation = require('../middleware/validation');

const router = express.Router();

router.post(
    '/register',
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    validation,
    authController.register
);

router.post(
    '/login',
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').exists().withMessage('Password is required'),
    validation,
    authController.login
);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

module.exports = router;
