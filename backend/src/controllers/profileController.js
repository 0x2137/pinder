const profileService = require('../services/profileService');
const { sendSuccess, sendError } = require('../utils/response');
const geocoder = require('../utils/geocoder');

async function getOwnProfile(req, res, next) {
    try {
        const userId = req.userId;
        const profile = await profileService.getOwnProfile(userId);
        return sendSuccess(res, { profile });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function updateOwnProfile(req, res, next) {
    try {
        const userId = req.userId;
        const data = req.body;

        if (data.city) {
            const { lat, lng } = await geocoder.geocodeCity(data.city);
            data.location = {
                type: 'Point',
                coordinates: [lng, lat]
            };
        }

        const profile = await profileService.updateOwnProfile(userId, data);
        return sendSuccess(res, { profile });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function getProfileById(req, res, next) {
    try {
        const userId = req.params.userId;
        const profile = await profileService.getProfileById(userId);
        return sendSuccess(res, { profile });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function uploadPicture(req, res, next) {
    try {
        const userId = req.userId;
        const file = req.file;
        const profile = await profileService.addPicture(userId, file.filename);
        return sendSuccess(res, { profile });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function deletePicture(req, res, next) {
    try {
        const userId = req.userId;
        const index = Number(req.params.index);
        const profile = await profileService.removePicture(userId, index);
        return sendSuccess(res, { profile });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

module.exports = {
    getOwnProfile,
    updateOwnProfile,
    getProfileById,
    uploadPicture,
    deletePicture
};
