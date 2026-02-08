-- SIMPLE DATABASE FIX - RUN THIS TO SOLVE ALL ERRORS

-- First, create database if not exists
CREATE DATABASE IF NOT EXISTS aptitude_quest;
USE aptitude_quest;

-- Drop existing tables to avoid conflicts
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS admins;

-- Create students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    has_attempted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admins table
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create questions table
CREATE TABLE questions (
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

-- Create results table
CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    quant_score INT DEFAULT 0,
    logical_score INT DEFAULT 0,
    verbal_score INT DEFAULT 0,
    total_score INT DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Insert admin (password: admin123)
INSERT INTO admins (email, password) VALUES 
('admin@aptitudequest.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.');

-- Insert test students (password: student123)
INSERT INTO students (roll_no, password, has_attempted) VALUES 
('1000', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', FALSE),
('1001', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', FALSE),
('1002', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.', FALSE);

-- Insert sample questions
INSERT INTO questions (section, question, option_a, option_b, option_c, option_d, correct_option) VALUES
('quantitative', 'What is 15% of 200?', '25', '30', '35', '40', 'b'),
('quantitative', 'If a car travels 60 km in 1.5 hours, what is its average speed?', '30 km/h', '40 km/h', '45 km/h', '50 km/h', 'b'),
('logical', 'Which number comes next: 2, 6, 12, 20, ?', '24', '28', '30', '32', 'b'),
('verbal', 'What is the synonym of "abundant"?', 'Scarce', 'Plentiful', 'Rare', 'Limited', 'b');

-- Show success message
SELECT 'DATABASE SETUP COMPLETE - READY TO USE' as status;
SELECT COUNT(*) as student_count FROM students;
SELECT COUNT(*) as question_count FROM questions;
