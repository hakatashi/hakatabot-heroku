const unique = require('array-unique');
const assert = require('assert');

const 么九牌s = [
	'🀀',
	'🀁',
	'🀂',
	'🀃',
	'🀄',
	'🀅',
	'🀆',
	'🀇',
	'🀏',
	'🀐',
	'🀘',
	'🀙',
	'🀡',
];

const is字牌 = (牌) => {
	const codePoint = 牌.codePointAt(0);
	return codePoint >= 0x1f000 && codePoint <= 0x1f006;
};

const is萬子 = (牌) => {
	const codePoint = 牌.codePointAt(0);
	return codePoint >= 0x1f007 && codePoint <= 0x1f00f;
};

const is索子 = (牌) => {
	const codePoint = 牌.codePointAt(0);
	return codePoint >= 0x1f010 && codePoint <= 0x1f018;
};

const is筒子 = (牌) => {
	const codePoint = 牌.codePointAt(0);
	return codePoint >= 0x1f019 && codePoint <= 0x1f021;
};

module.exports.is九種九牌 = (牌s) => {
	const included么九牌s = [];

	for (const 牌 of 牌s) {
		if (么九牌s.includes(牌)) {
			included么九牌s.push(牌);
		}
	}

	return unique(included么九牌s).length >= 9;
};

const count搭子 = (牌s) => {
	let 対子 = 0;
	let 順搭子 = 0;
	let 嵌搭子 = 0;

	const 萬子 = 牌s.filter((牌) => is萬子(牌));
	const 索子 = 牌s.filter((牌) => is索子(牌));
	const 筒子 = 牌s.filter((牌) => is筒子(牌));

	for (const 同種牌 of [萬子, 索子, 筒子]) {
		const 同種牌CodePoints = 同種牌.map((牌) => 牌.codePointAt(0));
		const sorted同種牌 = 同種牌CodePoints.sort((a, b) => a - b);

		if (sorted同種牌.length !== 0) {
			// eslint-disable-next-line no-loop-func
			sorted同種牌.reduce((previous牌, current牌) => {
				if (previous牌 === current牌) {
					対子++;
				}

				if (current牌 - previous牌 === 1) {
					順搭子++;
				}

				if (current牌 - previous牌 === 2) {
					嵌搭子++;
				}

				return current牌;
			});
		}
	}

	const 字牌 = 牌s.filter((牌) => is字牌(牌));

	assert(萬子.length + 索子.length + 筒子.length + 字牌.length === 牌s.length);

	対子 += 字牌.length - unique(字牌).length;

	return {対子, 順搭子, 嵌搭子};
};

module.exports.is十三不塔 = (牌s) => {
	const {対子, 順搭子, 嵌搭子} = count搭子(牌s);
	return 対子 === 1 && 順搭子 === 0 && 嵌搭子 === 0;
};

module.exports.is十三無靠 = (牌s) => {
	const {対子, 順搭子, 嵌搭子} = count搭子(牌s);
	return 対子 === 0 && 順搭子 === 0 && 嵌搭子 === 0;
};
