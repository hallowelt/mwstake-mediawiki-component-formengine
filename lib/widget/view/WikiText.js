( function ( mw, $, undefined ) {
	mw.ext.forms.widget.view.WikiText = function( cfg ) {
		var classes = [ 'ext-forms-widget-view-wikitext' ];
		cfg.classes = cfg.classes ? cfg.classes.concat( classes ) : classes;
		mw.ext.forms.widget.view.WikiText.parent.call( this, cfg );
		if ( cfg.hasOwnProperty( 'wikitext' ) ) {
			this.setValue( cfg.wikitext );
		}
	};

	OO.inheritClass( mw.ext.forms.widget.view.WikiText, OO.ui.Widget );

	mw.ext.forms.widget.view.WikiText.static.tagName = 'div';

	mw.ext.forms.widget.view.WikiText.prototype.setValue = function( value ) {
		if ( !value ) {
			return;
		}
		this.setLoading();
		this.parse( value ).done( function( response ) {
			this.setText( response.parse.text['*'] );
		}.bind( this ) ).fail( function() {
			this.setText( this.getParseErrorText() );
		}.bind( this ) );
	};

	mw.ext.forms.widget.view.WikiText.prototype.parse = function( value ) {
		return new mw.Api().get( {
			action: 'parse',
			text: value,
			contentmodel: 'wikitext'
		} );
	};

	mw.ext.forms.widget.view.WikiText.prototype.setLoading = function() {
		this.setText( new OO.ui.LabelWidget( {
			label: mw.message( 'forms-form-view-widget-wikitext-parsing' ).text(),
			classes: [ 'ext-forms-widget-view-wikitext-loading' ]
		} ).$element );
	};

	mw.ext.forms.widget.view.WikiText.prototype.setText = function( text ) {
		this.$element.html( text );
	};

	mw.ext.forms.widget.view.WikiText.prototype.getParseErrorText = function() {
		return new OO.ui.LabelWidget( {
			label: mw.message( 'forms-form-view-widget-wikitext-parsing-error' ).text(),
			classes: [ 'ext-forms-widget-view-wikitext-error' ]
		} ).$element;
	};

} )( mediaWiki, jQuery );