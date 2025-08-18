-- Create employees table with all required fields
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Organizational Information
    department VARCHAR(100) NOT NULL,
    cost_center VARCHAR(50),
    role VARCHAR(100) NOT NULL,
    employee_type VARCHAR(20) NOT NULL CHECK (employee_type IN ('Full-time', 'Part-time', 'Contract', 'Intern')),
    location VARCHAR(100) NOT NULL,
    billing_status VARCHAR(20) NOT NULL CHECK (billing_status IN ('Billable', 'Non-billable', 'Overhead')),
    
    -- Professional Details
    hourly_rate DECIMAL(10,2) CHECK (hourly_rate >= 0),
    utilization_target INTEGER DEFAULT 80 CHECK (utilization_target >= 0 AND utilization_target <= 100),
    start_date DATE NOT NULL,
    end_date DATE,
    
    -- Additional Information
    skills TEXT[], -- Array of skills
    
    -- System fields
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'deleted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date > start_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_employees_location ON employees(location);
CREATE INDEX IF NOT EXISTS idx_employees_employee_type ON employees(employee_type);
CREATE INDEX IF NOT EXISTS idx_employees_billing_status ON employees(billing_status);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_employees_start_date ON employees(start_date);
CREATE INDEX IF NOT EXISTS idx_employees_skills ON employees USING GIN(skills);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_employees_updated_at 
    BEFORE UPDATE ON employees 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO employees (
    department, cost_center, role, employee_type, location, billing_status,
    hourly_rate, utilization_target, start_date, skills
) VALUES 
(
    'Engineering', 'ENG001', 'Senior Software Developer', 'Full-time', 'New York', 'Billable',
    85.00, 80, '2024-01-15', ARRAY['JavaScript', 'React', 'Node.js', 'AWS']
),
(
    'Design', 'DES001', 'UX Designer', 'Contract', 'San Francisco', 'Billable',
    75.00, 75, '2024-02-01', ARRAY['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research']
),
(
    'Marketing', 'MKT001', 'Digital Marketing Specialist', 'Full-time', 'Austin', 'Non-billable',
    55.00, 85, '2024-01-20', ARRAY['SEO', 'Google Analytics', 'Social Media', 'Content Marketing']
);