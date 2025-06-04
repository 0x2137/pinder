const httpMocks = require('node-mocks-http');
const discoveryController = require('../../../src/controllers/discoveryController');
const discoveryService = require('../../../src/services/discoveryService');

jest.mock('../../../src/services/discoveryService');

describe('discoveryController.getNearbyProfiles', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'GET',
            url: '/api/discovery',
            userId: 'user1',
            query: { radius: '5', limit: '10', page: '2' }
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and profiles on success', async () => {
        const fakeProfiles = [{ userId: 'p1' }, { userId: 'p2' }];
        discoveryService.findMatchingProfiles.mockResolvedValue(fakeProfiles);

        await discoveryController.getNearbyProfiles(req, res, next);

        expect(discoveryService.findMatchingProfiles).toHaveBeenCalledWith({
            userId: 'user1',
            radiusInKm: 5,
            limit: 10,
            skip: 10
        });
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: { profiles: fakeProfiles }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should send error wrapper when service throws with statusCode', async () => {
        const error = new Error('Profile not found');
        error.statusCode = 404;
        discoveryService.findMatchingProfiles.mockRejectedValue(error);

        await discoveryController.getNearbyProfiles(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            status: 'error',
            message: 'Profile not found'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when service throws without statusCode', async () => {
        const error = new Error('Database down');
        discoveryService.findMatchingProfiles.mockRejectedValue(error);

        await discoveryController.getNearbyProfiles(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
        expect(res._isEndCalled()).toBe(false);
    });
});
