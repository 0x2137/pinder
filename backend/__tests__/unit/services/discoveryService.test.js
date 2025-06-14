const Profile = require('../../../src/models/Profile');
const ProfilePreferences = require('../../../src/models/ProfilePreferences');
const discoveryService = require('../../../src/services/discoveryService');

jest.mock('../../../src/models/Profile');
jest.mock('../../../src/models/ProfilePreferences');

describe('discoveryService.findMatchingProfiles', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw 404 if my profile is not found', async () => {
        Profile.findOne.mockResolvedValue(null);

        const args = { userId: 'user1', radiusInKm: 5, limit: 10, skip: 0 };
        await expect(discoveryService.findMatchingProfiles(args))
            .rejects
            .toMatchObject({ message: 'Profile not found', statusCode: 404 });

        expect(Profile.findOne).toHaveBeenCalledWith({ userId: 'user1' });
        expect(ProfilePreferences.findOne).not.toHaveBeenCalled();
    });

    it('should throw 404 if my preferences are not found', async () => {
        Profile.findOne.mockResolvedValue({ userId: 'user1', location: { coordinates: [10, 20] }, liked: [], rejected: [] });
        ProfilePreferences.findOne.mockResolvedValue(null);

        const args = { userId: 'user1', radiusInKm: 5, limit: 10, skip: 0 };
        await expect(discoveryService.findMatchingProfiles(args))
            .rejects
            .toMatchObject({ message: 'Preferences not found', statusCode: 404 });

        expect(Profile.findOne).toHaveBeenCalledWith({ userId: 'user1' });
        expect(ProfilePreferences.findOne).toHaveBeenCalledWith({ userId: 'user1' });
    });

    it('should return an array of matching profiles when everything exists', async () => {
        const fakeProfile = {
            userId: 'user1',
            location: { coordinates: [30, 40] },
            liked: [],
            rejected: [],
            interests: ['hiking'],
        };
        const fakePrefs = {
            userId: 'user1',
            agePref: { min: 18, max: 30 },
            genderPref: ['female'],
            havingChildrenPref: ['doesnt_want', 'want', 'has', 'maybe'],
            educationPref: ['HS', 'BS', 'MS', 'PhD', 'Other'],
            heightPref: { min: 150, max: 200 },
            bodyTypePref: ['slim', 'average', 'athletic', 'curvy', 'fat', 'other'],
            rangePref: 10,
        };
        Profile.findOne.mockResolvedValueOnce(fakeProfile);
        ProfilePreferences.findOne.mockResolvedValueOnce(fakePrefs);

        const fakeMatches = [
            { userId: 'user2' },
            { userId: 'user3' }
        ];
        const queryChain = {
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            then: jest.fn(fn => Promise.resolve(fakeMatches).then(fn)),
            catch: jest.fn()
        };
        Profile.find.mockReturnValue(queryChain);

        const args = { userId: 'user1' };
        const result = await discoveryService.findMatchingProfiles(args);

        expect(Profile.findOne).toHaveBeenCalledWith({ userId: 'user1' });
        expect(ProfilePreferences.findOne).toHaveBeenCalledWith({ userId: 'user1' });

        const calledQuery = Profile.find.mock.calls[0][0];
        expect(calledQuery.userId.$ne).toBe(fakeProfile.userId);
        expect(Array.isArray(calledQuery.userId.$nin)).toBe(true);

        expect(queryChain.skip).not.toHaveBeenCalled();
        expect(queryChain.limit).not.toHaveBeenCalled();
        expect(result).toEqual(fakeMatches);
    });
});
