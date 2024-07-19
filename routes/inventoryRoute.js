// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
router.get("/edit/:inv_id", utilities.handleErrors(invController.editInventoryView))
router.post("/update/", utilities.handleErrors(invController.updateInventory))
router.get("/delete/:inv_id", utilities.handleErrors(invController.deleteView))
router.post("/delete/", utilities.handleErrors(invController.deleteItem))
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));
router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification));
router.post("/add-classification", utilities.handleErrors(invController.addClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildNewVehicle))
router.post("/add-inventory", utilities.handleErrors(invController.addVehicle))
router.get("/", utilities.handleErrors(invController.buildManagementView))


module.exports = router;