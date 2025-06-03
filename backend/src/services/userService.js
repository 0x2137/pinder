const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getUserOrFail } = require('../utils/repositoryHelpers');

async function changeEmail(userId, newEmail) {
    const exists = await User.exists({ email: newEmail });
    if (exists) {
        const err = new Error('Email already in use');
        err.statusCode = 409;
        throw err;
    }

    const user = await getUserOrFail(userId);
    user.email = newEmail;
    await user.save();
    return { message: 'Email updated' };
}

async function resetPassword(userId, oldPassword, newPassword) {
    const user = await getUserOrFail(userId);

    const matches = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!matches) {
        const err = new Error('Old password is incorrect');
        err.statusCode = 400;
        throw err;
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();

    return { message: 'Password updated successfully' };
}

module.exports = {
    changeEmail,
    resetPassword
};
