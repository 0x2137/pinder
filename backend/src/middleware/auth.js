const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET;
const { sendError } = require('../utils/response');

async function auth(req, res, next) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendError(res, 401, 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch {
        return sendError(res, 401, 'Invalid or expired token');
    }

    const user = await User.findById(payload.sub);
    if (!user) {
        return sendError(res, 401, 'User not found');
    }

    if (payload.tokenVersion !== user.tokenVersion) {
        return sendError(res, 401, 'Token has been invalidated');
    }

    req.userId = payload.sub;
    next();
}

module.exports = auth;
