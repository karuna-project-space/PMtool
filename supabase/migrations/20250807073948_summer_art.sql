-- Troubleshooting SQL queries
-- Use these to diagnose database issues

-- 1. Check database connection
SELECT 
    current_database() as database_name,
    current_user as current_user,
    version() as postgresql_version,
    now() as current_time;

-- 2. Check if employees table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'employees'
) as table_exists;

-- 3. Check table permissions
SELECT 
    grantee, 
    privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'employees';

-- 4. Check for any data
SELECT COUNT(*) as row_count FROM employees;

-- 5. Test basic operations
-- Insert test record
INSERT INTO employees (
    department, role, employee_type, location, billing_status, start_date
) VALUES (
    'Test Dept', 'Test Role', 'Full-time', 'Test Location', 'Billable', CURRENT_DATE
) ON CONFLICT (id) DO NOTHING;

-- Select test record
SELECT * FROM employees WHERE department = 'Test Dept';

-- Clean up test record
DELETE FROM employees WHERE department = 'Test Dept';

-- 6. Check for common issues
-- Check for null values in required fields
SELECT 
    COUNT(*) FILTER (WHERE department IS NULL) as null_departments,
    COUNT(*) FILTER (WHERE role IS NULL) as null_roles,
    COUNT(*) FILTER (WHERE employee_type IS NULL) as null_employee_types,
    COUNT(*) FILTER (WHERE location IS NULL) as null_locations,
    COUNT(*) FILTER (WHERE billing_status IS NULL) as null_billing_status,
    COUNT(*) FILTER (WHERE start_date IS NULL) as null_start_dates
FROM employees;

-- Check constraint violations
SELECT 
    employee_type,
    COUNT(*) 
FROM employees 
WHERE employee_type NOT IN ('Full-time', 'Part-time', 'Contract', 'Intern')
GROUP BY employee_type;

SELECT 
    billing_status,
    COUNT(*) 
FROM employees 
WHERE billing_status NOT IN ('Billable', 'Non-billable', 'Overhead')
GROUP BY billing_status;