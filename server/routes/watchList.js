const {Router} = require('express');
const Api = require('../api');
const WatchList = require('../models/watchList');
const router = Router();

router.post('/add', async (req, res) => {
	try {
		const result = await Api.searchOne({ticker: req.body.value});
		if (result) {
			await WatchList.add(result);
			res.send(JSON.stringify('Success add'));
		} else {
			res.send(JSON.stringify('Not found'));
		}
	} catch (err) {
		res.send(JSON.stringify('Error'));
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

//
// router.delete('/remove/:id', async (req, res) => {
// 	const card = await Card.remove(req.params.id);
// 	res.status(200).json(card);
// })

router.get('/', async (req, res) => {
	const watchList = await WatchList.getAll();
	res.send(JSON.stringify(watchList));
})

module.exports = router;
