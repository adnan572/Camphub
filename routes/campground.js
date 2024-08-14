const express = require("express")
const router = express.Router()
const catchAsync = require("../utils/catchAsync")
const Campground = require("../models/campground")
const {isLoggedIn,isAuthorized,validateCampground} = require("../middleware.js")
const campgrounds = require("../controllers/campground.js")
const multer = require("multer")
const {storage} = require("../cloudinary")
const upload = multer({storage})



router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array("image"),validateCampground ,catchAsync(campgrounds.createCampground))


   

router.get("/new",isLoggedIn,campgrounds.renderNewForm)
router.get("/:id/edit",isLoggedIn,isAuthorized,catchAsync(campgrounds.renderEditForm))


router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,upload.array("image"),validateCampground,isAuthorized,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthorized,catchAsync(campgrounds.deleteCampground))


    
module.exports = router