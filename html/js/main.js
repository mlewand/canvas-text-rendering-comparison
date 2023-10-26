
document.addEventListener( 'DOMContentLoaded', function() {
	const DPI_RATIO = 3;
	const CANVAS_SIZE = { width: 1000, height: 5000 };
	const textToBeWritten = 'Hello World Nisi nisi veniam consequat nulla dolor. Nostrud cillum deserunt aliquip. Nulla duis amet irure ad sunt consequat eu eiusmod veniam labore. Excepteur commodo incididunt in nulla dolor commodo velit. Sit labore magna occaecat ex esse in duis est consequat mollit elit proident proident. Officia sunt exercitation reprehenderit ad sint amet dolor consequat esse et pariatur aliqua.!';

	const canvas = document.getElementById( 'canvasElement' );
	canvas.width = CANVAS_SIZE.width;
	canvas.height = CANVAS_SIZE.height;
	canvas.style.display = 'block';

	changeResolution( canvas, DPI_RATIO );

	const ctx = canvas.getContext( '2d' );
	applyStandardFontSettings( ctx );
	fillMultilineText( ctx, textToBeWritten, CANVAS_SIZE.width - 20, 10 );
} );

// A primitive implementation of filling a given context with text.
function fillMultilineText( ctx, text, maxWidth, xMargin ) {
	const LINE_HEIGHT = 20;
	const words = text.split( ' ' );
	let currentLine = '';
	let currentY = LINE_HEIGHT;
	let currentX = xMargin;

	for ( let i = 0; i < words.length; i++ ) {
		const word = words[ i ];
		const wordWidth = ctx.measureText( word ).width;

		if ( currentX + wordWidth > maxWidth ) {
			ctx.fillText( currentLine, xMargin, currentY );
			currentLine = word;
			currentY += LINE_HEIGHT;
		} else {
			currentLine += word + ' ';
		}

		currentX = ctx.measureText( currentLine ).width;
	}

	ctx.fillText( currentLine, xMargin, currentY );
}

function applyStandardFontSettings( ctx ) {
	ctx.font = '14px serif';
	ctx.textAlign = 'start';
}

// Based on https://stackoverflow.com/questions/14488849/higher-dpi-graphics-with-html5-canvas;
function changeResolution( canvas, scaleFactor ) {
	// Set up CSS size.
	canvas.style.width = canvas.style.width || canvas.width + 'px';
	canvas.style.height = canvas.style.height || canvas.height + 'px';

	// Resize canvas and scale future draws.
	canvas.width = Math.ceil( canvas.width * scaleFactor );
	canvas.height = Math.ceil( canvas.height * scaleFactor );
	var ctx = canvas.getContext( '2d' );
	ctx.scale( scaleFactor, scaleFactor );
}