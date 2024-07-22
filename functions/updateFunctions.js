const { findEmployee, findRoles } = require("./findFunctions");
const { Pool } = require("pg");

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
              } else {
                console.log("Employee's role updated successfully!");
              }
            }
          );
        });
      });
    });
  });
}

module.exports = { updateEmpRole };
