const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
        match: /^[\p{L}]+$/u
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max: 120
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'nonbinary']
    },
    city: {
        type: String,
        required: true
    },
    about: {
        type: String,
        minlength: 2,
        maxlength: 250
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    interests: {
        type: [String],
        default: [],
        validate: {
            validator: arr =>
                Array.isArray(arr) &&
                arr.every(str => typeof str === 'string' && str.length >= 2),
            message: 'Each interest must be a string of at least 2 characters'
        }
    },
    havingChildren: {
        type: String,
        required: true,
        enum: ['doesnt_want', 'want', 'has', 'maybe']
    },
    education: {
        type: String,
        required: true,
        enum: ['HS', 'BS', 'MS', 'PhD', 'Other']
    },
    height: {
        type: Number,
        required: true,
        min: 120,
        max: 250
    },
    bodyType: {
        type: String,
        required: true,
        enum: ['slim', 'average', 'athletic', 'curvy', 'fat', 'other']
    },
    pictures: {
        type: [String],
        default: []
    },
    profilePicture: {
        type: Number,
        default: 0
    },
    liked: [
        { type: Schema.Types.ObjectId, ref: 'Profile' }
    ],
    rejected: [
        { type: Schema.Types.ObjectId, ref: 'Profile' }
    ]
}, { timestamps: true });

ProfileSchema.index({ location: '2dsphere' });

ProfileSchema.methods.updateProfile = function(data) {
    Object.entries(data).forEach(([key, value]) => {
        if (this.schema.path(key)) this[key] = value;
    });
    return this.save();
};

module.exports = mongoose.model('Profile', ProfileSchema);
