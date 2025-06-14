const mongoose = require('mongoose');
const { Schema } = mongoose;

const RangeSchema = new Schema({
    min: {
        type: Number,
        required: true,
        min: 18,
        max: 120
    },
    max: {
        type: Number,
        required: true,
        min: 18,
        max: 120
    }
}, { _id: false });

const HeightRangeSchema = new Schema({
    min: {
        type: Number,
        required: true,
        min: 120,
        max: 220
    },
    max: {
        type: Number,
        required: true,
        min: 120,
        max: 220
    }
}, { _id: false });

const ProfilePreferencesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    agePref: {
        type: RangeSchema,
        default: { min: 18, max: 120 }
    },
    genderPref: {
        type: [{
            type: String,
            enum: ['male', 'female', 'nonbinary']
        }],
        default: ['male', 'female', 'nonbinary']
    },
    havingChildrenPref: {
        type: [{
            type: String,
            enum: ['doesnt_want', 'want', 'has', 'maybe']
        }],
        default: ['doesnt_want', 'want', 'has', 'maybe']
    },
    educationPref: {
        type: [{
            type: String,
            enum: ['HS', 'BS', 'MS', 'PhD', 'Other']
        }],
        default: ['HS', 'BS', 'MS', 'PhD', 'Other']
    },
    heightPref: {
        type: HeightRangeSchema,
        default: { min: 120, max: 220 }
    },
    bodyTypePref: {
        type: [{
            type: String,
            enum: ['slim', 'average', 'athletic', 'curvy', 'fat', 'other']
        }],
        default: ['slim', 'average', 'athletic', 'curvy', 'fat', 'other']
    },
    rangePref: {
        type: Number,
        required: true,
        min: 10,
        max: 1000
    }
}, { timestamps: true });

module.exports = mongoose.model('ProfilePreferences', ProfilePreferencesSchema);
