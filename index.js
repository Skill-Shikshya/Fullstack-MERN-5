const express = require("express");
const app = express();
const {userRouter} = require("./router/index.router");

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

app.listen(process.env.PORT, ()=> console.log(`server running at port: ${process.env.PORT}`) );