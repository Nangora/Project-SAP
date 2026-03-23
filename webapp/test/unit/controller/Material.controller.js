/*global QUnit*/

sap.ui.define([
	"zsupplychain/supplychainsystem/controller/Material.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Material Controller");

	QUnit.test("I should test the Material controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
