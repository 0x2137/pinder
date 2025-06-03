const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { signAccessToken } = require('../utils/jwt');

const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

function createRefreshTokenData(userAgent, ip) {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRES_IN_DAYS);
    return { token, userAgent, ip, expiresAt, valid: true };
}

async function register({ email, password, userAgent, ip }) {
    if (await User.exists({ email })) {
        const err = new Error('Email already in use');
        err.statusCode = 409;
        throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    const accessToken = signAccessToken(user._id, user.tokenVersion);

    const refreshData = createRefreshTokenData(userAgent, ip);
    user.refreshTokens.push(refreshData);
    await user.save();

    return {
        accessToken,
        refreshToken: refreshData.token
    };
}

async function login({ email, password, userAgent, ip }) {
    const user = await User.findOne({ email });
    if (!user) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
    }

    const accessToken = signAccessToken(user._id, user.tokenVersion);
    const refreshData = createRefreshTokenData(userAgent, ip);
    user.refreshTokens.push(refreshData);
    await user.save();

    return {
        accessToken,
        refreshToken: refreshData.token
    };
}

async function refreshTokens({ refreshToken, userAgent, ip }) {
    const now = new Date();
    const user = await User.findOne({
        'refreshTokens.token': refreshToken,
        'refreshTokens.valid': true,
        'refreshTokens.expiresAt': { $gt: now }
    });

    if (!user) {
        const err = new Error('Refresh token invalid or expired');
        err.statusCode = 401;
        throw err;
    }

    const tokenDoc = user.refreshTokens.find(rt => rt.token === refreshToken);
    tokenDoc.valid = false;

    const newRefresh = createRefreshTokenData(userAgent, ip);
    user.refreshTokens.push(newRefresh);
    await user.save();

    const accessToken = signAccessToken(user._id, user.tokenVersion);

    return {
        accessToken,
        refreshToken: newRefresh.token
    };
}

async function logout({ refreshToken }) {
    const user = await User.findOne({ 'refreshTokens.token': refreshToken });
    if (!user) {
        return;
    }

    const tokenDoc = user.refreshTokens.find(rt => rt.token === refreshToken);
    tokenDoc.valid = false;

    user.tokenVersion += 1;
    await user.save();
}

module.exports = {
    register,
    login,
    refreshTokens,
    logout
};
