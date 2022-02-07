<?php

if ( !defined( 'MEDIAWIKI' ) && !defined( 'MW_PHPUNIT_TEST' ) ) {
	return;
}

if ( defined( 'MWSTAKE_MEDIAWIKI_COMPONENT_FORMENGINE_VERSION' ) ) {
	return;
}

define( 'MWSTAKE_MEDIAWIKI_COMPONENT_FORMENGINE_VERSION', '2.0.1' );

MWStake\MediaWiki\ComponentLoader\Bootstrapper::getInstance()
->register( 'formengine', function () {
	$GLOBALS['wgHooks']['ResourceLoaderRegisterModules'][] = function ( $resourceLoader ) {
		$resourceLoader->register( [ 'ext.forms.init' => [
			'localBasePath' => __DIR__ . '/lib' ,
			'scripts' => [ "ext.forms.init.js" ],
			'messages' => [ "mwstake-formengine-session-loss-error" ],
			'dependencies' => [
				"ext.forms.widgets",
				"oojs-ui.styles.icons-content",
				"oojs-ui.styles.icons-moderation",
				"oojs-ui.styles.icons-editing-core",
				"oojs-ui.styles.icons-editing-advanced",
				"oojs-ui.styles.icons-editing-styling",
				"oojs-ui.styles.icons-interactions",
				"oojs-ui.styles.icons-layout",
				"oojs-ui.styles.icons-media",
				"oojs-ui-windows.icons"
			]
		] ] );

		$resourceLoader->register( [ "ext.forms.define" => [
			'localBasePath' => __DIR__ . '/lib' ,
			'scripts' => [ "ext.forms.define.js" ],
			'dependencies' => [
				"oojs-ui"
			]
		] ] );

		$resourceLoader->register( [ "ext.forms.standalone" => [
			'localBasePath' => __DIR__ . '/lib' ,
			'scripts' => [ "standalone/Form.js" ],
			'dependencies' => [
				"ext.forms.widgets"
			]
		] ] );

		$resourceLoader->register( [ "ext.forms.widgets" => [
			'localBasePath' => __DIR__ . '/lib' ,
			'scripts' => [
				"mixin/BookletLayoutParser.js",
				"mixin/IndexLayoutParser.js",
				"mixin/DefinitionParser.js",
				"mixin/FormLoadingAlert.js",
				"mixin/FloatableButtons.js",
				"mixin/EditSummary.js",
				"mixin/Message.js",
				"mixin/Autosave.js",
				"widget/edit/CategoryMultiselect.js",
				"widget/edit/RadioSelectInputWidget.js",
				"widget/edit/Checkbox.js",
				"widget/edit/Radio.js",
				"widget/edit/SelectFileInputWidget.js",
				"widget/edit/MultiStep.js",
				"widget/edit/ProgressBar.js",
				"widget/edit/Multiplier.js",
				"widget/edit/Listeners.js",
				"widget/edit/CustomFormProps.js",
				"widget/edit/FormImport.js",
				"widget/view/SingleImageView.js",
				"widget/view/BooleanView.js",
				"widget/view/CategoryMultiselectView.js",
				"widget/view/TextView.js",
				"widget/view/WikiText.js",
				"widget/view/OptionView.js",
				"widget/view/CheckboxMultiselectView.js",
				"widget/view/MenuTagMultiselectView.js",
				"widget/view/Multiplier.js",
				"widget/edit/CheckboxMultiselect.js",
				"widget/view/RadioSelectView.js",
				"widget/view/SectionLabel.js",
				"widget/Form.js",
				"widget/FormPicker.js",
				"formElement/base/FormElement.js",
				"formElement/base/InputFormElement.js",
				"formElement/base/FormLayoutElement.js",
				"formElement/Text.js",
				"formElement/TextArea.js",
				"formElement/WikiText.js",
				"formElement/StaticWikiText.js",
				"formElement/Text.js",
				"formElement/Button.js",
				"formElement/CategoryMultiselect.js",
				"formElement/Checkbox.js",
				"formElement/Multiplier.js",
				"formElement/FormImport.js",
				"formElement/Listeners.js",
				"formElement/MenuTagMultiselect.js",
				"formElement/CustomFormProps.js",
				"formElement/CheckboxMultiselect.js",
				"formElement/Dropdown.js",
				"formElement/Icon.js",
				"formElement/Indicator.js",
				"formElement/Label.js",
				"formElement/MultiStep.js",
				"formElement/MultiStepStep.js",
				"formElement/Number.js",
				"formElement/ProgressBar.js",
				"formElement/Radio.js",
				"formElement/RadioMultiselect.js",
				"formElement/SectionLabel.js",
				"formElement/SelectFile.js",
				"formElement/layout/HorizontalLayout.js",
				"formElement/layout/BookletLayout.js",
				"formElement/layout/BookletLayoutPage.js",
				"formElement/layout/IndexLayoutTab.js",
				"formElement/layout/IndexLayout.js",
				"formElement/layout/FieldsetLayout.js",
				"formElement/Title.js"
			],
			'styles' => [ "ext.forms.form.less" ],
			'dependencies' => [
				"ext.forms.define",
				"oojs-ui",
				"ext.oOJSPlus.data",
				"ext.oOJSPlus.widgets",
				"mediawiki.widgets.CategoryMultiselectWidget"
			],
			'messages' => [
				"mwstake-formengine-form-picker-picker-label",
				"mwstake-formengine-form-picker-layout-help",
				"mwstake-formengine-form-picker-layout-label",
				"mwstake-formengine-error-invalid-form",
				"mwstake-formengine-form-loading-label",
				"mwstake-formengine-form-submit-label",
				"mwstake-formengine-form-reset-label",
				"mwstake-formengine-form-cancel-label",
				"mwstake-formengine-message-ack-button-tooltip",
				"mwstake-formengine-form-validation-failed",
				"mwstake-formengine-form-submit-success",
				"mwstake-formengine-api-generic-error",
				"mwstake-formengine-form-form-name-label",
				"mwstake-formengine-edit-summary-placeholder",
				"mwstake-formengine-inclusion-error-form-not-includable",
				"mwstake-formengine-inclusion-form-submit-ps-enabled-label",
				"mwstake-formengine-form-save-label",
				"mwstake-formengine-form-autosave-success",
				"mwstake-formengine-label-next-step",
				"mwstake-formengine-no-default-value"
			]
		] ] );
	};

	$GLOBALS['wgMessagesDirs']['mwstake-component-formengine'] = __DIR__ . '/i18n';
} );
