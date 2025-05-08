const multer = require("multer");
const nodemailer = require("nodemailer");
const { default: hbs } = require("nodemailer-express-handlebars");
const fs = require('fs');
const path = require("path");

const store = [{id:1,name:"Rahul"},{id:2,name:"Ram"},{id:3,name:"Sham"},{id:4,name:"hari"}];


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/uploads/`)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now()+file.originalname)
    }
  });




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



const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
      user: 'test9812334@gmail.com',
      pass: 'ziphcsedbavawzvz'
  }
});

transporter.use('compile', hbs({
  viewEngine : {
    extname : '.handlebars',
    partialsDir: path.join(__dirname, '..', 'view', 'emails'),
    defaultLayout : false,
  },
  viewPath: path.join(__dirname, '..', 'view', 'emails'),
  extName : '.handlebars',
}))


async function sendEmail({data,subject}) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Vrit Techchnologies" <test9812334@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: subject, // Subject line
    text: "", // plain text body
    html:  `<div style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 2px 8px rgba(0,0,0,0.05);">
    <h1 style="color: #333333; text-align: center;">Welcome to Our Service!</h1>
    <p style="font-size: 16px; color: #555555; line-height: 1.6;">Hi ${data.fullName},</p>
    <p style="font-size: 16px; color: #555555; line-height: 1.6;">
      Thank you for registering an account with us. To complete your registration, please confirm your email address by clicking the button below.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      
    <p> Greeting, to you!! </p>

    </div>
    <p style="font-size: 14px; color: #999999; text-align: center;">
      If you didn't create an account, you can safely ignore this email.
    </p>
  </div>
</div>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}


async function sendWelcome({data,subject}) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Vrit Techchnologies" <test9812334@gmail.com>', // sender address
    to: data.email,
    subject: subject,
    template: "invoice",
    context : {
      name : "Test User",
      otp: 454545,
      age:55
    }
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}


module.exports = {
    store,
    storage,
    deletefile,
    transporter,
    sendEmail,
    sendWelcome
}
