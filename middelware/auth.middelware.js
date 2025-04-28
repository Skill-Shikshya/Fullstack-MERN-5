
const jwt = require("jsonwebtoken");

const auth = (req,res,next) => {

    const token = req?.headers["authorization"]?.split(" ")[1] || "";
    const verify = jwt.verify(token , process.env.SECRET_KEY);
    if(verify){
        req.userId = verify._id;
        req.rootUser = verify;
        return next();
    }
    return  res.status(401).json({status:false,message:"unauthorized access"})
};

module.exports = {
    auth
}