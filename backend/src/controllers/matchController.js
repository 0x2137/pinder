const matchService = require('../services/matchService');
const { sendSuccess, sendError } = require('../utils/response');

async function likeProfile(req, res, next) {
    try {
        const userId = req.userId;
        const { candidateId } = req.body;
        const result = await matchService.likeProfile(userId, candidateId);
        return sendSuccess(res, { message: result.message });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function rejectProfile(req, res, next) {
    try {
        const userId = req.userId;
        const { candidateId } = req.body;
        const result = await matchService.rejectProfile(userId, candidateId);
        return sendSuccess(res, { message: result.message });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function getMatches(req, res, next) {
    try {
        const userId = req.userId;
        const matchedProfiles = await matchService.getMatches(userId);
        return sendSuccess(res, { matches: matchedProfiles });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

module.exports = { likeProfile, rejectProfile, getMatches };
