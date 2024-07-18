const inventoryModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await inventoryModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildByVehicleId = async function (req, res, next) {
    const vehicle_id = req.params.vehicleId
    const data = await inventoryModel.getDetailByVehicleId(vehicle_id)
    const details = await utilities.buildVehicleDetailPage(data[0])
    let nav = await utilities.getNav()
    const vehicleName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
    res.render("./inventory/vehicle", {
        title: vehicleName,
        nav,
        details,
    })
}

invCont.buildVehicleManagement = async function (req, res, next) {
  try {
    const management = await utilities.buildVehicleManagement();
    let nav = await utilities.getNav();
    res.render("./inventory/management", {
      title: "Vehicles Management",
      nav,
      management,
      messages: req.flash('notice').concat(req.flash('error'))
    });
  } catch (error) {
    next(error);
  }
}

invCont.buildNewClassification = async function (req, res, next, success, error) {
    const classificationForm = await utilities.getAddClassificationForm(success, error)
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      classificationForm
    });
};

invCont.addClassification = async (req, res) => {
  const { classificationName } = req.body;

  try {
    await inventoryModel.addClassification(classificationName);
    req.flash("notice", "Classification added successfully!");
    res.redirect("/inv");
  } catch (error) {
    req.flash("error", "Error when adding classification: " + error.message);
    res.redirect("/inv");
  }
}

invCont.buildNewVehicle = async function (req, res, next) {
  const vehicleForm = await utilities.getAddInventoryForm()
  let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      vehicleForm
    });
}

invCont.addVehicle = async (req, res) => {
  const { 
    classification_id, 
    invMake, 
    invModel, 
    invDescription, 
    invImage, 
    invThumbnail, 
    invPrice, 
    invYear, 
    invMiles, 
    invColor  } = req.body;

  try {
      await inventoryModel.addVehicle({ 
        classification_id, 
        invMake, 
        invModel, 
        invDescription, 
        invImage, 
        invThumbnail, 
        invPrice, 
        invYear, 
        invMiles, 
        invColor  });
      req.flash("notice", "Vehicle added successfully!");
      res.redirect("/inv");
  } catch (error) {
      req.flash("error", "Error adding vehicle: " + error.message);
      res.redirect("/inv");
    }
  }


module.exports = invCont