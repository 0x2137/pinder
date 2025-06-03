const mongoose = require('mongoose');
const { Schema } = mongoose;

const MatchSchema = new Schema({
    userA: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userB: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    matchedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

MatchSchema.index({ userA: 1, userB: 1 }, { unique: true });

module.exports = mongoose.model('Match', MatchSchema);
