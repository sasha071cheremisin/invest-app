const {Router} = require('express');
const Api = require('../api');
const moment = require('moment');
const Candles = require('../models/candles');
const WatchList = require('../models/watchList');
const router = Router();

router.get('/updateBack', async (req, res) => {
	const company = await WatchList.getCompany('AMD');
	const {candles} = await Candles.getCompanyCandles(company.ticker);
	const toTime = moment.utc(candles[0].time);
	const fromTime = moment.utc(toTime).subtract(7, 'd');
	let result;

	const currentTime = moment.utc().toISOString()
	console.log('currentTime',currentTime);

	console.log('toTime',toTime);
	console.log('fromTime',fromTime);

	try {
		result = await Api.candlesGet({
			from: fromTime.subtract(3, 'h').toISOString(),
			to: toTime.subtract(3, 'h').toISOString(),
			figi: company.figi,
			interval: 'hour',
		});
		if (result) {
			result.candles.map(c => c.time = moment(c.time).add(3, 'h').toISOString());
			await Candles.update(company.name, result.candles);
			res.status(200);
			res.send(JSON.stringify(result));
		} else {
			// тут обработка ошибки
		}
	} catch (err) {
		console.log(err);
	}
})

router.get('/add', async (req, res) => {
	const company = await WatchList.getCompany('AMD');
	const to = moment.utc();
	const from = moment.utc().subtract(7, 'd');
	let result;

	try {
		result = await Api.candlesGet({
			from: from.toISOString(),
			to: to.toISOString(),
			figi: company.figi,
			interval: 'hour',
		});
		if (result) {
			result.candles.map(c => c.time = moment(c.time).add(3, 'hours').toISOString());
			await Candles.add(company.name, result);
			res.send(JSON.stringify(result));
		} else {
			// тут обработка ошибки
		}
	} catch (err) {
		console.log(err);
	}
})

router.post('/remove', async (req, res) => {
	try {
		const companyKey = req.body.value;
		if (companyKey) {
			await WatchList.remove(companyKey);
			res.send(JSON.stringify('Success remove'));
		} else {
			res.send(JSON.stringify('Not found company'));
		}
	} catch (err) {
		res.send(JSON.stringify('Error'));
	}
})

router.get('/', async (req, res) => {
	const watchList = await Candles.getAll();
	res.send(JSON.stringify(watchList));
})

router.get('/:name', async (req, res) => {
	const candles = await Candles.getCompanyCandles(req.params.name);
	if (candles) {
		res.send(JSON.stringify(candles));
	} else {
		res.send(JSON.stringify({}));
	}
})

module.exports = router;
