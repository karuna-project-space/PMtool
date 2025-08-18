-- Verify database setup
-- Run this to check if everything is working correctly

-- Check if table exists and has correct structure
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'employees' 
ORDER BY ordinal_position;

-- Check indexes
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'employees';

-- Check constraints
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'employees'::regclass;

-- Check triggers
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'employees';

-- Count sample data
SELECT 
    COUNT(*) as total_employees,
    COUNT(*) FILTER (WHERE status = 'active') as active_employees,
    COUNT(DISTINCT department) as departments,
    COUNT(DISTINCT location) as locations
FROM employees;

-- Sample data preview
SELECT 
    id,
    department,
    role,
    employee_type,
    location,
    billing_status,
    created_at
FROM employees 
ORDER BY created_at DESC 
LIMIT 5;