const mongoose = require("mongoose");

const ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
};
const STATUS = { 
    ACTIVE: 1,
    INACTIVE: 0 
};

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
    default: 1,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
});

let employee = mongoose.model("Employee", employeeSchema);
module.exports = { ROLES, employee , STATUS};
