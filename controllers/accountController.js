const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  const user = utilities.getUserLogged(req);

  res.render("account/login", {
    title: "Login",
    nav,
    user,
    errors: null,
  })
}

async function buildEditAccountView(req, res, next) {
  let nav = await utilities.getNav();
  const user = utilities.getUserLogged(req);

  const account_id = parseInt(req.params.account_id)
  const accountData = await accountModel.getAccountById(account_id)
  res.render("./account/update", {
    title: "Edit " + accountData.account_firstname,
    nav,
    user,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_password: accountData.account_password,
    account_id: accountData.account_id,
  })



  res.render("account/update", {
    title: "Edit Account",
    nav,
    user,
  })
}

async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  const user = utilities.getUserLogged(req);

  res.render("account/account-manager", {
    title: "Account Management",
    nav,
    user,
  })
}

async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  const user = utilities.getUserLogged(req);

  res.render("account/registration", {
    title: "Register",
    nav,
    user,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const user = utilities.getUserLogged(req);

  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      user,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
      user,
      errors: null,
    })
  }
}


async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const user = utilities.getUserLogged(req);

  const { account_firstname, account_lastname, account_email, account_password, account_id } = req.body
  if (account_password) {
    const updatePassResult = await accountModel.updatePassword(account_password, account_id);
    if (updatePassResult.rowCount >= 1) {
      req.flash(
        "notice",
        `Congratulations, password changed`
      )
      res.status(201).render("account/account-manager", {
        title: "Account Management",
        nav,
        user,
      })
    } else {
      req.flash("notice", "Sorry, update user failed, try again.")
      res.redirect(`account/update/${account_id}`)
    }
  } else {
    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

    if (updateResult.rowCount >= 1) {
      req.flash(
        "notice",
        `Congratulations, user ${account_firstname} updated`
      )
      res.status(201).render("account/account-manager", {
        title: "Account Management",
        nav,
        user,
      })
    } else {
      req.flash("notice", "Sorry, password changed failed, try again.")
      res.redirect(`/account/update/${account_id}`)
    }
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const user = utilities.getUserLogged(req);

  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      user,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
  } catch (error) {
    return new Error('Access Forbidden')
  }
}

async function accountLogout(req, res) {
  res.clearCookie("jwt", { httpOnly: true, secure: process.env.NODE_ENV === 'development' });
  req.flash("notice", "User logged out.")
  res.redirect("/account/login");
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, accountLogout, buildEditAccountView, updateAccount }