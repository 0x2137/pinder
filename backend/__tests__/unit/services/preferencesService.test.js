const ProfilePreferences = require('../../../src/models/ProfilePreferences');
const { getUserOrFail } = require('../../../src/utils/repositoryHelpers');
const preferencesService = require('../../../src/services/preferencesService');

jest.mock('../../../src/models/ProfilePreferences');
jest.mock('../../../src/utils/repositoryHelpers');

describe('preferencesService.getPreferences', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw 404 if getUserOrFail fails', async () => {
        const error = new Error('User not found');
        getUserOrFail.mockRejectedValue(error);

        await expect(preferencesService.getPreferences('u1'))
            .rejects
            .toBe(error);

        expect(getUserOrFail).toHaveBeenCalledWith('u1');
        expect(ProfilePreferences.findOne).not.toHaveBeenCalled();
    });

    it('should throw 404 if preferences not found', async () => {
        getUserOrFail.mockResolvedValue({ userId: 'u1' });
        ProfilePreferences.findOne.mockResolvedValue(null);

        await expect(preferencesService.getPreferences('u1'))
            .rejects
            .toMatchObject({ message: 'Preferences not found', statusCode: 404 });

        expect(ProfilePreferences.findOne).toHaveBeenCalledWith({ userId: 'u1' });
    });

    it('should return preferences when found', async () => {
        const fakePrefs = { userId: 'u1', agePref: { min: 20, max: 30 } };
        getUserOrFail.mockResolvedValue({ userId: 'u1' });
        ProfilePreferences.findOne.mockResolvedValue(fakePrefs);

        const result = await preferencesService.getPreferences('u1');
        expect(result).toEqual(fakePrefs);
        expect(ProfilePreferences.findOne).toHaveBeenCalledWith({ userId: 'u1' });
    });
});

describe('preferencesService.upsertPreferences', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw if getUserOrFail throws', async () => {
        const error = new Error('User missing');
        getUserOrFail.mockRejectedValue(error);

        await expect(preferencesService.upsertPreferences('u1', { agePref: { min: 18, max: 25 } }))
            .rejects
            .toBe(error);

        expect(getUserOrFail).toHaveBeenCalledWith('u1');
        expect(ProfilePreferences.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should upsert and return preferences', async () => {
        const fakePrefs = { userId: 'u1', agePref: { min: 18, max: 25 } };
        getUserOrFail.mockResolvedValue({ userId: 'u1' });
        ProfilePreferences.findOneAndUpdate.mockResolvedValue(fakePrefs);

        const data = { agePref: { min: 18, max: 25 } };
        const result = await preferencesService.upsertPreferences('u1', data);

        expect(ProfilePreferences.findOneAndUpdate).toHaveBeenCalledWith(
            { userId: 'u1' },
            { ...data, userId: 'u1' },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        expect(result).toEqual(fakePrefs);
    });
});
