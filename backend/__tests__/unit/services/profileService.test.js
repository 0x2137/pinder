const Profile = require('../../../src/models/Profile');
const { getProfileOrFail } = require('../../../src/utils/repositoryHelpers');
const profileService = require('../../../src/services/profileService');

jest.mock('../../../src/models/Profile');
jest.mock('../../../src/utils/repositoryHelpers');

describe('profileService.getOwnProfile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return the profile when it exists', async () => {
        const fakeProfile = { userId: 'u1', name: 'John' };
        getProfileOrFail.mockResolvedValue(fakeProfile);

        const result = await profileService.getOwnProfile('u1');
        expect(getProfileOrFail).toHaveBeenCalledWith('u1');
        expect(result).toEqual(fakeProfile);
    });

    it('should throw if getProfileOrFail throws', async () => {
        const error = new Error('No profile');
        getProfileOrFail.mockRejectedValue(error);

        await expect(profileService.getOwnProfile('u1')).rejects.toBe(error);
        expect(getProfileOrFail).toHaveBeenCalledWith('u1');
    });
});

describe('profileService.updateOwnProfile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should upsert a new profile when none exists', async () => {
        const newProfile = { userId: 'u3', name: 'Mark' };
        Profile.findOneAndUpdate.mockResolvedValue(newProfile);

        const data = { name: 'Mark' };
        const result = await profileService.updateOwnProfile('u3', data);

        expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
            { userId: 'u3' },
            { ...data, userId: 'u3' },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        expect(result).toEqual(newProfile);
    });
});

describe('profileService.addPicture', () => {
    afterEach(() => jest.clearAllMocks());

    it('adds picture and sets profilePicture when first', async () => {
        const profile = { pictures: [], profilePicture: 0, save: jest.fn() };
        getProfileOrFail.mockResolvedValue(profile);

        const result = await profileService.addPicture('u1', 'a.jpg');

        expect(getProfileOrFail).toHaveBeenCalledWith('u1');
        expect(profile.pictures).toEqual(['a.jpg']);
        expect(profile.profilePicture).toBe(0);
        expect(profile.save).toHaveBeenCalled();
        expect(result).toBe(profile);
    });
});

describe('profileService.removePicture', () => {
    afterEach(() => jest.clearAllMocks());

    it('throws when only one picture', async () => {
        const profile = { pictures: ['a.jpg'], save: jest.fn() };
        getProfileOrFail.mockResolvedValue(profile);

        await expect(profileService.removePicture('u1', 0)).rejects.toHaveProperty('statusCode', 400);
    });

    it('removes picture and updates profilePicture', async () => {
        const profile = { pictures: ['a.jpg', 'b.jpg'], profilePicture: 1, save: jest.fn() };
        getProfileOrFail.mockResolvedValue(profile);

        const result = await profileService.removePicture('u1', 1);

        expect(profile.pictures).toEqual(['a.jpg']);
        expect(profile.profilePicture).toBe(0);
        expect(profile.save).toHaveBeenCalled();
        expect(result).toBe(profile);
    });
});
