const fs = require('fs');
const path = require('path');
const moment = require('moment');

class Candles {
	static async update(companyName, candles) {
		const list = await Candles.getAll();

		list[companyName].candles.push(...candles);
		list[companyName].candles = list[companyName].candles.sort((a, b) => {
			return moment(a.time).unix() - moment(b.time).unix();
		})

		return new Promise((resolve, reject) => {
			fs.writeFile(
				path.join(__dirname, '..', 'data', 'candles.json'),
				JSON.stringify(list),
				(err) => {
					if (err) reject(err);
					resolve(`candles ${companyName} add`);
				}
			);
		});
	}

	static async add(companyName, companyCandles) {
		const list = await Candles.getAll();

		list[companyName] = companyCandles;

		return new Promise((resolve, reject) => {
			fs.writeFile(
				path.join(__dirname, '..', 'data', 'candles.json'),
				JSON.stringify(list),
				(err) => {
					if (err) reject(err);
					resolve(`candles ${companyName} add`);
				}
			);
		});
	}

	static async getCompanyCandles(ticker) {
		const companyCandles = await Candles.getAll();
		return companyCandles[ticker];
	}

	static async getAll() {
		return new Promise((resolve, reject) => {
			fs.readFile(
				path.join(__dirname, '..', 'data', 'candles.json'),
				'utf-8',
				(err, content) => {
					if (err) reject(err);
					resolve(JSON.parse(content));
				}
			);
		});
	}
}

module.exports = Candles;
