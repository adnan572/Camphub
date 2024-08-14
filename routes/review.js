
const express = require("express")
const router = express.Router({mergeParams:true})
const catchAsync = require("../utils/catchAsync")
const Review = require("../models/review.js")
const Campground = require("../models/campground.js")
const {validateReview,isLoggedIn, isReviewAuthorized} = require("../middleware.js")
const reviews = require("../controllers/review.js")

    


router.post("/",isLoggedIn,validateReview,catchAsync(reviews.createReview))
router.delete("/:reviewid",isLoggedIn,isReviewAuthorized, catchAsync(reviews.deleteReview))

module.exports = router