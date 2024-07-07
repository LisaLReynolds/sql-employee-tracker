DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

\c business_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY, --auto increment id each is unique--
  name VARCHAR(30) UNIQUE NOT NULL
  );

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) --sets up foreign key on this table   assigns instructor_id as the foreign key--
  REFERENCES department(id) --sets up what the forein key is referencing--
  ON DELETE SET NULL
);