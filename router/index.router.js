const express = require("express");
const { userGet, userPost } = require("../controller/user.controller");
const userRouter  = new express.Router();


userRouter.get("/users", userGet );
userRouter.post("/users", userPost );



module.exports = {userRouter};
