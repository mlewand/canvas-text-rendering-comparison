
import { CANVAS_SIZE, FONT_NAME, DPI_RATIO } from './constants.js';

export default {
	name: 'Native Canvas 2D',
	shortName: 'Canvas2D',

	async getCanvas() {
		const canvas = document.createElement( 'canvas' );
		setFinalCanvasStyling( canvas );

		setCanvasGeometry( canvas );
		changeResolution( canvas, DPI_RATIO );

		this.canvas = canvas;

		return canvas;
	},

	async init() {
		if ( !this.initialized ) {
			this.initialized = true;
		}

		if ( this.app ) {
			await this.destroy();
		}

		const canvas = this.getCanvas();

		return canvas;
	},

	async destroy() {
		this.canvas.remove();
		this.canvas = null;
	},

	async getImageUrl() {
		return this.canvas.toDataURL( 'image/png' );
	},

	drawText( text ) {
		setCanvasText( this.canvas, text );
	}
}

function setCanvasGeometry( canvas ) {
	canvas.width = CANVAS_SIZE.width;
	canvas.height = CANVAS_SIZE.height;
}

function setFinalCanvasStyling( canvas ) {
	canvas.style.display = 'block';
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

	if ( ctx ) {
		ctx.scale( scaleFactor, scaleFactor );
	} else {
		console.warn( 'changeResolution(): Could not get canvas context.' );
	}
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

/*
API:
getCanvas()
async init()
async destroy()
measureText( string )
renderText()

*/
