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

invCont.buildManagementView = async function (req, res, next) {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
      title: "Vehicles Management",
      nav,
      errors: null,
      classificationSelect,
    });
}

invCont.buildNewClassification = async function (req, res, next, success, error) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
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
  const classificationSelect = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
    res.render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
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

  invCont.deleteView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await inventoryModel.getDetailByVehicleId(inv_id)
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData[0].inv_id,
      invMake: itemData[0].inv_make,
      invModel: itemData[0].inv_model,
      invYear: itemData[0].inv_year,
      invPrice: itemData[0].inv_price,
    })
  }

invCont.deleteItem = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { inv_id } = req.body
    const deleteResult = await inventoryModel.deleteInventoryItem(inv_id)
  if (deleteResult) {
    req.flash("notice", "The vehicle was successfully deleted.")
    res.redirect("/inv/")
  } else {
    req.flash("error", "Error deleting vehicle: " + error.message);
    res.redirect("/inv/");
  }
}
  /* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    invMake,
    invModel,
    invDescription,
    invImage,
    invThumbnail,
    invPrice,
    invYear,
    invMiles,
    invColor,
    classification_id,
  } = req.body
  const updateResult = await inventoryModel.updateInventory(
    inv_id,  
    invMake,
    invModel,
    invDescription,
    invImage,
    invThumbnail,
    invPrice,
    invYear,
    invMiles,
    invColor,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}
  /* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await inventoryModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await inventoryModel.getDetailByVehicleId(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id)
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData[0].inv_id,
    invMake: itemData[0].inv_make,
    invModel: itemData[0].inv_model,
    invYear: itemData[0].inv_year,
    invDescription: itemData[0].inv_description,
    invImage: itemData[0].inv_image,
    invThumbnail: itemData[0].inv_thumbnail,
    invPrice: itemData[0].inv_price,
    invMiles: itemData[0].inv_miles,
    invColor: itemData[0].inv_color,
    classification_id: itemData[0].classification_id
  })
}

module.exports = invCont