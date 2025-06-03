const discoveryService = require('../services/discoveryService');
const { sendSuccess, sendError } = require('../utils/response');

async function getNearbyProfiles(req, res, next) {
    try {
        const userId = req.userId;
        const { radius, limit, page } = req.query;

        const rad = radius ? Number(radius) : undefined;
        const lim = limit ? Number(limit) : 20;
        const pg = page ? Number(page) : 1;
        const skip = (pg - 1) * lim;

        const profiles = await discoveryService.findMatchingProfiles({
            userId,
            radiusInKm: rad,
            limit: lim,
            skip
        });

        return sendSuccess(res, { profiles });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

module.exports = { getNearbyProfiles };
