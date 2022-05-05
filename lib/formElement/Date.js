( function ( mw, $, undefined ) {
	mw.ext.forms.formElement.Date = function() {};

	OO.inheritClass( mw.ext.forms.formElement.Date, mw.ext.forms.formElement.InputFormElement );

	mw.ext.forms.formElement.Date.prototype.getElementConfig = function() {
		var config = mw.ext.forms.formElement.Date.parent.prototype.getElementConfigInternal.call( this );

		config.value.type = 'date';
		config.value.label =  mw.message( 'mwstake-formengine-label-date-default' ).text();
		return this.returnConfig( config );
	};

	mw.ext.forms.formElement.Date.prototype.getType = function() {
		return "date";
	};

	mw.ext.forms.formElement.Date.prototype.getWidgets = function() {
		return {
			view: mw.ext.forms.widget.view.TextView,
			edit: mw.ext.forms.widget.edit.Date
		};
	};

	mw.ext.forms.registry.Type.register( "date", new mw.ext.forms.formElement.Date() );

} )( mediaWiki, jQuery );