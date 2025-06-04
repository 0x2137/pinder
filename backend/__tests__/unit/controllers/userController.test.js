const httpMocks = require('node-mocks-http');
const userController = require('../../../src/controllers/userController');
const userService = require('../../../src/services/userService');

jest.mock('../../../src/services/userService');

describe('userController.changeOwnEmail', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'PATCH',
            url: '/api/users/email',
            userId: 'user123',
            body: { email: 'new@domain.com' },
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and return status/data wrapper on success', async () => {
        userService.changeEmail.mockResolvedValue({ message: 'Email updated' });

        await userController.changeOwnEmail(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: { message: 'Email updated' },
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should respond with error wrapper when changeEmail throws with statusCode', async () => {
        const error = new Error('Email already in use');
        error.statusCode = 409;
        userService.changeEmail.mockRejectedValue(error);

        await userController.changeOwnEmail(req, res, next);

        expect(res.statusCode).toBe(409);
        expect(res._getJSONData()).toEqual({
            status: 'error',
            message: 'Email already in use',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when changeEmail throws without statusCode', async () => {
        const error = new Error('Some unexpected error');
        userService.changeEmail.mockRejectedValue(error);

        await userController.changeOwnEmail(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});

describe('userController.resetOwnPassword', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = httpMocks.createRequest({
            method: 'PATCH',
            url: '/api/users/password',
            userId: 'user123',
            body: { oldPassword: 'old123', newPassword: 'new123' },
        });
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should respond with 200 and return status/data wrapper on success', async () => {
        userService.resetPassword.mockResolvedValue({ message: 'Password updated successfully' });

        await userController.resetOwnPassword(req, res, next);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            status: 'success',
            data: { message: 'Password updated successfully' },
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should respond with error wrapper when resetPassword throws with statusCode', async () => {
        const error = new Error('Passwords do not match');
        error.statusCode = 400;
        userService.resetPassword.mockRejectedValue(error);

        await userController.resetOwnPassword(req, res, next);

        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            status: 'error',
            message: 'Passwords do not match',
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next(err) when resetPassword throws without statusCode', async () => {
        const error = new Error('Some unexpected error');
        userService.resetPassword.mockRejectedValue(error);

        await userController.resetOwnPassword(req, res, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
