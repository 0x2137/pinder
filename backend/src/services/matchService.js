const Profile = require('../models/Profile');
const Match = require('../models/Match');
const { getProfileOrFail } = require('../utils/repositoryHelpers');

async function likeProfile(userId, candidateId) {
    const myProfile = await Profile.findOne({ userId });
    if (!myProfile) {
        const err = new Error('My profile not found');
        err.statusCode = 404;
        throw err;
    }

    const candidateProfile = await Profile.findById(candidateId);
    if (!candidateProfile) {
        const err = new Error('Candidate profile not found');
        err.statusCode = 404;
        throw err;
    }

    if (myProfile.liked.map(id => id.toString()).includes(candidateId)) {
        const err = new Error('Already liked this profile');
        err.statusCode = 400;
        throw err;
    }

    myProfile.liked.push(candidateId);
    myProfile.rejected = myProfile.rejected.filter(id => id.toString() !== candidateId);
    await myProfile.save();

    if (candidateProfile.liked.map(id => id.toString()).includes(myProfile._id.toString())) {
        const idA = myProfile.userId.toString();
        const idB = candidateProfile.userId.toString();
        const userA = idA < idB ? myProfile.userId : candidateProfile.userId;
        const userB = idA < idB ? candidateProfile.userId : myProfile.userId;

        const existingMatch = await Match.findOne({ userA, userB });
        if (!existingMatch) {
            await Match.create({ userA, userB });
        }
    }

    return { message: 'Profile liked' };
}

async function rejectProfile(userId, candidateId) {
    const myProfile = await Profile.findOne({ userId });
    if (!myProfile) {
        const err = new Error('My profile not found');
        err.statusCode = 404;
        throw err;
    }

    const candidateProfile = await Profile.findById(candidateId);
    if (!candidateProfile) {
        const err = new Error('Candidate profile not found');
        err.statusCode = 404;
        throw err;
    }

    if (myProfile.rejected.map(id => id.toString()).includes(candidateId)) {
        const err = new Error('Already rejected this profile');
        err.statusCode = 400;
        throw err;
    }

    myProfile.rejected.push(candidateId);
    myProfile.liked = myProfile.liked.filter(id => id.toString() !== candidateId);
    await myProfile.save();

    return { message: 'Profile rejected' };
}

async function getMatches(userId) {
    await getProfileOrFail(userId);

    const matches = await Match.find({
        $or: [
            { userA: userId },
            { userB: userId }
        ]
    });

    const matchedUserIds = matches.map(match =>
        match.userA.toString() === userId ? match.userB : match.userA
    );

    const matchedProfiles = await Profile.find({ userId: { $in: matchedUserIds } });
    return matchedProfiles;
}

module.exports = { likeProfile, rejectProfile, getMatches };
