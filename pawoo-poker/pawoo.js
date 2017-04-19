const Masto = require('mastodon');

module.exports.toot = ({access_token, status, visibility}) => {
	const masto = new Masto({
		access_token,
		api_url: 'https://pawoo.net/api/v1/',
	});

	return masto.post('statuses', {
		status,
		visibility,
	});
};
