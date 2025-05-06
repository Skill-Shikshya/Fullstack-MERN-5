const { User } = require("../schema/users.schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")


const authLogin = async (req,res) =>{
    const {email,password} = req.body || {};

    if(!email || !password) return res.status(403).json({
        status : false,
        message : "some fields are required."
    });

    const findData = await User.findOne({email});
    if(!findData) return res.status(401).json({
        status : false,
        message : "credential miss-match."
    });


    //admin@123 != $2b$10$Ao4ZQ0fq2Gan9ifVJz.Osegnv6mPumvNJUIYsTgSjp5Xeob7MSFP. > true/false
    const isPasswordMatch = await bcrypt.compare(password,findData.password)
    if(!isPasswordMatch) return res.status(401).json({
        status : false,
        message : "credential miss-match."
    });

    const token = jwt.sign({_id : findData._id,fullName:findData.fullName}, process.env.SECRET_KEY , {expiresIn : "30000s"});
    return res.status(200).json({
        status : true,
        message : "success",
        token : token
    });
};

module.exports = {
    authLogin
}