const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../src/models/User');
const { createApp } = require('../../server');

let app;
let authToken;
let userId;

describe('Users Integration Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
        if (mongoose.connection.db) {
            await mongoose.connection.db.dropDatabase();
        }
        app = await createApp();
        const hashedPassword = await bcrypt.hash('initialPass123', 10);
        const user = await User.create({
            email: 'user1@example.com',
            passwordHash: hashedPassword
        });
        userId = user._id;
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'user1@example.com',
                password: 'initialPass123'
            });
        authToken = loginRes.body.data.accessToken;
    });

    afterAll(async () => {
        if (mongoose.connection.db) {
            await mongoose.connection.db.dropDatabase();
        }
        await mongoose.disconnect();
    });

    it('should change email', async () => {
        const response = await request(app)
            .put('/api/users/me/email')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                email: 'changed@example.com',
                currentPassword: 'initialPass123'
            });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        const updatedUser = await User.findById(userId);
        expect(updatedUser.email).toBe('changed@example.com');
    });

    it('should change password', async () => {
        const response = await request(app)
            .put('/api/users/me/password')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                oldPassword: 'initialPass123',
                newPassword: 'brandNewPass456'
            });
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('success');
        const loginRes2 = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'changed@example.com',
                password: 'brandNewPass456'
            });
        expect(loginRes2.status).toBe(200);
        expect(loginRes2.body.status).toBe('success');
        expect(loginRes2.body.data).toHaveProperty('accessToken');
    });
});
