const express = require("express");
const app = express();
app.use(express.json());

app.use(express.static("./public"));

const multer = require('multer');
const fs = require("fs");
const path = require("path");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads/`)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  });

 const upload = multer({ storage:storage });

 const homeUpload = upload.fields([{name:'thumbnail'},{name:'banner'},{name:'logo'}]);

app.post("/upload" ,upload.single('image'), (req,res) => {
    const file = req.file;
    return res.status(201).json({status:true,message:"success", data : "http://localhost:3000/uploads/"+file.filename});
});

app.post("/home" ,homeUpload, (req,res) => {
    const files = req.files;
    return res.status(201).json({
        status:true,message:"success", 
        data : {
        thumbnail : files['thumbnail']?.map((item) => "http://localhost:3000/uploads/"+item.filename),
        banner : files['banner']?.map((item) => "http://localhost:3000/uploads/"+item.filename),
        logo : files['logo']?.map((item) => "http://localhost:3000/uploads/"+item.filename),
        } 
});

});

app.get("/gallery" , (req,res) => {
  const filePath = path.join(__dirname , "public","uploads")
  fs.readdir( filePath, (err,data) => {

    if(err) return res.status(400).json({
      status:false,message:err
  })


     return res.status(201).json({
    status:true,message:"success", 
    data : data?.map((item) => "http://localhost:3000/uploads/"+item) 
});
  } );
})


app.listen(3000, ()=> console.log("server runing at port 3000"));