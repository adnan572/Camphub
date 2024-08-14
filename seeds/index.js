const mongoose = require("mongoose")
const Campground = require("../models/campground")
const cities = require("./cities")
const {places, descriptors} = require("./seedHelpers")
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
  console.log("database connected")
}
const sample = (array) => array[Math.floor(Math.random()*array.length)];
  
const seedDB = async()=> {
    await Campground.deleteMany({}) 
    for (let i = 0; i< 500; i++) {
      const randomCity = sample(cities)
      const price = Math.floor(Math.random()*20) + 10
       const camp = new Campground({
          author: "669c28a8162c9fa043af2651",
          geometry: { type: 'Point', coordinates: [ randomCity.latitude , randomCity.longitude ] },
          location: `${randomCity.city},${randomCity.state}`,
          title: `${sample(descriptors)} ${sample(places)}`,
          description: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Sapiente aperiam corporis necessitatibus iusto aspernatur error, nostrum animi fugit, enim itaque in dolor quasi placeat possimus tempora, assumenda ipsa quaerat. A?`,
          price,
         images: [
            {
              url: 'https://res.cloudinary.com/dpmoflxc3/image/upload/v1722459624/YelpCamp/kuncbrqjwvholikqotbm.jpg',
              filename: 'YelpCamp/kuncbrqjwvholikqotbm',
            }, {
              url: 'https://res.cloudinary.com/dpmoflxc3/image/upload/v1722459727/YelpCamp/lhweuhtl2fvklol7wzbx.jpg',
              filename: 'YelpCamp/lhweuhtl2fvklol7wzbx',
            },
            {
              url: 'https://res.cloudinary.com/dpmoflxc3/image/upload/v1722459730/YelpCamp/wuv1qmef52z5e3yfxlpw.jpg',
              filename: 'YelpCamp/wuv1qmef52z5e3yfxlpw',
            },
            {
              url: 'https://res.cloudinary.com/dpmoflxc3/image/upload/v1722459733/YelpCamp/vvoolc0h64wx2glo8v3h.jpg',
              filename: 'YelpCamp/vvoolc0h64wx2glo8v3h',
            },
             {
              url: 'https://res.cloudinary.com/dpmoflxc3/image/upload/v1722459734/YelpCamp/nnbui95zbrhyxndwd5r9.jpg',
              filename: 'YelpCamp/nnbui95zbrhyxndwd5r9',
            }
        
        
          ],
    
        })
       await camp.save()  
    }

}
seedDB().then(()=>{
  mongoose.connection.close()
})
 main()