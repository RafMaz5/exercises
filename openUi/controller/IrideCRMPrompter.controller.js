sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/m/MessageToast",
  "sap/ui/iride/control/IrideCRMPrompter"
], function (Controller, MessageToast, PrompterConnection) {
  "use strict";

  var controller = {
    prompterConnection: {},

    onAutomaticClassify: function() {
      var sRecipient = this.getView().getModel().getProperty("/recipient/note");
      if(sRecipient.split(" ").length > 3) {
        this.prompterConnection.classify(sRecipient);
      }
    },

    onClassify: function () {
      // read msg from i18n model
      var oBundle = this.getView().getModel("i18n").getResourceBundle();
      var sRecipient = this.getView().getModel().getProperty("/recipient/note");
      this.prompterConnection.classify(sRecipient);
    },
    onInit: function (contactId, terminalId) {
      this.prompterConnection = new PrompterConnection();
      this.prompterConnection.initConnection('STOCAZZO', 'PIPPA');
    }
  };

  return Controller.extend("sap.ui.iride.controller.IrideCRMPrompter", controller);

});
