--find all employees, join with roles and departments to display their roles, salaries, departments, and managers --
SELECT employee_id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, '', manager.last_name) AS manager FROM employee LEFT JOIN role on employee. role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;

--create new employee--
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4), [first_name, last_name, role_id, manager_id]

--update the given employees role --
UPDATE employee SET role_id = $1 WHERE id = $2, [roleId, employeeId]

--update the given employees manager --
UPDATE employee SET manager_id = $1 WHERE id = $2, [managerId, employeeId]