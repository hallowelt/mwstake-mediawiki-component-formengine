( function ( mw, $, undefined ) {
	mw.ext.forms.formElement.FormElement = function() {};

	OO.initClass( mw.ext.forms.formElement.FormElement );

	mw.ext.forms.formElement.FormElement.prototype.getElementConfig = function() {
		return this.returnConfig( this.getElementConfigInternal() );
	};

	mw.ext.forms.formElement.FormElement.prototype.getElementConfigInternal = function() {
		return {
			// Its not a very good idea to allow changing types
			// at least not without rigid rules
			/*type: {
				type: 'dropdown',
				required: true,
				options: mw.ext.forms.widget.formElement.FormElementGroup.static.getElementPickerOptions(),
				widget_dropdown: {
					$overlay: true
				},
				name: 'type',
				label: mw.message( 'ext-forms-label-type' ).text(),
				widget_data: {
					tab: 'main'
				}
			},*/
			name: {
				type: 'text',
				required: true,
				name: 'name',
				label: mw.message( 'ext-forms-label-name' ).text(),
				widget_data: {
					tab: 'main'
				}
			},
			label: {
				type: "text",
				name: 'label',
				label: mw.message( 'ext-forms-label-label' ).text(),
				widget_data: {
					tab: 'main'
				}
			},
			help: {
				type: "text",
				name: 'help',
				label: mw.message( 'ext-forms-label-help' ).text(),
				widget_data: {
					tab: 'main'
				}
			},
			noLayout: {
				type: 'checkbox',
				name: 'noLayout',
				label: mw.message( 'ext-forms-label-no-layout' ).text(),
				widget_data: {
					tab: 'main'
				}
			},
			classes: {
				type: 'multiplier',
				name: 'widget_classes',
				label: 'CSS Classes',
				returnType: 'simple_array',
				returnKey: 'class',
				base: [ {
					type: 'text',
					name: 'class',
					noLayout: true
				} ],
				widget_data: {
					tab: 'styling'
				}
			},
			showOn: {
				name: "showOn",
				type: "checkbox_multiselect",
				widget_classes: [ 'inline-cbx' ],
				label: mw.message( 'ext-forms-label-show-on' ).text(),
				value: [ 'create', 'edit', 'view' ],
				options: [
					{
						data: 'create',
						label: mw.message( 'ext-forms-label-create' ).text()
					}, {
						data: 'edit',
						label: mw.message( 'ext-forms-label-edit' ).text()
					}, {
						data: 'view',
						label: mw.message( 'ext-forms-label-view' ).text()
					}
				],
				widget_data: {
					tab: 'main'
				}
			},
			editableOn: {
				name: "editableOn",
				type: "checkbox_multiselect",
				widget_classes: [ 'inline-cbx' ],
				label: "Editable on",
				value: [ 'create', 'edit' ],
				options: [
					{
						data: 'create',
						label: mw.message( 'ext-forms-label-create' ).text()
					}, {
						data: 'edit',
						label: mw.message( 'ext-forms-label-edit' ).text()
					}
				],
				widget_data: {
					tab: 'main'
				}
			},
			style: {
				type: 'textarea',
				name: 'style',
				label: mw.message( 'ext-forms-label-style' ).text(),
				widget_data: {
					tab: 'styling'
				}
			},
			widgetCustomProps: {
				type: 'custom_form_props',
				name: 'widgetCustomProps',
				label: mw.message( 'ext-forms-label-custom-widget-properties' ).text()
			},
			widget_listeners: {
				type: 'listeners_widget',
				required: true,
				name: 'widget_listeners',
				label: mw.message( 'ext-forms-label-listeners' ).text()
			}
		};
	};

	mw.ext.forms.formElement.FormElement.prototype.getSubitemConfig = function() {
		return false; // Does not support subitems
	};

	mw.ext.forms.formElement.FormElement.prototype.getGroup = function() {
		return 'other';
	};

	mw.ext.forms.formElement.FormElement.prototype.returnConfig = function( config ) {
		var values = Object.values( config );
		values = values.sort();
		// Name first (if input) listeners last
		values = values.sort( function( a, b ) {
			if( !a.hasOwnProperty( 'name' ) ) {
				return 0;
			}
			if ( a.name === 'name' && this instanceof mw.ext.forms.formElement.InputFormElement ) {
				return -1;
			}
			if ( a.name === 'listeners' ) {
				return 1;
			}
			if ( a.name === 'widgetCustomProps' ) {
				return 1;
			}
			return 0;
		} );
		return values;
	};

	mw.ext.forms.formElement.FormElement.prototype.getType = function() {
		// STUB
		return "_default";
	};

	mw.ext.forms.formElement.FormElement.prototype.getDisplayName = function() {
		return mw.message( 'ext-forms-type-' + this.getType() ).text();
	};

	mw.ext.forms.formElement.FormElement.prototype.isInput = function() {
		return this instanceof mw.ext.forms.formElement.InputFormElement;
	};

	mw.ext.forms.formElement.FormElement.prototype.getWidgets = function() {
		return null;
	};

	mw.ext.forms.formElement.FormElement.prototype.isSystemElement = function() {
		return false;
	};

	mw.ext.forms.formElement.FormElement.prototype.isHidden = function() {
		return false;
	};

	mw.ext.forms.formElement.FormElement.prototype.getIcon = function() {
		return '';
	};

	/**
	 * True for any element that can only be a subitem of another element that accepts it
	 * @returns {boolean}
	 */
	mw.ext.forms.formElement.FormElement.prototype.isSubitem = function() {
		return false;
	};

	mw.ext.forms.formElement.FormElement.prototype.getDefaultValue = function() {
		return {};
	};

} )( mediaWiki, jQuery );
