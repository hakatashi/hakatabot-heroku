const mockery = require('mockery');
const path = require('path');
const {expect} = require('chai');

const {is九種九牌} = require('../hands.js');

describe('pawoo-tenho/hands', () => {
	describe('is九種九牌', () => {
		it('detects 九種九牌', () => {
			// http://majandofu.com/nine-mummies
			expect(is九種九牌(Array.from('🀇🀌🀏🀙🀜🀝🀟🀐🀗🀘🀂🀃🀅🀄'))).to.be.true;
			expect(is九種九牌(Array.from('🀇🀌🀏🀙🀜🀝🀟🀐🀗🀘🀂🀃🀅🀅'))).to.be.false;
			expect(is九種九牌(Array.from('🀇🀌🀏🀙🀝🀟🀐🀗🀘🀂🀃🀅🀄🀄'))).to.be.true;
			expect(is九種九牌(Array.from('🀇🀌🀌🀏🀙🀝🀟🀐🀗🀘🀂🀃🀄🀄'))).to.be.false;

			// http://dic.nicovideo.jp/a/%E4%B9%9D%E7%A8%AE%E4%B9%9D%E7%89%8C
			expect(is九種九牌(Array.from('🀇🀡🀐🀀🀀🀁🀁🀂🀂🀃🀃🀆🀅🀄'))).to.be.true;

			// https://www.pixiv.net/member_illust.php?mode=medium&illust_id=18793732
			expect(is九種九牌(Array.from('🀇🀏🀙🀡🀐🀘🀀🀁🀂🀃🀆🀅🀄🀡'))).to.be.true;
		});
	});
});
