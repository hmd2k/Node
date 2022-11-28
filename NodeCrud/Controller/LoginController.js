const express = require("express");
require("dotenv").config();
const router = express.Router();
const { ROLES, employee } = require("../Entity/Employee");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Employee login
router.post("/", async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const employeeWithEmail = await employee.findOne({ email });
    if (!(email && req.body.password)) {
      res.status(400).send("Fill all details");
    }
    if (!employeeWithEmail) {
      res.status(404).send("Employee not found");
    }
    if (await bcrypt.compare(password, employeeWithEmail.password)) {
      const accessToken = jwt.sign(
        { employeeId: employeeWithEmail._id, role: employeeWithEmail.role, purpose:"ACCESS_TOKEN" },
        process.env.TOKEN_KEY,
        { expiresIn: "8h" }
      );
      const refreshToken = jwt.sign(
        { employeeId: employeeWithEmail._id, role: employeeWithEmail.role, purpose:"REFRESH_TOKEN" },
        process.env.TOKEN_KEY,
        { expiresIn: "1d" }
      );
      employeeWithEmail.accessToken = accessToken;
      employeeWithEmail.refreshToken = refreshToken;
      res.status(200).json(employeeWithEmail);
    }else{
        res.status(401).send('Wrong password')
    }
  } catch (err) {
    res.send("Error " + err);
  }
});

// Refresh Access token
router.put('/',async(req,res)=>{
    try{
        const refreshToken = req.body.refreshToken
        if(!refreshToken){
            return res.status(403).send("Refresh token is not provided")
        }
        const decodedRefreshToken = jwt.decode(refreshToken,process.env.TOKEN_KEY)
        if(decodedRefreshToken.purpose==="REFRESH_TOKEN" && jwt.verify(refreshToken,process.env.TOKEN_KEY)){
            const Employee = await employee.findById(decodedRefreshToken.employeeID)
            const accessToken = jwt.sign(
                { employeeId: Employee._id, role: Employee.role, purpose:"ACCESS_TOKEN" },
                process.env.TOKEN_KEY,
                { expiresIn: "8h" }
              );
            Employee.accessToken = accessToken
            Employee.refreshToken = refreshToken
            res.status(200).json(Employee)
        }else{
            res.status(401).send("Invalid token")
        }
    }catch(err){
        res.send("Error " + err)
    }
})

module.exports = router;
