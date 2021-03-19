( function ( mw, $, undefined ) {
	mw.ext.forms.formElement.Dropdown = function() {};

	OO.inheritClass( mw.ext.forms.formElement.Dropdown, mw.ext.forms.formElement.InputFormElement );

	mw.ext.forms.formElement.Dropdown.prototype.getElementConfig = function() {
		var config = mw.ext.forms.formElement.Dropdown.parent.prototype.getElementConfigInternal.call( this );

		config.options = {
			type: 'multiplier',
			name: 'options',
			noLayout: true,
			base: [ {
				type: 'text',
				name: 'data',
				label: mw.message( 'ext-forms-label-data' ).text(),
				required: true
			}, {
				type: 'text',
				name: 'label',
				label: mw.message( 'ext-forms-label-label' ).text(),
				required: true
			} ],
			widget_data: {
				tab: 'options'
			}
		};

		return this.returnConfig( config );
	};

	mw.ext.forms.formElement.Dropdown.prototype.getType = function() {
		return "dropdown";
	};

	mw.ext.forms.formElement.Dropdown.prototype.getWidgets = function() {
		return {
			view: mw.ext.forms.widget.view.OptionView,
			edit: OO.ui.DropdownInputWidget
		};
	};

	mw.ext.forms.registry.Type.register( "dropdown", new mw.ext.forms.formElement.Dropdown() );

} )( mediaWiki, jQuery );
