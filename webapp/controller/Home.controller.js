sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("zsupplychain.supplychainsystem.controller.Home", {

        /**
         * Điều hướng tới danh mục Vật tư
         */
        onPressMaterial: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteMaterial");
        },

        /**
         * Điều hướng tới danh mục Tồn kho
         */
        onPressStock: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteStock");
        },

        /**
         * Điều hướng tới danh mục Purchase Order (PO)
         */
        onPressPurchaseOrder: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RoutePurchaseOrder");
        },

        /**
         * Điều hướng tới danh mục Goods Receipt
         */
        onPressGoodsReceipt: function () {
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteGoodsReceipt");
        },
        /**
         * Điều hướng tới danh mục Goods Issue
         */
        onPressGoodsIssue: function () {
            this.getOwnerComponent().getRouter().navTo("RouteGoodsIssue");
        }

    });
});