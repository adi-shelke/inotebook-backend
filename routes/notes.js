const express = require("express")
const router = express.Router()

router.get('/',(req,res)=>{
    obj={
        name:"Adi Notes",
        id:"007 Notes"
    }
    res.send(obj)
})
module.exports=router