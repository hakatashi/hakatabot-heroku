const {stripIndents} = require('common-tags');
const SuddenDeath = require('sudden-death');
const shuffle = require('shuffle-array');

const pawoo = require('../utils/pawoo.js');
const calcShangten = require('./shangten.js');
const {is九種九牌, is十三不塔, is十三無靠} = require('./hands.js');
const generateImage = require('./generateImage.js');

const scream = (text) => {
	const suddenDeath = new SuddenDeath(text);
	return suddenDeath.say();
}

const 麻雀牌 = Array.from({length: 136}, (e, i) => (
	String.fromCodePoint(0x1F000 + Math.floor(i / 4))
));

const 配牌 = shuffle(麻雀牌).slice(0, 14);
const 向聴Number = calcShangten(配牌);

const 配牌String = `${配牌.slice(0, 13).join('')} ${配牌[13]}`;

let text;

if (向聴Number === -1) {
	text = stripIndents`
		配牌！
		${配牌String}

		ロン！

		${scream(scream('天和'))}
	`;
} else if (is十三不塔(配牌)) {
	text = stripIndents`
		配牌！
		${配牌String}

		ツモ！

		${scream(scream('十三不塔'))}
	`;
} else if (is十三無靠(配牌)) {
	text = stripIndents`
		配牌！
		${配牌String}

		ツモ！

		${scream(scream('十三無靠'))}
	`;
} else if (is九種九牌(配牌)) {
	text = stripIndents`
		配牌！
		${配牌String}

		${scream('九種九牌')}
	`;
} else {
	const 向聴String = ['聴牌', '一向聴', '二向聴', '三向聴', '四向聴', '五向聴', '六向聴'][向聴Number];

	text = stripIndents`
		配牌！
		${配牌String}

		${scream(向聴String)}
	`;
}

console.log('\n' + stripIndents`
	Text to toot
	============

	${text}
`);

generateImage(配牌).then((png) => {
	pawoo.toot({
		access_token: process.env.PAWOO_TENHO_TOKEN,
		status: text,
		visibility: 'unlisted',
		file: png,
	});
});
