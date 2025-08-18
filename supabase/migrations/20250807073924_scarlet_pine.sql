-- Create Database and User (Run as postgres superuser)
-- This file creates the database and user with proper permissions

-- Create database
CREATE DATABASE employee_management_db;

-- Create user (optional - you can use existing postgres user)
-- CREATE USER emp_user WITH PASSWORD 'your_password_here';

-- Grant privileges to user
-- GRANT ALL PRIVILEGES ON DATABASE employee_management_db TO emp_user;

-- Connect to the new database
\c employee_management_db;

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;