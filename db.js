const mongoose = require("mongoose")
const mongooseURL = "mongodb+srv://shelkeadinath:adimongo@cluster0.3xcgtqi.mongodb.net/?retryWrites=true&w=majority"
mongoose.set('strictQuery', true);
const connect =()=>{
    try {
        
        mongoose.connect(mongooseURL,()=>{
            console.log("Connected")
        })
    } catch (error) {
        console.log(error)
    }
}
module.exports = connect