const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav()
  const user = utilities.getUserLogged(req);

  res.render("index", {
    title: "Home",
    nav,
    user,
  })
}

module.exports = baseController