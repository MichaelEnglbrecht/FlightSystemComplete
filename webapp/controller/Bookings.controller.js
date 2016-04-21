sap.ui.define([
	"sap/training/flight/controller/BaseController",
	"sap/ui/core/format/DateFormat"
], function(Controller, DateFormat) {
	"use strict";

	return Controller.extend("sap.training.flight.controller.Bookings", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf sap.training.flight.view.Bookings
		 */
		onInit: function() {
			this.getRouter().getRoute("bookings").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function(oEvent) {
			this.sObjectId = oEvent.getParameter("arguments").carrierId;
			this.sConnId = oEvent.getParameter("arguments").connid;
			this.sFlDate = decodeURIComponent(oEvent.getParameter("arguments").fldate);
			this.getModel().metadataLoaded().then(function() {
				var sObjectPath = this.getModel().createKey("FlightSet", {
					Carrid: this.sObjectId,
					Connid: this.sConnId,
					Fldate: this.sFlDate
				});

				sObjectPath = sObjectPath.replace("FlightSet", "Flights");

				var sCarrierPath = this.getModel().createKey("CarrierSet", {
					Carrid: this.sObjectId
				});
				this._currentNavigationPath = "/" + sCarrierPath + " .. " + sObjectPath;
				this._bindView("/" + sCarrierPath + " .. " + sObjectPath + "/Bookings");
			}.bind(this));
		},

		_bindView: function(sObjectPath) {

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {

					},
					dataReceived: function() {

					}
				}
			});
		},
		_onBindingChange: function() {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				return;
			}
		},

		handleCreatePressed: function() {
			var dateFormat = DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd hh:mm"
			});
			var oFlDate = encodeURIComponent(dateFormat.format(new Date(Date.parse(this.sFlDate))));

			this.getRouter().getTargets().display("createbooking", {
				carrierId: this.sObjectId,
				connid: this.sConnId,
				fldate: oFlDate
			});

			/*	this.getRouter().navTo("createbooking", {
				carrierId: this.sObjectId,
				connid: this.sConnId,
				fldate: oFlDate
			}, true);*/
		},

		handleStornoPressed: function(oEvent) {

			var carrId = oEvent.getSource().data("Carrid");
			var bookId = oEvent.getSource().data("Bookid");

			var oModel = this.getView().getModel();

			oModel.callFunction("/CancelBooking", {
				method: "POST",
				urlParameters: {
					Carrid: carrId,
					Bookid: bookId
				},
				error: function(oError) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.error(oError.responseText);
				}
			});
		},
		handleConfirmPressed: function(oEvent) {

			var carrId = oEvent.getSource().data("Carrid");
			var bookId = oEvent.getSource().data("Bookid");

			var oModel = this.getView().getModel();

			oModel.callFunction("/ConfirmBooking", {
				method: "POST",
				urlParameters: {
					Carrid: carrId,
					Bookid: bookId
				},
				error: function(oError) {
					jQuery.sap.require("sap.m.MessageBox");
					sap.m.MessageBox.error(oError.responseText);
				}
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf sap.training.flight.view.Bookings
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf sap.training.flight.view.Bookings
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf sap.training.flight.view.Bookings
		 */
		//	onExit: function() {
		//
		//	}

	});

});