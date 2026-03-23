sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (Controller, History, Fragment, MessageToast, MessageBox) {
    "use strict";

    return Controller.extend("zsupplychain.supplychainsystem.controller.GoodsIssue", {

        onNavBack: function () {
            var oHistory = History.getInstance();
            var sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent().getRouter().navTo("RouteHome", {}, true);
            }
        },

        onOpenGIDialog: function () {
            var oView = this.getView();
            if (!this._pGIDialog) {
                this._pGIDialog = Fragment.load({
                    id: oView.getId(),
                    name: "zsupplychain.supplychainsystem.view.fragments.CreateGI",
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pGIDialog.then(function (oDialog) {
                oDialog.open();

                // Set ngày hôm nay
                if (this.byId("inputBUDAT")) {
                    this.byId("inputBUDAT").setDateValue(new Date());
                }
            }.bind(this));
        },

        onCloseGIDialog: function () {
            this.byId("giDialog").close();
        },

        // 🔥 Hàm format date chuẩn SAP (yyyyMMdd)
        _formatDate: function (oDate) {
            if (!oDate) return "";

            var yyyy = oDate.getFullYear();
            var mm = String(oDate.getMonth() + 1).padStart(2, '0');
            var dd = String(oDate.getDate()).padStart(2, '0');

            return yyyy + mm + dd;
        },

        onSaveGI: function () {
            var oModel = this.getView().getModel();

            // ✅ Lấy ngày
            var oDate = this.byId("inputBUDAT").getDateValue();
            var sBudat = this._formatDate(oDate);

            var oPayload = {
                "SalesOrder": this.byId("inputVBELN").getValue(),
                "SalesItem": this.byId("inputPOSNR").getValue(),
                "Quantity": this.byId("inputLFIMG").getValue().toString(),
                "UoM": "EA",
                "Plant": this.byId("inputWERKS").getValue(),
                "StorageLoc": this.byId("inputLGORT").getValue(),
                "PostingDate": this.byId("inputBUDAT").getDateValue() || new Date()
            };
            console.log("Payload gửi lên SAP:", oPayload);

            // ✅ Validation
            if (!oPayload.VBELN) {
                MessageBox.error("Thiếu Sales Order (VBELN)");
                return;
            }

            if (!oPayload.LFIMG || oPayload.LFIMG === "0") {
                MessageBox.error("Số lượng phải > 0");
                return;
            }

            sap.ui.core.BusyIndicator.show(0);

            oModel.create("/GoodsIssueSet", oPayload, {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();

                    var sMsg = oData.MatDoc
                        ? "Xuất kho thành công! MatDoc: " + oData.MatDoc
                        : "Xuất kho thành công!";

                    MessageBox.success(sMsg);
                    this.onCloseGIDialog();
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