const { prompt } = require("inquirer");
//const { Pool } = require("pg");
const logo = require("asciiart-logo");
const config = require("./package.json");
const {
  allDepartments,
  allEmployees,
  allRoles,
} = require("./functions/allFunctions");
const {
  addDepartment,
  addEmployee,
  addRole,
} = require("./functions/addFunctions");
const { updateEmpRole } = require("./functions/updateFunctions");

console.log(logo(config).render()); //displays sql employee manager logo

//init();

//function init() {
const init = function () {
  prompt([
    {
      type: "list",
      name: "option",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    },
  ]).then(async (answers) => {
    switch (answers.option) {
      case "View all departments":
        await allDepartments();
        break;
      case "View all roles":
        await allRoles();
        break;
      case "View all employees":
        await allEmployees();
        break;
      case "Add a department":
        addDepartment();
        break;
      case "Add a role":
        console.log("Add a role");
        addRole();
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "Update an employee role":
        updateEmpRole();
        break;
      case "Exit":
        process.exit();
        break;
      default:
        process.exit();
    }
    // Call Main Query/Inquirer Method
    init();
  });
};

init();

// module.exports = { init };
module.exports = init;
