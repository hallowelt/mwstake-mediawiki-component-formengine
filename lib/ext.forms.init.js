( function( mw, $, undefined ) {
	mw.ext.forms.init = _init;

	function _init( $formContainer, showPicker ) {
		if ( $formContainer.length === 0 ) {
			return;
		}
		var form = $formContainer.data( 'form' );
		var data = $formContainer.data( 'data' );
		var formCreated = $formContainer.data( 'form-created' );
		var action = $formContainer.data( 'action' );
		var formPickerConfig = $formContainer.data( 'form-picker' ) || {};
		var autoSelectForm = formPickerConfig.autoSelectForm || false;

		if ( form ) {
			_makeForm( form );
		} else if ( showPicker ) {
			_showDefinitionPicker();
		} else {
			_showNoForm();
		}

		function _showDefinitionPicker() {
			var definitionPicker = new mw.ext.forms.widget.FormPicker( formPickerConfig );
			definitionPicker.on( 'definitionSelected', _makeForm );
			$formContainer.append( definitionPicker.$element );
			if ( autoSelectForm ) {
				definitionPicker.selectFirst();
			}
		}

		function _makeForm( form ) {
			var form = new mw.ext.forms.widget.Form( {
				definitionName: form,
				action: action,
				data: data,
				createdOn: formCreated || ''
			} );
			$formContainer.find( '.mw-ext-forms-form' ).remove();
			$formContainer.append( form.$element );

			// BlueSpiceDiscovery skin special case
			if ( $( 'body' ).hasClass( 'base-bluespicediscovery' ) || $( 'body' ).hasClass( 'skin-bluespicediscovery' ) ) {
				form.connect( this, {
					initComplete: function () {
						var offset = $('#main').offset().top + $('#title-line').height();
						form.$element.children( '.form-instance-toolbar' ).css( 'top', offset );
					}
				} );
			}
		}

		function _showNoForm() {
			// TODO: IMPLEMENT
		}
	}

	$( function() {
		$( '.forms-form-container' ).each( function( k, container ) {
			var $formContainer = $( container );
			mw.ext.forms.init( $formContainer, true );
		} );
	} );

} )( mediaWiki, jQuery );
