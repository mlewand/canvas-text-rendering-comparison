
function createCanvasElement( { parent, size } ) {
	const canvas = document.createElement( 'canvas' );
	const defaultSize = { width: 1000, height: 5000 };

	canvas.width = size && size.width || defaultSize.width;
	canvas.height = size && size.height || defaultSize.height;
	canvas.style.display = 'block';

	if ( parent ) {
		parent.appendChild( canvas );
	}

	return canvas;
}

function applyStandardFontSettings( ctx ) {
	ctx.font = '14px CustomCanvasFont';
	ctx.textAlign = 'start';
}

function onDocumentAndFontReady() {
	return new Promise( ( resolve, reject ) => {
		if ( !document.fonts || !document.fonts.load ) {
			alert( 'Your browser does not support the Font Loading API. Please use a newer browser.' );
			reject();
		} else {
			document.addEventListener( 'DOMContentLoaded', async function() {
				document.fonts.load( '14px CustomCanvasFont' ).then( function() {
					resolve();
				} );
			} );
		}
	} );
}