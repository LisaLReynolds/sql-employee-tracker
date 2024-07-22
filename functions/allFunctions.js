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

module.exports = { allDepartments, allEmployees, allRoles };
