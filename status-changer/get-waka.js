const download = require('download');
const sample = require('lodash/sample');
const get = require('lodash/get');
const qs = require('querystring');

const pages = {
	古今和歌集: '古今集',
	後撰和歌集: '後撰集',
	拾遺和歌集: '拾遺集',
	新古今和歌集: '新古今集',
	千載和歌集: '千載集',
};

const getBody = async (title) => {
	console.log(`Getting wikisource ${title}...`);
	const url = `https://ja.wikisource.org/w/api.php?${qs.encode({
		format: 'json',
		action: 'query',
		prop: 'revisions',
		rvprop: 'content',
		titles: title,
	})}`;

	const content = await download(url);
	const body = get(Object.values(get(JSON.parse(content), ['query', 'pages'])), [0, 'revisions', 0, '*']);

	return body;
};

module.exports = async () => {
	const page = sample(Object.keys(pages));
	const pageBody = await getBody(page);

	if (!pageBody) {
		return '';
	}

	const matches = [];
	const entryRegexp = /^\*\s*\[\[(.+?)\|.+?\]\][ \u3000]*(.+?)$/gm;
	let tempMatch = null;
	while ((tempMatch = entryRegexp.exec(pageBody))) {
		matches.push(tempMatch);
	}

	const [, path, title] = sample(matches);
	const entryBody = await getBody(`${page}${path}`);

	if (!entryBody) {
		return '';
	}

	let number = null;
	let author = null;
	let text = null;

	const wakas = [];

	for (const rawLine of entryBody.split('\n')) {
		const line = rawLine.trim();

		if (line.length === 0 || line.includes('詞書') || line.includes('－')) {
			continue;
		}

		if (line.match(/^\d+$/)) {
			number = line;
			author = null;
			text = null;
		} else if (line.length > 15) {
			text = line;
		} else {
			author = line.match(/(よみ人|読み人|読人)/) ? '読人不知' : line;
		}

		if (number && author && text) {
			wakas.push({number, author, text});
			number = null;
			author = null;
			text = null;
		}
	}

	const waka = sample(wakas);
	return `${waka.text}──${waka.author}\u3000『${pages[page]}』${title.replace(/([歌\s一二三四五六七八九]|（.+?）)/g, '')}・${parseInt(waka.number)}`;
};

if (require.main === module) {
	module.exports();
}
