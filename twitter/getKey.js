const request = require('request');
const open = require('open');
const CSON = require('cson');

const readline = require('readline');
const qs = require('querystring');
const fs = require('fs');

const config = CSON.parseCSONFile('config.cson');

const oauth = {
	callback: 'oob',
	consumer_key: config.oauth.consumer_key,
	consumer_secret: config.oauth.consumer_secret,
};

const url = 'https://api.twitter.com/oauth/request_token';

request.post({url, oauth}, (e, r, body) => {
	const access_token = qs.parse(body);
	const oauth = {
		oauth_token: access_token.oauth_token,
	};

	const url = `https://api.twitter.com/oauth/authenticate?${qs.stringify(oauth)}`;
	open(url);

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question('PIN? ', (PIN) => {
		rl.close();

		const oauth = {
			consumer_key: config.oauth.consumer_key,
			consumer_secret: config.oauth.consumer_secret,
			token: access_token.oauth_token,
			verifier: PIN,
		};

		const url = 'https://api.twitter.com/oauth/access_token';

		request.post({url, oauth}, (e, r, body) => {
			const tokens = qs.parse(body);

			const config = CSON.parseCSONFile('config.cson');
			config.oauth[tokens.screen_name] = tokens;

			const string = CSON.stringify(config);
			fs.writeFile('config.cson', string, () => {
				console.log('ok.');
			});
		});
	});
});
