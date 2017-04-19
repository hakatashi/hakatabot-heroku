const converter = require('unicode-playing-card-converter');
const {StandardDeck} = require('fh-cards');
const {Game, Hand} = require('ab-pokersolver');
const {stripIndents} = require('common-tags');
const SuddenDeath = require('sudden-death');

const pawoo = require('./pawoo.js');

const cardToAbbr = card => {
	if (card.value === 'O') {
		return 'X';
	} else if (card.rank === 9) {
		return `T${card.suit}`;
	} else {
		return card.toString();
	}
};

const deck = new StandardDeck(1);
deck.shuffle();

const drawHand = deck.draws(7);
const drawHandUnicode = drawHand.map(card => converter(card.toString())).join('');

console.log(`Draw: ${drawHandUnicode} (${drawHand.map(card => card.toString()).join(', ')})`);

const game = new Game('paigowpokerhi');
game.wildStatus = 1;
game.wheelStatus = 0;
const hand = Hand.solve(drawHand.map(card => card.suit === -1 ? 'Or' : card.toString()), 'paigowpokerhi');

console.log(`Hand name: ${hand.name}`);
console.log(`Hand description: ${hand.descr}`);
console.log(`Hand cards: ${hand.cards.map(card => cardToAbbr(card)).join(', ')}`);

const completeHand = hand.cards.map(card => cardToAbbr(card));

hand.cardPool.forEach(card => {
	if (completeHand.length < 5 && !completeHand.includes(cardToAbbr(card))) {
		completeHand.push(cardToAbbr(card));
	}
});

const completeHandUnicode = completeHand.map(card => converter(card)).join('');

console.log(`Complete Hand: ${completeHandUnicode}`);

let japaneseName;

if (hand.descr === 'Wild Royal Flush' || hand.descr === 'Royal Flush') {
	japaneseName = 'ロイヤルストレートフラッシュ';
} else if (hand.name === 'Five of a Kind') {
	japaneseName = 'ファイブカード';
} else if (hand.name === 'Straight Flush') {
	japaneseName = 'ストレートフラッシュ';
} else if (hand.name === 'Four of a Kind' || hand.name === 'Four of a Kind with Pair or Better') {
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
}

console.log(`Japanese Name: ${japaneseName}`);

const screamer = new SuddenDeath(japaneseName);

const text = stripIndents`
	ドロー！
	${drawHandUnicode}

	${screamer.say()}

	出来役: ${completeHandUnicode}
`;

console.log('\n' + stripIndents`
	Text to toot
	============

	${text}
`);

pawoo.toot({
	access_token: process.env.PAWOO_POKER_TOKEN,
	status: text,
	visibility: 'public',
});
