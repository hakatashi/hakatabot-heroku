const dotenv = require('dotenv');
const download = require('download');
const {WebClient} = require('@slack/client');
const emojiData = require('emoji-data');
const sample = require('lodash/sample');
const inRange = require('lodash/inRange');
const unicodeNames = require('unicode-11.0.0/Names');
const getWaka = require('./get-waka.js');

const derivedNames = [
	{start: 0x3400, end: 0x4DB5},
	{start: 0x4E00, end: 0x9FEA},
	{start: 0xF900, end: 0xFA6D},
	{start: 0xFA70, end: 0xFAD9},
	{start: 0x17000, end: 0x187EC},
	{start: 0x1B170, end: 0x1B2FB},
	{start: 0x20000, end: 0x2A6D6},
	{start: 0x2A700, end: 0x2B734},
	{start: 0x2B740, end: 0x2B81D},
	{start: 0x2B820, end: 0x2CEA1},
	{start: 0x2CEB0, end: 0x2EBE0},
	{start: 0x2F800, end: 0x2FA1D},
];

const unicodes = [...unicodeNames.entries()].filter(([codepoint, name]) => {
	if (name.includes('Private Use')) {
		return false;
	}

	if (name.includes('Hangul Syllable')) {
		return false;
	}

	for (const {start, end} of derivedNames) {
		if (inRange(codepoint, start, end + 1)) {
			return false;
		}
	}

	return true;
});

if (require.main === module) {
	dotenv.config();
}

const slackTokens = process.env.SLACK_TOKENS.split(':');

module.exports = (async () => {
	// For test
	await new Promise(process.nextTick);

	const tweetsBuffer = await download(process.env.TWEETS_URL);
	const tweets = JSON.parse(tweetsBuffer);
	const statusText = sample(tweets).replace(/\n/g, '　');

	const emojis = emojiData.all();

	for (const slackToken of slackTokens) {
		const slack = new WebClient(slackToken);

		const {team} = await slack.team.info();
		console.log(`Updating status for team ${team.name}...`);

		const {emoji: customEmojis} = await slack.emoji.list();
		const totalEmojis = [
			...emojis.map((e) => e.short_name),
			...Object.keys(customEmojis),
		];

		const statusEmoji = `:${sample(totalEmojis)}:`;

		const waka = await getWaka();
		const [unicodePoint, unicodeName] = sample(unicodes);
		const name = `U-${unicodePoint.toString(16).toUpperCase().padStart(4, '0')} ${unicodeName}`;

		await slack.users.profile.set({
			profile: JSON.stringify({
				title: waka,
				status_text: statusText,
				status_emoji: statusEmoji,
				real_name: name,
			}),
		});

		console.log(`New status: ${statusEmoji} ${statusText}`);
		console.log(`New title: ${waka}`);
		console.log(`New name: ${name}`);
	}
})();
