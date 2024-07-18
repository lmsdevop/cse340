const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}


/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

async function getDetailByVehicleId(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      WHERE i.inv_id = $1`,
      [vehicle_id]
    )
    return data.rows
  } catch (error) {
    console.error("getvehiclebyid error " + error)
  }
}

async function addClassification(data) {
  try {
    console.log(data)
    const result = await pool.query(
      `INSERT INTO public.classification (classification_name)
       VALUES ($1) RETURNING classification_id, classification_name`,
      [data]
    );
    return result.rows[0];
  } catch (error) {
    console.error("addClassification error: " + error.message);
    throw error; // Propagate the error
  }
}

async function addVehicle(data) {
  try {
    console.log(data)
    const result = await pool.query(
      `INSERT INTO public.inventory (
      classification_id, 
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [ data.classification_id, 
        data.invMake, 
        data.invModel, 
        data.invDescription, 
        data.invImage, 
        data.invThumbnail, 
        data.invPrice, 
        data.invYear, 
        data.invMiles, 
        data.invColor]
    );
    return result.rows[0];
  } catch (error) {
    console.error("addVehicle error: " + error.message);
    throw error; 
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getDetailByVehicleId, addClassification, addVehicle}
