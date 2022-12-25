const jwt = require("jsonwebtoken")
const JWT_SECRET = "InoteBookBuiltByAdi"
const fetchuser = (req,res,next)=>{
    //get the user from the jwt token and add id to the req object  
    const token = req.header("auth-token");
    if(!token)
    {
        res.status(401).send({error: "Please authenticate"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET)
        req.user=data.user
        next();
    } catch (error) {
        res.status(401).send({error: "Please authenticate"})
    }
}
module.exports = fetchuser;