const request = require('request');

const qeocode = (address, callback) => {
	const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
		address
	)}.json?access_token=pk.eyJ1IjoiYmFzdGluZGExOCIsImEiOiJja2RqOXBrbXkwM2l2MnltbzIyNGo0bzFlIn0.rcPDjvCwca0GCAuENGh5xQ&limit=1`;

	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback('Unable to connect to location services!', undefined);
		} else if (body.features.length === 0) {
			callback('Unable to find location! Try enother search', undefined);
		} else {
			callback(undefined, {
				latitude: body.features[0].center[1],
				longitude: body.features[0].center[0],
				location: body.features[0].place_name
			});
		}
	});
};

module.exports = qeocode;
