# Edit and Save

When registering a block, the `edit` and `save` functions provide the interface for how a block is going to be rendered within the editor, how it will operate and be manipulated, and how it will be saved.

## Edit

The `edit` function describes the structure of your block in the context of the editor. This represents what the editor will render when the block is used.

```js
// Defining the edit interface
edit() {
	return <hr />;
}
```

// Todo: for more advanced uses, `edit` can return a component with lifecycle.

The function receives the following properties through an object argument.

### attributes

This property surfaces all the available attributes and their corresponding values, as described by the `attributes` property when the block type was registered. In this case, assuming we had defined an attribute of `content` during block registration, we would receive and use that value in our edit function:

```js
// Defining the edit interface
edit( { attributes } ) {
	return <div>{ attributes.content }</div>;
}
```

The value of `attributes.content` will be displayed inside the `div` when inserting the block in the editor.

### className

This property returns the class name for the wrapper element. This is automatically added in the `save` method, but not on `edit`, as the root element may not correspond to what is _visually_ the main element of the block. You can request it to add it to the correct element in your function.

```js
// Defining the edit interface
edit( { attributes, className } ) {
	return <div className={ className }>{ attributes.content }</div>;
}
```

### focus

The focus property is an object that communicates whether the block is currently focused, and which children of the block may be in focus.

```js
// Defining the edit interface
edit( { attributes, className, focus } ) {
	return (
		<div className={ className }>
			{ attributes.content }
			{ focus &&
				<span>Shows only when the block is focused.</span>
			}
		</div>
	);
}
```

### setAttributes

This function allows the block to update individual attributes based on user interactions.

```js
// Defining the edit interface
edit( { attributes, setAttributes, className, focus } ) {
	// Simplify access to attributes
	const { content, mySetting } = attributes;

	// Toggle a setting when the user clicks the button
	const toggleSetting = () => setAttributes( { mySetting: ! mySetting } );
	return (
		<div className={ className }>
			{ content }
			{ focus &&
				<button onClick={ toggleSetting }>Toggle setting</button>
			}
		</div>
	);
}
```

### setFocus

// Todo ...

## Save

The `save` function defines the way in which the different attributes should be combined into the final markup, which is then serialized by Gutenberg into `post_content`.

{% codetabs %}
{% ES5 %}
```js
save() {
	return wp.element.createElement( 'hr' );
}
```
{% ESNext %}
```jsx
save() {
	return <hr />;
}
```
{% end %}

For most blocks, the return value of `save` should be an [instance of WordPress Element](https://github.com/WordPress/gutenberg/blob/master/element/README.md) representing how the block is to appear on the front of the site.

_Note:_ While it is possible to return a string value from `save`, it _will be escaped_. If the string includes HTML markup, the markup will be shown on the front of the site verbatim, not as the equivalent HTML node content. If you must return raw HTML from `save`, use `wp.element.DangerousHTML`. As the name implies, this is prone to [cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting) and therefore is discouraged in favor of a WordPress Element hierarchy whenever possible.

For [dynamic blocks](https://wordpress.org/gutenberg/handbook/blocks/creating-dynamic-blocks/), the return value of `save` could either represent a cached copy of the block's content to be shown only in case the plugin implementing the block is ever disabled. Alternatively, return a `null` (empty) value to save no markup in post content for the dynamic block, instead deferring this to always be calculated when the block is shown on the front of the site.

### attributes

As with `edit`, the `save` function also receives an object argument including attributes which can be inserted into the markup.

{% codetabs %}
{% ES5 %}
```js
save( props ) {
	return wp.element.createElement(
		'div',
		null,
		props.attributes.content
	);
}
```
{% ESNext %}
```jsx
save( { attributes } ) {
	return <div>{ attributes.content }</div>;
}
```
{% end %}
