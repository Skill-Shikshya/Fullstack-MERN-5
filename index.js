const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
require("./db/config") 
const {userRouter} = require("./router/index.router");
app.use(express.json());
app.use(express.static('./public/'));

app.use(userRouter);

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

app.listen(3000, ()=> console.log(`server running at port: ${3000}`) );