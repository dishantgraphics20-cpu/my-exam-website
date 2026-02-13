const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database/connection');

// Student login page
router.get('/login', (req, res) => {
    res.render('student/login', { title: 'Student Login - Aptitude Quest' });
});

// Student login process
router.post('/login', async (req, res) => {
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Request body:', req.body);
    
    const { roll_no, password } = req.body;
    
    // Validate input
    if (!roll_no || !password) {
        console.log('Missing credentials');
        return res.render('student/login', { 
            title: 'Student Login - Aptitude Quest',
            error: 'Please enter roll number and password' 
        });
    }
    
    try {
        // Query students table
        const query = 'SELECT * FROM students WHERE roll_no = ?';
        db.query(query, [roll_no], async (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.render('student/login', { 
                    title: 'Student Login - Aptitude Quest',
                    error: 'Database error. Please try again.' 
                });
            }
            
            console.log('Query results:', results);
            console.log('Results length:', results.length);
            
            if (results.length === 0) {
                console.log('No student found');
                return res.render('student/login', { 
                    title: 'Student Login - Aptitude Quest',
                    error: 'Invalid roll number' 
                });
            }
            
            const student = results[0];
            console.log('Student data:', student);
            
            // Verify password
            const passwordMatch = await bcrypt.compare(password, student.password);
            console.log('Password match:', passwordMatch);
            
            if (!passwordMatch) {
                console.log('Password does not match');
                return res.render('student/login', { 
                    title: 'Student Login - Aptitude Quest',
                    error: 'Invalid password' 
                });
            }
            
            // Save student in session
            req.session.student = {
                id: student.id,
                roll_no: student.roll_no,
                has_attempted: student.has_attempted
            };
            
            console.log('Session saved:', req.session.student);
            console.log('=== LOGIN SUCCESS ===');
            
            // Redirect to student dashboard
            res.redirect('/student/dashboard');
        });
    } catch (error) {
        console.error('Login error:', error);
        res.render('student/login', { 
            title: 'Student Login - Aptitude Quest',
            error: 'Login failed. Please try again.' 
        });
    }
});

// Student dashboard
router.get('/dashboard', (req, res) => {
    if (!req.session.student) {
        return res.redirect('/student/login');
    }
    
    const student = req.session.student;
    
    // Check if student has already attempted test
    db.query('SELECT * FROM results WHERE student_id = ?', [student.id], (err, results) => {
        if (err) throw err;
        
        const hasAttempted = results.length > 0;
        res.render('student/dashboard', { 
            title: 'Student Dashboard - Aptitude Quest',
            student: student,
            hasAttempted: hasAttempted
        });
    });
});

// Start test
router.get('/test', (req, res) => {
    if (!req.session.student) {
        return res.redirect('/student/login');
    }
    
    // Check if already attempted
    db.query('SELECT * FROM results WHERE student_id = ?', [req.session.student.id], (err, results) => {
        if (err) throw err;
        
        if (results.length > 0) {
            return res.redirect('/student/dashboard');
        }
        
        // Get questions for the test
        db.query('SELECT * FROM questions ORDER BY section, RAND() LIMIT 60', (err, questions) => {
            if (err) throw err;
            
            res.render('student/test', { 
                title: 'Aptitude Test - Aptitude Quest',
                questions: questions,
                student: req.session.student
            });
        });
    });
});

// Submit test
router.post('/submit', (req, res) => {
    if (!req.session.student) {
        return res.redirect('/student/login');
    }
    
    const answers = req.body;
    const studentId = req.session.student.id;
    
    // Get questions to calculate scores
    db.query('SELECT * FROM questions', (err, questions) => {
        if (err) throw err;
        
        let quantScore = 0;
        let logicalScore = 0;
        let verbalScore = 0;
        
        questions.forEach(question => {
            const answer = answers[`q${question.id}`];
            if (answer === question.correct_option) {
                switch(question.section) {
                    case 'quantitative':
                        quantScore++;
                        break;
                    case 'logical':
                        logicalScore++;
                        break;
                    case 'verbal':
                        verbalScore++;
                        break;
                }
            }
        });
        
        const totalScore = quantScore + logicalScore + verbalScore;
        
        // Save result
        db.query('INSERT INTO results (student_id, quant_score, logical_score, verbal_score, total_score) VALUES (?, ?, ?, ?, ?)', 
                [studentId, quantScore, logicalScore, verbalScore, totalScore], (err) => {
            if (err) throw err;
            
            // Update student status
            db.query('UPDATE students SET has_attempted = TRUE WHERE id = ?', [studentId], (err) => {
                if (err) throw err;
                
                res.render('student/result', {
                    title: 'Test Result - Aptitude Quest',
                    quantScore: quantScore,
                    logicalScore: logicalScore,
                    verbalScore: verbalScore,
                    totalScore: totalScore
                });
            });
        });
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
