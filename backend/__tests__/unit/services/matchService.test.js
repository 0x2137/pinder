const Profile = require('../../../src/models/Profile');
const Match = require('../../../src/models/Match');
const { getProfileOrFail } = require('../../../src/utils/repositoryHelpers');
const matchService = require('../../../src/services/matchService');

jest.mock('../../../src/models/Profile');
jest.mock('../../../src/models/Match');
jest.mock('../../../src/utils/repositoryHelpers');

describe('matchService.likeProfile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw 404 if my profile is not found', async () => {
        Profile.findOne.mockResolvedValue(null);
        await expect(matchService.likeProfile('u1', 'c1'))
            .rejects
            .toMatchObject({ message: 'My profile not found', statusCode: 404 });

        expect(Profile.findOne).toHaveBeenCalledWith({ userId: 'u1' });
    });

    it('should throw 404 if candidate profile is not found', async () => {
        Profile.findOne.mockResolvedValue({ userId: 'u1', _id: 'p1', liked: [], rejected: [] });
        Profile.findById.mockResolvedValue(null);

        await expect(matchService.likeProfile('u1', 'c1'))
            .rejects
            .toMatchObject({ message: 'Candidate profile not found', statusCode: 404 });

        expect(Profile.findById).toHaveBeenCalledWith('c1');
    });

    it('should throw 400 if already liked', async () => {
        const myself = {
            userId: 'u1',
            _id: 'p1',
            liked: ['c1'],
            rejected: [],
            save: jest.fn()
        };
        Profile.findOne.mockResolvedValue(myself);
        Profile.findById.mockResolvedValue({ userId: 'c1', _id: 'p2', liked: [], rejected: [] });

        await expect(matchService.likeProfile('u1', 'c1'))
            .rejects
            .toMatchObject({ message: 'Already liked this profile', statusCode: 400 });

        expect(myself.liked).toEqual(['c1']);
    });

    it('should create a match when candidate already liked me & no existing match', async () => {
        const myProfile = {
            userId: 'u1',
            _id: 'p1',
            liked: [],
            rejected: [],
            save: jest.fn()
        };
        const candidateProfile = {
            userId: 'u2',
            _id: 'p2',
            liked: ['p1'],
            rejected: []
        };

        Profile.findOne.mockResolvedValue(myProfile);
        Profile.findById.mockResolvedValue(candidateProfile);
        Match.findOne.mockResolvedValue(null);
        Match.create.mockResolvedValue({ userA: 'u1', userB: 'u2' });

        const result = await matchService.likeProfile('u1', 'c2');
        expect(myProfile.liked).toContain('c2');
        expect(myProfile.rejected).toEqual([]);
        expect(myProfile.save).toHaveBeenCalled();

        expect(Match.findOne).toHaveBeenCalledWith({
            userA: expect.any(String),
            userB: expect.any(String)
        });
        expect(Match.create).toHaveBeenCalledWith(expect.objectContaining({
            userA: expect.any(String),
            userB: expect.any(String)
        }));

        expect(result).toEqual({ message: 'Profile liked' });
    });

    it('should not create a new match if one already exists', async () => {
        const myProfile = {
            userId: 'u1',
            _id: 'p1',
            liked: [],
            rejected: [],
            save: jest.fn()
        };
        const candidateProfile = {
            userId: 'u2',
            _id: 'p2',
            liked: ['p1'],
            rejected: []
        };

        Profile.findOne.mockResolvedValue(myProfile);
        Profile.findById.mockResolvedValue(candidateProfile);

        Match.findOne.mockResolvedValue({ userA: 'u1', userB: 'u2' });
        Match.create.mockClear();

        const result = await matchService.likeProfile('u1', 'c2');
        expect(Match.findOne).toHaveBeenCalled();
        expect(Match.create).not.toHaveBeenCalled();
        expect(result).toEqual({ message: 'Profile liked' });
    });
});

describe('matchService.rejectProfile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw 404 if my profile is not found', async () => {
        Profile.findOne.mockResolvedValue(null);
        await expect(matchService.rejectProfile('u1', 'c1'))
            .rejects
            .toMatchObject({ message: 'My profile not found', statusCode: 404 });
    });

    it('should throw 404 if candidate profile is not found', async () => {
        Profile.findOne.mockResolvedValue({ userId: 'u1', _id: 'p1', liked: [], rejected: [] });
        Profile.findById.mockResolvedValue(null);

        await expect(matchService.rejectProfile('u1', 'c1'))
            .rejects
            .toMatchObject({ message: 'Candidate profile not found', statusCode: 404 });
    });

    it('should throw 400 if already rejected', async () => {
        const me = {
            userId: 'u1',
            _id: 'p1',
            liked: [],
            rejected: ['c1'],
            save: jest.fn()
        };
        Profile.findOne.mockResolvedValue(me);
        Profile.findById.mockResolvedValue({ userId: 'c1', _id: 'p2', liked: [], rejected: [] });

        await expect(matchService.rejectProfile('u1', 'c1'))
            .rejects
            .toMatchObject({ message: 'Already rejected this profile', statusCode: 400 });

        expect(me.rejected).toEqual(['c1']);
    });

    it('should reject a profile successfully', async () => {
        const me = {
            userId: 'u1',
            _id: 'p1',
            liked: ['c1'],
            rejected: [],
            save: jest.fn()
        };
        const candidateProfile = { userId: 'c1', _id: 'p2', liked: [], rejected: [] };

        Profile.findOne.mockResolvedValue(me);
        Profile.findById.mockResolvedValue(candidateProfile);

        const result = await matchService.rejectProfile('u1', 'c1');
        expect(me.rejected).toContain('c1');
        expect(me.liked).not.toContain('c1');
        expect(me.save).toHaveBeenCalled();
        expect(result).toEqual({ message: 'Profile rejected' });
    });
});

describe('matchService.getMatches', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return matched profiles when matches exist', async () => {
        getProfileOrFail.mockResolvedValue({ userId: 'u1' });

        const existingMatches = [
            { userA: 'u1', userB: 'u2' },
            { userA: 'u3', userB: 'u1' }
        ];
        Match.find.mockResolvedValue(existingMatches);
        
        Profile.find.mockResolvedValue([
            { userId: 'u2', name: 'Alice' },
            { userId: 'u3', name: 'Bob' }
        ]);

        const result = await matchService.getMatches('u1');
        expect(getProfileOrFail).toHaveBeenCalledWith('u1');
        expect(Match.find).toHaveBeenCalledWith({
            $or: [
                { userA: 'u1' },
                { userB: 'u1' }
            ]
        });
        expect(Profile.find).toHaveBeenCalledWith({ userId: { $in: ['u2', 'u3'] } });
        expect(result).toEqual([
            { userId: 'u2', name: 'Alice' },
            { userId: 'u3', name: 'Bob' }
        ]);
    });

    it('should throw if getProfileOrFail throws', async () => {
        const error = new Error('Not found');
        getProfileOrFail.mockRejectedValue(error);

        await expect(matchService.getMatches('u1'))
            .rejects
            .toBe(error);

        expect(getProfileOrFail).toHaveBeenCalledWith('u1');
        expect(Match.find).not.toHaveBeenCalled();
    });
});
