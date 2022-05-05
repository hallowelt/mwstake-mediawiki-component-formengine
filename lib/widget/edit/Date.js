( function ( mw, $, undefined ) {
	mw.ext.forms.widget.edit.Date = function( cfg ) {
		mw.ext.forms.widget.edit.Date.parent.call( this, cfg );
	};

	OO.inheritClass( mw.ext.forms.widget.edit.Date, mw.widgets.DateInputWidget );

} )( mediaWiki, jQuery );
