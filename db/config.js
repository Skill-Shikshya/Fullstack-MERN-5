const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://rahul:NjglIJKiAjXNZ83U@cluster0.tqvqajl.mongodb.net/ecom?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("database connected");
}).catch((err)=> {
    console.log(`database failed to connect, Error : ${err}`)
});
