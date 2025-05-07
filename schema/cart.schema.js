const mongoose = require("mongoose");

const cartSchema  = new mongoose.Schema({
    userId:{type:mongoose.Schema.ObjectId, ref : 'users'},
    amount : {type:Number, required:true}
}, {
    timestamps : true
});

const Cart = mongoose.model("carts" , cartSchema);
module.exports = {Cart};