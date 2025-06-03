const Profile = require('../models/Profile');
const { getProfileOrFail } = require('../utils/repositoryHelpers');

async function getOwnProfile(userId) {
    return await getProfileOrFail(userId);
}

async function updateOwnProfile(userId, data) {
    const filter = { userId };
    const update = { ...data, userId };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const profile = await Profile.findOneAndUpdate(filter, update, options);
    return profile;
}

async function getProfileById(userId) {
    return await getProfileOrFail(userId);
}

module.exports = { getOwnProfile, updateOwnProfile, getProfileById };
