/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','sap/ui/Device','./library'],function(q,C,D,l){"use strict";var T=C.extend("sap.m.Title",{metadata:{library:"sap.m",interfaces:["sap.ui.core.IShrinkable"],properties:{text:{type:"string",group:"Appearance",defaultValue:null},level:{type:"sap.ui.core.TitleLevel",group:"Appearance",defaultValue:sap.ui.core.TitleLevel.Auto},titleStyle:{type:"sap.ui.core.TitleLevel",group:"Appearance",defaultValue:sap.ui.core.TitleLevel.Auto},width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},textAlign:{type:"sap.ui.core.TextAlign",group:"Appearance",defaultValue:sap.ui.core.TextAlign.Initial}},associations:{title:{type:"sap.ui.core.Title",multiple:false}}}});T.prototype._getTitle=function(){var t=this.getTitle();if(t){var o=sap.ui.getCore().byId(t);if(o&&o instanceof sap.ui.core.Title){return o;}}return null;};T.prototype._onTitleChanged=function(){this.invalidate();};T.prototype.setTitle=function(t){var a=this;var o=this._getTitle();if(o){o.invalidate=o.__sapui5_title_originvalidate;o.exit=o.__sapui5_title_origexit;delete o.__sapui5_title_origexit;delete o.__sapui5_title_originvalidate;}this.setAssociation("title",t);var n=this._getTitle();if(n){n.__sapui5_title_originvalidate=n.invalidate;n.__sapui5_title_origexit=n.exit;n.exit=function(){a._onTitleChanged();if(this.__sapui5_title_origexit){this.__sapui5_title_origexit.apply(this,arguments);}};n.invalidate=function(){a._onTitleChanged();this.__sapui5_title_originvalidate.apply(this,arguments);};}return this;};return T;},true);
