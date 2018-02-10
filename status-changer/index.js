require('dotenv').config();

const download = require('download');
const {WebClient} = require('@slack/client');
const emojiData = require('emoji-data');
const sample = require('lodash/sample');

const slackTokens = process.env.SLACK_TOKENS.split(':');

module.exports = (async () => {
	await new Promise(process.nextTick);

	const tweetsBuffer = await download(process.env.TWEETS_URL);
	const tweets = JSON.parse(tweetsBuffer);

	const emojis = emojiData.all();

	for (const slackToken of slackTokens) {
		const slack = new WebClient(slackToken);

		const {emoji: customEmojis} = await slack.emoji.list();
		const totalEmojis = [...emojis.map((e) => e.short_name), ...Object.keys(customEmojis)];

		await slack.users.profile.set({
			profile: JSON.stringify({
				status_text: sample(tweets),
				status_emoji: `:${sample(totalEmojis)}:`,
			}),
		});
	}
})();
