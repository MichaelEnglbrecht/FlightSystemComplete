sap.ui.define([
	"sap/training/flight/controller/BaseController",
	"sap/ui/model/json/JSONModel"
], function(Controller,JSONModel) {
	"use strict";

	return Controller.extend("sap.training.flight.controller.CreateBooking", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.training.flight.view.CreateBooking
		 */
		onInit: function() {
			var oRouter, oTarget;
			oRouter = this.getRouter();
			oTarget = oRouter.getTarget("createbooking");
			oTarget.attachDisplay(function(oEvent) {
				this._oData = oEvent.getParameter("data"); //store the data
				var oModel = this.getOwnerComponent().getModel();
				var carrId = this._oData.carrierId;
				var connId = this._oData.connid;
				var fldate = decodeURIComponent(this._oData.fldate);
				
				var oViewModel = new JSONModel();
				oViewModel.setData({"Carrid":carrId, "Connid": connId,"Fldate":fldate, "Customid": "",
				"Passname": "",
				"Counter": "1"});

				this.getView().setModel(oViewModel,"viewModel");
			}, this);
		},

		handleSavePressed: function(oEvent) {

			var carrId = this._oData.carrierId;
			var connId = this._oData.connid;
			var fldate = decodeURIComponent(this._oData.fldate);


			var oViewModel = this.getView().getModel("viewModel");
				var sObjectPath = this.getModel().createKey("FlightSet", {
					Carrid: carrId,
					Connid: connId,
					Fldate: fldate
				});
		
			var oModel = this.getOwnerComponent().getModel();
			oModel.create("/BookingSet", oViewModel.getData(), {
				success: function(OData) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.success("Buchung angelegt mit Buchungsnummer " + OData.Bookid);
				},
				error: function(oError) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.error(oError.responseText);
				}
			});
		},

		handleCancelPressed: function(oEvent) {
			this.getOwnerComponent().getModel().deleteCreateEntry();
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sap.training.flight.view.CreateBooking
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sap.training.flight.view.CreateBooking
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sap.training.flight.view.CreateBooking
		 */
		//	onExit: function() {
		//
		//	}

	});

});