-- Admin Credentials Fix
-- Email: dishantgraphics@gmail.com
-- Password: dishant0106

-- Delete existing admin (if any)
DELETE FROM admins WHERE email = 'dishantgraphics@gmail.com';

-- Insert new admin with specified credentials
INSERT INTO admins (email, password) VALUES 
('dishantgraphics@gmail.com', 'dishant0106');

-- Verify admin insertion
SELECT * FROM admins WHERE email = 'dishantgraphics@gmail.com';
