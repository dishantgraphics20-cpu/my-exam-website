const express = require('express');
const router = express.Router();
const db = require('../database/connection.js');

// Student login page
router.get('/login', (req, res) => {
    res.render('student/login', { title: 'Student Login - Aptitude Quest' });
});

// Student login process - ROLL NUMBER ONLY
router.post('/login', (req, res) => {
    console.log('=== STUDENT LOGIN ATTEMPT ===');
    console.log('Request body:', req.body);
    
    const { roll_no } = req.body;
    
    // Validate input
    if (!roll_no) {
        console.log('❌ No roll number provided');
        return res.render('student/login', { 
            title: 'Student Login - Aptitude Quest',
            error: 'Please enter your roll number' 
        });
    }
    
    // Fetch student using roll_no only
    const query = 'SELECT * FROM students WHERE roll_no = ?';
    db.query(query, [roll_no], (err, results) => {
        if (err) {
            console.error('❌ Database error:', err);
            return res.render('student/login', { 
                title: 'Student Login - Aptitude Quest',
                error: 'Database error. Please try again.' 
            });
        }
        
        console.log('📊 Query results:', results);
        console.log('📊 Results length:', results.length);
        
        if (results.length === 0) {
            console.log('❌ No student found with roll_no:', roll_no);
            return res.render('student/login', { 
                title: 'Student Login - Aptitude Quest',
                error: 'Invalid roll number' 
            });
        }
        
        const student = results[0];
        console.log('✅ Student found:', student);
        
        // Save student in session (NO PASSWORD VERIFICATION)
        req.session.student = {
            id: student.id,
            roll_no: student.roll_no
        };
        
        console.log('💾 Session saved:', req.session.student);
        console.log('=== STUDENT LOGIN SUCCESS ===');
        
        // Redirect to student dashboard
        res.redirect('/student/dashboard');
    });
});

// Student dashboard
router.get('/dashboard', (req, res) => {
    if (!req.session.student) {
        console.log('❌ No student session, redirecting to login');
        return res.redirect('/student/login');
    }
    
    const student = req.session.student;
    console.log('📋 Student dashboard accessed by:', student.roll_no);
    
    // Simple dashboard
    res.render('student/dashboard', { 
        title: 'Student Dashboard - Aptitude Quest',
        student: student,
        hasAttempted: student.has_attempted || false
    });
});

// Start test
router.get('/test', (req, res) => {
    if (!req.session.student) {
        return res.redirect('/student/login');
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
    console.log('👋 Student logout');
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
