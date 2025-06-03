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
        type: String,
        enum: ['male', 'female', 'nonbinary', 'any'],
        default: 'any'
    },
    havingChildrenPref: {
        type: String,
        enum: ['doesnt_want', 'want', 'has', 'maybe', 'any'],
        default: 'any'
    },
    educationPref: {
        type: String,
        enum: ['HS', 'BS', 'MS', 'PhD', 'Other', 'any'],
        default: 'any'
    },
    heightPref: {
        type: HeightRangeSchema,
        default: { min: 120, max: 220 }
    },
    bodyTypePref: {
        type: String,
        enum: ['slim', 'average', 'athletic', 'curvy', 'fat', 'other', 'any'],
        default: 'any'
    },
    rangePref: {
        type: Number,
        required: true,
        min: 10,
        max: 1000
    }
}, { timestamps: true });

module.exports = mongoose.model('ProfilePreferences', ProfilePreferencesSchema);
