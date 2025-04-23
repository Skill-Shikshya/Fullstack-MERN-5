const { User } = require("../schema/users.schema");

const otpVerify = async (req,res) => {
    const {otp,email} = req.body || {};
    if(!otp) return res.status(403).json({
        status : false,
        message : "otp fields are required."
    });

    const findEmail = await User.findOne({email});
    if(!findEmail) return res.status(404).json({
        status : false,
        message : "email dosenot exist."
    });
    
    if(findEmail.otp !== otp) return res.status(404).json({
        status : false,
        message : "otp dosenot match."
    }); 

    if(findEmail.otpExpireAt < Date.now()) return res.status(404).json({
        status : false,
        message : "otp has been expired."
    });

    findEmail.verified = true;
    findEmail.otp = null;
    findEmail.otpExpireAt = null;

    await findEmail.save();
    return res.status(201).json({
        status : true,
        message : "success, otp verified"
    })
};

const otpGenerate = async (req,res) => {
    const {email} = req.body || {};
    if(!email) return res.status(403).json({
        status : false,
        message : "otp fields are required."
    });

    const findData = await User.findOne({email});
    if(!findData) return res.status(404).json({
        status : false,
        message : "email dosenot exist."
    });
    
    findData.otp = Math.ceil(Math.random()*10000)
    findData.otpExpireAt = Date.now()+2*60*1000;
    await findData.save();

    return res.status(201).json({
        status : true,
        message : "success",
        data : {
            otp : findData.otp
        }
    });
};

module.exports = {
    otpVerify,
    otpGenerate
}