const nock = require('nock');
const geocodeCity = require('../../../src/utils/geocoder').geocodeCity;

describe('geocodeCity', () => {
    afterEach(() => nock.cleanAll());

    it('returns lat/lon for known city', async () => {
        nock('https://nominatim.openstreetmap.org')
            .get(/search/)
            .reply(200, [{ lat: '52.23', lon: '21.01' }]);   // Warszawa

        const { lat, lng } = await geocodeCity('Warsaw');
        expect(lat).toBeCloseTo(52.23, 2);
        expect(lng).toBeCloseTo(21.01, 2);
    });

    it('throws when service returns empty list', async () => {
        nock('https://nominatim.openstreetmap.org')
            .get(/search/)
            .reply(200, []);

        await expect(geocodeCity('Nowhereville')).rejects.toThrow('Could not get geocode city');
    });
});
