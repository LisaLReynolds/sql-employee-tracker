const inquirer = require("inquirer");
const { Pool } = require("pg");

function init() {
  prompt([
    {
      type: "list",
      name: "option",
      message: "What would you like to do? (Use arrow keys)",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
    },
  ]).then((answers) => {
    switch (answers.option) {
      case "View all departments":
        allDepartments();
        break;
      case "View all roles":
        console.log("View all roles");
        break;
      case "View all employees":
        allEmployees();
        break;
      case "Add a department":
        addDepartment();
        break;
      case "Add a role":
        console.log("Add a role");
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "Update an employee role":
        console.log("Update an employee role");
        break;
      default:
        process.exit();
    }
  });
}

function allEmployees() {}

function allDepartments() {}

function addRole() {}

function addEmployee() {
  prompt([
    {
      name: "first_name",
      message: "What is the first name?",
    },
    {
      name: "last_name",
      message: "What is the last name?",
    },
  ]).then((response) => {
    let firstName = response.first_name;
    let lastName = response.last_name;

    findRoles().then(({ rows }) => {
      let roles = rows;
      console.log(roles);
      //map over roles to get role choices
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      prompt ({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices,
      }).then(response) => {
        let roleId = response.roleId;
        console.log(roleId);
      }
    });
  });
}
