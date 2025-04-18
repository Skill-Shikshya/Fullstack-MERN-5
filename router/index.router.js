const express = require("express");
const { userGet, userPost, userPut, userDelete } = require("../controller/user.controller");
const userRouter  = new express.Router();


userRouter.get("/users", userGet );
userRouter.post("/users", userPost );
userRouter.put("/users/:id", userPut );
userRouter.delete("/users/:id", userDelete );




module.exports = {userRouter};
