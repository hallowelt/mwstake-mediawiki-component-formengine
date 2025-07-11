( function ( mw, $ ) {
	mw.ext.forms.mixin.DefinitionParser = function () {
		this.title = this.definition.title || '';
		this.showTitle = this.definition.showTitle || false;
		this.showFormName = this.definition.showFormName || false;
		this.sealAfterCreation = this.definition.sealAfterCreation || false;
		this.buttonsFloat = this.definition.buttonsFloat || false;
		this.target = this.definition.target || null;
		this.rawItems = this.definition.items || [];
		this.formListeners = this.definition.listeners || {};
		this.enableEditSummary = this.definition.editSummary || false;
		this.includable = this.definition.includable || false;
		this.enableProgressSave = this.definition.enableProgressSave || false;
		this.fieldLabelAlign = this.definition.fieldLabelAlign || 'left';
		this.items = {
			inputs: {},
			statics: {}
		};

		this.typeMap = mw.ext.forms.registry.Type.registry;
	};

	OO.initClass( mw.ext.forms.mixin.DefinitionParser );

	mw.ext.forms.mixin.DefinitionParser.static.reservedKeywords = [
		'type', 'label', 'name', 'help', 'listeners', 'widget_listeners',
		'showOn', 'editableOn', 'noLayout', 'style', 'level', 'labelAlign'
	];

	mw.ext.forms.mixin.DefinitionParser.prototype.parseDefinition = function () {
		const dfd = $.Deferred();

		if ( this.showTitle ) {
			this.layout.setLabel( this.title );
		}
		if ( this.showFormName ) {
			this.addFormNameWidget();
		}

		const includablePromise = $.Deferred();
		this.resolveIncludables( includablePromise );
		includablePromise.promise().done( () => {
			let items = [];
			if ( !this.forInclusion ) {
				items = this.parseItems( this.rawItems, this.layout );
			}
			if ( this.forPreview ) {
				items = this.parseItems( this.rawItems, this.layout, true );
			}
			dfd.resolve( items );
		} );
		return dfd.promise();
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.resolveIncludables = function ( dfd ) {
		let i, item, includableItems, includableForm, indexToReplace;
		for ( i = 0; i < this.rawItems.length; i++ ) {
			item = this.rawItems[ i ];
			if ( item.type === 'formImport' ) {
				includableForm = item.form;
				indexToReplace = i;
				break;
			}
		}

		if ( !includableForm ) {
			return dfd.resolve();
		}

		const form = new mw.ext.forms.widget.Form( {
			definitionName: includableForm,
			action: this.action,
			forInclusion: true,
			data: {}
		} );
		form.connect( this, {
			parseComplete: function () {
				includableItems = form.rawItems;
				this.rawItems.splice( indexToReplace, 1 );
				const args = [ indexToReplace, 0 ].concat( includableItems );
				this.rawItems.splice.apply( this.rawItems, args );
				this.resolveIncludables( dfd );
			},
			inclusionError: function ( message ) {
				this.rawItems.splice( indexToReplace, 1 );
				this.resolveIncludables( dfd );
			}
		} );

	};

	mw.ext.forms.mixin.DefinitionParser.prototype.parseItems = function ( items, layout, justParse ) {
		justParse = justParse || false;
		let parsedItems = {}, parseResult;
		for ( let i = 0; i < items.length; i++ ) {
			const item = items[ i ];

			const separatedConfig = this.separateConfigs( item );
			const itemConfig = separatedConfig.itemConfig;
			const widgetConfig = separatedConfig.widgetConfig;
			if ( !itemConfig.hasOwnProperty( 'type' ) ) {
				// No type set
				continue;
			}

			if ( this.shouldShow( itemConfig.showOn ) === false ) {
				// Set not to show
				continue;
			}

			if ( itemConfig.type.slice( 0, 6 ) === 'layout' ) {
				// "Regular" layouts, with items parameter
				if ( widgetConfig.hasOwnProperty( 'items' ) ) {
					widgetConfig.layoutItems = widgetConfig.items;
					delete ( widgetConfig.items );
				}
				// If expanded is true, it will try to take up the entire form
				// which we don't want ever
				widgetConfig.expanded = false;
			}

			const widgetFunc = this.getWidgetFromType( itemConfig.type );
			if ( widgetFunc === null ) {
				continue;
			}

			if ( itemConfig.hasOwnProperty( 'level' ) ) {
				widgetConfig.classes = widgetConfig.classes || [];
				widgetConfig.classes.push( 'level-' + itemConfig.level );
			}

			// Inject form context into any widget displayed in it
			widgetConfig.form = this;
			let widgetInstance;
			try {
				widgetInstance = new widgetFunc( widgetConfig ); // eslint-disable-line new-cap
				if ( itemConfig.hasOwnProperty( 'listeners' ) ) {
					this.addListenersToWidget( widgetInstance, itemConfig.listeners );
				}
				if ( itemConfig.hasOwnProperty( 'widget_listeners' ) ) {
					this.addListenersToWidget( widgetInstance, itemConfig.widget_listeners );
				}
			} catch ( error ) {
				console.log( error ); // eslint-disable-line no-console
				continue;
			}

			if ( widgetInstance instanceof OO.ui.Layout ) {
				parseResult = this.parseLayout( itemConfig.name, widgetConfig, widgetInstance, layout, justParse );
				parsedItems = $.extend( parsedItems, parseResult ); // eslint-disable-line no-jquery/no-extend
				continue;
			}

			if ( this.editMode ) {
				parseResult = this.addEditWidget( itemConfig, widgetConfig, widgetInstance, layout, justParse );
				parsedItems = $.extend( parsedItems, parseResult ); // eslint-disable-line no-jquery/no-extend
			} else {
				parseResult = this.addViewWidget( itemConfig, widgetConfig, widgetInstance, layout, justParse );
				parsedItems = $.extend( parsedItems, parseResult ); // eslint-disable-line no-jquery/no-extend
			}
		}

		// Set value to all the items parsed - this is done after everything
		// is parsed to avoid firing any events before all items are available
		for ( const itemName in parsedItems ) {
			const value = this.getValueFor( itemName );
			if ( value ) {
				parsedItems[ itemName ].setValue( value );
			}
		}

		return parsedItems;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.parseLayout = function ( name, config, layout, hostLayout, justParse ) {
		name = name || this.getNameForStatic();
		if ( layout instanceof OO.ui.BookletLayout ) {
			this.parseBooklet( config.pages, layout );
			layout = this.wrapInPanel( layout, config.framed );
		} else if ( layout instanceof OO.ui.IndexLayout ) {
			this.parseIndexLayout( config.tabs, layout );
			layout = this.wrapInPanel( layout, config.framed );
		} else if ( config.hasOwnProperty( 'layoutItems' ) ) {
			for ( let li = 0; li < config.layoutItems.length; li++ ) {
				const layoutItem = config.layoutItems[ li ];
				if ( !layoutItem.hasOwnProperty( 'noLayout' ) || layoutItem.noLayout !== false ) {
					layoutItem.noLayout = true;
				}
			}
		} else {
			// No special layout and no items - nothing to display
			return;
		}

		if ( !justParse ) {
			this.items.statics[ name ] = layout;
		}

		hostLayout.addItems( [ layout ] );
		if ( config.hidden ) {
			this.hideItem( name );
		}

		const res = {};
		res[ name ] = layout;

		return res;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.wrapInPanel = function ( widget, framed ) {
		return new OO.ui.PanelLayout( {
			expanded: false,
			framed: !!framed,
			classes: [ 'forms-form-layout-inner' ],
			content: [ widget ]
		} );
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.addFormNameWidget = function () {
		if ( this.action === 'view' ) {
			this.layout.addItems( [ new OO.ui.HorizontalLayout( {
				classes: [ 'forms-form-view-layout', 'control-wrap', 'auto-wrap' ],
				items: [
					new OO.ui.LabelWidget( {
						label: mw.message( 'mwstake-formengine-form-form-name-label' ).text(),
						classes: [ 'view-label' ]
					} ),
					new OO.ui.LabelWidget( {
						label: this.definitionName
					} )
				]
			} ) ] );
		} else if ( this.action === 'edit' ) {
			this.layout.addItems( [
				new OO.ui.FieldLayout( new OO.ui.TextInputWidget( {
					classes: [ 'forms-form-edit-layout', 'control-wrap', 'auto-wrap' ],
					value: this.definitionName,
					disabled: true,
					align: this.fieldLabelAlign
				} ), {
					label: mw.message( 'mwstake-formengine-form-form-name-label' ).text()
				} )
			] );
		}
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.addViewWidget = function ( config, widgetConfig, widget, layout, justParse ) {
		const name = config.name || this.getNameForStatic();
		if ( !justParse ) {
			if ( config.hasOwnProperty( 'name' ) && this.getValueFor( config.name ) !== null ) {
				this.items.inputs[ name ] = widget;
			} else {
				this.items.statics[ name ] = widget;
			}
		}

		if ( config.noLayout === true || !config.hasOwnProperty( 'name' ) ) {
			if ( config.style ) {
				widget.$element.attr( 'style', config.style );
			}
			layout.addItems( [ widget ] );
		} else {
			const viewLayout = new OO.ui.HorizontalLayout( {
				classes: [ 'forms-form-view-layout', 'control-wrap', 'auto-wrap' ],
				items: [
					new OO.ui.LabelWidget( {
						label: config.label || config.name,
						classes: [ 'view-label' ]
					} ),
					widget
				]
			} );
			if ( config.style ) {
				viewLayout.$element.attr( 'style', config.style );
			}
			layout.addItems( [ viewLayout ] );
		}
		if ( widgetConfig.hidden ) {
			this.hideItem( name );
		}

		widget.emit( 'render', widget );
		return {
			[ name ]: widget
		};
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.parseCustomProps = function ( props ) {
		if ( !$.isPlainObject( props ) ) {
			return {};
		}
		const parsed = {};
		for ( const name in props ) {
			if ( !props.hasOwnProperty( name ) ) {
				continue;
			}
			const value = props[ name ];
			if ( !isNaN( value ) ) {
				parsed[ name ] = parseFloat( value );
				continue;
			}
			if ( value === 'true' ) {
				parsed[ name ] = true;
				continue;
			}
			if ( value === 'false' ) {
				parsed[ name ] = false;
				continue;
			}
			parsed[ name ] = value;
		}

		return parsed;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.addEditWidget = function ( config, widgetConfig, widget, layout, justParse ) {
		const isInput = widget instanceof OO.ui.InputWidget || this.typeMap[ config.type ].isInput();
		if ( isInput && !config.name ) {
			// All inputs must have name
			return;
		}
		const name = config.name || this.getNameForStatic();

		if ( isInput ) {
			if ( !this.shouldEdit( config.editableOn ) ) {
				widget.setDisabled( true );
			}
			if ( !justParse ) {
				this.items.inputs[ name ] = widget;
			}
		} else if ( !justParse ) {
			this.items.statics[ name ] = widget;
		}

		// If explicitly set, or if widget is input and its not explicitly set to false
		if ( config.noLayout === true || ( config.noLayout !== false && !isInput ) ) {
			if ( config.style ) {
				widget.$element.attr( 'style', config.style );
			}
			layout.addItems( [ widget ] );
		} else {
			const widgetLayout = new OO.ui.FieldLayout( widget, {
				classes: [ 'forms-form-edit-layout', 'control-wrap', 'auto-wrap' ],
				label: config.label || config.name,
				help: config.help || '',
				align: config.labelAlign || this.fieldLabelAlign
			} );
			if ( config.style ) {
				widgetLayout.$element.attr( 'style', config.style );
			}
			layout.addItems( [ widgetLayout ] );
		}

		if ( widgetConfig.hidden ) {
			this.hideItem( name );
		}

		widget.emit( 'render', widget );
		return {
			[ name ]: widget
		};
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.getWidgetFromType = function ( type ) {
		if ( !this.typeMap.hasOwnProperty( type ) ) {
			type = '_default';
		}

		const element = this.typeMap[ type ];
		const widgetDef = element.getWidgets();
		if ( widgetDef === null ) {
			return null;
		}
		if ( this.action === 'view' && widgetDef.hasOwnProperty( 'view' ) ) {
			return widgetDef.view;
		} else if ( this.action !== 'view' && widgetDef.hasOwnProperty( 'edit' ) ) {
			return widgetDef.edit;
		}
		return widgetDef;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.getValueFor = function ( name ) {
		const parts = name.split( '.' );
		let value = this.data[ parts[ 0 ] ];
		for ( let i = 1; i < parts.length; i++ ) {
			if ( i < parts.length ) {
				if ( $.type( value ) !== 'object' || !value.hasOwnProperty( parts[ i ] ) ) { // eslint-disable-line no-jquery/no-type
					return null;
				}
			}
			value = value[ parts[ i ] ];
		}

		return value;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.shouldShow = function ( showOn ) {
		return this._shouldAction( showOn );
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.shouldEdit = function ( editableOn ) {
		return this._shouldAction( editableOn );
	};

	mw.ext.forms.mixin.DefinitionParser.prototype._shouldAction = function ( cond ) {
		if ( !cond ) {
			return true;
		}

		if ( typeof cond === 'function' ) {
			return cond();
		}

		if ( Array.isArray( cond ) === false ) {
			cond = [ cond ];
		}

		if ( cond.indexOf( this.action ) !== -1 ) {
			return true;
		}

		return false;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.separateConfigs = function ( item ) {
		const itemConfig = {};
		const widgetConfig = {};

		if ( item.hasOwnProperty( 'widgetCustomProps' ) ) {
			item = $.extend( item, this.parseCustomProps( item.widgetCustomProps ) ); // eslint-disable-line no-jquery/no-extend
			delete ( item.widgetCustomProps );
		}

		for ( let name in item ) {
			if ( !item.hasOwnProperty( name ) ) {
				continue;
			}
			const value = item[ name ];

			if ( mw.ext.forms.mixin.DefinitionParser.static.reservedKeywords.indexOf( name ) !== -1 ) {
				itemConfig[ name ] = value;
			} else {
				// If a reserved keyword should actually go to the widget config
				// it must be prefixed with "widget_"
				if ( name.slice( 0, 7 ) === 'widget_' ) {
					name = name.slice( 7 );
				}
				widgetConfig[ name ] = value;
			}
		}

		return {
			itemConfig: itemConfig,
			widgetConfig: widgetConfig
		};
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.getItem = function ( name ) {
		if ( this.items.inputs.hasOwnProperty( name ) ) {
			return this.items.inputs[ name ];
		}
		if ( this.items.statics.hasOwnProperty( name ) ) {
			return this.items.statics[ name ];
		}
		return null;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.showItem = function ( name ) {
		this.setItemVisibility( name, true );
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.hideItem = function ( name ) {
		this.setItemVisibility( name, false );
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.setItemVisibility = function ( name, visible ) {
		const item = this.getItem( name );
		let $el;
		if ( item === null ) {
			return;
		}

		if ( item.$element.closest( '.auto-wrap' ).hasClass( 'control-wrap' ) ) {
			$el = item.$element.closest( '.auto-wrap' );
		} else {
			$el = item.$element;
		}

		if ( visible ) {
			$el.show();
		} else {
			$el.hide();
		}
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.getItems = function () {
		return this.items;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.addListenersToWidget = function ( widget, listeners ) {
		for ( const event in listeners ) {
			if ( !event ) {
				continue;
			}
			if ( !listeners.hasOwnProperty( event ) ) {
				continue;
			}
			const handler = listeners[ event ];
			if ( typeof handler !== 'function' ) {
				continue;
			}

			widget.on( event, handler.bind( this ) );
		}
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.getInputs = function () {
		return this.items.inputs;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.getStatics = function () {
		return this.items.statics;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.getRandomName = function ( type, num ) {
		num = num || 1;
		const name = type + '-' + num;
		if ( this.items.statics.hasOwnProperty( name ) ) {
			num++;
			return this.getRandomName( num, type );
		}
		return name;
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.getNameForStatic = function ( num ) {
		return this.getRandomName( 'static', num );
	};

	mw.ext.forms.mixin.DefinitionParser.prototype.getNameForInput = function ( num ) {
		return this.getRandomName( 'input', num );
	};

}( mediaWiki, jQuery ) );
