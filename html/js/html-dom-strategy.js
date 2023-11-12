
import { CANVAS_SIZE, FONT_NAME } from './constants.js';

export default {
	name: 'Native HTML DOM',
	shortName: 'DOM',

	async init() {
		if ( this.element ) {
			await this.destroy();
		}

		this.element = document.createElement( 'div' );
		this.element.style.width = `${ CANVAS_SIZE.width }px`;
		// this.element.style.fontFamily = `Custom${ FONT_NAME }, sans-serif`;


		return this.element;
	},

	async destroy() {
		this.element.remove();
		this.element = null;
	},

	async getImageUrl() {
		return "javascript:alert('This one is not implemented yet, sorry :(')";
	},

	drawText( text ) {
		this.element.innerText = text;
	}
}
