sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History"
], function (Controller, Filter, FilterOperator, History) {
    "use strict";

    return Controller.extend("zsupplychain.supplychainsystem.controller.Stock", {
        // ĐÃ XÓA HÀM onInit() KHỞI TẠO ODATA TẠI ĐÂY

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteHome", {}, true);
            }
        },

        onFilter: function () {
            var aFilters = [];
            var sMat = this.byId("stockInput").getValue();
            var sPlant = this.byId("plantInput").getValue();

            if (sMat) { aFilters.push(new Filter("Matnr", FilterOperator.Contains, sMat)); }
            if (sPlant) { aFilters.push(new Filter("Werks", FilterOperator.Contains, sPlant)); }

            this.byId("stockTable").getBinding("items").filter(aFilters);
        },

        onClear: function () {
            this.byId("stockInput").setValue("");
            this.byId("plantInput").setValue("");
            this.byId("stockTable").getBinding("items").filter([]);
        }
    });
});