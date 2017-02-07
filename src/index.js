// Return Promise
const imageMerge = (sources = [], options = {format: 'image/png'}) => new Promise(resolve => {
	// Setup browser/node specific variables
	const canvas = options.Canvas ? new options.Canvas() : window.document.createElement('canvas');
	const Image = options.Canvas ? options.Canvas.Image : window.Image;

	// Load sources
	const images = sources.map(source => new Promise(resolve => {
		// Convert strings to objects
		if (typeof source === 'string') {
			source = {src: source};
		}

		// Resolve source and img when loaded
		const img = new Image();
		img.onload = () => resolve(Object.assign({}, source, {img}));
		img.src = source.src;
	}));

	// Get canvas context
	const ctx = canvas.getContext('2d');

	// When sources have loaded
	Promise.all(images)
		.then(images => {
			// Set canvas dimensions
			const getSize = dim => options[dim] || Math.max(...images.map(image => image.img[dim]));
			canvas.width = getSize('width');
			canvas.height = getSize('height');

			// Draw images to canvas
			images.forEach(image => ctx.drawImage(image.img, image.x || 0, image.y || 0));

			// Resolve data uri
			resolve(canvas.toDataURL(options.format));
		});
});

module.exports = imageMerge;