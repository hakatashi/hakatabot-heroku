const mockery = require('mockery');
const path = require('path');
const {expect} = require('chai');

describe('pawoo-poker', () => {
	let callback = null;

	before(() => {
		mockery.registerMock('../utils/pawoo.js', {
			toot: (...args) => {
				if (typeof callback === 'function') {
					callback(...args);
				}
			},
		});
	});

	beforeEach(() => {
		callback = null;
		mockery.enable({
			warnOnUnregistered: false,
		});
	});

	afterEach(() => {
		delete require.cache[path.resolve(__dirname, '../index.js')];
		mockery.disable();
	});

	it('toots something', async () => {
		process.env.PAWOO_POKER_TOKEN = 'hoge';

		require('../index.js');

		await new Promise((resolve) => {
			callback = ({access_token, status, visibility}) => {
				expect(access_token).to.equal('hoge');
				expect(status).to.be.a('string');
				expect(status).to.have.string('ドロー！');
				expect(status).to.have.string('人人人');
				expect(status).to.have.string('出来役');
				expect(visibility).to.equal('unlisted');

				delete process.env.PAWOO_POKER_TOKEN;
				resolve();
			};
		});
	});
});
