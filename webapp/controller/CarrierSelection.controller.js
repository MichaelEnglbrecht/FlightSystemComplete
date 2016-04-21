sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
"sap/training/flight/controller/BaseController",
	'sap/ui/model/Filter'
], function(jQuery, Fragment, Controller, Filter) {
	"use strict";

	return Controller.extend("sap.training.flight.controller.CarrierSelection", {

		onInit: function(oEvent) {
			this._carrierDeck = this.getView().byId("carrierDetails");
			this._carrierDeck.setVisible(false);
		},

		handleValueHelp: function(oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"sap.training.flight.view.Dialog",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}

			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter([new Filter(
				"Carrid",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},
		_handleValueHelpSearch: function(evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Carrid",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose: function(evt) {
			var oSelectedItem = evt.getParameter("selectedItem");

			if (oSelectedItem) {
				var productInput = this.getView().byId(this.inputId);
				productInput.setValue(oSelectedItem.getTitle());

				if (!this._carrierInformation) {
					this._carrierInformation = sap.ui.xmlfragment(
						"sap.training.flight.view.CarrierDetail",
						this
					);
					this._carrierDeck.addContent(this._carrierInformation);

					this._carrierDeck.setVisible(true);
				}
				this._carrierInformation.bindElement(oSelectedItem.getBindingContext().getPath());
			}
			evt.getSource().getBinding("items").filter([]);
		},

		handleFlightSelection: function(oEvent) {
			var oListItem = oEvent.getParameter("listItem");
			var sCarrID = oListItem.getBindingContext().getProperty("Carrid");
			var sConnID = oListItem.getBindingContext().getProperty("Connid");
			var oFlDate = oListItem.getBindingContext().getProperty("Fldate");

			jQuery.sap.require("sap.ui.core.format.DateFormat");

			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd hh:mm"
			});
			oFlDate = encodeURIComponent(dateFormat.format(new Date(Date.parse(oFlDate))));

			this.getRouter().navTo("bookings", {
				carrierId: sCarrID,
				connid: sConnID,
				fldate: oFlDate
			}, true);
		}
	});

});