-- Sample Data for Aptitude Quest Testing
USE aptitude_quest;

-- Update student passwords (hashed with bcrypt)
-- Password: student123
UPDATE students SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE roll_no = 'STU001';
UPDATE students SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE roll_no = 'STU002';
UPDATE students SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE roll_no = 'STU003';

-- Update admin password (hashed with bcrypt)
-- Password: admin123
UPDATE admins SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.' WHERE email = 'admin@aptitudequest.com';

-- Clear existing questions
DELETE FROM questions;

-- Insert Quantitative Aptitude Questions (20)
INSERT INTO questions (section, question, option_a, option_b, option_c, option_d, correct_option) VALUES
('quantitative', 'What is 15% of 200?', '25', '30', '35', '40', 'b'),
('quantitative', 'If a car travels 60 km in 1.5 hours, what is its average speed?', '30 km/h', '40 km/h', '45 km/h', '50 km/h', 'b'),
('quantitative', 'What is the next number in the series: 2, 6, 12, 20, 30, ?', '40', '42', '44', '46', 'b'),
('quantitative', 'A shopkeeper sells an article at 20% profit. If the cost price is $500, what is the selling price?', '$550', '$600', '$650', '$700', 'b'),
('quantitative', 'What is the value of x in the equation: 3x + 7 = 22?', '5', '6', '7', '8', 'a'),
('quantitative', 'The average of 5 numbers is 20. If one number is excluded, the average becomes 18. What is the excluded number?', '20', '25', '28', '30', 'c'),
('quantitative', 'What is 3/4 of 80?', '60', '65', '70', '75', 'a'),
('quantitative', 'If the ratio of boys to girls in a class is 3:2 and there are 30 boys, how many girls are there?', '15', '18', '20', '25', 'c'),
('quantitative', 'What is the compound interest on $1000 at 10% per annum for 2 years?', '$200', '$210', '$220', '$230', 'b'),
('quantitative', 'A train 150m long passes a pole in 15 seconds. What is its speed?', '10 m/s', '12 m/s', '15 m/s', '18 m/s', 'a'),
('quantitative', 'What is the square root of 529?', '21', '22', '23', '24', 'c'),
('quantitative', 'If 5 workers can complete a task in 10 days, how many days will 8 workers take?', '5.5 days', '6 days', '6.25 days', '7 days', 'c'),
('quantitative', 'What is 25% of 80% of 200?', '40', '45', '50', '55', 'a'),
('quantitative', 'The sum of two numbers is 45 and their difference is 15. What are the numbers?', '20 and 25', '25 and 30', '30 and 15', '35 and 10', 'c'),
('quantitative', 'What is the area of a circle with radius 7 cm?', '144 cm²', '154 cm²', '164 cm²', '174 cm²', 'b'),
('quantitative', 'If a:b = 3:4 and b:c = 5:6, what is a:c?', '15:24', '5:8', '3:6', '15:8', 'b'),
('quantitative', 'What is 20% of 25% of 400?', '20', '25', '30', '35', 'a'),
('quantitative', 'A number when divided by 8 leaves remainder 3. When divided by 5, what will be the remainder?', '1', '2', '3', '4', 'c'),
('quantitative', 'What is the value of (2³)²?', '32', '64', '128', '256', 'b'),
('quantitative', 'If the cost price of 10 pens is equal to the selling price of 8 pens, what is the profit percentage?', '20%', '25%', '30%', '35%', 'b');

