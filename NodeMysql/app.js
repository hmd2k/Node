const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const limiter = require('express-rate-limit')
const serveIndex = require('serve-index')
const connection = require("./Configuration/DbConnection");
const compression = require('compression')
const cors =require('cors');

const app = express();
const http = require('http').createServer(app)
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(limiter({
  windowMs:5000,
  max:2
}))
app.use(compression({
  level: 6,
  threshold: 100*1000, // response above 100 bytes will be compressed
  filter: (req, res) => {
    if(req.headers['no-compression']){
      return false
    }
    return compression.filter(req,res)
  }
}))
app.use(cors());
app.use(
  '/getAllFiles',
  express.static('Public/Images'),
  serveIndex('Public/Images',{icon:true})
)
const employeeController = require('./Controller/EmployeeController')
app.use('/employee',employeeController)

const loginController = require('./Controller/LoginController')
app.use('/login',loginController)

http.listen(port, () => {
  console.log("Server started on port " + port);
});
