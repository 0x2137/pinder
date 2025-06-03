const User = require('../models/User');
const Profile = require('../models/Profile');

async function getUserOrFail(userId) {
    const user = await User.findById(userId);
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    return user;
}

async function getProfileOrFail(userId) {
    const profile = await Profile.findOne({ userId });
    if (!profile) {
        const err = new Error('Profile not found');
        err.statusCode = 404;
        throw err;
    }
    return profile;
}

module.exports = { getUserOrFail, getProfileOrFail };
