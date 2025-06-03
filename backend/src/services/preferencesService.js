const ProfilePreferences = require('../models/ProfilePreferences');
const { getUserOrFail } = require('../utils/repositoryHelpers');

async function getPreferences(userId) {
    await getUserOrFail(userId);
    const prefs = await ProfilePreferences.findOne({ userId });
    if (!prefs) {
        const err = new Error('Preferences not found');
        err.statusCode = 404;
        throw err;
    }
    return prefs;
}

async function upsertPreferences(userId, data) {
    await getUserOrFail(userId);
    const filter = { userId };
    const update = { ...data, userId };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const prefs = await ProfilePreferences.findOneAndUpdate(filter, update, options);
    return prefs;
}

module.exports = { getPreferences, upsertPreferences };
