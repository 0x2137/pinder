const bcrypt = require('bcryptjs');
const { fakerPL } = require('@faker-js/faker');
const User = require('../models/User');
const Profile = require('../models/Profile');
const ProfilePreferences = require('../models/ProfilePreferences');
const { connectDB } = require('../config/db');
const geocoder = require('../utils/geocoder');

const INTERESTS_LIST = [
    'Sport', 'Movies', 'Books'
];

const GENDER_PREFS      = ['male', 'female', 'nonbinary', 'any'];
const CHILDREN_PREFS    = ['doesnt_want', 'want', 'has', 'maybe', 'any'];
const EDUCATION_PREFS   = ['HS', 'BS', 'MS', 'PhD', 'Other', 'any'];
const BODY_TYPE_PREFS   = ['slim', 'average', 'athletic', 'curvy', 'fat', 'other', 'any'];

async function seed(count = 20) {
    await connectDB();

    await User.deleteMany({});
    await Profile.deleteMany({});
    await ProfilePreferences.deleteMany({});

    for (let i = 0; i < count; i++) {
        const email = fakerPL.internet.email().toLowerCase();
        const passwordHash = await bcrypt.hash('password123', 10);

        const user = new User({ email, passwordHash });
        const refreshTokenData = {
            token: fakerPL.string.uuid(),
            userAgent: 'Seeder',
            ip: '127.0.0.1',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            valid: true
        };
        user.refreshTokens.push(refreshTokenData);
        await user.save();

        const city = 'Warsaw';
        let lat = 0, lng = 0;
        try {
            const coords = await geocoder.geocodeCity(city);
            lat = coords.lat;
            lng = coords.lng;
        } catch {
            lat = 0;
            lng = 0;
        }

        const numInterests = fakerPL.number.int({ min: 2, max: 5 });
        const interests = fakerPL.helpers.arrayElements(INTERESTS_LIST, numInterests);

        const profile = new Profile({
            userId: user._id,
            name: fakerPL.person.firstName(),
            age: fakerPL.number.int({ min: 18, max: 60 }),
            gender: fakerPL.helpers.arrayElement(['male', 'female', 'nonbinary']),
            city,
            about: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            location: {
                type: 'Point',
                coordinates: [lng, lat]
            },
            interests: interests,
            havingChildren: fakerPL.helpers.arrayElement(['doesnt_want', 'want', 'has', 'maybe']),
            education: fakerPL.helpers.arrayElement(['HS', 'BS', 'MS', 'PhD', 'Other']),
            height: fakerPL.number.int({ min: 175, max: 185 }),
            bodyType: fakerPL.helpers.arrayElement(['slim', 'average', 'athletic', 'curvy', 'fat', 'other']),
            liked: [],
            rejected: []
        });
        await profile.save();

        const prefs = new ProfilePreferences({
            userId: user._id,
            agePref: { min: 18, max: 99 },
            genderPref: ['male', 'female', 'nonbinary'],
            havingChildrenPref: ['doesnt_want', 'want', 'has', 'maybe'],
            educationPref: ['HS', 'BS', 'MS', 'PhD', 'Other'],
            heightPref: { min: 175, max: 185 },
            bodyTypePref: ['slim', 'average', 'athletic', 'curvy', 'fat', 'other'],
            rangePref: 100
        });
        await prefs.save();
    }

    console.log(`Seeded ${count} records`);
    process.exit(0);
}

if (require.main === module) {
    const argCount = parseInt(process.argv[2], 10);
    const seedCount = Number.isInteger(argCount) && argCount > 0 ? argCount : 20;
    seed(seedCount).catch(err => {
        console.error('Seeding went wrong', err);
        process.exit(1);
    });
}

module.exports = seed;
