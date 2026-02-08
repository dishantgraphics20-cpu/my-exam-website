const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// ==========================
// ADMIN LOGIN
// ==========================
router.get('/login', (req, res) => {
    res.render('admin/login', { title: 'Admin Login - Aptitude Quest' });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log('Admin login attempt:', { email, password });
    
    db.query('SELECT * FROM admins WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.render('admin/login', { 
                title: 'Admin Login - Aptitude Quest',
                error: 'Database error. Please try again.' 
            });
        }
        
        console.log('Admin query results:', results);
        
        if (results.length > 0) {
            const admin = results[0];
            console.log('Admin found:', admin);
            
            // Plain-text password comparison
            if (password === admin.password) {
                console.log('Password match - login successful');
                req.session.admin = {
                    id: admin.id,
                    email: admin.email
                };
                res.redirect('/admin/dashboard');
            } else {
                console.log('Password mismatch - login failed');
                res.render('admin/login', { 
                    title: 'Admin Login - Aptitude Quest',
                    error: 'Invalid email or password' 
                });
            }
        } else {
            console.log('No admin found with email:', email);
            res.render('admin/login', { 
                title: 'Admin Login - Aptitude Quest',
                error: 'Invalid email or password' 
            });
        }
    });
});

// ==========================
// ADMIN DASHBOARD
// ==========================
router.get('/dashboard', (req, res) => {
    if (!req.session.admin) {
        console.log('No admin session, redirecting to login');
        return res.redirect('/admin/login');
    }
    
    console.log('Admin dashboard accessed by:', req.session.admin.email);
    
    // Get statistics
    db.query('SELECT COUNT(*) as totalStudents FROM students', (err, studentCount) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching student count');
        }
        
        db.query('SELECT COUNT(*) as totalQuestions FROM questions', (err, questionCount) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching question count');
            }
            
            db.query('SELECT COUNT(*) as totalResults FROM results', (err, resultCount) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error fetching result count');
                }
                
                res.render('admin/dashboard', {
                    title: 'Admin Dashboard - Aptitude Quest',
                    admin: req.session.admin,
                    stats: {
                        totalStudents: studentCount[0].totalStudents,
                        totalQuestions: questionCount[0].totalQuestions,
                        totalResults: resultCount[0].totalResults
                    }
                });
            });
        });
    });
});

// ==========================
// QUESTION MANAGEMENT
// ==========================
router.get('/questions', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    db.query('SELECT * FROM questions ORDER BY section, id', (err, questions) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching questions');
        }

        res.render('admin/questions', {
            title: 'Manage Questions - Aptitude Quest',
            admin: req.session.admin,
            questions: questions
        });
    });
});

// ==========================
// LOGOUT
// ==========================
router.get('/logout', (req, res) => {
    console.log('Admin logout:', req.session.admin?.email);
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
