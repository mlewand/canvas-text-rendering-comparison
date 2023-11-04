
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
	ctx.font = '14px serif';
	ctx.textAlign = 'start';
}