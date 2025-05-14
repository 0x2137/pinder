const express = require('express');
const multer = require('multer');
const auth = require('../middleware/auth');
const { getProfile, updateProfile, addPhoto } = require('../controllers/userController');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// @route GET /api/users/me
router.get('/me', auth, getProfile);
// @route PUT /api/users/me
router.put('/me', auth, updateProfile);
// @route PATCH /api/users/me/photo
router.patch('/me/photo', auth, upload.single('photo'), addPhoto);

module.exports = router;