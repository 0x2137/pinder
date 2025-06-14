const Profile = require('../models/Profile');
const ProfilePreferences = require('../models/ProfilePreferences');

async function findMatchingProfiles({ userId, radiusInKm, limit, skip }) {
    const myProfile = await Profile.findOne({ userId });
    if (!myProfile) {
        const err = new Error('Profile not found');
        err.statusCode = 404;
        throw err;
    }

    const myPrefs = await ProfilePreferences.findOne({ userId });
    if (!myPrefs) {
        const err = new Error('Preferences not found');
        err.statusCode = 404;
        throw err;
    }

    const query = {};

    if (myPrefs.agePref) {
        query.age = {
            $gte: myPrefs.agePref.min,
            $lte: myPrefs.agePref.max
        };
    }

    if (myPrefs.genderPref && myPrefs.genderPref.length > 0) {
        query.gender = { $in: myPrefs.genderPref };
    }

    if (myPrefs.havingChildrenPref && myPrefs.havingChildrenPref.length > 0) {
        query.havingChildren = { $in: myPrefs.havingChildrenPref };
    }

    if (myPrefs.educationPref && myPrefs.educationPref.length > 0) {
        query.education = { $in: myPrefs.educationPref };
    }

    if (myPrefs.heightPref) {
        query.height = {
            $gte: myPrefs.heightPref.min,
            $lte: myPrefs.heightPref.max
        };
    }

    if (myPrefs.bodyTypePref && myPrefs.bodyTypePref.length > 0) {
        query.bodyType = { $in: myPrefs.bodyTypePref };
    }

    if (Array.isArray(myProfile.interests) && myProfile.interests.length > 0) {
        query.interests = { $in: myProfile.interests };
    }

    const [myLng, myLat] = myProfile.location.coordinates;
    const maxDistMeters = (radiusInKm !== undefined ? radiusInKm : myPrefs.rangePref) * 1000;
    query.location = {
        $nearSphere: {
            $geometry: {
                type: 'Point',
                coordinates: [myLng, myLat]
            },
            $maxDistance: maxDistMeters
        }
    };

    query.userId = { $ne: myProfile.userId };

    query.userId.$nin = [
        ...myProfile.liked.map(id => id.toString()),
        ...myProfile.rejected.map(id => id.toString())
    ];

    const cursor = Profile.find(query);

    if (typeof skip === 'number') {
        cursor.skip(skip);
    }
    if (typeof limit === 'number') {
        cursor.limit(limit);
    }

    const matches = await cursor;
    return matches;
}

module.exports = { findMatchingProfiles };
