const multer = require("multer");
const store = [{id:1,name:"Rahul"},{id:2,name:"Ram"},{id:3,name:"Sham"},{id:4,name:"hari"}];


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads/`)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  });




  const fs = require('fs')
const deletefile = (filename) =>{
    fs.unlink(filename.replace("http://localhost:3000/uploads/", 'public/uploads/') , (err)=>{
        if(err){
            console.log(` file deletion failed :  ${err}`)
        }
        else{
            console.log(`${filename} file deleted success`)
        }
    })
}


module.exports = {
    store,
    storage,
    deletefile
}
