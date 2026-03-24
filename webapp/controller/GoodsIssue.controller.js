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
            // Lấy Model từ View thay vì Component để đảm bảo context
            var oModel = this.getView().getModel();

            // Thu thập dữ liệu: Tên trường phải CHÍNH XÁC như trong ảnh Metadata
            var oPayload = {
                "SalesOrder": this.byId("inputVBELN").getValue(), // Chữ S và O viết hoa
                "SalesItem": this.byId("inputPOSNR").getValue(),  // Chữ S và I viết hoa
                "Quantity": this.byId("inputLFIMG").getValue(),   // Định dạng Edm.Decimal
                "UoM": "EA",
                "Plant": this.byId("inputWERKS").getValue(),
                "StorageLoc": this.byId("inputLGORT").getValue(),
                "PostingDate": this.byId("inputBUDAT").getDateValue() // Trả về object Date cho OData
            };

            // --- Validation tiếng Anh (Mã) thân thiện ---
            if (!oPayload.SalesOrder || !oPayload.SalesItem) {
                MessageBox.error("Sales Order (VBELN) and Item (POSNR) are required.");
                return;
            }
            if (!oPayload.Quantity || parseFloat(oPayload.Quantity) <= 0) {
                MessageBox.error("Quantity (LFIMG) must be greater than 0.");
                return;
            }

            sap.ui.core.BusyIndicator.show(0);

            // Gửi request tới đúng EntitySet: /GoodsIssueSet
            oModel.create("/GoodsIssueSet", oPayload, {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    // Nếu MatDoc có giá trị tức là SAP đã tạo chứng từ thành công
                    if (oData.MatDoc) {
                        MessageBox.success("Goods Issue Successful!\nMaterial Document: " + oData.MatDoc);
                        this.onCloseGIDialog();
                        oModel.refresh(true);
                    } else {
                        // Hiển thị thông báo nghiệp vụ từ SAP (ví dụ: Thiếu hàng, sai kho...)
                        MessageBox.warning("SAP Response: " + oData.Message);
                    }
                }.bind(this),
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    var sErrorMsg = "Communication Error (500)";
                    try {
                        var oResponse = JSON.parse(oError.responseText);
                        sErrorMsg = oResponse.error.message.value;
                    } catch (e) { }
                    MessageBox.error(sErrorMsg);
                }.bind(this)
            });
        }
    });
});