const { prompt } = require("inquirer");
const { Pool } = require("pg");
const logo = require("asciiart-logo");
const config = require("./package.json");

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
        console.log("Update an employee role");
        break;
      case "Exit":
        process.exit();
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
      init();
    });
}

function allRoles() {
  pool
    .query("SELECT * FROM role")
    .then((result) => {
      console.table(result.rows);
      init();
    })
    .catch((error) => {
      console.error("Error executing query", error);
      init();
    });
}

function allEmployees() {
  pool
    .query("SELECT * FROM employee")
    .then((result) => {
      console.table(result.rows);
      init();
    })
    .catch((error) => {
      console.error("Error executing query", error);
      init();
    });
}

function findRoles() {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await pool.query("SELECT id, title FROM role");
      resolve(result.rows);
    } catch (error) {
      console.error("Error executing query", error);
      reject(error);
    }
  });
}

function findDepartment() {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await pool.query("SELECT name FROM department");
      resolve(result.rows);
    } catch (error) {
      console.error("Error executing query", error);
      reject(error);
    }
  });
}

function findManager() {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await pool.query(
        "SELECT id, first_name, last_name FROM employee"
      );
      resolve(result.rows);
    } catch (error) {
      console.error("Error executing query", error);
      reject(error);
    }
  });
}

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

    findRoles().then((roles) => {
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

        findManager().then((options) => {
          const managerChoices = options.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id, // Use employee.id as the value
            })
          );

          managerChoices.unshift({ name: "None", value: null });

          prompt({
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managerChoices,
          }).then((response) => {
            let managerId = response.managerId;

            console.log(managerId);

            // Ensure managerId is correctly assigned to the id from managerChoices
            if (managerId !== null) {
              managerId = managerChoices.find(
                (choice) => choice.value === managerId
              ).value;
            }

            console.log(managerId);

            const newEmployee = createEmployee(
              firstName,
              lastName,
              roleId,
              managerId // Use the manager's employee.id
            );
            console.log("New Employee Object:", newEmployee);

            addEmployeeToDatabase(newEmployee);
          });
        });
      });
    });
  });

  function createEmployee(firstName, lastName, roleId, managerId) {
    return {
      first_name: firstName,
      last_name: lastName,
      role_id: roleId,
      manager_id: managerId, // Set the manager's employee.id
    };
  }

  function addEmployeeToDatabase(employee) {
    const query = {
      text: "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES($1, $2, $3, $4)",
      values: [
        employee.first_name,
        employee.last_name,
        employee.role_id,
        employee.manager_id,
      ],
    };

    pool
      .query(query)
      .then(() => {
        console.log("Employee added successfully");
        init();
      })
      .catch((error) => {
        console.error("Error adding employee", error);
      });
  }
}

function addDepartment() {
  prompt([
    {
      name: "department_name",
      message: "What is the department's name?",
    },
  ]).then((response) => {
    let departmentName = response.department_name;

    const newDepartment = createDepartment(departmentName);
    console.log("New Department Object:", newDepartment);

    addDepartmentToDatabase(newDepartment);
  });
}

function createDepartment(name) {
  return {
    name: name,
  };
}

function addDepartmentToDatabase(department) {
  const query = {
    text: "INSERT INTO department(name) VALUES($1)",
    values: [department.name],
  };

  pool
    .query(query)
    .then(() => {
      console.log("Department added successfully");
      init();
    })
    .catch((error) => {
      console.error("Error adding department", error);
    });
}

function addRole() {
  prompt([
    {
      name: "role_name",
      message: "What is the name of the role?",
    },
    {
      name: "role_salary",
      message: "What is the salary of the role",
    },
  ]).then((response) => {
    let roleName = response.role_name;
    let roleSalary = response.role_salary;

    findDepartment().then((departments) => {
      const deptChoices = departments.map(({ name }) => ({
        name: name,
        name: name,
      }));

      prompt({
        type: "list",
        name: "department",
        message: "Select the department for the role:",
        choices: deptChoices,
      });
    });
  });
}
