const request  = require('supertest');
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../../src/models/User');
const { createApp } = require('../../server');

jest.mock('../../src/utils/geocoder', () => ({
    geocodeCity: jest.fn().mockResolvedValue({ lat: 52.0, lng: 19.0 })
}));

let app, authToken, userId;

describe('Profiles – integration', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
        if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();
        app = await createApp();

        const user = await User.create({
            email: 'alice@example.com',
            passwordHash: await bcrypt.hash('secret123', 10)
        });
        userId = user._id;

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'alice@example.com', password: 'secret123' });

        authToken = loginRes.body.data.accessToken;
    });

    afterAll(async () => {
        if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('creates a new profile (upsert)', async () => {
        const body = {
            name: 'Alice',
            age: 30,
            gender: 'female',
            city: 'Warsaw',
            location: { type: 'Point', coordinates: [19.0, 52.0] },
            interests: ['tea', 'hiking'],
            havingChildren: 'maybe',
            education: 'BS',
            height: 170,
            bodyType: 'average'
        };

        const res = await request(app)
            .put('/api/profiles/me')
            .set('Authorization', `Bearer ${authToken}`)
            .send(body);

        expect(res.status).toBe(200);
        expect(res.body.data.profile).toMatchObject({ name: 'Alice', age: 30 });
    });

    it('returns own profile', async () => {
        const res = await request(app)
            .get('/api/profiles/me')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.profile).toHaveProperty('city', 'Warsaw');
    });

    it('updates a single field', async () => {
        const res = await request(app)
            .put('/api/profiles/me')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ bodyType: 'athletic' });

        expect(res.status).toBe(200);
        expect(res.body.data.profile.bodyType).toBe('athletic');
    });

    it('fetches profile by userId', async () => {
        const res = await request(app)
            .get(`/api/profiles/${userId}`)
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.profile).toHaveProperty('userId');
    });
});
