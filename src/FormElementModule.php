<?php

namespace MWStake\MediaWiki\Component\FormEngine;

class FormElementModule extends \ResourceLoaderFileModule {
	public function __construct() {
		$options['localBasePath'] = dirname( __DIR__ ) . '/lib';
		$externalElements = $GLOBALS['mwsgFormEngineElementModules'];
		if ( !is_array( $externalElements ) ) {
			$externalElements = [];
		}
		$options['dependencies'] = array_merge( $externalElements, [ 'ext.forms.widgets' ] );
		parent::__construct( $options );
	}
}
