
import { CANVAS_SIZE, FONT_NAME } from './constants.js';

import pixiWebglStrategy from './pixi-webgl-strategy.js';
import canvas2dStrategy from './canvas-2d-strategy.js';

const renderingStrategies = [ pixiWebglStrategy, canvas2dStrategy ];

const defaultStrategy = pixiWebglStrategy;
// const defaultStrategy = canvas2dStrategy;
let currentStrategy = null;
let currentText = null;

onDocumentAndFontReady().then( async function() {
	await setRenderingStrategy( defaultStrategy );

	const fixtures = [ 'dummy-short', 'lorem-ipsum-short', 'english-long', 'english-long-safe-chars', 'english-long-safe-chars-no-line-breaks', 'chinese-medium', 'arabic-ligatures-short' ];

	addListeners( fixtures );
	initialize( fixtures );

	// Force loading in the first fixture.
	document.getElementById( 'fixture' ).value = fixtures[ 1 ];
	document.getElementById( 'fixture' ).dispatchEvent( new Event( 'change' ) );
} );

function initialize( fixtures ) {
	const fixtureSelect = document.getElementById( 'fixture' );
	const rendererSelect = document.getElementById( 'driver' );

	fixtureSelect.addEventListener( 'change', async function() {
		const textFixture = await fetch( `../fixtures/${fixtureSelect.value}.txt` )
			.then( response => response.text() )
			.then( text => {
				currentText = text;
				currentStrategy.drawText( currentText );
			 } );

		document.getElementById( 'dump-file-name' ).value = getFixtureFileName();
	} );

	rendererSelect.addEventListener( 'change', async function() {
		rendererSelect.disabled = true;

		const newStrategy = renderingStrategies.find( strategy => strategy.name === rendererSelect.value );

		await setRenderingStrategy( newStrategy );

		currentStrategy.drawText( currentText );

		rendererSelect.disabled = false;

		document.getElementById( 'dump-file-name' ).value = getFixtureFileName();
	} );

	fixtureSelect.focus();
}

async function setRenderingStrategy( newStrategy ) {
	if ( newStrategy !== currentStrategy ) {
		if ( currentStrategy ) {
			await currentStrategy.destroy();
		}

		const rendererCanvas = await newStrategy.init();
		rendererCanvas.style.display = 'none';
		rendererCanvas.id = 'canvasElement';

		const renderArea = document.getElementById( 'render-area' );
		console.log( document.body.innerHTML );
		renderArea.replaceChildren( rendererCanvas );
		rendererCanvas.style.display = 'block';

		currentStrategy = newStrategy;
		console.log( `Renderer set to: ${currentStrategy.name}` );
	}
}

function addListeners( fixtures ) {
	document.getElementById( 'dump-file-name' ).value = getFixtureFileName();

	const fixtureSelect = document.getElementById( 'fixture' );

	for ( const fixtureName of fixtures ) {
		fixtureSelect.options.add( new Option( fixtureName, fixtureName ) );
	}

	const driverSelect = document.getElementById( 'driver' );

	for ( const renderer of renderingStrategies ) {
		driverSelect.options.add( new Option( renderer.name, renderer.name ) );
	}

	driverSelect.value = defaultStrategy.name;

	document.getElementById( 'download-button' ).addEventListener( 'click', function() {
		const fileName = `${document.getElementById( 'dump-file-name' ).value}.png`;
		downloadCanvas( document.getElementById( 'canvasElement' ), fileName );
	} );
}

async function downloadCanvas( canvas, filename ) {
	const link = document.createElement( 'a' );
	link.download = filename;
	link.href = await currentStrategy.getImageUrl();
	link.click();
};

// Returns name like 'english-long__Chrome_118.0.5993.117__Windows10'.
function getFixtureFileName() {
	const info = getBrowserInfo();
	let nameParts = [ currentStrategy.name ];

	if ( document.getElementById( 'fixture' ).value ) {
		nameParts.push( document.getElementById( 'fixture' ).value );
	}

	nameParts.push(
		`${info.name}_${info.version}`,
		`${info.os.name}${info.os.version ? '_' + info.os.version : ''}`
	);

	return nameParts.join( '__' ).replace( /\s+/g, '-' );
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