
document.addEventListener( 'DOMContentLoaded', function() {
	const textToBeWritten = 'Hello World Nisi nisi veniam consequat nulla dolor. Nostrud cillum deserunt aliquip. Nulla duis amet irure ad sunt consequat eu eiusmod veniam labore. Excepteur commodo incididunt in nulla dolor commodo velit. Sit labore magna occaecat ex esse in duis est consequat mollit elit proident proident. Officia sunt exercitation reprehenderit ad sint amet dolor consequat esse et pariatur aliqua.!';
	const canvas = document.getElementById( 'canvasElement' );
	const DPI_RATIO = 3;

	changeResolution( canvas, DPI_RATIO );

	const ctx = canvas.getContext( '2d' );
	applyStandardFontSettings( ctx );
	ctx.fillText( textToBeWritten, 10, 50 );
} );

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