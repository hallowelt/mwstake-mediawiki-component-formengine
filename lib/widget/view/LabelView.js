mw.ext.forms.widget.view.LabelView = function( cfg ) {
	cfg.label = cfg.title;
	mw.ext.forms.widget.view.LabelView.parent.call( this, cfg );
};

OO.inheritClass( mw.ext.forms.widget.view.LabelView, OO.ui.LabelWidget );