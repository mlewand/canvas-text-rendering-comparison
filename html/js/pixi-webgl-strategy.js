
import { CANVAS_SIZE, FONT_NAME } from './constants.js';

export default {
	name: 'WebGL (using PixiJs)',
	shortName: 'WebGL',

	async init() {
		if ( !this.initialized ) {
			this.initialized = true;

			await includeGoogleFontsScript();
		}

		if ( this.app ) {
			await this.destroy();
		}

		this.app = new PIXI.Application( { background: '#fff' } );
		this.app.renderer.resize( CANVAS_SIZE.width, CANVAS_SIZE.height );

		return this.app.view;
	},

	async destroy() {
		if ( this.app ) {
			this.app.destroy();
			this.app = null;
		}
	},

	async getImageUrl() {
		let image = await this.app.renderer.extract.image( this.app.stage );
		return image.src;
	},

	drawText( text ) {
		const { stage } = this.app;

		stage.removeChildren();

		// Text to make sure that exported image has some background.
		var backgroundRect = new PIXI.Graphics();
		backgroundRect.beginFill( 0xFFFFFF );
		// set the line style to have a width of 5 and set the color to red
		backgroundRect.lineStyle( 5, 0xFFFFFF );
		backgroundRect.drawRect( 0, 0, CANVAS_SIZE.width, CANVAS_SIZE.height );
		stage.addChild( backgroundRect );

		const textSample = new PIXI.Text(
			text, {
			fontFamily: FONT_NAME,
			fontSize: '14px',
			fill: 'black',
			align: 'left',
			wordWrap: true,
			wordWrapWidth: CANVAS_SIZE.width
		}
		);
		textSample.position.set( 0, 0 );
		stage.addChild( textSample );
	}
}

function includeGoogleFontsScript() {
	return new Promise( function( resolve, reject ) {
		// Load them google fonts before starting...
		window.WebFontConfig = {
			google: {
				families: [ FONT_NAME ],
			},
			active() {
				resolve();
			},
		};

		const scriptElement = document.createElement( 'script' );
		const protocol = document.location.protocol === 'https:' ? 'https' : 'http';
		scriptElement.src = `${protocol}://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js`;
		scriptElement.type = 'text/javascript';
		scriptElement.async = 'true';
		const s = document.getElementsByTagName( 'script' )[ 0 ];
		s.parentNode.insertBefore( scriptElement, s );
	} );
}

/*
API:
getCanvas()
async init()
async destroy()
measureText( string )
renderText()

*/
