-- Insert sample employee data
-- Run this after creating tables

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
),
(
    'Engineering', 'ENG002', 'Frontend Developer', 'Full-time', 'Seattle', 'Billable',
    70.00, 85, '2024-02-15', ARRAY['React', 'TypeScript', 'CSS', 'HTML']
),
(
    'Engineering', 'ENG003', 'Backend Developer', 'Contract', 'Remote', 'Billable',
    90.00, 75, '2024-01-10', ARRAY['Python', 'Django', 'PostgreSQL', 'Docker']
),
(
    'Design', 'DES002', 'Graphic Designer', 'Part-time', 'Los Angeles', 'Non-billable',
    45.00, 60, '2024-03-01', ARRAY['Adobe Photoshop', 'Illustrator', 'InDesign', 'Branding']
),
(
    'Sales', 'SAL001', 'Sales Manager', 'Full-time', 'Chicago', 'Non-billable',
    65.00, 90, '2024-01-05', ARRAY['CRM', 'Lead Generation', 'Negotiation', 'Team Management']
),
(
    'HR', 'HR001', 'HR Specialist', 'Full-time', 'Boston', 'Overhead',
    50.00, 80, '2024-02-20', ARRAY['Recruitment', 'Employee Relations', 'HRIS', 'Compliance']
)
ON CONFLICT (id) DO NOTHING;