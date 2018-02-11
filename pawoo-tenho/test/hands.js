const {expect} = require('chai');

const {is九種九牌, is十三不塔, is十三無靠} = require('../hands.js');

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

	describe('is十三不塔', () => {
		it('detects 十三不塔', () => {
			// https://ja.wikipedia.org/wiki/%E5%8D%81%E4%B8%89%E4%B8%8D%E5%A1%94
			expect(is十三不塔(Array.from('🀇🀋🀏🀏🀟🀒🀕🀀🀁🀂🀃🀆🀄🀚'))).to.be.true;
			expect(is十三不塔(Array.from('🀇🀋🀏🀚🀞🀐🀔🀗🀀🀂🀃🀆🀅🀄'))).to.be.false;

			// http://majandofu.com/thirteen-tiles
			expect(is十三不塔(Array.from('🀈🀌🀏🀛🀟🀐🀔🀗🀀🀁🀃🀆🀅🀅'))).to.be.true;
			expect(is十三不塔(Array.from('🀈🀌🀏🀛🀟🀐🀔🀗🀀🀁🀂🀄🀄🀃'))).to.be.true;
			expect(is十三不塔(Array.from('🀈🀉🀍🀛🀞🀐🀒🀔🀀🀁🀂🀃🀄🀄'))).to.be.false;
			expect(is十三不塔(Array.from('🀈🀌🀏🀛🀞🀐🀔🀘🀀🀁🀂🀃🀅🀅'))).to.be.true;
			expect(is十三不塔(Array.from('🀀🀁🀂🀃🀆🀅🀄🀇🀏🀙🀡🀐🀘🀘'))).to.be.true;
			expect(is十三不塔(Array.from('🀈🀌🀏🀛🀟🀐🀔🀗🀀🀁🀃🀆🀅🀄'))).to.be.false;

			// http://dic.nicovideo.jp/a/%E5%8D%81%E4%B8%89%E4%B8%8D%E5%A1%94
			expect(is十三不塔(Array.from('🀙🀜🀠🀑🀔🀘🀀🀀🀁🀂🀆🀅🀄🀇'))).to.be.true;
			expect(is十三不塔(Array.from('🀇🀊🀎🀚🀞🀡🀐🀔🀘🀀🀂🀃🀅🀇'))).to.be.true;
			expect(is十三不塔(Array.from('🀇🀌🀏🀚🀟🀑🀔🀘🀀🀂🀃🀅🀄🀁'))).to.be.false;

			// http://www.jannyumon.jp/yaku/localrule/shisanputa/
			expect(is十三不塔(Array.from('🀈🀌🀏🀛🀟🀐🀔🀗🀀🀁🀃🀆🀅🀅'))).to.be.true;
		});
	});

	describe('is十三無靠', () => {
		it('detects 十三無靠', () => {
			// https://ja.wikipedia.org/wiki/%E5%8D%81%E4%B8%89%E4%B8%8D%E5%A1%94
			expect(is十三無靠(Array.from('🀇🀋🀏🀏🀟🀒🀕🀀🀁🀂🀃🀆🀄🀚'))).to.be.false;
			expect(is十三無靠(Array.from('🀇🀋🀏🀚🀞🀐🀔🀗🀀🀂🀃🀆🀅🀄'))).to.be.true;

			// http://majandofu.com/thirteen-tiles
			expect(is十三無靠(Array.from('🀈🀌🀏🀛🀟🀐🀔🀗🀀🀁🀃🀆🀅🀅'))).to.be.false;
			expect(is十三無靠(Array.from('🀈🀌🀏🀛🀟🀐🀔🀗🀀🀁🀂🀄🀄🀃'))).to.be.false;
			expect(is十三無靠(Array.from('🀈🀉🀍🀛🀞🀐🀒🀔🀀🀁🀂🀃🀄🀄'))).to.be.false;
			expect(is十三無靠(Array.from('🀈🀌🀏🀛🀞🀐🀔🀘🀀🀁🀂🀃🀅🀅'))).to.be.false;
			expect(is十三無靠(Array.from('🀀🀁🀂🀃🀆🀅🀄🀇🀏🀙🀡🀐🀘🀘'))).to.be.false;
			expect(is十三無靠(Array.from('🀈🀌🀏🀛🀟🀐🀔🀗🀀🀁🀃🀆🀅🀄'))).to.be.true;

			// http://dic.nicovideo.jp/a/%E5%8D%81%E4%B8%89%E4%B8%8D%E5%A1%94
			expect(is十三無靠(Array.from('🀙🀜🀠🀑🀔🀘🀀🀀🀁🀂🀆🀅🀄🀇'))).to.be.false;
			expect(is十三無靠(Array.from('🀇🀊🀎🀚🀞🀡🀐🀔🀘🀀🀂🀃🀅🀇'))).to.be.false;
			expect(is十三無靠(Array.from('🀇🀌🀏🀚🀟🀑🀔🀘🀀🀂🀃🀅🀄🀁'))).to.be.true;

			// http://www.jannyumon.jp/yaku/localrule/shisanputa/
			expect(is十三無靠(Array.from('🀈🀌🀏🀛🀟🀐🀔🀗🀀🀁🀃🀆🀅🀅'))).to.be.false;
		});
	});
});
