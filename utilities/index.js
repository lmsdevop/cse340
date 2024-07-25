const invModel = require("../models/inventory-model")
const commentModel = require("../models/comment-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
Util.buildClassificationGrid = async function (data) {
  let grid
  if (data.length > 0) {
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id
        + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
        + '" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
        + ' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id + '" title="View '
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

Util.buildVehicleDetailPage = async function (data) {
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

Util.buildFormComments = async function (vehicle_id) {
  commentsform = '<section class="comments-section">'
  commentsform += '<h2>Comments</h2>'
  commentsform += '<form class="comment-form" action="/comment/create" method="post">'
  commentsform += '<input type="hidden" name="vehicle_id" value="' + vehicle_id + '"></input>'
  commentsform += '<input type="textarea" id="commenttext" name="commenttext" placeholder="Write your comment here..." required></textarea>'
  commentsform += '<button type="submit">Submit</button>'
  commentsform += '</form>'
  commentsform += '<div class="comment-container">'

  return commentsform
}

Util.buildVehicleCommentsComponent = async function (vehicle_id) {
  let data = await commentModel.getCommentsByVehicleId(vehicle_id);
  let comments = '';
  if (data.length != 0) {
    data.forEach(comment => {
      comments += '<div class="comment-made">';
      comments += '<h4>' + comment.comment_user + '</h4>';
      comments += '<p>' + comment.comment_text + '</p>';
      comments += '<span><strong>commented on</strong> ' + new Date(comment.comment_date).toLocaleDateString() + '</span>';
      comments += '</div>';
    });
  } else {
    comments = '<h3>No comments are made. Be the first!</h3>'
  }

  return comments
}

/* **************************************
* Build the management view HTML
* ************************************ */
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
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
*  Check Login
* ************************************ */

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
* Decode JWT                
**************************************** */
Util.getUserLogged = (req) => {
  const jwt = req.cookies.jwt;
  let user = {};

  if (jwt) {
    const decodedJwt = Util.parseJwt(jwt)
    user = {
      isLoggedIn: true,
      id: decodedJwt.account_id,
      role: decodedJwt.account_type,
      username: decodedJwt.account_firstname
    };
  } else {
    user = {
      isLoggedIn: false
    };
  }
  return user

}

Util.parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util


