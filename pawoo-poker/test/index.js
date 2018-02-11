const mockery = require('mockery');
const path = require('path');
const {expect} = require('chai');

const ticker = async (value) => {
	await new Promise(process.nextTick);
	return value;
};

describe('pawoo-poker', () => {
	let callback = null;

	before(() => {
		mockery.registerMock('../utils/pawoo.js', {
			toot: (...args) => typeof callback === 'function' ? callback(...args) : undefined,
		});
		mockery.registerMock('fh-cards', {
			StandardDeck: class StandardDeck {
				shuffle() {
					return undefined;
				}
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
			callback = ({accessToken, status, visibility}) => {
				try {
					expect(accessToken).to.equal('hoge');
					expect(status).to.be.a('string');
					expect(status).to.have.string('ドロー！');
					expect(status).to.have.string('人人人');
					expect(status).to.have.string('ロイヤルストレートフラッシュ');
					expect(status).to.have.string('出来役');
					expect(visibility).to.equal('unlisted');
					resolve();
				} catch (error) {
					return reject(error);
				}

				return ticker({data: {url: 'https://pawoo.net/@poker/114514'}});
			};
		});

		await new Promise((resolve, reject) => {
			callback = ({accessToken, status, visibility}) => {
				try {
					expect(accessToken).to.equal('hoge');
					expect(status).to.be.a('string');
					expect(status).to.have.string('@hakatashi');
					expect(status).to.have.string('ドロー！');
					expect(status).to.have.string('人人人');
					expect(status).to.have.string('ロイヤルストレートフラッシュ');
					expect(status).to.have.string('出来役');
					expect(status).to.have.string('https://pawoo.net/@poker/114514');
					expect(visibility).to.equal('direct');
					resolve();
				} catch (error) {
					return reject(error);
				}

				return ticker({data: {url: 'https://pawoo.net/@poker/114514'}});
			};
		});
	});
});
