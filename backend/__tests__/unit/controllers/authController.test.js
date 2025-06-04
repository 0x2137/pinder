const httpMocks = require('node-mocks-http');
const authController = require('../../../src/controllers/authController');
const authService = require('../../../src/services/authService');

jest.mock('../../../src/services/authService');

describe('authController.register', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/auth/register',
            body: { email: 'user@a.com', password: 'secret' },
            headers: { 'user-agent': 'TestAgent' },
            ip: '127.0.0.1',
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 201 and return status/data wrapper on success', async () => {
        authService.register.mockResolvedValue({
            accessToken: 'fakeAccess',
        });

        await authController.register(req, res, next);

        expect(res.statusCode).toBe(201);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: {
                accessToken: 'fakeAccess',
            },
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when service throws', async () => {
        const error = new Error('Email already in use');
        authService.register.mockRejectedValue(error);

        await authController.register(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('authController.login', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'POST',
            url: '/api/auth/login',
            body: { email: 'login@a.com', password: 'SECRET' },
            headers: { 'user-agent': 'TestAgent' },
            ip: '127.0.0.1',
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and return status/data wrapper on success', async () => {
        authService.login.mockResolvedValue({
            accessToken: 'loginAccess',
        });

        await authController.login(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: {
                accessToken: 'loginAccess',
            },
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when service throws', async () => {
        const error = new Error('Invalid credentials');
        authService.login.mockRejectedValue(error);

        await authController.login(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
