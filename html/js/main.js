const CANVAS_SIZE = { width: 1000, height: 10000 };

onDocumentAndFontReady().then( function() {
	const DPI_RATIO = 3;
	const fixtures = [ 'dummy-short', 'lorem-ipsum-short', 'english-long', 'chinese-medium', 'arabic-ligatures-short' ];
	const textToBeWritten = 'Hello World Nisi nisi veniam consequat nulla dolor. Nostrud cillum deserunt aliquip. Nulla duis amet irure ad sunt consequat eu eiusmod veniam labore. Excepteur commodo incididunt in nulla dolor commodo velit. Sit labore magna occaecat ex esse in duis est consequat mollit elit proident proident. Officia sunt exercitation reprehenderit ad sint amet dolor consequat esse et pariatur aliqua.!';

	const canvas = document.getElementById( 'canvasElement' );
	canvas.width = CANVAS_SIZE.width;
	canvas.height = CANVAS_SIZE.height;
	canvas.style.display = 'block';

	changeResolution( canvas, DPI_RATIO );

	addListeners( fixtures );
	initialize( fixtures );

	// Force loading in the first fixture.
	document.getElementById( 'fixture' ).value = fixtures[ 1 ];
	document.getElementById( 'fixture' ).dispatchEvent( new Event( 'change' ) );
} );

function initialize( fixtures ) {
	const fixtureSelect = document.getElementById( 'fixture' );

	fixtureSelect.addEventListener( 'change', async function() {
		const textFixture = await fetch( `/fixtures/${ fixtureSelect.value }.txt` )
			.then( response => response.text() )
			.then( text => setCanvasText( document.getElementById( 'canvasElement' ), text ) );

		document.getElementById( 'dump-file-name' ).value = getFixtureFileName();
	} );

	fixtureSelect.focus();
}

function addListeners( fixtures ) {
	document.getElementById( 'dump-file-name' ).value = getFixtureFileName();

	const fixtureSelect = document.getElementById( 'fixture' );

	for ( const fixtureName of fixtures ) {
		fixtureSelect.options.add( new Option( fixtureName, fixtureName ) );
	}

	document.getElementById( 'download-button' ).addEventListener( 'click', function() {
		const fileName = `${ document.getElementById( 'dump-file-name' ).value }.png`;
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

// Returns name like 'english-long__Chrome_118.0.5993.117__Windows10'.
function getFixtureFileName() {
	const info = getBrowserInfo();
	let nameParts = [];

	if ( document.getElementById( 'fixture' ).value ) {
		nameParts.push( document.getElementById( 'fixture' ).value );
	}

	nameParts.push( `${ info.name }_${ info.version }`, `${ info.os.name }${ info.os.version ? '_' + info.os.version : '' }`);

	return nameParts.join( '__' );
}

function getBrowserInfo() {
	const userAgent = navigator.userAgent;

	// Define browsers with regex to capture version
	const browserRegexes = [
		{ name: 'Edge', regex: /Edge\/(\d+\.\d+)/ },
		{ name: 'Chrome', regex: /Chrome\/(\d+\.\d+)/ },
		{ name: 'Firefox', regex: /Firefox\/(\d+\.\d+)/ },
		{ name: 'Safari', regex: /Version\/(\d+\.\d+).*Safari/ },
		{ name: 'Opera', regex: /OPR\/(\d+\.\d+)/ },
		{ name: 'MSIE', regex: /MSIE (\d+\.\d+);/ },
		{ name: 'Trident', regex: /Trident\/.*rv:(\d+\.\d+)/ }, // For IE 11
	];

	// Detect browser and version
	for ( const { name, regex } of browserRegexes ) {
		const match = userAgent.match( regex );
		if ( match ) {
			const version = match[ 1 ];
			return {
				name: name,
				version: version,
				os: getOS()
			};
		}
	}

	return {
		name: 'unknown',
		version: 'unknown',
		os: getOS()
	};
}

// Helper function to detect OS
function getOS() {
	const osRegexes = [
		{ name: 'Windows10', regex: /Windows NT 10.0/ },
		{ name: 'Windows8.1', regex: /Windows NT 6.3/ },
		{ name: 'Windows8', regex: /Windows NT 6.2/ },
		{ name: 'Windows7', regex: /Windows NT 6.1/ },
		{ name: 'MacOS', regex: /Mac OS X (\d+_\d+)/ },
		{ name: 'MacOS', regex: /Intel Mac OS X (\d+.\d+)/ }, // Firefox
		{ name: 'Linux', regex: /Linux/ },
		{ name: 'Android', regex: /Android (\d+\.\d+)/ },
		{ name: 'iOS', regex: /iPhone OS (\d+_\d+)/ },
	];

	// Detect OS
	for ( const { name, regex } of osRegexes ) {
		const match = navigator.userAgent.match( regex );
		if ( match ) {
			return {
				name: name,
				version: match[ 1 ] ? match[ 1 ].replace( /_/g, '.' ) : ''
			};
		}
	}

	// Fallback if OS is not detected
	return {
		name: navigator.platform,
		version: 'unknown'
	};
}

// Example use
console.log( getBrowserInfo() );