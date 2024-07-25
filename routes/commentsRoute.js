const express = require("express")
const router = new express.Router()
const commentController = require("../controllers/commentController")
const utilities = require("../utilities/")

router.post("/create", utilities.handleErrors(commentController.createComment))

module.exports = router;