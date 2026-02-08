-- Aptitude Quest Database Schema

CREATE DATABASE IF NOT EXISTS aptitude_quest;
USE aptitude_quest;

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    has_attempted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    section ENUM('quantitative', 'logical', 'verbal') NOT NULL,
    question TEXT NOT NULL,
    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,
    correct_option ENUM('a', 'b', 'c', 'd') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results table
CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    quant_score INT DEFAULT 0,
    logical_score INT DEFAULT 0,
    verbal_score INT DEFAULT 0,
    total_score INT DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Insert default admin (email: admin@aptitudequest.com, password: admin123)
INSERT INTO admins (email, password) VALUES 
('admin@aptitudequest.com', '$2b$10$rQ8KQZJqKqQZqKqKqKqKqOZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8')
ON DUPLICATE KEY UPDATE email = email;

-- Insert sample students
INSERT INTO students (roll_no, password) VALUES 
('STU001', '$2b$10$rQ8KQZJqKqQZqKqKqKqKqOZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8'),
('STU002', '$2b$10$rQ8KQZJqKqQZqKqKqKqKqOZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8'),
('STU003', '$2b$10$rQ8KQZJqKqQZqKqKqKqKqOZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8')
ON DUPLICATE KEY UPDATE roll_no = roll_no;
