const express = require('express');
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');
const { createOrUpdateProfile, userIdParam } = require('../validators/profileValidators');

const router = express.Router();

router.get('/me', auth, profileController.getOwnProfile);

router.put(
    '/me',
    auth,
    createOrUpdateProfile,
    validation,
    profileController.updateOwnProfile
);

router.get(
    '/:userId',
    auth,
    userIdParam,
    validation,
    profileController.getProfileById
);

module.exports = router;
