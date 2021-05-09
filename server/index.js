const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const pino = require('express-pino-logger')();
const Api = require('./api');
const watchListRoutes = require('./routes/watchList');
const candlesRoutes = require('./routes/candles');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(pino);

app.use('/api/watchList', watchListRoutes);
app.use('/api/candles', candlesRoutes);

// app.get('/', async (req, res) => {
// 	const result = await Api.searchOne({ticker: 'AMD'});
// 	console.log(result);
// 	res.send(JSON.stringify(result));
// 	await WatchList.add(result);
// 	// fs.writeFile(
// 	// 	path.join(__dirname, '..', 'data', 'watch-list.json'),
// 	// 	JSON.stringify([1,2,3,4]),
// 	// 	(err) => {
// 	// 		if (err) reject(err);
// 	// 		resolve();
// 	// 	}
// 	// )
// })

app.get('/api/greeting', async (req, res) => {
	const name = req.query.name || 'World';
	res.setHeader('Content-Type', 'application/json');

	const to = moment();
	const from = moment().subtract(100, 'd');
	let result;
	try {
		result = await Api.candlesGet({
			from: from.toISOString(),
			to: to.toISOString(),
			figi: 'BBG000BBQCY0',
			interval: 'day',
		});
	} catch (err) {
		console.log(err);
	}

	res.send(JSON.stringify(result));
});

app.listen(3001, () =>
	console.log('Express server is running on localhost:3001')
);
