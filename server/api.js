const OpenAPI = require('@tinkoff/invest-openapi-js-sdk');

const _apiURL = 'https://api-invest.tinkoff.ru/openapi';
const _socketURL = 'wss://api-invest.tinkoff.ru/openapi/md/v1/md-openapi/ws';
const Api = new OpenAPI({
	apiURL: encodeURI(_apiURL),
	secretToken: process.env.TOKEN,
	socketURL: encodeURI(_socketURL)
});

module.exports = Api;
