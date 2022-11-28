const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const connection = require("./Configuration/DbConnection");

const app = express();
const http = require('http').createServer(app)
const port = process.env.PORT || 5000;

app.use(express.json());

const employeeController = require('./Controller/EmployeeController')
app.use('/employee',employeeController)

const loginController = require('./Controller/LoginController')
app.use('/login',loginController)

http.listen(port, () => {
  console.log("Server started on port " + port);
});
