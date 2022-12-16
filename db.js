const mongoose = require("mongoose")
const mongooseURL = "mongodb://localhost:27017/"
mongoose.set('strictQuery', true);
const connect =()=>{
    mongoose.connect(mongooseURL,()=>{
        console.log("Connected")
    })
}
module.exports = connect