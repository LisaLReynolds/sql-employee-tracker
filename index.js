const { prompt } = require("inquirer");
const { Pool } = require("pg");
const logo = require("asciiart-logo");
const config = require("./package.json");
const consoleTable = require("console.table");

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

function allDepartments() {
  pool
    .query("SELECT * FROM department")
    .then((result) => {
      console.table(result.rows);
      init();
    })
    .catch((error) => {
      console.error("Error executing query", error);
    });
}

function allEmployees() {
  pool
    .query("SELECT * FROM employee")
    .then((result) => {
      console.table(result.rows);
    })
    .catch((error) => {
      console.error("Error executing query", error);
    });
}

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

      prompt({
        type: "list",
        name: "roleId",
        message: "What is the employee's role?",
        choices: roleChoices,
      }).then((response) => {
        let roleId = response.roleId;
        console.log(roleId);

        //next query for all employees and map over data for managerChoices because a manager is an employee

        //The unshift() method of Array instances adds the specified elements to the beginning of an array and returns the new length of the array

        //managerChoices.unshift({name: 'None', value: null})

        //then prompt for who is the employees manager by passing managerChoices to choices key

        //then create an employee object and call createEmployee()
      });
    });
  });
}
