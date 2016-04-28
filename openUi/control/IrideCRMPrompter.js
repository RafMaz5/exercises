sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";

	return Control.extend("sap.ui.iride.control.IrideCRMPrompter", {
		startDate: (new Date()).getTime(),
		connection : {},
		initConnection: function(contactId, terminalId) {
			this.connection = new Connection(contactId,terminalId, this.receiveMessage);
		}, 
		classify: function(note) {
			var now = (new Date()).getTime();
			var sessionDuration = Math.round((now - this.startDate)/1000);
			this.connection.classifyNote(note, sessionDuration);
		},
		receiveMessage: function(msg) {
			console.log(msg);
		},
		onInit: function() {
			alert('jklsdfasdfj');
		}
	});
});
