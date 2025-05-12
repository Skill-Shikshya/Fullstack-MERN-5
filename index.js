const express = require("express");
const app = express();
require("dotenv").config()
const morgan = require("morgan");
const compression = require('compression');
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
require("./db/config") 
const {userRouter} = require("./router/index.router");
const fs = require("fs");


app.use(express.static('./public/'));
app.use(compression({ filter: shouldCompress }))
const cron = require('node-cron');
const {rateLimit} = require("express-rate-limit");
const path = require("path");


/* ==== serve logging start ==== */

app.set('trust proxy', true);
// maintain logs in access.log file
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),{
    flags : 'a'
  }
);

const errorLogStream = fs.createWriteStream(
  path.join(__dirname, "error.log"),{
    flags : 'a'
  }
);

const logFormat = ':remote-addr - :method :url :status :res[content-length] - :response-time ms';
morgan.token('status' , (req,res) => res.statusCode);
app.use(morgan(logFormat, {
  skip: (req, res) => res.statusCode >= 400,  // Skip if statusCode >= 400 (error)
  stream: accessLogStream
}));

// Set up logging for error requests (status code >= 400)
app.use(morgan(logFormat, {
  skip: (req, res) => res.statusCode < 400,   // Skip if statusCode < 400 (success)
  stream: errorLogStream
}));

/* ==== serve logging end ==== */



app.use(express.json())
app.use(userRouter);













// const { sendEmail, sendWelcome } = require("./helper/index.helper");
// const { User } = require("./schema/users.schema");
// app.use(limiter);  //gllobally





function shouldCompress (req, res) {
    if (req.headers['x-no-compression']) {
      // don't compress responses with this request header
      return false
    }
  
    // fallback to standard filter function
    return compression.filter(req, res)
  }



// corn send greeting email template 

cron.schedule('* * * * *', async() => {
  // console.log("Cron running", new Date());
  // sendWelcome({data : {email : "rahul@vrittechnologies.com", fullName:"Rahul Sharma"} , subject : "Greeting from App ok test"});
});


// Load YAML Swagger file
const swaggerDocument = YAML.load("./docs/swagger.yaml");

// Setup docs route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get("/" , (req,res) =>{
    return res.status(200).json({
        status:true,
        message: "server tested ok!",
        data : {
            secret_key : process.env.SECRET_KEY
        }
    })
});

app.listen( process.env.PORT || 3000, ()=> console.log(`server running at port: ${process.env.PORT || 3000}`) );