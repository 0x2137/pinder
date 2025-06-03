const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');

function validation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendError(res, 400, 'Validation failed: ' +
            errors.array().map(e => `${e.param} – ${e.msg}`).join('; ')
        );
    }
    next();
}

module.exports = validation;
