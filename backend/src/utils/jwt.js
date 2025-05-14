const jwt = require('jsonwebtoken');

const signToken = (userId) => {
    return jwt.sign(
        { sub: userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

module.exports = { signToken };