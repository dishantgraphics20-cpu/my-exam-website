-- Fix Student Login - Remove Password Column and Add Test Data
USE aptitude_quest;

-- Remove password column from students table (if it exists)
ALTER TABLE students DROP COLUMN IF EXISTS password;

-- Clear existing students to avoid conflicts
DELETE FROM students;

-- Insert test students with direct login
INSERT INTO students (roll_no, has_attempted) VALUES 
('1000', FALSE),
('1001', FALSE),
('1002', FALSE);

-- Verify data was inserted
SELECT * FROM students;
