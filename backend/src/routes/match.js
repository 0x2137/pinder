const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');
const validation = require('../middleware/validation');
const matchController = require('../controllers/matchController');

router.post(
    '/like',
    auth,
    body('candidateId').isMongoId().withMessage('candidateId must be a valid Mongo ID'),
    validation,
    matchController.likeProfile
);

router.post(
    '/reject',
    auth,
    body('candidateId').isMongoId().withMessage('candidateId must be a valid Mongo ID'),
    validation,
    matchController.rejectProfile
);

router.get('/', auth, matchController.getMatches);

module.exports = router;
