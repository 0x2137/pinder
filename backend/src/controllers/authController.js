const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

async function register(req, res, next) {
    try {
        const { email, password } = req.body;
        const userAgent = req.get('User-Agent') || '';
        const ip = req.ip;

        const { accessToken, refreshToken } = await authService.register({
            email,
            password,
            userAgent,
            ip
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return sendSuccess(res, { accessToken }, 201);
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const userAgent = req.get('User-Agent') || '';
        const ip = req.ip;

        const { accessToken, refreshToken } = await authService.login({
            email,
            password,
            userAgent,
            ip
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return sendSuccess(res, { accessToken });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function refresh(req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return sendError(res, 401, 'No refresh token provided');
        }

        const userAgent = req.get('User-Agent') || '';
        const ip = req.ip;

        const { accessToken, refreshToken: newRefresh } = await authService.refreshTokens({
            refreshToken,
            userAgent,
            ip
        });

        res.cookie('refreshToken', newRefresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return sendSuccess(res, { accessToken });
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function logout(req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await authService.logout({ refreshToken });
            res.clearCookie('refreshToken');
        }
        return res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login,
    refresh,
    logout
};
