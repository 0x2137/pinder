const User = require('../models/User');

exports.getProfile = (req, res) => {
    const user = User.findById(req.userId);
    res.json({ profile: user.profile });
};

exports.updateProfile = (req, res) => {
    const user = User.findById(req.userId);
    user.updateProfile(req.body);
    res.json({ profile: user.profile });
};

exports.addPhoto = (req, res) => {
    const user = User.findById(req.userId);
    const url = `/uploads/${req.file.filename}`;
    user.profile.photos.push(url);
    res.status(201).json({ url });
};