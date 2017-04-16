const Masto = require('mastodon');
const converter = require('unicode-playing-card-converter');
const {StandardDeck} = require('fh-cards');
const {Game, Hand} = require('ab-pokersolver');

const japaneseHandNames = {
	RoyalFlush: 'ロイヤルストレートフラッシュ',

};

const cardToAbbr = card => {
	if (card.value === 'O') {
		return 'X';
	} else if (card.rank === 9) {
		return `T${card.suit}`;
	} else {
		return card.toString();
	}
};

const masto = new Masto({
	access_token: process.env.PAWOO_POKER_TOKEN,
	api_url: 'https://pawoo.net/api/v1/',
});

const deck = new StandardDeck(1);
deck.shuffle();

const drawHand = deck.draws(7);
const drawHandUnicode = drawHand.map(card => converter(card.toString())).join('');

console.log(`Draw: ${drawHandUnicode} (${drawHand.map(card => card.toString()).join(', ')})`);

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
	japaneseName = 'ファイブ・オブ・ア・カインド';
} else if (hand.name === 'Straight Flush') {
	japaneseName = 'ストレートフラッシュ';
} else if (hand.name === 'Four of a Kind' || hand.name === 'Four of a Kind with Pair or Better') {
	japaneseName = 'フォー・オブ・ア・カインド';
} else if (hand.name === 'Full House') {
	japaneseName = 'フルハウス';
} else if (hand.name === 'Flush') {
	japaneseName = 'フラッシュ';
} else if (hand.name === 'Straight') {
	japaneseName = 'ストレート';
} else if (hand.name === 'Three of a Kind') {
	japaneseName = 'スリー・オブ・ア・カインド';
} else if (hand.name === 'Two Pair') {
	japaneseName = 'ツーペア';
} else if (hand.name === 'Pair') {
	japaneseName = 'ワンペア';
} else if (hand.name === 'High Card') {
	japaneseName = 'ノーペア';
} else {
	japaneseName = '???';
}

console.log(japaneseName);

/*
masto.post('statuses', {
	status: 'test',
	visibility: 'public',
});
*/
