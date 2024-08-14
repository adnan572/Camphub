const Campground = require("../models/campground")
const {cloudinary} = require("../cloudinary")

module.exports.index = (async(req,res)=>{


    const  campgrounds = await Campground.find({})
    
    res.render("campgrounds/index",{campgrounds})
})

module.exports.renderNewForm = (req,res)=>{

    res.render("campgrounds/new")
}

module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id)
    if(!campground) {
        req.flash("error","Cannot find campground")
      return  res.redirect("/campgrounds")
     }
    res.render("campgrounds/edit",{campground})
}

module.exports.createCampground = async(req,res)=>{
    //if(!req.body.campground) throw new ExpressError("invalid Campground Data",404)
    const response = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${req.body.campground.location}&apiKey=${process.env.MAP_TOKEN}`, requestOptions)
    const data = await response.json()

    if (data.features && data.features.length > 0) {
        const geometry = data.features[0].geometry;

   const campground = new Campground(req.body.campground)
   campground.images = req.files.map(f=> ({url:f.path, filename:f.filename}))
   campground.geometry = geometry
    campground.author = req.user._id
    await campground.save()
    req.flash("success","campground successfully created")
    res.redirect(`/campgrounds/${campground._id}`)
    } else {
        // Handle the case where no valid location data was found
        console.log('No features found in geocode response');
        res.status(400).send('Location not found');}
}
module.exports.updateCampground = async(req,res)=>{
   
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,req.body.campground)
    const imgs = req.files.map(f=> ({url:f.path, filename:f.filename}))
    campground.images.push(...imgs)
    await campground.save() 
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages){
           await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash("success","Successfully updated campground")
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndDelete(id)
    req.flash("success","campground successfully deleted")

    res.redirect("/campgrounds")
}

module.exports.showCampground = async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findById(id).populate({
       path:"reviews",
       populate: {
           path: "author"
       }

   }).populate("author")
    
    if(!campground) {
       req.flash("error","Cannot find campground")
     return  res.redirect("/campgrounds")
    }
   res.render("campgrounds/show",{campground})
}