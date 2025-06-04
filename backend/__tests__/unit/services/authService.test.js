const bcrypt = require('bcryptjs');
const User = require('../../../src/models/User');
const { signAccessToken } = require('../../../src/utils/jwt');
const authService = require('../../../src/services/authService');

jest.mock('bcryptjs');
jest.mock('../../../src/models/User');
jest.mock('../../../src/utils/jwt', () => ({
    signAccessToken: jest.fn(),
}));

describe('authService.register', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if email is already in use', async () => {
        User.exists.mockResolvedValue(true);

        await expect(
            authService.register({
                email: 'taken@example.com',
                password: 'anyPassword',
                userAgent: 'UA',
                ip: '127.0.0.1',
            })
        ).rejects.toThrow('Email already in use');

        expect(User.exists).toHaveBeenCalledWith({ email: 'taken@example.com' });
        expect(bcrypt.hash).not.toHaveBeenCalled();
        expect(User.create).not.toHaveBeenCalled();
    });

    it('should create a new user, hash the password, and return tokens', async () => {
        User.exists.mockResolvedValue(false);
        bcrypt.hash.mockResolvedValue('hashedPassword123');

        const fakeUserDoc = {
            _id: 'newUserId',
            tokenVersion: 0,
            refreshTokens: [],
            save: jest.fn().mockResolvedValue(undefined),
        };
        User.create.mockResolvedValue(fakeUserDoc);
        signAccessToken.mockReturnValue('fakeAccessToken');

        const result = await authService.register({
            email: 'new@example.com',
            password: 'plainPassword',
            userAgent: 'MyUserAgent',
            ip: '10.0.0.1',
        });

        expect(result).toEqual({
            accessToken: 'fakeAccessToken',
            refreshToken: expect.any(String),
        });
        expect(User.exists).toHaveBeenCalledWith({ email: 'new@example.com' });
        expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 10);
        expect(User.create).toHaveBeenCalledWith({
            email: 'new@example.com',
            passwordHash: 'hashedPassword123',
        });
        expect(signAccessToken).toHaveBeenCalledWith('newUserId', 0);
        expect(fakeUserDoc.save).toHaveBeenCalled();
        expect(fakeUserDoc.refreshTokens.length).toBe(1);
        expect(typeof fakeUserDoc.refreshTokens[0].token).toBe('string');
    });
});

describe('authService.login', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an error if no user is found', async () => {
        User.findOne.mockResolvedValue(null);

        await expect(
            authService.login({
                email: 'notfound@example.com',
                password: 'doesntMatter',
                userAgent: 'UA',
                ip: '127.0.0.1',
            })
        ).rejects.toThrow('Invalid credentials');

        expect(User.findOne).toHaveBeenCalledWith({ email: 'notfound@example.com' });
        expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw an error if password does not match', async () => {
        const fakeUser = {
            _id: 'existingUserId',
            passwordHash: 'someHashValue',
            tokenVersion: 2,
            refreshTokens: [],
            save: jest.fn().mockResolvedValue(undefined),
        };
        User.findOne.mockResolvedValue(fakeUser);
        bcrypt.compare.mockResolvedValue(false);

        await expect(
            authService.login({
                email: 'user@example.com',
                password: 'wrongPassword',
                userAgent: 'UA',
                ip: '127.0.0.1',
            })
        ).rejects.toThrow('Invalid credentials');

        expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'someHashValue');
    });

    it('should return tokens when credentials are valid', async () => {
        const fakeUser = {
            _id: 'existingUserId',
            passwordHash: 'someHashValue',
            tokenVersion: 5,
            refreshTokens: [],
            save: jest.fn().mockResolvedValue(undefined),
        };
        User.findOne.mockResolvedValue(fakeUser);
        bcrypt.compare.mockResolvedValue(true);
        signAccessToken.mockReturnValue('validAccessToken');

        const result = await authService.login({
            email: 'user@example.com',
            password: 'correctPassword',
            userAgent: 'MyAgent',
            ip: '8.8.8.8',
        });

        expect(result).toEqual({
            accessToken: 'validAccessToken',
            refreshToken: expect.any(String),
        });
        expect(User.findOne).toHaveBeenCalledWith({ email: 'user@example.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('correctPassword', 'someHashValue');
        expect(signAccessToken).toHaveBeenCalledWith('existingUserId', 5);
        expect(fakeUser.save).toHaveBeenCalled();
        expect(fakeUser.refreshTokens.length).toBe(1);
        expect(typeof fakeUser.refreshTokens[0].token).toBe('string');
    });
});
