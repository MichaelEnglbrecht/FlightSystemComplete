sap.ui.controller("sap.training.flight.controller.view.NotFound", {

	getRouter: function() {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},

	onNavBack: function() {
		var oHistory, sPreviousHash, oRouter;

		oHistory = sap.ui.core.routing.History.getInstance();
		sPreviousHash = oHistory.getPreviousHash();

		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			oRouter = this.getRouter();
			oRouter.navTo("overview", true /*no history*/ );
		}
	}

});