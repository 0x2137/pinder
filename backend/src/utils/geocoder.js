const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
    provider: 'openstreetmap',
    httpAdapter: 'https',
    formatter: null,
    headers: {
        // can be fake for now
        'User-Agent': 'pinder-backend/1.0 (kitten@example.com)'
    }
});

module.exports = {
    geocodeCity: async function(cityName) {
        const res = await geocoder.geocode(cityName);
        if (!res || res.length === 0) {
            const err = new Error('Could not get geocode city');
            err.statusCode = 400;
            throw err;
        }
        return { lat: res[0].latitude, lng: res[0].longitude };
    }
};
