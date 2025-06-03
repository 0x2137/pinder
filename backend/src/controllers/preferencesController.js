const preferencesService = require('../services/preferencesService');
const { sendSuccess, sendError } = require('../utils/response');

async function getPreferences(req, res, next) {
    try {
        const userId = req.userId;
        const prefs = await preferencesService.getPreferences(userId);
        return sendSuccess(res, { preferences: prefs });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function upsertPreferences(req, res, next) {
    try {
        const userId = req.userId;
        const data = req.body;
        const prefs = await preferencesService.upsertPreferences(userId, data);
        return sendSuccess(res, { preferences: prefs });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

module.exports = { getPreferences, upsertPreferences };
