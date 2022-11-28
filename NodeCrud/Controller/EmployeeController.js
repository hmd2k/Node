const express = require("express");
const router = express.Router();
const { ROLES, employee, STATUS } = require("../Entity/Employee");
const bcrypt = require("bcryptjs");
const auth = require("../Security/AccessTokenAuth");
const { adminAccess, employeeAccess } = require("../Security/Rbac");
const getCurrentUserId = require("../Security/SecurityUtil");
const { pager } = require("../Configuration/Pager");
const multer = require('multer')
const {connect,sentAddNotif} = require("../Configuration/Socket");

// get all employee
router.get("/", auth, employeeAccess, async (req, res) => {
  try {
    let keyWord = "";
    if (req.query.keyWord) {
      keyWord = req.query.keyWord;
    }
    const result = await pager(
      employee,
      req.query.page,
      req.query.limit,
      keyWord
    );
    res.json(result);
  } catch (err) {
    res.send("Error " + err);
  }
});

// get employee by id
router.get("/:id", auth, employeeAccess, async (req, res) => {
  try {
    const userId = getCurrentUserId(req.headers["employee"]);
    console.log(userId);
    const getUniqueEmployee = await employee.findById(req.params.id);
    if (getUniqueEmployee) {
      res.json(getUniqueEmployee);
    } else {
      res.status(404).send("Employee not found");
    }
  } catch (err) {
    res.send("Error " + err);
  }
});

// register user
router.post("/", async (req, res) => {
  const email = req.body.email.toLowerCase();
  try {
    if (!(req.body.empName && req.body.email && req.body.password)) {
      res.status(400).send("Fill all details");
    }
    const oldUser = await employee.findOne({ email });
    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    let encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const addEmployee = new employee({
      firstName: req.body.empName,
      email: email,
      status: req.body.sub,
      password: encryptedPassword,
      role: ROLES.EMPLOYEE,
    });
    const employeeDetail = await addEmployee.save();
    sentAddNotif(req.body.empName)
    res.json(employeeDetail);
  } catch (err) {
    res.send("Error bdsjfmdhb" + err);
  }
});

// soft delete
router.put("/:id", auth, employeeAccess, async (req, res) => {
  try {
    const employeeWithId = await employee.findById(req.params.id);
    if (employeeWithId.status === 0) {
      res.status(404).json("NOt found");
    } else {
      employeeWithId.status = STATUS.INACTIVE;
      const data = await employeeWithId.save();
      res.status(200).json("Deleted soft");
    }
  } catch (err) {
    res.send("Error");
  }
});

// Hard delete
router.delete("/:id", auth, employeeAccess, async (req, res) => {
  try {
    const employeeWithId = await employee.findByIdAndDelete(req.params.id);
    if (employeeWithId === null) {
      res.status(500).json("No such data exists");
    } else {
      res.status(200).json("Deleted");
    }
  } catch (err) {
    res.send("Error " + err);
  }
});

// Upload file
const fileStorageEngine = multer.diskStorage({
  destination: (req,file,cb) => {
    cb(null,'./Images')
  },
  file: (req,file,cb) => {
    cb(null,Date.now()+file.originalname)
  }
})

const upload = multer({storage: fileStorageEngine});

router.post("/fileUpload",auth,employeeAccess,upload.single('image'),async (req,res) => {
    try{
        console.log(req.file);
        res.send(req.file)
    }catch(err){
        res.send(err)
    }
})

router.post("/fileUploadMultiple",auth,employeeAccess,upload.array('images', 3),async (req,res) => {
  try{
      console.log(req.files);
      res.send(req.files)
  }catch(err){
      res.send(err)
  }
})

module.exports = router;
