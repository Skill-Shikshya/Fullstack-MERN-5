const express = require("express");
const app = express();
app.use(express.json());

let users = [];

app.post("/sign-up" , (req,res) => {

    if(req.body===undefined) return res.status(403).json({
        status:false,
        message: "email and password is required"
    });
    
    const {email,password} = req.body;
    if(!email || !password) return res.status(403).json({
        status:false,
        message: "email and password is required"
    });

    const findEmail = users.find((item) => item.email === email);
    if(findEmail) return res.status(403).json({
        status:false,
        message: "email already exist"
    });


    const otp  = Math.ceil(Math.random()*100000);
    const expireTime = 5*60*1000;

    req.body={...req.body , verified:false, otp , expireAt : Date.now()+expireTime};

    users.push(req.body);
    return res.status(201).json({
        status:true,
        message: "success, account created",
        data: req.body
    });

});

app.post("/login" , (req,res) => {

    if(req.body===undefined) return res.status(403).json({
        status:false,
        message: "email and password is required"
    });
    
    const {email,password} = req.body;
    if(!email || !password) return res.status(403).json({
        status:false,
        message: "email and password is required"
    });

    const findUser = users.find((item) => item.email === email);
    if(!findUser) return res.status(403).json({
        status:false,
        message: "email dosenot exist"
    });

    if(findUser.password != password) return res.status(404).json({
        status:false,
        message: "password doesnot match"
    });

    if(!findUser.verified) return res.status(403).json({
        status:false,
        message: "account not verified"
    });

    return res.status(200).json({
        status:true,
        message: "success",
        token : "akjwndkjawjdnajwdnawndaawdawdawdawdawdawdawdamwawdawdawdawdawdawdwdawjdbawndawdiawndawd",
        data: users
    });

});

app.get("/users" , (req,res) => {

    return res.status(200).json({
        status:true,
        message: "success",
        count : users.length,
        data: users
    });

});

app.post('/verify-otp', (req,res) => {
    if(req.body===undefined) return res.status(403).json({
        status:false,
        message: "otp is required"
    });
    
    const {otp,email} = req.body;
    if(!otp || !email) return res.status(403).json({
        status:false,
        message: "otp and email is required"
    });

    const findUser = users.find((item) => item.email === email);
    if(!findUser) return res.status(403).json({
        status:false,
        message: "user dosenot exist"
    });

    if(findUser.otp !== otp) return res.status(404).json({
        status:false,
        message: "otp dosenot match"
    });

    if(findUser.exipreAt < Date.now()) return res.status(404).json({
        status:false,
        message: "otp has expired"
    });

    users = users.map((item) => item.email === email ? {...item , verified : true, otp : null, expireAt : null} : item);
    return res.status(200).json({
        status:true,
        message: "success, verified"
    });


});

app.post('/generate-otp', (req,res) => {
    if(req.body===undefined) return res.status(403).json({
        status:false,
        message: "email is required"
    });
    
    const {email} = req.body;
    if(!email) return res.status(403).json({
        status:false,
        message: "email is required"
    });

    const findUser = users.find((item) => item.email === email);
    if(!findUser) return res.status(403).json({
        status:false,
        message: "user dosenot exist"
    });

    const otp  = Math.ceil(Math.random()*100000);
    const expireTime = 5*60*1000;


    users = users.map((item) => item.email === email ? {...item , otp : otp, expireAt : Date.now()+expireTime} : item);
    return res.status(200).json({
        status:true,
        message: "success, otp sent"
    });


});


app.listen(3000, ()=> console.log("server runing at port 3000"))