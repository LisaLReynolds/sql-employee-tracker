const { prompt } = require("inquirer");

const logo = require("asciiart-logo");
const config = require("./package.json");
const pool = require("./db/connection.js");
const {
  findDepartment,
  findEmployee,
  findRoles,
} = require("./functions/findFunctions");

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

function allDepartments() {
  //console.log("In ALl Functions INIT: ", init);

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

function addDepartment() {
  prompt([
    {
      name: "department_name",
      message: "What is the department's name?",
    },
  ]).then((response) => {
    let departmentName = response.department_name;

    const newDepartment = {
      name: departmentName,
    };
    console.log("New Department Object:", newDepartment);

    const query = {
      text: "INSERT INTO department(name) VALUES($1)",
      values: [newDepartment.name],
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

        findEmployee().then((options) => {
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

            const newEmployee = {
              first_name: firstName,
              last_name: lastName,
              role_id: roleId,
              manager_id: managerId,
            };

            const query = {
              text: "INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES($1, $2, $3, $4)",
              values: [
                newEmployee.first_name,
                newEmployee.last_name,
                newEmployee.role_id,
                newEmployee.manager_id,
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
          });
        });
      });
    });
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
      }).then((response) => {
        let dept = response.department;
        console.log(dept);

        // Insert the new role into the database
        pool.query(
          `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, (SELECT id FROM department WHERE name = $3))`,
          [roleName, roleSalary, dept],
          (error, result) => {
            if (error) {
              console.error("Error adding role:", error);
              init();
            } else {
              console.log("Role added successfully!");
              init();
            }
          }
        );
      });
    });
  });
}

function updateEmpRole() {
  findEmployee().then((options) => {
    const employeeOptions = options.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id, // Use employee.id as the value
    }));
    prompt({
      type: "list",
      name: "employeeChoice",
      message: "Which employee's role do you want to update?",
      choices: employeeOptions,
    }).then((response) => {
      let employeeId = response.employeeChoice;
      console.log(employeeId);

      findRoles().then((roles) => {
        const roleOptions = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));
        prompt({
          type: "list",
          name: "roleId",
          message: "Which role do you want to assign to the selected employee?",
          choices: roleOptions,
        }).then((response) => {
          let roleId = response.roleId;

          console.log(roleId);
          const updateEmployeeRoleQuery = `
              UPDATE employee
              SET role_id = $1
              WHERE id = $2
            `;

          // Execute the update query
          pool.query(
            updateEmployeeRoleQuery,
            [roleId, employeeId],
            (err, result) => {
              if (err) {
                console.error("Error updating employee's role:", err);
                init();
              } else {
                console.log("Employee's role updated successfully!");
                init();
              }
            }
          );
        });
      });
    });
  });
}
