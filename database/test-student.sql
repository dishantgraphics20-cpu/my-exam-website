-- Test Student Insert - Direct Login System (No Password)
-- Roll Number: 1000

USE aptitude_quest;

INSERT INTO students (roll_no, has_attempted) VALUES 
('1000', FALSE);

-- Additional test students
INSERT INTO students (roll_no, has_attempted) VALUES 
('1001', FALSE),
('1002', FALSE);

-- Note: No password needed for direct login system
-- Students can login using only their roll number
