const request = require('supertest');
const mongoose = require('mongoose');
const { createApp } = require('../../server');

let app;

describe('Auth Integration Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
        if (mongoose.connection.db) {
            await mongoose.connection.db.dropDatabase();
        }
        app = await createApp();
    });

    afterAll(async () => {
        if (mongoose.connection.db) {
            await mongoose.connection.db.dropDatabase();
        }
        await mongoose.disconnect();
    });

    it('should register a new user', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(201);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('accessToken');
        expect(typeof response.body.data.accessToken).toBe('string');
    });

    it('should log in an existing user', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('accessToken');
        expect(typeof response.body.data.accessToken).toBe('string');
    });

    it('should refresh token via cookie', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        const cookies = loginRes.headers['set-cookie'];
        expect(Array.isArray(cookies)).toBe(true);

        const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
        expect(refreshCookie).toBeDefined();

        const response = await request(app)
            .post('/api/auth/refresh')
            .set('Cookie', refreshCookie)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        expect(response.body.data).toHaveProperty('accessToken');
        expect(typeof response.body.data.accessToken).toBe('string');
    });

    it('should log out a user via cookie', async () => {
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'testuser@example.com',
                password: 'password123'
            });

        const cookies = loginRes.headers['set-cookie'];
        expect(Array.isArray(cookies)).toBe(true);

        const refreshCookie = cookies.find(c => c.startsWith('refreshToken='));
        expect(refreshCookie).toBeDefined();

        const response = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', refreshCookie)
            .send();

        expect([200, 204]).toContain(response.status);
    });
});
