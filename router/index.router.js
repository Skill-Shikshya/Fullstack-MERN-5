const express = require("express");
const multer  = require("multer");
const { storage } = require("../helper/index.helper");
const { userGet, userPost, userPut, userDelete } = require("../controller/user.controller");
const { otpVerify, otpGenerate } = require("../controller/otp.controller");
const { auth } = require("../middelware/auth.middelware");
const { authLogin } = require("../controller/auth.controller");
const { blogGet,
    blogPost,
    blogPut,
    blogDelete} = require("../controller/blog.controller");
const { cartGet, cartPost, cartUserGet } = require("../controller/cart.controller");
const userRouter  = new express.Router();



/* multer logic */
 const upload = multer({ storage:storage }); // upload works as middelware


userRouter.get("/users" , auth , userGet ); // auth is a middelware for route protecation
userRouter.post("/users", upload.single("profileImage"), userPost );
userRouter.put("/users/:id", upload.single("profileImage"),  userPut );
userRouter.delete("/users/:id", userDelete );


/* blog routes */
userRouter.get("/blog"  , blogGet );
userRouter.post("/blog", blogPost );
userRouter.put("/blog/:id", blogPut );
userRouter.delete("/blog/:id", blogDelete );


/* cart routes */
userRouter.get("/cart"  , cartGet );
userRouter.post("/cart", cartPost );
userRouter.get("/cart/user", cartUserGet );


userRouter.post("/otp-verify", otpVerify );
userRouter.post("/otp-generate", otpGenerate );

userRouter.post("/login", authLogin );




module.exports = {userRouter};
