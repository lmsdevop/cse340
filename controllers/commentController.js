const commentModel = require("../models/comment-model")
const utilities = require("../utilities")
const commentController = {}

commentController.createComment = async function (req, res, next) {
    const user = utilities.getUserLogged(req);
    const { vehicle_id } = req.body

    if (user.isLoggedIn == false) {
        req.flash("error", "You need to Login to create a comment");
        res.redirect(`/inv/detail/${vehicle_id}`);
        return
    }
    const { commenttext } = req.body
    const payload = {
        user: user.username,
        text: commenttext,
        vehicle_id: vehicle_id
    }
    const commentResult = await commentModel.createComments(payload)
    if (commentResult != 'undefined') {
        req.flash("notice", "The comment was successfully created.")
        res.redirect(`/inv/detail/${vehicle_id}`)
    } else {
        req.flash("error", "Error creating comment: " + error.message);
        res.redirect(`/inv/detail/${vehicle_id}`);
    }
}

module.exports = commentController;