const {Router} = require('express');
const Api = require('../api');
const moment = require('moment');
const Candles = require('../models/candles');
const WatchList = require('../models/watchList');
const router = Router();

async function* generatorCandles(toTime, lastTime, figi) {
	let time = toTime;
	let result = [];
	while (time.diff(lastTime, 'd') > 0) {
		try {
			const fromTime = moment.utc(time).subtract(7, 'd');
			result = await Api.candlesGet({
				from: fromTime.subtract(3, 'h').toISOString(),
				to: time.subtract(3, 'h').toISOString(),
				figi: figi,
				interval: 'hour',
			});
			if (result) {
				result.candles.map(c => c.time = moment(c.time).add(3, 'h').toISOString());
				time.subtract(7, 'd')
				yield result.candles;
			} else {
				throw result;
			}
		} catch (err) {
			console.log(err);
		}
	}
}

router.get('/updateBack', async (req, res) => {
	const company = await WatchList.getCompany('AMD');
	const {candles} = await Candles.getCompanyCandles(company.ticker);
	const toTime = moment.utc(candles[0].time);
	const currentTime = moment.utc();
	const lastTime = moment.utc(toTime).subtract(1, 'y');
	let result = [];

	const generator = generatorCandles(toTime, lastTime, company.figi);

	for await (const candle of generator) {
		if (candle) {
			result.push(...candle)
		}
	}

	await Candles.update(company.name, result);

	res.status(200);
	res.send(JSON.stringify(result));
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
