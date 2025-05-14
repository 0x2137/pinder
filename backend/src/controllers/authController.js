const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken } = require('../utils/jwt');
const { tokenBlacklist } = require('../storage/inMemoryDb');

exports.register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (User.findByEmail(email)) {
            return res.status(409).json({ msg: 'Email already exists' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = User.create({ email, passwordHash });
        const token = signToken(user.id);
        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }
        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }
        const token = signToken(user.id);
        res.json({ token });
    } catch (err) {
        next(err);
    }
};

exports.logout = (req, res) => {
    tokenBlacklist.add(req.token);
    res.sendStatus(204);
};