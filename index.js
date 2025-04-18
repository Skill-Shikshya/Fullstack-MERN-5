const express = require("express");
const app = express();
require("./db/config") 
const {userRouter} = require("./router/index.router");
app.use(express.json());
app.use(userRouter);
app.get("/" , (req,res) =>{
    return res.status(200).json({
        status:true,
        message: "server tested ok!",
        data : {
            secret_key : process.env.SECRET_KEY
        }
    })
});

app.listen(3000, ()=> console.log(`server running at port: ${3000}`) );