sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, Filter, FilterOperator, History, Fragment, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("zsupplychain.supplychainsystem.controller.PurchaseOrder", {

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
            var sPo = this.byId("poInput").getValue();
            var aFilters = [];
            if (sPo) {
                aFilters.push(new Filter("EBELN", FilterOperator.Contains, sPo));
            }
            var oBinding = this.byId("poTable").getBinding("items");
            if (oBinding) { oBinding.filter(aFilters); }
        },

        onClear: function () {
            this.byId("poInput").setValue("");
            var oBinding = this.byId("poTable").getBinding("items");
            if (oBinding) { oBinding.filter([]); }
        },

        onOpenCreatePODialog: function () {
            var oView = this.getView();
            if (!this._pPODialog) {
                this._pPODialog = Fragment.load({
                    id: oView.getId(),
                    // Cập nhật đường dẫn vào thư mục fragments
                    name: "zsupplychain.supplychainsystem.view.fragments.CreatePO",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._pPODialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onClosePODialog: function () {
            this.byId("createPODialog").close();
        },

        onSavePO: function () {
            var oModel = this.getOwnerComponent().getModel();
            
            // Thu thập dữ liệu từ Dialog
            var oPayload = {
                "EBELN": "",
                "BSART": this.byId("inputBSART").getValue(),
                "LIFNR": this.byId("inputLIFNR").getValue(),
                "MATNR": this.byId("inputMATNR").getValue(),
                "MENGE": this.byId("inputMENGE").getValue().toString(),
                "WERKS": this.byId("inputWERKS").getValue(),
                "NETPR": this.byId("inputNETPR").getValue().toString(),
                "BUKRS": this.byId("inputBUKRS").getValue(),
                "EKORG": this.byId("inputEKORG").getValue(),
                "EKGRP": this.byId("inputEKGRP").getValue()
            };

            if (!oPayload.LIFNR || !oPayload.MATNR) {
                MessageBox.error("Vui lòng nhập đầy đủ Nhà cung cấp và Vật tư");
                return;
            }

            sap.ui.core.BusyIndicator.show(0);

            oModel.create("/PurchaseOrderSet", oPayload, {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    MessageBox.success("Tạo PO thành công: " + oData.EBELN);
                    this.onClosePODialog();
                    oModel.refresh(true);
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var sErrorMsg = "Lỗi hệ thống";
                    try {
                        var oResponse = JSON.parse(oError.responseText);
                        sErrorMsg = oResponse.error.message.value;
                    } catch (e) { }
                    MessageBox.error(sErrorMsg);
                }
            });
        }
    });
});