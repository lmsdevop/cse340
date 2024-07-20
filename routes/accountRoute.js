// Needed Resources 
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require('../controllers/accountController')
const regValidate = require('../utilities/account-validation')

// Route to login and logout
router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

// Route to register an account
router.get("/register", utilities.handleErrors(accountController.buildRegister))
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Route to update account
router.get("/update/:account_id", utilities.handleErrors(accountController.buildEditAccountView))
router.post("/update", utilities.handleErrors(accountController.updateAccount))

// Main route
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

module.exports = router;