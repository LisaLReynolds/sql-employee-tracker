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

module.exports = { findDepartment, findManager, findRoles };
