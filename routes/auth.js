const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "InoteBookBuiltByAdi"
const fetchuser = require("../middleware/fetchuser")

//ROUTE 1: Creating a user using : POST "api/auth/createuser". No login required
router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be at least 8 characters").isLength({
      min: 8,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Looking for exceptions
    try { 
        // finding if a user is available with the same email id that is provided in the request
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry, a user with this email already exists" });
      }

      // creating a salt to add with the hash password
      const salt =await bcrypt.genSalt(10)
      // creating a hash of the password
      const secPass=await bcrypt.hash(req.body.password,salt) 
      //Creating a user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user:{
          id:user.id
        }
      }
      // creating a signature token to use for further authentication when the user is logged in
      const authtoken=jwt.sign(data, JWT_SECRET)
      res.json({authtoken});

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error")
    }
  }
);

//ROUTE 2: Authenticate user using POST "api/auth/login" no login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password","Password cannot be blank").exists(),
  ],async(req,res)=>{
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    const {email,password}=req.body
    try {
      let user = await User.findOne({email})
      if(!user)
      {
        return res.status(400).json({success,error:"Invalid Credentials, try again"})
      }
      const cmpPass=await bcrypt.compare(password,user.password)
      if(!cmpPass)
      {
        return res.status(400).json({success,error:"Invalid Credentials, try again"})
      }
      
      const data = {
        user:{
          id:user.id
        }
      }
      success=true
      const authtoken=jwt.sign(data, JWT_SECRET)
      res.json({success,authtoken});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Inernal Server Error!")
    }
  }
  )
  //ROUTE 2: Get logged in user details using POST "api/auth/getuser" LOGIN REQUIRED
  router.post(
"/getuser",fetchuser,async(req,res)=>{
  try {
    const userId=req.user.id
    const user =await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error!")
  }
});




module.exports = router;
