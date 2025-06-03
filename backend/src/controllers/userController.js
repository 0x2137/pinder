const userService = require('../services/userService');
const { sendSuccess, sendError } = require('../utils/response');

async function changeOwnEmail(req, res, next) {
    try {
        const userId = req.userId;
        const { email } = req.body;
        const result = await userService.changeEmail(userId, email);
        return sendSuccess(res, result);
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

async function resetOwnPassword(req, res, next) {
    try {
        const userId = req.userId;
        const { oldPassword, newPassword } = req.body;
        const result = await userService.resetPassword(userId, oldPassword, newPassword);
        return sendSuccess(res, result);
    } catch (err) {
        if (err.statusCode) {
            return sendError(res, err.statusCode, err.message);
        }
        next(err);
    }
}

module.exports = { changeOwnEmail, resetOwnPassword };
