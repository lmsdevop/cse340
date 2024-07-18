// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));
router.get("/add-classification", utilities.handleErrors(invController.buildNewClassification));
router.post("/add-classification", utilities.handleErrors(invController.addClassification));
router.get("/add-inventory", utilities.handleErrors(invController.buildNewVehicle))
router.post("/add-inventory", utilities.handleErrors(invController.addVehicle))
router.get("/", utilities.handleErrors(invController.buildVehicleManagement))


module.exports = router;