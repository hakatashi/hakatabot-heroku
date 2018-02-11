const mockery = require('mockery');
const path = require('path');
const {expect} = require('chai');

const ticker = async (value) => {
	await new Promise(process.nextTick);
	return value;
};

describe('pawoo-tenho', () => {
	let callback = null;

	before(() => {
		mockery.registerMock('../utils/pawoo.js', {
			toot: (...args) => typeof callback === 'function' ? callback(...args) : undefined,
		});
		mockery.registerMock('./shangten.js', () => 0);
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

	it('toots something', async function() {
		this.timeout(30000);

		process.env.PAWOO_TENHO_TOKEN = 'pawoo-tenho-token';

		require('../index.js');

		await new Promise((resolve, reject) => {
			callback = ({accessToken, status, visibility, file}) => {
				try {
					expect(accessToken).to.equal('pawoo-tenho-token');
					expect(status).to.be.a('string');
					expect(status).to.have.string('配牌！');
					expect(status).to.have.string('人人人');
					expect(status).to.have.string('聴牌');
					expect(Buffer.isBuffer(file)).to.be.true;
					expect(visibility).to.equal('unlisted');
					resolve();
				} catch (error) {
					return reject(error);
				}

				return ticker({data: {url: 'https://pawoo.net/@tenho/114514'}});
			};
		});

		await new Promise((resolve, reject) => {
			callback = ({accessToken, status, visibility}) => {
				try {
					expect(accessToken).to.equal('pawoo-tenho-token');
					expect(status).to.be.a('string');
					expect(status).to.have.string('@hakatashi');
					expect(status).to.have.string('配牌！');
					expect(status).to.have.string('人人人');
					expect(status).to.have.string('聴牌');
					expect(status).to.have.string('https://pawoo.net/@tenho/114514');
					expect(visibility).to.equal('direct');
					resolve();
				} catch (error) {
					return reject(error);
				}

				return ticker({data: {url: 'https://pawoo.net/@tenho/114514'}});
			};
		});
	});
});
