const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    title : {type:String},
    description : {type:String},
    author : {type:mongoose.Types.ObjectId , ref : "users"},
},{
    timestamps : true
});

const Blog = mongoose.model('blogs',blogSchema);
module.exports =  {
    Blog
};