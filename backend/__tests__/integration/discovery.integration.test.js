const request  = require('supertest');
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../../src/models/User');
const Profile  = require('../../src/models/Profile');
const { createApp } = require('../../server');

jest.mock('../../src/utils/geocoder', () => ({
    geocodeCity: jest.fn().mockResolvedValue({ lat: 52.0, lng: 19.0 })
}));

let app, authToken, profileB;

describe('Discovery – integration', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI);
        if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();
        app = await createApp();

        /** USER A **/
        const userA = await User.create({
            email: 'hunt@example.com',
            passwordHash: await bcrypt.hash('hunter2', 10)
        });
        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({ email: 'hunt@example.com', password: 'hunter2' });
        authToken = loginRes.body.data.accessToken;

        await Profile.create({
            userId: userA._id,
            name: 'Hunter',
            age: 29,
            gender: 'female',
            city: 'Warsaw',
            location: { type: 'Point', coordinates: [19.0, 52.0] },
            interests: ['tea', 'hiking'],
            havingChildren: 'maybe',
            education: 'BS',
            height: 165,
            bodyType: 'average'
        });

        await request(app)
            .post('/api/preferences')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                agePref: { min: 25, max: 35 },
                genderPref: ['male'],
                rangePref: 100
            });

        /** USER B – should match **/
        const userB = await User.create({
            email: 'bob@example.com',
            passwordHash: await bcrypt.hash('bobpass', 10)
        });
        profileB = await Profile.create({
            userId: userB._id,
            name: 'Bob',
            age: 30,
            gender: 'male',
            city: 'Warsaw',
            location: { type: 'Point', coordinates: [19.02, 52.02] },
            interests: ['tea'],
            havingChildren: 'maybe',
            education: 'BS',
            height: 180,
            bodyType: 'athletic'
        });

        /** USER C – out of range **/
        const userC = await User.create({
            email: 'far@example.com',
            passwordHash: await bcrypt.hash('farpass', 10)
        });
        await Profile.create({
            userId: userC._id,
            name: 'Far',
            age: 30,
            gender: 'male',
            city: 'Gdansk',
            location: { type: 'Point', coordinates: [18.6, 54.4] },
            interests: ['coding'],
            havingChildren: 'maybe',
            education: 'BS',
            height: 180,
            bodyType: 'athletic'
        });
    });

    it('returns only nearby & preference-matched profiles', async () => {
        const res = await request(app)
            .get('/api/discovery/near?radius=50')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        const { profiles } = res.body.data;
        expect(Array.isArray(profiles)).toBe(true);
        expect(profiles.length).toBe(1);
        expect(profiles[0]._id).toBe(profileB._id.toString());
    });

    afterAll(async () => {
        if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });
});
