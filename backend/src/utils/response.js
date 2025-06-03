function sendSuccess(res, data = {}, statusCode = 200) {
    return res.status(statusCode).json({
        status: 'success',
        data
    });
}

function sendError(res, statusCode = 500, message = 'Something went wrong') {
    return res.status(statusCode).json({
        status: 'error',
        message
    });
}

module.exports = { sendSuccess, sendError };
