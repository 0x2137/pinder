const httpMocks = require('node-mocks-http');
const profileController = require('../../../src/controllers/profileController');
const profileService = require('../../../src/services/profileService');

jest.mock('../../../src/services/profileService');

describe('profileController.getOwnProfile', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'GET',
            url: '/api/profiles',
            userId: 'user123',
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and return status/data wrapper on success', async () => {
        const fakeProfile = { userId: 'user123', name: 'John' };
        profileService.getOwnProfile.mockResolvedValue(fakeProfile);

        await profileController.getOwnProfile(req, res, next);

        expect(profileService.getOwnProfile).toHaveBeenCalledWith('user123');
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: { profile: fakeProfile }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should send error wrapper when service throws with statusCode', async () => {
        const error = new Error('Not found');
        error.statusCode = 404;
        profileService.getOwnProfile.mockRejectedValue(error);

        await profileController.getOwnProfile(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            status: 'error',
            message: 'Not found'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when service throws without statusCode', async () => {
        const error = new Error('Unexpected');
        profileService.getOwnProfile.mockRejectedValue(error);

        await profileController.getOwnProfile(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('profileController.updateOwnProfile', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'PATCH',
            url: '/api/profiles',
            userId: 'user123',
            body: { name: 'Alice' }
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and return status/data wrapper on success', async () => {
        const fakeProfile = { userId: 'user123', name: 'Alice' };
        profileService.updateOwnProfile.mockResolvedValue(fakeProfile);

        await profileController.updateOwnProfile(req, res, next);

        expect(profileService.updateOwnProfile).toHaveBeenCalledWith('user123', { name: 'Alice' });
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: { profile: fakeProfile }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should send error wrapper when service throws with statusCode', async () => {
        const error = new Error('Validation failed');
        error.statusCode = 400;
        profileService.updateOwnProfile.mockRejectedValue(error);

        await profileController.updateOwnProfile(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: 'error',
            message: 'Validation failed'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when service throws without statusCode', async () => {
        const error = new Error('Unexpected');
        profileService.updateOwnProfile.mockRejectedValue(error);

        await profileController.updateOwnProfile(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});


describe('profileController.uploadPicture', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/profiles/me/pictures',
            userId: 'user123'
        });
        req.file = { filename: 'a.jpg' };
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    it('returns updated profile on success', async () => {
        const profile = { pictures: ['a.jpg'] };
        profileService.addPicture.mockResolvedValue(profile);

        await profileController.uploadPicture(req, res, next);

        expect(profileService.addPicture).toHaveBeenCalledWith('user123', 'a.jpg');
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ status: 'success', data: { profile } });
        expect(next).not.toHaveBeenCalled();
    });
});

describe('profileController.deletePicture', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'DELETE',
            url: '/api/profiles/me/pictures/0',
            userId: 'user123',
            params: { index: '0' }
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => jest.clearAllMocks());

    it('returns updated profile on success', async () => {
        const profile = { pictures: [] };
        profileService.removePicture.mockResolvedValue(profile);

        await profileController.deletePicture(req, res, next);

        expect(profileService.removePicture).toHaveBeenCalledWith('user123', 0);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({ status: 'success', data: { profile } });
        expect(next).not.toHaveBeenCalled();
    });
});
