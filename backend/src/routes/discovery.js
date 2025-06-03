const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const discoveryController = require('../controllers/discoveryController');

router.get('/near', auth, discoveryController.getNearbyProfiles);

module.exports = router;
