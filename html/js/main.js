const CANVAS_SIZE = { width: 1000, height: 5000 };

document.addEventListener( 'DOMContentLoaded', async function() {
	const DPI_RATIO = 3;
	const fixtures = [ 'dummy-short', 'lorem-ipsum-short', 'english-long' ];
	const textToBeWritten = 'Hello World Nisi nisi veniam consequat nulla dolor. Nostrud cillum deserunt aliquip. Nulla duis amet irure ad sunt consequat eu eiusmod veniam labore. Excepteur commodo incididunt in nulla dolor commodo velit. Sit labore magna occaecat ex esse in duis est consequat mollit elit proident proident. Officia sunt exercitation reprehenderit ad sint amet dolor consequat esse et pariatur aliqua.!';

	const canvas = document.getElementById( 'canvasElement' );
	canvas.width = CANVAS_SIZE.width;
	canvas.height = CANVAS_SIZE.height;
	canvas.style.display = 'block';

	changeResolution( canvas, DPI_RATIO );

	addListeners( fixtures );
	initialize( fixtures );

	// Force loading in the first fixture.
	document.getElementById( 'fixture' ).dispatchEvent( new Event( 'change' ) );
} );

function initialize( fixtures ) {
	const fixtureSelect = document.getElementById( 'fixture' );

	fixtureSelect.addEventListener( 'change', async function() {
		const textFixture = await fetch( `/fixtures/${ fixtureSelect.value }.txt` )
			.then( response => response.text() )
			.then( text => setCanvasText( document.getElementById( 'canvasElement' ), text ) );

		console.log('fetched text', textFixture);
	} );

	fixtureSelect.focus();
}

function addListeners( fixtures ) {
	document.getElementById( 'browser-name' ).value = getRealBrowserName();

	const fixtureSelect = document.getElementById( 'fixture' );

	for ( const fixtureName of fixtures ) {
		fixtureSelect.options.add( new Option( fixtureName, fixtureName ) );
	}

	document.getElementById( 'download-button' ).addEventListener( 'click', function() {
		const fileName = `${ document.getElementById( 'browser-name' ).value }-${ fixtureSelect.value }.png`;
		downloadCanvas( document.getElementById( 'canvasElement' ), fileName );
	} );
}

function setCanvasText( canvas, textToBeWritten ) {
	const ctx = canvas.getContext( '2d' );

	// Make sure to give it some background, otherwise text will be on transparent bg in png files which could
	// complicate seeing it in dark mode :)
	ctx.fillStyle = 'white';
	ctx.fillRect( 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height );
	ctx.fillStyle = 'black';

	applyStandardFontSettings( ctx );
	fillMultilineText( ctx, textToBeWritten, CANVAS_SIZE.width - 20, 10 );

	return textToBeWritten;
}

function downloadCanvas( canvas, filename ) {
	const link = document.createElement( 'a' );
	link.download = filename;
	link.href = canvas.toDataURL( 'image/png' );
	link.click();
};

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

function getRealBrowserName() {
	const userAgent = navigator.userAgent;
	const browsers = [ 'Chrome', 'Firefox', 'Safari', 'Opera', 'MSIE', 'Trident', 'Edge' ];

	for ( const browser of browsers ) {
		if ( userAgent.indexOf( browser ) > -1 ) {
			return browser;
		}
	}

	return 'unknown';
}