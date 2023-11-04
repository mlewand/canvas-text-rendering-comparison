// const { expect } = require( 'chai' );

describe( 'main', function() {
	let canvas,
		/**
		 * @type {CanvasRenderingContext2D}
		 */
		context;

	beforeEach( () => {
		canvas = createCanvasElement( { parent: document.body } );
		context = canvas.getContext( '2d' );

		applyStandardFontSettings( context );
	} );

	afterEach( () => {
		canvas.remove();
	} );

	describe( '#endsWith()', function() {
		it( 'should return true when the value ends with the suffix', function() {
			console.log( JSON.stringify( context.measureText( 'foo' ) ) );
			const measurements = context.measureText( 'foo' );

			console.log( measurements.width );
		} );

		it( 'should return false when the value does not end with the suffix', function() {
		} );
	} );
} );
