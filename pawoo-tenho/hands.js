const unique = require('array-unique');
const assert = require('assert');

const 么九牌s = ['🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆', '🀇', '🀏', '🀐', '🀘', '🀙', '🀡'];

const is字牌 = (牌) => {
	const codePoint = 牌.codePointAt(0);
	return 0x1F000 <= codePoint && codePoint <= 0x1F006;
};

const is萬子 = (牌) => {
	const codePoint = 牌.codePointAt(0);
	return 0x1F007 <= codePoint && codePoint <= 0x1F00F;
};

const is索子 = (牌) => {
	const codePoint = 牌.codePointAt(0);
	return 0x1F010 <= codePoint && codePoint <= 0x1F018;
};

const is筒子 = (牌) => {
	const codePoint = 牌.codePointAt(0);
	return 0x1F019 <= codePoint && codePoint <= 0x1F021;
};

module.exports.is九種九牌 = (牌s) => {
	const included么九牌s = [];

	牌s.forEach((牌) => {
		if (么九牌s.includes(牌)) {
			included么九牌s.push(牌);
		}
	});

	return unique(included么九牌s).length >= 9;
};

const count搭子 = (牌s) => {
	let 対子 = 0;
	let 順搭子 = 0;
	let 嵌搭子 = 0;

	const 萬子 = 牌s.filter(牌 => is萬子(牌));
	const 索子 = 牌s.filter(牌 => is索子(牌));
	const 筒子 = 牌s.filter(牌 => is筒子(牌));

	[萬子, 索子, 筒子].forEach((同種牌) => {
		const 同種牌CodePoints = 同種牌.map(牌 => 牌.codePointAt(0))
		const sorted同種牌 = 同種牌CodePoints.sort((a, b) => a - b);

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
	});

	const 字牌 = 牌s.filter(牌 => is字牌(牌));

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
