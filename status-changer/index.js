const dotenv = require('dotenv');
const download = require('download');
const {WebClient} = require('@slack/client');
const emojiData = require('emoji-data');
const sample = require('lodash/sample');

if (require.main === module) {
	dotenv.config();
}

const slackTokens = process.env.SLACK_TOKENS.split(':');

module.exports = (async () => {
	// For test
	await new Promise(process.nextTick);

	const tweetsBuffer = await download(process.env.TWEETS_URL);
	const tweets = JSON.parse(tweetsBuffer);

	const emojis = emojiData.all();

	for (const slackToken of slackTokens) {
		const slack = new WebClient(slackToken);

		const {team} = await slack.team.info();
		console.log(`Updating status for team ${team.name}...`);

		const {emoji: customEmojis} = await slack.emoji.list();
		const totalEmojis = [...emojis.map((e) => e.short_name), ...Object.keys(customEmojis)];

		const statusText = sample(tweets).replace(/\n/g, '　');
		const statusEmoji = `:${sample(totalEmojis)}:`;

		await slack.users.profile.set({
			profile: JSON.stringify({
				status_text: statusText,
				status_emoji: statusEmoji,
			}),
		});

		console.log(`New status: ${statusEmoji} ${statusText}`);
	}
})();
