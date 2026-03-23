sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History"
], function (Controller, MessageToast, Filter, FilterOperator, History) {
    "use strict";

    return Controller.extend("zsupplychain.supplychainsystem.controller.Material", {
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
            var sMat = this.byId("matInput").getValue();
            var aFilters = [];
            if (sMat) {
                aFilters.push(new Filter("Matnr", FilterOperator.Contains, sMat));
            }
            var oBinding = this.byId("matTable").getBinding("items");
            if (oBinding) { oBinding.filter(aFilters); }
        },

        onClear: function () {
            this.byId("matInput").setValue("");
            var oBinding = this.byId("matTable").getBinding("items");
            if (oBinding) { oBinding.filter([]); }
        },

        onRefresh: function () {
            var oBinding = this.byId("matTable").getBinding("items");
            if (oBinding) {
                oBinding.refresh(true);
                MessageToast.show("Đã cập nhật dữ liệu");
            }
        }
    });
});