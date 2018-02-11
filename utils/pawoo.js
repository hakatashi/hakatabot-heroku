const Masto = require('mastodon');

module.exports.toot = async ({accessToken, status, visibility, file}) => {
	const masto = new Masto({
		access_token: accessToken,
		api_url: 'https://pawoo.net/api/v1/',
	});

	if (!file) {
		return masto.post('statuses', {
			status,
			visibility,
		});
	}

	const response = await masto.post('media', {
		file: {
			value: file,
			options: {
				filename: 'test.png',
				contentType: 'image/png',
			},
		},
	});

	return masto.post('statuses', {
		status,
		visibility,
		media_ids: [response.data.id],
	});
};
