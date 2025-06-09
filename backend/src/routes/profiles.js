const express = require('express');
const profileController = require('../controllers/profileController');
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');
const upload = require('../middleware/upload');
const { createOrUpdateProfile, userIdParam, pictureIndexParam } = require('../validators/profileValidators');

const router = express.Router();

router.get('/me', auth, profileController.getOwnProfile);

router.put(
    '/me',
    auth,
    createOrUpdateProfile,
    validation,
    profileController.updateOwnProfile
);

router.post(
    '/me/pictures',
    auth,
    upload.single('picture'),
    profileController.uploadPicture
);

router.delete(
    '/me/pictures/:index',
    auth,
    pictureIndexParam,
    validation,
    profileController.deletePicture
);


router.get(
    '/:userId',
    auth,
    userIdParam,
    validation,
    profileController.getProfileById
);

module.exports = router;
