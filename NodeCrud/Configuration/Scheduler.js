const schedule = require("node-schedule");
const { ROLES, employee, STATUS } = require("../Entity/Employee");
const {connect,sentAddNotif} = require("../Configuration/Socket");

const startScheduler = () => {
  schedule.scheduleJob("*/1 * * * *", async () => {
    const Employees = await employee.find();
    Employees.forEach(element => {
        if(element.status === 0){
            sentAddNotif(element.firstName)
        }
    });

  });
};

module.exports = { startScheduler };
