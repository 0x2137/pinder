const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function signAccessToken(userId, tokenVersion) {
    return jwt.sign(
        { sub: userId, tokenVersion },
        JWT_SECRET,
        { expiresIn: '15m' }
    );
}

module.exports = { signAccessToken };
