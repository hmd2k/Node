const express = require("express");
require("dotenv").config();
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connection = require("../Configuration/DbConnection");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

// Employee login
router.post("/", async (req, res) => {
  try {
    let passowrdDb = null
    let employeeData = null
    const email = req.body.email.toLowerCase()
    if (!(req.body.email && req.body.password)) {
      res.status(400).json("fill all details");
    }
    const employeeDetail = await query("select * from employee where email = ?", [
      req.body.email,
    ]);
    if (employeeDetail.length == 0) {
      res.status(500).send("User Not Found");
    } else {
      passowrdDb = employeeDetail[0].password;
      employeeData = employeeDetail
    }
    if(await bcrypt.compare(req.body.password,passowrdDb)){
      const accessToken = jwt.sign(
        {employeeId: employeeData[0].employeeId, role:employeeData[0].role, purpose:"ACCESS_TOKEN"},
        process.env.TOKEN_KEY,
        {expiresIn: "2h"}
      )
      const refreshToken = jwt.sign(
        {employeeId: employeeData[0].employeeId, role:employeeData[0].role, purpose:"REFRESH_TOKEN"},
        process.env.TOKEN_KEY,
        {expiresIn: "2h"}
      )
      res.json({
        employeeData,accessToken,refreshToken
      }).status(200)
    }else{
      res.status(400).json('Invalid password')
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;