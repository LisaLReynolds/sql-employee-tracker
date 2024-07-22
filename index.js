const { prompt } = require("inquirer");
const { Pool } = require("pg");
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

//Connection pool to the database
const pool = new Pool(
  {
    user: "postgres",
    password: "root",
    host: "localhost",
    database: "business_db",
  },
  console.log("Connected to the business_db database.")
);

pool.connect();

console.log(logo(config).render()); //displays sql employee manager logo

init();

function init() {
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
  ]).then((answers) => {
    switch (answers.option) {
      case "View all departments":
        allDepartments();
        break;
      case "View all roles":
        allRoles();
        break;
      case "View all employees":
        allEmployees();
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
  });
}

module.exports = { init };
