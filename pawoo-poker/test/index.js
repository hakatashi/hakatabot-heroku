const mockery = require('mockery');
const path = require('path');
const {expect} = require('chai');

describe('pawoo-poker', () => {
	let callback = null;

	before(() => {
		mockery.registerMock('../utils/pawoo.js', {
			toot: async (...args) => {
				if (typeof callback === 'function') {
					return callback(...args);
				}
			},
		});
		mockery.registerMock('fh-cards', {
			StandardDeck: class StandardDeck {
				shuffle() {}

				draws() {
					return ['As', 'Ks', 'Qs', 'Js', 'Ts', '9s', '8s'];
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

		await new Promise((resolve, reject) => {
			callback = ({access_token, status, visibility}) => {
				try {
					expect(access_token).to.equal('hoge');
					expect(status).to.be.a('string');
					expect(status).to.have.string('ドロー！');
					expect(status).to.have.string('人人人');
					expect(status).to.have.string('ロイヤルストレートフラッシュ');
					expect(status).to.have.string('出来役');
					expect(visibility).to.equal('unlisted');
				} catch (error) {
					reject(error);
					return;
				}

				callback = ({access_token, status, visibility}) => {
					try {
						expect(access_token).to.equal('hoge');
						expect(status).to.be.a('string');
						expect(status).to.have.string('@hakatashi');
						expect(status).to.have.string('ドロー！');
						expect(status).to.have.string('人人人');
						expect(status).to.have.string('ロイヤルストレートフラッシュ');
						expect(status).to.have.string('出来役');
						expect(status).to.have.string('https://pawoo.net/@poker/114514');
						expect(visibility).to.equal('direct');
					} catch (error) {
						reject(error);
						return;
					}

					resolve();

					return {data: {url: 'https://pawoo.net/@poker/114514'}};
				};

				return {data: {url: 'https://pawoo.net/@poker/114514'}};
			};
		});
	});
});
