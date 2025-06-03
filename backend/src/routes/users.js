const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');
const { changeEmail, resetPassword } = require('../validators/userValidators');
const userController = require('../controllers/userController');

router.put(
    '/me/email',
    auth,
    changeEmail,
    validation,
    userController.changeOwnEmail
);

router.put(
    '/me/password',
    auth,
    resetPassword,
    validation,
    userController.resetOwnPassword
);

module.exports = router;
