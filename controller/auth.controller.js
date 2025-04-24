const { User } = require("../schema/users.schema");
const jwt = require("jsonwebtoken");


const authLogin = async (req,res) =>{
    const {email,password} = req.body || {};
    if(!email || !password) return res.status(403).json({
        status : false,
        message : "some fields are required."
    });

    const findEmail = await User.findOne({email});
    if(!findEmail) return res.status(401).json({
        status : false,
        message : "credential miss-match."
    });
    if(findEmail.password !== password) return res.status(401).json({
        status : false,
        message : "credential miss-match."
    });

    const token = jwt.sign({_id : findEmail.id}, process.env.SECRET_KEY , {expiresIn : "30000s"});
    return res.status(200).json({
        status : true,
        message : "success",
        token : token
    });
};

module.exports = {
    authLogin
}