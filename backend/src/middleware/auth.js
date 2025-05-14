const jwt = require('jsonwebtoken');
const { tokenBlacklist } = require('../storage/inMemoryDb');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ msg: 'Token expired' });
    }
    try {
        const { sub } = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = sub;
        req.token = token;
        next();
    } catch {
        res.sendStatus(403);
    }
};
