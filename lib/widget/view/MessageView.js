mw.ext.forms.widget.view.MessageView = function( cfg ) {
	cfg.label = cfg.title;
	mw.ext.forms.widget.view.MessageView.parent.call( this, cfg );
};

OO.inheritClass( mw.ext.forms.widget.view.MessageView, OO.ui.MessageWidget );