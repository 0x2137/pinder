const mongoose = require('mongoose');
const { Schema } = mongoose;

const RefreshTokenSchema = new Schema({
    token: { type: String, required: true },
    userAgent: String,
    ip: String,
    expiresAt: Date,
    valid: { type: Boolean, default: true }
});

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
    refreshTokens: [RefreshTokenSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
