const unique = require('array-unique');

const 么九牌s = ['🀀', '🀁', '🀂', '🀃', '🀄', '🀅', '🀆', '🀇', '🀏', '🀐', '🀘', '🀙', '🀡'];

module.exports.is九種九牌 = (牌s) => {
	const included么九牌s = [];

	牌s.forEach((牌) => {
		if (么九牌s.includes(牌)) {
			included么九牌s.push(牌);
		}
	});

	return unique(included么九牌s).length >= 9;
};
