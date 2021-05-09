const fs = require('fs');
const path = require('path');

class WatchList {
	static async add(company) {
		const list = await WatchList.getAll();

		list[company.ticker] = company;

		return new Promise((resolve, reject) => {
			fs.writeFile(
				path.join(__dirname, '..', 'data', 'watch-list.json'),
				JSON.stringify(list),
				(err) => {
					if (err) reject(err);
					resolve(`company ${company.ticker} add`);
				}
			);
		});
	}

	static async getCompany(ticker) {
		const list = await WatchList.getAll();
		return list[ticker];
	}

	static async getAll() {
		return new Promise((resolve, reject) => {
			fs.readFile(
				path.join(__dirname, '..', 'data', 'watch-list.json'),
				'utf-8',
				(err, content) => {
					if (err) reject(err);
					resolve(JSON.parse(content));
				}
			);
		});
	}

	static async remove(companyKey) {
		const list = await WatchList.getAll();

		delete list[companyKey];

		return new Promise((resolve, reject) => {
			fs.writeFile(
				path.join(__dirname, '..', 'data', 'watch-list.json'),
				JSON.stringify(list),
				(err) => {
					if (err) reject(err);
					resolve(`company ${companyKey} add`);
				}
			);
		});
	}
}

module.exports = WatchList;
