    // require mock server implementation
    sap.ui.define(['sap/ui/core/mvc/Controller','sap/ui/model/json/JSONModel'],
    	function(Controller, JSONModel) {
    	"use strict";
     
    	var ListController = Controller.extend("sap.ui.iride.controller.TupleList", {
            tuples:[
                {
                    id:1,
                    level: ["INFO", "CONTATTO", "DEBITO"]
                },
                {
                    id:2,
                    level: ["INFO", "CONTATTO", "DEBITO"]
                },
                {
                    id:3,
                    level: ["INFO", "CONTATTO", "DEBITO"]
                }],
     
    		onInit: function(oEvent) {
     
    			// NOTE TO DEVELOPERS: You do not need to reproduce this following section
    			// It is just so we can simulate 1000ms delay from the fictional OData service
    			// MockServer.start();
     
    			// create and set ODATA Model
				this.oViewModel = new JSONModel({tuples:this.tuples});

    			this.getView().setModel(this.oViewModel, "view");
    		},
     
    		onExit : function() {
    			// NOTE TO DEVELOPERS: You do not need to reproduce this following section
    			// It stops the fictional OData service generated onInit
    			// MockServer.stop();
     
    			// destroy the model and clear the model data
    			this.oViewModel.destroy();
    		},
     
    		handleDelete: function(oEvent) {
    			var oList = oEvent.getSource(),
    				oItem = oEvent.getParameter("listItem");
            for (var p in oItem.getAttributes() ) {
              console.log(oItem.getAttributes()[p].getTitle())
            }
    		},
    	});
     
     
    	return ListController;
     
    });