## MediaWiki Stakeholders Group - Components
# FormEngine for MediaWiki

Provides a OOJS based form engine for MediaWiki.

**This code is meant to be executed within the MediaWiki application context. No standalone usage is intended.**

## Use in a MediaWiki extension

Add `"mwstake/mediawiki-component-formengine": "~2.0"` to the `require` section of your `composer.json` file.

Since 2.0 explicit initialization is required. This can be archived by
- either adding `"callback": "mwsInitComponents"` to your `extension.json`/`skin.json`
- or calling `mwsInitComponents();` within you extensions/skins custom `callback` method

See also [`mwstake/mediawiki-componentloader`](https://github.com/hallowelt/mwstake-mediawiki-componentloader).

## Available ResourceLoader modules
- `ext.forms.init`
- `ext.forms.define`
- `ext.forms.standalone`
- `ext.forms.widgets`
- `ext.forms.form.less`

