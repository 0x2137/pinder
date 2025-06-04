const bcrypt = require('bcryptjs');
const User = require('../../../src/models/User');
const { getUserOrFail } = require('../../../src/utils/repositoryHelpers');
const userService = require('../../../src/services/userService');

jest.mock('../../../src/models/User');
jest.mock('../../../src/utils/repositoryHelpers');

describe('userService.changeEmail', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if new email is already in use', async () => {
        User.exists.mockResolvedValue(true);

        await expect(userService.changeEmail('someUserId', 'taken@example.com')).rejects.toThrow(
            'Email already in use'
        );
        expect(User.exists).toHaveBeenCalledWith({ email: 'taken@example.com' });
        expect(getUserOrFail).not.toHaveBeenCalled();
    });

    it('should change email when new email is not in use', async () => {
        User.exists.mockResolvedValue(false);

        const fakeUser = {
            _id: 'user123',
            email: 'old@domain.com',
            save: jest.fn().mockResolvedValue(undefined),
        };
        getUserOrFail.mockResolvedValue(fakeUser);

        const result = await userService.changeEmail('user123', 'new@domain.com');
        expect(getUserOrFail).toHaveBeenCalledWith('user123');
        expect(fakeUser.email).toBe('new@domain.com');
        expect(fakeUser.save).toHaveBeenCalled();
        expect(result).toEqual({ message: 'Email updated' });
    });
});

describe('userService.resetPassword', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if passwords do not match', async () => {
        await expect(
            userService.resetPassword('user123', 'short', 'notMatching', 'oldHash')
        ).rejects.toThrow();
    });

    it('should throw an error if user not found', async () => {
        const err = new Error('User not found');
        err.statusCode = 404;
        getUserOrFail.mockRejectedValue(err);

        await expect(
            userService.resetPassword('user123', 'newPass123', 'newPass123', 'oldHash')
        ).rejects.toThrow('User not found');
        expect(getUserOrFail).toHaveBeenCalledWith('user123');
    });

    it('should update password when inputs are valid', async () => {
        const fakeUser = {
            _id: 'user123',
            passwordHash: 'oldHash',
            save: jest.fn().mockResolvedValue(undefined),
        };
        getUserOrFail.mockResolvedValue(fakeUser);

        bcrypt.compare = jest.fn().mockResolvedValue(true);
        bcrypt.hash = jest.fn().mockResolvedValue('newHashedPassword');

        const result = await userService.resetPassword('user123', 'newPass123', 'newPass123', 'oldHash');
        expect(getUserOrFail).toHaveBeenCalledWith('user123');
        expect(bcrypt.compare).toHaveBeenCalledWith('newPass123', 'oldHash');
        expect(bcrypt.hash).toHaveBeenCalledWith('newPass123', 10);
        expect(fakeUser.passwordHash).toBe('newHashedPassword');
        expect(fakeUser.save).toHaveBeenCalled();
        expect(result).toEqual({ message: 'Password updated successfully' });
    });
});
