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
        
        // Save student in session
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
    
    // Get questions for test
    db.query('SELECT * FROM questions ORDER BY section, RAND() LIMIT 60', (err, questions) => {
        if (err) throw err;
        
        res.render('student/test', { 
            title: 'Aptitude Test - Aptitude Quest',
            questions: questions,
            student: req.session.student
        });
    });
});

// Submit test - FIXED VERSION
router.post('/submit', (req, res) => {
    console.log('=== STUDENT TEST SUBMIT ===');
    console.log('Request method:', req.method);
    console.log('Request body:', req.body);
    console.log('Session student:', req.session.student);
    
    if (!req.session.student) {
        console.log('❌ No student session, redirecting to login');
        return res.redirect('/student/login');
    }
    
    const answers = req.body || {};
    const studentId = req.session.student.id;
    
    console.log('Student ID:', studentId);
    console.log('Answers received:', answers);
    
    // Get questions to calculate scores
    db.query('SELECT * FROM questions', (err, questions) => {
        if (err) {
            console.error('❌ Database error fetching questions:', err);
            return res.status(500).send('Database error');
        }
        
        console.log('Questions fetched:', questions.length);
        
        let quant_score = 0;
        let logical_score = 0;
        let verbal_score = 0;
        
        questions.forEach(question => {
            const answer = answers[`q${question.id}`];
            if (answer === question.correct_option) {
                switch(question.section) {
                    case 'quantitative':
                        quant_score++;
                        break;
                    case 'logical':
                        logical_score++;
                        break;
                    case 'verbal':
                        verbal_score++;
                        break;
                }
            }
        });
        
        const total_score = quant_score + logical_score + verbal_score;
        
        console.log('Score calculation:', {
            quant_score,
            logical_score,
            verbal_score,
            total_score
        });
        
        // Save result
        db.query('INSERT INTO results (student_id, quant_score, logical_score, verbal_score, total_score) VALUES (?, ?, ?, ?, ?)', 
                [studentId, quant_score, logical_score, verbal_score, total_score], (err) => {
            if (err) {
                console.error('❌ Database error saving result:', err);
                return res.status(500).send('Error saving result');
            }
            
            console.log('✅ Result saved to database');
            
            // Update student status
            db.query('UPDATE students SET has_attempted = TRUE WHERE id = ?', [studentId], (err) => {
                if (err) {
                    console.error('❌ Database error updating student:', err);
                    return res.status(500).send('Error updating student');
                }
                
                console.log('✅ Student status updated');
                console.log('=== STUDENT SUBMIT SUCCESS ===');
                
                res.render('student/result', {
                    title: 'Test Result - Aptitude Quest',
                    quant_score: quant_score,
                    logical_score: logical_score,
                    verbal_score: verbal_score,
                    total_score: total_score
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
