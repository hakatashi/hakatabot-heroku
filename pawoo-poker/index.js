const converter = require('unicode-playing-card-converter');
const {StandardDeck} = require('fh-cards');
const {Game, Hand} = require('ab-pokersolver');
const {stripIndents} = require('common-tags');
const SuddenDeath = require('sudden-death');

const pawoo = require('../utils/pawoo.js');

module.exports = (async () => {
	await new Promise(process.nextTick);

	const cardToAbbr = (card) => {
		if (card.value === 'O') {
			return 'X';
		} else if (card.rank === 9) {
			return `T${card.suit}`;
		}
		return card.toString();
	};

	const deck = new StandardDeck(1);
	deck.shuffle();

	const drawHand = deck.draws(7);
	const drawHandUnicode = drawHand
		.map((card) => converter(card.toString()))
		.join('');

	console.log(
		`Draw: ${drawHandUnicode} (${drawHand
			.map((card) => card.toString())
			.join(', ')})`
	);

	const game = new Game('paigowpokerhi');
	game.wildStatus = 1;
	game.wheelStatus = 0;
	const hand = Hand.solve(
		drawHand.map((card) => (card.suit === -1 ? 'Or' : card.toString())),
		'paigowpokerhi'
	);

	console.log(`Hand name: ${hand.name}`);
	console.log(`Hand description: ${hand.descr}`);
	console.log(
		`Hand cards: ${hand.cards.map((card) => cardToAbbr(card)).join(', ')}`
	);

	const completeHands = hand.cards.map((card) => cardToAbbr(card));

	for (const card of hand.cardPool) {
		if (completeHands.length < 5 && !completeHands.includes(cardToAbbr(card))) {
			completeHands.push(cardToAbbr(card));
		}
	}

	const completeHandsUnicode = completeHands
		.map((card) => converter(card))
		.join('');

	console.log(`Complete Hand: ${completeHandsUnicode}`);

	let japaneseName = null;
	let notification = false;

	if (hand.descr === 'Wild Royal Flush' || hand.descr === 'Royal Flush') {
		japaneseName = 'ロイヤルストレートフラッシュ';
		notification = true;
	} else if (hand.name === 'Five of a Kind') {
		japaneseName = 'ファイブカード';
		notification = true;
	} else if (hand.name === 'Straight Flush') {
		japaneseName = 'ストレートフラッシュ';
		notification = true;
	} else if (
		hand.name === 'Four of a Kind' ||
		hand.name === 'Four of a Kind with Pair or Better'
	) {
		japaneseName = 'フォーカード';
	} else if (hand.name === 'Full House') {
		japaneseName = 'フルハウス';
	} else if (hand.name === 'Flush') {
		japaneseName = 'フラッシュ';
	} else if (hand.name === 'Straight') {
		japaneseName = 'ストレート';
	} else if (hand.name === 'Three of a Kind') {
		japaneseName = 'スリーカード';
	} else if (hand.name === 'Two Pair') {
		japaneseName = 'ツーペア';
	} else if (hand.name === 'Pair') {
		japaneseName = 'ワンペア';
	} else if (hand.name === 'High Card') {
		japaneseName = 'ノーペア';
	} else {
		japaneseName = '???';
		notification = true;
	}

	console.log(`Japanese Name: ${japaneseName}`);

	const screamer = new SuddenDeath(japaneseName);

	const text = stripIndents`
		ドロー！
		${drawHandUnicode}

		${screamer.say()}

		出来役: ${completeHandsUnicode}
	`;

	console.log(
		`\n${
			stripIndents`
		Text to toot
		============

		${text}
	`}`
	);

	const {data: status} = await pawoo.toot({
		accessToken: process.env.PAWOO_POKER_TOKEN,
		status: text,
		visibility: 'unlisted',
	});

	if (notification) {
		await pawoo.toot({
			accessToken: process.env.PAWOO_POKER_TOKEN,
			status: stripIndents`
				@hakatashi
				${text}

				${status.url}
			`,
			visibility: 'direct',
		});
	}
})();
