const mongoose = require("mongoose");

const userSchema  = new mongoose.Schema({
    email:{type:String , unique:true, required : true},
    password : {type:String, required : true},
    fullName : {type:String, required : true},
}, {
    timestamps : true
});

const User = mongoose.model("users" , userSchema);
module.exports = {User};