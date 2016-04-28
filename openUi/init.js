		sap.ui.getCore().attachInit(function () {
			new sap.m.Shell({
				app: new sap.ui.core.ComponentContainer({
					name: "sap.ui.iride"
				})
			}).placeAt("content");
		});
