-- PROPER STUDENT LOGIN FIX
-- Creates users table with role field and inserts test students

USE aptitude_quest;

-- Create users table with role field
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    has_attempted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test students with bcrypt hashed passwords
-- Password: student123 for all test students
INSERT INTO users (roll_no, password, role, has_attempted) VALUES 
('1000', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'student', FALSE),
('1001', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'student', FALSE),
('1002', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', 'student', FALSE);

-- Verify the data
SELECT 'Users table created with role field' as status;
SELECT * FROM users WHERE role = 'student';

-- Note: If you prefer to keep existing tables, you can also:
-- 1. Add role column to students table: ALTER TABLE students ADD COLUMN role ENUM('student', 'admin') DEFAULT 'student';
-- 2. Update existing records: UPDATE students SET role = 'student';
-- 3. Add password column: ALTER TABLE students ADD COLUMN password VARCHAR(255);
-- 4. Update passwords: UPDATE students SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE roll_no IN ('1000', '1001', '1002');
