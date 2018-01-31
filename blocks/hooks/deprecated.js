/**
 * External dependencies
 */
import { includes } from 'lodash';

/**
 * WordPress dependencies
 */
import { Component, DangerousHTML } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';

/**
 * Wrapper component for DangerousHTML, logging a warning about unsupported raw
 * markup return values from a block's `save` implementation.
 */
export class DangerousHTMLWithWarning extends Component {
	constructor() {
		super( ...arguments );

		// Disable reason: We're intentionally logging a console warning
		// advising the developer to upgrade usage.

		// eslint-disable-next-line no-console
		console.warn(
			'Deprecated: Returning raw HTML from block `save` is not supported. ' +
			'Use `wp.element.DangerousHTML` component instead.\n\n' +
			'See: https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/#save'
		);
	}

	render() {
		const { children } = this.props;

		return <DangerousHTML>{ children }</DangerousHTML>;
	}
}

/**
 * Override save element for a block, providing support for deprecated HTML
 * return value, logging a warning advising the developer to use the preferred
 * DangerousHTML component instead.
 *
 * @param {WPElement} element Original block save return.
 *
 * @returns {WPElement}       Dangerously shimmed block save.
 */
export function shimDangerousHTML( element ) {
	// Still support string return from save, but in the same way any component
	// could render a string, it should be escaped. Therefore, only shim usage
	// which had included some HTML expected to be unescaped.
	if ( typeof element === 'string' && includes( element, '<' ) ) {
		element = <DangerousHTMLWithWarning children={ element } />;
	}

	return element;
}

addFilter( 'blocks.getSaveContent.saveElement', 'core/deprecated/save-props', shimDangerousHTML );
