INSERT INTO department (name)
VALUES ('Sales'), 
       ('Finance'), 
       ('Engineering'), 
       ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1), 
       ('Salesperson', 80000, 1), 
       ('Lead Engineer', 150000, 3), 
       ('Software Engineer', 120000, 3), 
       ('Account Manager', 160000, 2), 
       ('Accountant', 125000, 2), 
       ('Legal Team Lead', 250000, 4), 
       ('Lawyer', 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Joe', 'Shmoe', 1, null), 
       ('Pam', 'Beesly', 2, 1), 
       ('Ashley', 'Chen', 3, null), 
       ('Mia', 'Tupik', 4, 3), 
       ('Regina', 'George', 5, null), 
       ('John', 'Doe', 6, 5), 
       ('Kevin', 'Gnapoor', 7, null), 
       ('Tom', 'Smith', 8, 7);