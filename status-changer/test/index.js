const mockery = require('mockery');
const path = require('path');
const {expect} = require('chai');

const ticker = async (value) => {
	await new Promise(process.nextTick);
	return value;
};

describe('status-changer', () => {
	let callback = null;

	before(() => {
		mockery.registerMock('@slack/client', {
			WebClient: class {
				constructor() {
					const handler = {
						get: (name, property) => {
							if (typeof callback === 'function') {
								return new Proxy((...args) => {
									return callback(property, ...args);
								}, handler);
							}
							return new Proxy({}, handler);
						}
					};
					return new Proxy({}, handler);
				}
			},
		});
		mockery.registerMock('download', async () => JSON.stringify(['tweet1', 'tweet2', 'tweet3']));
		mockery.registerMock('emoji-data', {
			all: () => [
				{short_name: 'emoji1'},
				{short_name: 'emoji2'},
			],
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

	it('toots something', async function () {
		this.timeout(10000);
		
		process.env.SLACK_TOKENS = 'TOKEN'

		const program = require('../index.js');

		await new Promise((resolve, reject) => {
			callback = (property) => {
				if (property === 'info') {
					resolve();
					return ticker({team: {name: 'team'}});
				}
			};
		});

		await new Promise((resolve, reject) => {
			callback = (property) => {
				if (property === 'list') {
					resolve();
					return ticker({
						emoji: {
							emoji3: '',
						},
					});
				}
			};
		});

		await new Promise((resolve, reject) => {
			callback = (property, data) => {
				if (property === 'set') {
					try {
						expect(data).to.have.own.property('profile');
						const profile = JSON.parse(data.profile);
						
						expect(profile.status_text).to.be.oneOf(['tweet1', 'tweet2', 'tweet3']);
						expect(profile.status_emoji).to.be.oneOf([
							':emoji1:',
							':emoji2:',
							':emoji3:',
						]);
						resolve();
					} catch (error) {
						reject(error);
					}
				}
			};
		});

		await program;
	});
});
