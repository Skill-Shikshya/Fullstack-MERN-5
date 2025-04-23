const express = require("express");
const multer  = require("multer");
const { storage } = require("../helper/index.helper");
const { userGet, userPost, userPut, userDelete } = require("../controller/user.controller");
const { otpVerify, otpGenerate } = require("../controller/otp.controller");
const userRouter  = new express.Router();



/* multer logic */
 const upload = multer({ storage:storage }); // upload works as middelware


userRouter.get("/users", userGet );
userRouter.post("/users", upload.single("profileImage"), userPost );
userRouter.put("/users/:id", upload.single("profileImage"),  userPut );
userRouter.delete("/users/:id", userDelete );


userRouter.post("/otp-verify", otpVerify );
userRouter.post("/otp-generate", otpGenerate );




module.exports = {userRouter};
