const request  = require('supertest');
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../../src/models/User');
const { createApp } = require('../../server');

let app, authToken;

describe('Preferences – integration', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
        if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();
        app = await createApp();

        await User.create({
            email: 'pref@example.com',
            passwordHash: await bcrypt.hash('pass12345', 10)
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'pref@example.com', password: 'pass12345' });

        authToken = loginRes.body.data.accessToken;
    });

    afterAll(async () => {
        if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('creates preferences', async () => {
        const body = {
            agePref: { min: 25, max: 35 },
            genderPref: 'male',
            rangePref: 50
        };

        const res = await request(app)
            .post('/api/preferences')
            .set('Authorization', `Bearer ${authToken}`)
            .send(body);

        expect(res.status).toBe(200);
        expect(res.body.data.preferences).toMatchObject({ genderPref: 'male' });
    });

    it('gets preferences', async () => {
        const res = await request(app)
            .get('/api/preferences')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(res.body.data.preferences.rangePref).toBe(50);
    });

    it('updates preferences', async () => {
        const res = await request(app)
            .post('/api/preferences')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ rangePref: 75 });

        expect(res.status).toBe(200);
        expect(res.body.data.preferences.rangePref).toBe(75);
    });
});
