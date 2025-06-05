const request  = require('supertest');
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('../../src/models/User');
const Profile  = require('../../src/models/Profile');
const { createApp } = require('../../server');

let app;
let authToken;
let profileB, profileC;

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();

    app = await createApp();

    const userA = await User.create({
        email: 'a@example.com',
        passwordHash: await bcrypt.hash('aPassword', 10)
    });

    await Profile.create({
        userId: userA._id,
        name: 'Alice',
        age: 27,
        gender: 'female',
        city: 'Warsaw',
        location: { type: 'Point', coordinates: [19.0, 52.0] },
        interests: ['tea'],
        havingChildren: 'maybe',
        education: 'BS',
        height: 165,
        bodyType: 'average'
    });

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'a@example.com', password: 'aPassword' });

    authToken = loginRes.body.data.accessToken;

    const userB = await User.create({
        email: 'b@example.com',
        passwordHash: await bcrypt.hash('bPassword', 10)
    });

    profileB = await Profile.create({
        userId: userB._id,
        name: 'Bob',
        age: 28,
        gender: 'male',
        city: 'Poznan',
        location: { type: 'Point', coordinates: [16.9, 52.4] },
        interests: ['tea'],
        havingChildren: 'doesnt_want',
        education: 'BS',
        height: 180,
        bodyType: 'average'
    });

    const userC = await User.create({
        email: 'c@example.com',
        passwordHash: await bcrypt.hash('cPassword', 10)
    });

    profileC = await Profile.create({
        userId: userC._id,
        name: 'Cara',
        age: 30,
        gender: 'female',
        city: 'Gdansk',
        location: { type: 'Point', coordinates: [18.6, 54.4] },
        interests: ['coding'],
        havingChildren: 'maybe',
        education: 'MS',
        height: 168,
        bodyType: 'slim'
    });
});

afterAll(async () => {
    if (mongoose.connection.db) await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
});

describe('Match – integration', () => {
    it('likes a profile', async () => {
        const res = await request(app)
            .post('/api/match/like')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ candidateId: profileB._id.toString() });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
    });

    it('rejects another profile', async () => {
        const res = await request(app)
            .post('/api/match/reject')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ candidateId: profileC._id.toString() });

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('success');
    });

    it('returns matches list (array)', async () => {
        const res = await request(app)
            .get('/api/match')
            .set('Authorization', `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body.data.matches)).toBe(true);
    });
});
