const mongoose = require("mongoose");

const userSchema  = new mongoose.Schema({
    email:{type:String , unique:true, required : true},
    password : {type:String, required : true},
    fullName : {type:String, required : true},
    otp : {type:Number},
    otpExpireAt : {type:Number},
    verified: {type:Boolean , default:false},
    profileImage : {type:String,default:null}
}, {
    timestamps : true
});

const User = mongoose.model("users" , userSchema);
module.exports = {User};