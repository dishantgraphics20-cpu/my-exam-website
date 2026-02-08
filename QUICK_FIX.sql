-- QUICK FIX - Run this in phpMyAdmin
USE aptitude_quest;

-- Check if password column exists and remove it
SET @sql = (SELECT IF(
    (
        SELECT COUNT(*) 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE 
            TABLE_SCHEMA = 'aptitude_quest' 
            AND TABLE_NAME = 'students' 
            AND COLUMN_NAME = 'password'
    ) > 0,
    'ALTER TABLE students DROP COLUMN password',
    'SELECT "Password column already removed"'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Clear and insert test students
DELETE FROM students;
INSERT INTO students (roll_no, has_attempted) VALUES 
('1000', FALSE),
('1001', FALSE),
('1002', FALSE);

-- Show result
SELECT 'Student login system fixed - password removed' as status;
SELECT * FROM students;
