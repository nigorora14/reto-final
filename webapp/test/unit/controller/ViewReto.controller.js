/*global QUnit*/

sap.ui.define([
	"ngonzano/reto/controller/ViewReto.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ViewReto Controller");

	QUnit.test("I should test the ViewReto controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
