const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

Util.buildVehicleDetailPage = async function(data){
    console.log(data)
    let details
    details = '<section class="vehicle-details">'
    details += '<div class="image-block">'
    details += '<img src="' + data.inv_image + '" alt="' + data.inv_model + ' vehicle">'
    details += '</div>'
    details += '<div class="details-block">'
    details += '<h2>' + data.inv_make + ' Details</h2>'
    details += '<div class="details-itens">'
    details += '<span><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(data.inv_price) + '</span>'
    details += '<span><strong>Description:</strong> ' + data.inv_description + '</span>'
    details += '<span><strong>Color:</strong> ' + data.inv_color + '</span>'
    details += '<span><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(data.inv_miles) + '</span>'
    details += '</div>'
    details += '</div>'
    details += '</section>'
    return details
  }

/* **************************************
* Build the management view HTML
* ************************************ */
Util.buildVehicleManagement = async function(){
  let management

  management = '<section class="management-menu">'
  management += '<a href="../../inv/add-classification">Add New Classification</a>'
  management += '<a href="../../inv/add-inventory">Add New Vehicle</a>'

  return management
}

Util.getAddClassificationForm = function () {
  let formHTML
  formHTML += `<div class="div-classification">`
  formHTML += `<div class="form-div">`
  formHTML += `<form id="add-classification-form" action="/inv/add-classification" method="POST">`
  formHTML += `<span>NAME MUST BE ALPHABETIC CHARACTERS ONLY</span><br>`
  formHTML += `<label for="classificationName">Classification Name:</label>`
  formHTML += `<input type="text" id="classificationName" name="classificationName" required>`
  formHTML += `<button type="submit">Add Classification</button>`
  formHTML += `</form>`
  formHTML += `</div>`
  formHTML += `</div>`
  
  ;

  return formHTML;
};

Util.getAddInventoryForm = async function () {
  let formHTML = ''; // Inicialize a variável formHTML
  const classification = await this.buildClassificationList(); // Use await para esperar a resolução da promessa

  formHTML += `<div class="div-classification">`;
  formHTML += `<div class="form-div">`;
  formHTML += `<form id="add-inventory-form" action="/inv/add-inventory" method="POST">`;
  formHTML += `<span>ALL FIELDS ARE REQUIRED</span><br>`;

  formHTML += `<label for="classificationId">Classification</label>`;
  formHTML += `${classification}`;

  formHTML += `<label for="invMake">Make</label>`;
  formHTML += `<input type="text" id="invMake" name="invMake" required>`;

  formHTML += `<label for="invModel">Model</label>`;
  formHTML += `<input type="text" id="invModel" name="invModel" required>`;

  formHTML += `<label for="invDescription">Description</label>`;
  formHTML += `<textarea type="text" id="invDescription" name="invDescription" required></textarea>`;

  formHTML += `<label for="invImage">Image Path</label>`;
  formHTML += `<input type="text" id="invImage" name="invImage" required>`;

  formHTML += `<label for="invThumbnail">Thumbnail Path</label>`;
  formHTML += `<input type="text" id="invThumbnail" name="invThumbnail" required>`;

  formHTML += `<label for="invPrice">Price</label>`;
  formHTML += `<input type="text" id="invPrice" name="invPrice" required>`;

  formHTML += `<label for="invYear">Year</label>`;
  formHTML += `<input type="text" id="invYear" name="invYear" required>`;

  formHTML += `<label for="invMiles">Miles</label>`;
  formHTML += `<input type="text" id="invMiles" name="invMiles" required>`;

  formHTML += `<label for="invColor">Color</label>`;
  formHTML += `<input type="text" id="invColor" name="invColor" required>`;

  formHTML += `<button type="submit">Add Vehicle</button>`;
  formHTML += `</form>`;
  formHTML += `</div>`;
  formHTML += `</div>`;

  return formHTML;
};

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util


