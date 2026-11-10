
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}


const express = require("express")
const app = express()
const path = require("path")
const Joi = require("joi")
const mongoose = require("mongoose")
const Campground = require("./models/campground")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError")
const { campgroundSchema, reviewSchema } = require("./schemas.js")
const Review = require("./models/review")
const campgroundsRoutes = require("./routes/campground.js")
const reviewsRoutes = require("./routes/review.js")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user")
const userRoutes = require("./routes/user.js")
const mongoSanitize = require("express-mongo-sanitize")
const helmet = require("helmet")
const db_url = process.env.MONGO_PASSWORD

app.use(express.static(path.join(__dirname, "public")))
app.use(methodOverride("_method"))
app.use(mongoSanitize({
    replaceWith: "_"
}))
app.use(helmet({ contentSecurityPolicy: false, referrerPolicy: { policy: "strict-origin-when-cross-origin" } }))
app.engine("ejs", ejsMate)
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
//app.use(helmet({contentSecurityPolicy:false}))
main().catch(err => console.log(err, "sorry there was an error"));
//async function main() {
//  await mongoose.connect(db_url)
//  console.log("database connected")
//}
async function main() {
    await mongoose.connect(db_url)
    console.log("database connected")
}



const sessionConfig = {
    name: "yoursession",
    secret: "thisshouldbeabettersecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 604800000,
        maxAge: 604800000
    },
    store: MongoStore.create({
        mongoUrl: db_url,
        crypto: {
            secret: "thisshouldbeabettersecret",
        },
        touchAfter: 24 * 60 * 60

    }).on("error", function (e) {
        console.log("session store error", e)
    })
}



app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.currentUser = req.user
    res.locals.currentRoute = req.path;
    next()
})


app.use("/", userRoutes)
app.use("/campgrounds", campgroundsRoutes)
app.use("/campgrounds/:id/reviews", reviewsRoutes)


app.get("/", (req, res) => {
    res.render("campgrounds/home")
})

app.all("*", (req, res, next) => {
    next(new ExpressError("page not found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "oh no, something went wrong"
    res.status(statusCode).render("error", { err })

})
app.listen(3000, () => {
    console.log("serving on port 3000")
})