( function ( mw, $) {
	mw.ext.forms.standalone.Form = function( cfg ) {
		OO.EventEmitter.call( this );

		this.form = new mw.ext.forms.widget.Form( {
			definitionName: 'Test',
			action: 'create',
			definition: {
				title: 'title',
				showTitle: true,
				target: {
					type: 'json-on-wikipage',
					title: 'Customer_{{customerName}}'
				},
				items: [
					{
						required: true,
						name: 'customerName',
						label: "COMPANY",
						type: 'text'
					},
					{
						name: 'noOfEmployees',
						label: "Number of emp",
						type: 'number',
						min: 1,
						max: 5000,
						value: 10
					}
				],
				listeners: {
					submit: function() {
						console.log( "SUB" );
					},
					reset: function() {
						// Do stuff on reset - scope: form
					},
					cancel: function() {
						// Do stuff on reset - scope: form
					}
				}
			}
		} );

		$( 'body' ).append( this.form.$element );
	};

	OO.initClass( mw.ext.forms.standalone.Form );
	OO.mixinClass( mw.ext.forms.standalone.Form, OO.EventEmitter );
} )( mediaWiki, jQuery );
