-- Complete Fix for Student Login System
USE aptitude_quest;

-- Drop and recreate students table without password column
DROP TABLE IF EXISTS students;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    has_attempted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test students
INSERT INTO students (roll_no, has_attempted) VALUES 
('1000', FALSE),
('1001', FALSE),
('1002', FALSE);

-- Verify the data
SELECT 'Students table created successfully' as status;
SELECT * FROM students;
