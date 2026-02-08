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
            console.error('Error fetching student count:', err);
            return res.status(500).send('Error fetching student count');
        }
        
        db.query('SELECT COUNT(*) as totalQuestions FROM questions', (err, questionCount) => {
            if (err) {
                console.error('Error fetching question count:', err);
                return res.status(500).send('Error fetching question count');
            }
            
            db.query('SELECT COUNT(*) as totalResults FROM results', (err, resultCount) => {
                if (err) {
                    console.error('Error fetching result count:', err);
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
        console.log('No admin session, redirecting to login');
        return res.redirect('/admin/login');
    }

    db.query('SELECT * FROM questions ORDER BY section, id', (err, questions) => {
        if (err) {
            console.error('Error fetching questions:', err);
            return res.status(500).send('Error fetching questions');
        }

        res.render('admin/questions', {
            title: 'Manage Questions - Aptitude Quest',
            admin: req.session.admin,
            questions: questions
        });
    });
});

router.get('/questions/add', (req, res) => {
    if (!req.session.admin) {
        console.log('No admin session, redirecting to login');
        return res.redirect('/admin/login');
    }

    res.render('admin/add-question', {
        title: 'Add Question - Aptitude Quest',
        admin: req.session.admin
    });
});

router.post('/questions/add', (req, res) => {
    if (!req.session.admin) {
        console.log('No admin session, redirecting to login');
        return res.redirect('/admin/login');
    }

    const { question, option_a, option_b, option_c, option_d, correct_option, section } = req.body;

    db.query('INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_option, section) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [question, option_a, option_b, option_c, option_d, correct_option, section], (err) => {
        if (err) {
            console.error('Error adding question:', err);
            return res.status(500).send('Error adding question');
        }

        console.log('Question added successfully');
        res.redirect('/admin/questions');
    });
});

router.get('/questions/edit/:id', (req, res) => {
    if (!req.session.admin) {
        console.log('No admin session, redirecting to login');
        return res.redirect('/admin/login');
    }

    const questionId = req.params.id;

    db.query('SELECT * FROM questions WHERE id = ?', [questionId], (err, results) => {
        if (err) {
            console.error('Error fetching question:', err);
            return res.status(500).send('Error fetching question');
        }

        if (results.length === 0) {
            return res.status(404).send('Question not found');
        }

        res.render('admin/edit-question', {
            title: 'Edit Question - Aptitude Quest',
            admin: req.session.admin,
            question: results[0]
        });
    });
});

router.post('/questions/edit/:id', (req, res) => {
    if (!req.session.admin) {
        console.log('No admin session, redirecting to login');
        return res.redirect('/admin/login');
    }

    const questionId = req.params.id;
    const { question, option_a, option_b, option_c, option_d, correct_option, section } = req.body;

    db.query('UPDATE questions SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?, section = ? WHERE id = ?', 
            [question, option_a, option_b, option_c, option_d, correct_option, section, questionId], (err) => {
        if (err) {
            console.error('Error updating question:', err);
            return res.status(500).send('Error updating question');
        }

        console.log('Question updated successfully');
        res.redirect('/admin/questions');
    });
});

router.post('/questions/delete/:id', (req, res) => {
    if (!req.session.admin) {
        console.log('No admin session, redirecting to login');
        return res.redirect('/admin/login');
    }

    const questionId = req.params.id;

    db.query('DELETE FROM questions WHERE id = ?', [questionId], (err) => {
        if (err) {
            console.error('Error deleting question:', err);
            return res.status(500).send('Error deleting question');
        }

        console.log('Question deleted successfully');
        res.redirect('/admin/questions');
    });
});

// ==========================
// STUDENTS MANAGEMENT
// ==========================
router.get('/students', (req, res) => {
    if (!req.session.admin) {
        console.log('No admin session, redirecting to login');
        return res.redirect('/admin/login');
    }

    db.query('SELECT * FROM students ORDER BY id', (err, students) => {
        if (err) {
            console.error('Error fetching students:', err);
            return res.status(500).send('Error fetching students');
        }

        res.render('admin/students', {
            title: 'Manage Students - Aptitude Quest',
            admin: req.session.admin,
            students: students
        });
    });
});

// ==========================
// RESULTS MANAGEMENT
// ==========================
router.get('/results', (req, res) => {
    if (!req.session.admin) {
        console.log('No admin session, redirecting to login');
        return res.redirect('/admin/login');
    }

    db.query('SELECT r.*, s.roll_no FROM results r JOIN students s ON r.student_id = s.id ORDER BY r.id DESC', (err, results) => {
        if (err) {
            console.error('Error fetching results:', err);
            return res.status(500).send('Error fetching results');
        }

        res.render('admin/results', {
            title: 'Manage Results - Aptitude Quest',
            admin: req.session.admin,
            results: results
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
