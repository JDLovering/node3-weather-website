const path = require('path');
const express = require('express');
const hbs = require('hbs');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express configs
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and vies location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather',
		name: 'James Lovering'
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Me',
		name: 'James Lovering'
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help',
		name: 'James Lovering',
		message: 'My message for help page'
	});
});

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: 'Address must be provided'
		});
	}
	const addressProvided = req.query.address;
	geocode(addressProvided, (error, { latitude, longitude, location } = {}) => {
		if (error) {
			return res.send({
				error
			});
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({
					error
				});
			}

			res.send({
				forecast: forecastData,
				location,
				address: addressProvided
			});
		});
	});
});

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term'
		});
	}

	console.log(req.query.search);
	res.send({
		products: []
	});
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'James Lovering',
		message: 'Help article not found'
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'James Lovering',
		message: 'Page not found'
	});
});

app.listen(3002, () => {
	console.log('Server is app on port 3002');
});