-- Insert Logical Reasoning Questions (20)
INSERT INTO questions (section, question, option_a, option_b, option_c, option_d, correct_option) VALUES
('logical', 'Which number comes next in the series: 1, 4, 9, 16, 25, ?', '30', '36', '40', '49', 'b'),
('logical', 'If A is taller than B, B is taller than C, then A is ?', 'Shorter than C', 'Equal to C', 'Taller than C', 'Cannot determine', 'c'),
('logical', 'Find the odd one out: Apple, Banana, Carrot, Orange', 'Apple', 'Banana', 'Carrot', 'Orange', 'c'),
('logical', 'If all roses are flowers and some flowers fade quickly, then?', 'All roses fade quickly', 'Some roses fade quickly', 'No roses fade quickly', 'Cannot determine', 'd'),
('logical', 'Complete the analogy: Doctor is to Patient as Teacher is to ?', 'Student', 'Books', 'School', 'Knowledge', 'a'),
('logical', 'Which word does not belong: Tiger, Lion, Elephant, Dog', 'Tiger', 'Lion', 'Elephant', 'Dog', 'd'),
('logical', 'If Monday is to Tuesday as March is to ?', 'April', 'May', 'June', 'February', 'a'),
('logical', 'Find the missing number: 2, 6, 12, 20, 30, ?', '40', '42', '44', '46', 'b'),
('logical', 'Which is the odd one out: Circle, Square, Triangle, Line', 'Circle', 'Square', 'Triangle', 'Line', 'd'),
('logical', 'If all cats are animals and some animals are pets, then?', 'All cats are pets', 'Some cats are pets', 'No cats are pets', 'Cannot determine', 'd'),
('logical', 'Complete the series: AB, BC, CD, DE, ?', 'EF', 'FG', 'GH', 'HI', 'a'),
('logical', 'Which comes next: Winter, Spring, Summer, ?', 'Autumn', 'Winter', 'Spring', 'Monsoon', 'a'),
('logical', 'If 3 + 4 = 21, 5 + 6 = 55, then 2 + 3 = ?', '6', '10', '12', '15', 'a'),
('logical', 'Find the odd one out: Mercury, Venus, Earth, Sun', 'Mercury', 'Venus', 'Earth', 'Sun', 'd'),
('logical', 'If all books are pages and some pages are blank, then?', 'All books are blank', 'Some books are blank', 'No books are blank', 'Cannot determine', 'd'),
('logical', 'Which number should replace the question mark: 1, 1, 2, 3, 5, 8, ?', '11', '12', '13', '14', 'c'),
('logical', 'If A = 1, B = 2, C = 3, then what is the value of CAB?', '312', '321', '123', '213', 'a'),
('logical', 'Which is the odd one out: Piano, Guitar, Violin, Drum', 'Piano', 'Guitar', 'Violin', 'Drum', 'd'),
('logical', 'If today is Tuesday, what day will it be after 100 days?', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'a'),
('logical', 'Find the missing letter: A, C, F, J, O, ?', 'T', 'U', 'V', 'W', 'b');

-- Insert Verbal Ability Questions (20)
INSERT INTO questions (section, question, option_a, option_b, option_c, option_d, correct_option) VALUES
('verbal', 'What is the synonym of "abundant"?', 'Scarce', 'Plentiful', 'Rare', 'Limited', 'b'),
('verbal', 'Choose the correct spelling:', 'Accomodate', 'Accommodate', 'Acommodate', 'Acomodate', 'b'),
('verbal', 'What is the antonym of "ancient"?', 'Old', 'Modern', 'Historical', 'Traditional', 'b'),
('verbal', 'Fill in the blank: The cat is ___ the table.', 'on', 'in', 'at', 'over', 'a'),
('verbal', 'Which is the correct sentence?', 'He don''t like coffee', 'He doesn''t like coffee', 'He doesn''t likes coffee', 'He don''t likes coffee', 'b'),
('verbal', 'What is the meaning of "procrastinate"?', 'To hurry', 'To delay', 'To finish early', 'To organize', 'b'),
('verbal', 'Choose the correct article: ___ apple a day keeps the doctor away.', 'A', 'An', 'The', 'No article', 'b'),
('verbal', 'What is the plural of "child"?', 'Childs', 'Children', 'Childrens', 'Childes', 'b'),
('verbal', 'Which word is a noun?', 'Run', 'Beautiful', 'Book', 'Quickly', 'c'),
('verbal', 'Complete the idiom: Better late than ___?', 'Never', 'Early', 'Always', 'Sometimes', 'a'),
('verbal', 'What is the past tense of "go"?', 'Went', 'Gone', 'Going', 'Goed', 'a'),
('verbal', 'Choose the correct preposition: The book is ___ the shelf.', 'in', 'on', 'at', 'over', 'b'),
('verbal', 'What is the meaning of "ubiquitous"?', 'Rare', 'Everywhere', 'Hidden', 'Expensive', 'b'),
('verbal', 'Which sentence is in passive voice?', 'The boy kicked the ball', 'The ball was kicked by the boy', 'The boy kicks the ball', 'The ball kicks the boy', 'b'),
('verbal', 'What is the comparative form of "good"?', 'Gooder', 'Better', 'Best', 'More good', 'b'),
('verbal', 'Choose the correct conjunction: I like tea ___ coffee.', 'but', 'and', 'or', 'so', 'c'),
('verbal', 'What is the prefix meaning "not" in "unhappy"?', 'un', 'happy', 'unh', 'pp', 'a'),
('verbal', 'Which word means "to make something better"?', 'Improve', 'Worsen', 'Destroy', 'Ignore', 'a'),
('verbal', 'What is the correct spelling?', 'Necesary', 'Necessary', 'Necesery', 'Necassary', 'b'),
('verbal', 'Complete the proverb: Actions speak louder than ___?', 'Words', 'Thoughts', 'Promises', 'Ideas', 'a');
