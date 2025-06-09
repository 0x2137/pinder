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

async function addPicture(userId, filename) {
    const profile = await getProfileOrFail(userId);
    profile.pictures.push(filename);
    if (profile.pictures.length === 1) {
        profile.profilePicture = 0;
    }
    await profile.save();
    return profile;
}

async function removePicture(userId, index) {
    const profile = await getProfileOrFail(userId);
    if (profile.pictures.length <= 1) {
        const err = new Error('Cannot delete the only picture');
        err.statusCode = 400;
        throw err;
    }

    profile.pictures.splice(index, 1);

    if (profile.profilePicture === index) {
        profile.profilePicture = 0;
    } else if (profile.profilePicture > index) {
        profile.profilePicture -= 1;
    }

    await profile.save();
    return profile;
}

module.exports = {
    getOwnProfile,
    updateOwnProfile,
    getProfileById,
    addPicture,
    removePicture
};
