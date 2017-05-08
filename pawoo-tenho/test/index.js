const mockery = require('mockery');
const path = require('path');
const {expect} = require('chai');

describe('pawoo-tenho', () => {
	let callback = null;

	before(() => {
		mockery.registerMock('../utils/pawoo.js', {
			toot: async (...args) => {
				if (typeof callback === 'function') {
					return callback(...args);
				}
			},
		});
		mockery.registerMock('./shangten.js', () => 1);
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

	it('toots something', async function () {
		this.timeout(10000);

		process.env.PAWOO_TENHO_TOKEN = 'pawoo-tenho-token';

		const program = require('../index.js');

		await new Promise((resolve, reject) => {
			callback = ({access_token, status, visibility, file}) => {
				try {
					expect(access_token).to.equal('pawoo-tenho-token');
					expect(status).to.be.a('string');
					expect(status).to.have.string('配牌！');
					expect(status).to.have.string('人人人');
					expect(status).to.have.string('一向聴');
					expect(Buffer.isBuffer(file)).to.be.true;
					expect(visibility).to.equal('unlisted');
					resolve();
				} catch (error) {
					reject(error);
				}

				return {data: {url: 'https://pawoo.net/@tenho/114514'}};
			};
		});

		await new Promise((resolve, reject) => {
			callback = ({access_token, status, visibility}) => {
				try {
					expect(access_token).to.equal('pawoo-tenho-token');
					expect(status).to.be.a('string');
					expect(status).to.have.string('@hakatashi');
					expect(status).to.have.string('配牌！');
					expect(status).to.have.string('人人人');
					expect(status).to.have.string('一向聴');
					expect(status).to.have.string('https://pawoo.net/@tenho/114514');
					expect(visibility).to.equal('direct');
					resolve();
				} catch (error) {
					reject(error);
				}

				return {data: {url: 'https://pawoo.net/@tenho/114514'}};
			};
		});

		await program;
	});
});
