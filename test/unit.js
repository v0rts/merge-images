import test from 'ava';
import Canvas from 'canvas';
import mergeImages from '../';
import fixtures from './fixtures';

test('mergeImages returns empty b64 string if nothing is passed in', async t => {
	t.plan(1);
	await mergeImages([], { Canvas }).then(b64 => t.true(b64 === 'data:,'));
});

test('mergeImages returns correct data URI', async t => {
	t.plan(1);
	const image = await fixtures.getImage('face.png');
	const b64 = await mergeImages([image], { Canvas });

	const expectedB64 = await fixtures.getDataURI('face.png');

	t.true(b64 === expectedB64);
});

['png', 'jpeg'].forEach(format => {
	test(`mergeImages encodes ${format} format`, async t => {
		t.plan(1);
		const image = await fixtures.getImage('face.png');
		const b64 = await mergeImages([image], {
			format: `image/${format}`,
			Canvas: Canvas
		});

		const expectedB64 = await fixtures.getDataURI(`face.${format}`);

		t.true(b64 === expectedB64);
	});
});

test('mergeImages correctly merges images', async t => {
	t.plan(1);
	const images = await Promise.all(['body.png', 'mouth.png', 'eyes.png'].map(image => fixtures.getImage(image)));
	const b64 = await mergeImages(images, { Canvas });

	const expectedB64 = await fixtures.getDataURI('face.png');

	t.true(b64 === expectedB64);
});

test('mergeImages uses custom dimensions', async t => {
	t.plan(1);
	const image = await fixtures.getImage('face.png');
	const b64 = await mergeImages([image], {
		width: 128,
		height: 128,
		Canvas: Canvas
	});

	const expectedB64 = await fixtures.getDataURI('face-custom-dimension.png');

	t.true(b64 === expectedB64);
});