const httpMocks = require('node-mocks-http');
const preferencesController = require('../../../src/controllers/preferencesController');
const preferencesService = require('../../../src/services/preferencesService');

jest.mock('../../../src/services/preferencesService');

describe('preferencesController.getPreferences', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'GET',
            url: '/api/preferences',
            userId: 'user1'
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and preferences on success', async () => {
        const fakePrefs = { agePref: { min: 20, max: 30 } };
        preferencesService.getPreferences.mockResolvedValue(fakePrefs);

        await preferencesController.getPreferences(req, res, next);

        expect(preferencesService.getPreferences).toHaveBeenCalledWith('user1');
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: { preferences: fakePrefs }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should send error wrapper when service throws with statusCode', async () => {
        const error = new Error('Preferences not found');
        error.statusCode = 404;
        preferencesService.getPreferences.mockRejectedValue(error);

        await preferencesController.getPreferences(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(res._getJSONData()).toEqual({
            status: 'error',
            message: 'Preferences not found'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when service throws without statusCode', async () => {
        const error = new Error('Unexpected');
        preferencesService.getPreferences.mockRejectedValue(error);

        await preferencesController.getPreferences(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('preferencesController.upsertPreferences', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/preferences',
            userId: 'user1',
            body: { agePref: { min: 20, max: 30 } }
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and preferences on success', async () => {
        const fakePrefs = { agePref: { min: 20, max: 30 } };
        preferencesService.upsertPreferences.mockResolvedValue(fakePrefs);

        await preferencesController.upsertPreferences(req, res, next);

        expect(preferencesService.upsertPreferences).toHaveBeenCalledWith('user1', { agePref: { min: 20, max: 30 } });
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: { preferences: fakePrefs }
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should send error wrapper when service throws with statusCode', async () => {
        const error = new Error('Invalid data');
        error.statusCode = 400;
        preferencesService.upsertPreferences.mockRejectedValue(error);

        await preferencesController.upsertPreferences(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: 'error',
            message: 'Invalid data'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when service throws without statusCode', async () => {
        const error = new Error('Unexpected');
        preferencesService.upsertPreferences.mockRejectedValue(error);

        await preferencesController.upsertPreferences(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
