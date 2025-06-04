const httpMocks = require('node-mocks-http');
const matchController = require('../../../src/controllers/matchController');
const matchService = require('../../../src/services/matchService');

jest.mock('../../../src/services/matchService');

describe('matchController.likeProfile', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/match/like',
            userId: 'user1',
            body: { candidateId: 'cand1' }
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and message on success', async () => {
        matchService.likeProfile.mockResolvedValue({ message: 'Profile liked' });

        await matchController.likeProfile(req, res, next);

        expect(matchService.likeProfile).toHaveBeenCalledWith('user1', 'cand1');
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: { message: 'Profile liked' }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should send error wrapper when service throws with statusCode', async () => {
        const error = new Error('Candidate profile not found');
        error.statusCode = 404;
        matchService.likeProfile.mockRejectedValue(error);

        await matchController.likeProfile(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            status: 'error',
            message: 'Candidate profile not found'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when service throws without statusCode', async () => {
        const error = new Error('Unexpected');
        matchService.likeProfile.mockRejectedValue(error);

        await matchController.likeProfile(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('matchController.rejectProfile', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/match/reject',
            userId: 'user1',
            body: { candidateId: 'cand2' }
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and message on success', async () => {
        matchService.rejectProfile.mockResolvedValue({ message: 'Profile rejected' });

        await matchController.rejectProfile(req, res, next);

        expect(matchService.rejectProfile).toHaveBeenCalledWith('user1', 'cand2');
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: { message: 'Profile rejected' }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should send error wrapper when service throws with statusCode', async () => {
        const error = new Error('Candidate profile not found');
        error.statusCode = 404;
        matchService.rejectProfile.mockRejectedValue(error);

        await matchController.rejectProfile(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            status: 'error',
            message: 'Candidate profile not found'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when service throws without statusCode', async () => {
        const error = new Error('Unexpected');
        matchService.rejectProfile.mockRejectedValue(error);

        await matchController.rejectProfile(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('matchController.getMatches', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'GET',
            url: '/api/match',
            userId: 'user1'
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and matches on success', async () => {
        const fakeMatches = [{ userId: 'u2' }, { userId: 'u3' }];
        matchService.getMatches.mockResolvedValue(fakeMatches);

        await matchController.getMatches(req, res, next);

        expect(matchService.getMatches).toHaveBeenCalledWith('user1');
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: { matches: fakeMatches }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should send error wrapper when service throws with statusCode', async () => {
        const error = new Error('No matches found');
        error.statusCode = 404;
        matchService.getMatches.mockRejectedValue(error);

        await matchController.getMatches(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            status: 'error',
            message: 'No matches found'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when service throws without statusCode', async () => {
        const error = new Error('Unexpected');
        matchService.getMatches.mockRejectedValue(error);

        await matchController.getMatches(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
