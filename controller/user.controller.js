const { store, deletefile, sendEmail } = require("../helper/index.helper");
const { User } = require("../schema/users.schema");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt")





const userGet = async (req,res) => {
    const page = parseInt(req.query.page||1);
    const limit = parseInt(req.query.limit||10);
    const skip = (page-1)*limit;
    const isVerified = req.query.verified;



    const data = await User.find(); // => SELECT * from users
    const dataCount = await User.countDocuments().where('verified').equals(false);
    return res.status(200).json({
        status : true,
        message : "success, from user controller",
        page:  Math.ceil(dataCount/limit) ,
        count: dataCount,
        requestedBy: req.rootUser.fullName,
        data : data
    })
};


const userPost = async (req,res) => {
    let {email,password,fullName} = req.body || {};
    if(!email || !password || !fullName) return res.status(403).json({
        status : false,
        message : "some fields are required."
    });

    const findEmail = await User.findOne({email});
    if(findEmail) return res.status(406).json({
        status : false,
        message : "email already registred."
    });


    const otp = Math.ceil(Math.random()*10000);
    const otpExpireAt = Date.now()+(2*60*1000);

    let profileImage = null;
    if(req.file) {
        profileImage = 'http://localhost:3000/uploads/'+req.file.filename;
    };


    password = await bcrypt.hash(password , 10); // admin@123 == akwbdhabwda.da.daw.dmajwndjawndawdawdjanwdnawjdjawnd

    const newData  = await User.create({email,password,fullName,otp,otpExpireAt,profileImage});
    sendEmail({data:newData , subject:"Account Registred"}).catch((err)=>console.error(err));
    if(!newData) return res.status(500).json({
        status : false,
        message : "something went wrong."
    });

    return res.status(201).json({
        status : true,
        message : "success",
        data : newData
    })
};


const userPut = async (req,res) => {
    const findUser = await User.findById(req.params.id);

    if(!findUser) return res.status(406).json({
        status : false,
        message : "user not found."
    });


    let profileImage = findUser.profileImage;
    if(req.file) {
        profileImage = 'http://localhost:3000/uploads/'+req.file.filename;
        
        if(findUser.profileImage) {
            deletefile(findUser.profileImage)
        };
        
    };


    findUser.email = req.body.email || findUser.email,
    findUser.password = req.body.password || findUser.password,
    findUser.fullName = req.body.fullName || findUser.fullName,
    findUser.profileImage = profileImage || findUser.profileImage,
    await findUser.save();
    
    return res.status(200).json({
        status : true,
        message : "success",
        data : findUser
    });
};


const userDelete = async (req,res) => {
    const findUser = await User.findById(req.params.id);
    if(!findUser) return res.status(406).json({
        status : false,
        message : "user not found."
    });

    await User.findByIdAndDelete(req.params.id);
    return res.status(204).json({
        status : true,
        message : "success"
    })
};


// const postUserWelcome = async (req,res) => {
  
// }

module.exports = {
    userGet,
    userPost,
    userDelete,
    userPut
}