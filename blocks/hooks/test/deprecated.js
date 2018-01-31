/**
 * External dependencies
 */
import { shallow } from 'enzyme';

/**
 * WordPress dependencies
 */
import { createElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import {
	DangerousHTMLWithWarning,
	shimDangerousHTML,
} from '../deprecated';

describe( 'deprecated', () => {
	describe( 'DangerousHTMLWithWarning', () => {
		it( 'warns on mount', () => {
			shallow( <DangerousHTMLWithWarning /> );

			expect( console ).toHaveWarned();
		} );

		it( 'renders DangerousHTML', () => {
			const wrapper = shallow(
				<DangerousHTMLWithWarning>
					Scary!
				</DangerousHTMLWithWarning>
			);

			expect( console ).toHaveWarned();
			expect( wrapper.name() ).toBe( 'DangerousHTML' );
			expect( wrapper.find( 'DangerousHTML' ).prop( 'children' ) ).toBe( 'Scary!' );
		} );
	} );

	describe( 'shimDangerousHTML()', () => {
		it( 'should do nothing to elements', () => {
			const original = createElement( 'div' );
			const result = shimDangerousHTML( original );

			expect( result ).toBe( original );
		} );

		it( 'should do nothing to non-HTML strings', () => {
			const original = 'Not so scary';
			const result = shimDangerousHTML( original );

			expect( result ).toBe( original );
		} );

		it( 'replace HTML strings with DangerousHTMLWithWarning', () => {
			const original = '<p>So scary!</p>';
			const result = shimDangerousHTML( original );

			expect( result.type ).toBe( DangerousHTMLWithWarning );
			expect( result.props.children ).toBe( original );
		} );
	} );
} );
