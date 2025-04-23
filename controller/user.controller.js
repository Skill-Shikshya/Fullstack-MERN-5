const { store } = require("../helper/index.helper");
const { User } = require("../schema/users.schema");

const userGet = async (req,res) => {
    const data = await User.find(); // => SELECT * from users

    return res.status(200).json({
        status : true,
        message : "success, from user controller",
        count: data.length,
        data : data
    })
};


const userPost = async (req,res) => {
    const {email,password,fullName} = req.body || {};
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

    const newData  = await User.create({email,password,fullName,otp,otpExpireAt,profileImage});
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
    })
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

module.exports = {
    userGet,
    userPost,
    userDelete,
    userPut
}