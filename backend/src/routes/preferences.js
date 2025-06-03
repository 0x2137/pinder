const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validation = require('../middleware/validation');
const { createOrUpdatePreferences } = require('../validators/preferencesValidators');
const preferencesController = require('../controllers/preferencesController');

router.get('/', auth, preferencesController.getPreferences);

router.post(
    '/',
    auth,
    createOrUpdatePreferences,
    validation,
    preferencesController.upsertPreferences
);

module.exports = router;
