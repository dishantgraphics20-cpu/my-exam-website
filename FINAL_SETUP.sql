-- Final Setup for Aptitude Quest
-- Admin Credentials: dishantgraphics@gmail.com / dishant0106

-- Delete existing admin (if any)
DELETE FROM admins WHERE email = 'dishantgraphics@gmail.com';

-- Insert new admin with specified credentials
INSERT INTO admins (email, password) VALUES 
('dishantgraphics@gmail.com', 'dishant0106');

-- Verify admin insertion
SELECT * FROM admins WHERE email = 'dishantgraphics@gmail.com';

-- Check existing data
SELECT COUNT(*) as total_students FROM students;
SELECT COUNT(*) as total_questions FROM questions;
SELECT COUNT(*) as total_results FROM results;
