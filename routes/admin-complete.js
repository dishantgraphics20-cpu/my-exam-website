const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../database/connection');

// ==========================
// ADMIN LOGIN
// ==========================
router.get('/login', (req, res) => {
    res.render('admin/login', { title: 'Admin Login - Aptitude Quest' });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    db.query('SELECT * FROM admins WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.render('admin/login', { 
                title: 'Admin Login - Aptitude Quest',
                error: 'Database error. Please try again.' 
            });
        }
        
        if (results.length > 0) {
            const admin = results[0];
            try {
                const passwordMatch = await bcrypt.compare(password, admin.password);
                
                if (passwordMatch) {
                    req.session.admin = admin;
                    res.redirect('/admin/dashboard');
                } else {
                    res.render('admin/login', { 
                        title: 'Admin Login - Aptitude Quest',
                        error: 'Invalid email or password' 
                    });
                }
            } catch (bcryptError) {
                console.error('Bcrypt error:', bcryptError);
                res.render('admin/login', { 
                    title: 'Admin Login - Aptitude Quest',
                    error: 'Authentication error. Please try again.' 
                });
            }
        } else {
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
        return res.redirect('/admin/login');
    }
    
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

// Add question page
router.get('/questions/add', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    res.render('admin/add-question', {
        title: 'Add Question - Aptitude Quest',
        admin: req.session.admin
    });
});

// Add question process
router.post('/questions/add', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const { question, option_a, option_b, option_c, option_d, correct_option, section } = req.body;

    db.query('INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_option, section) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [question, option_a, option_b, option_c, option_d, correct_option, section], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding question');
        }

        res.redirect('/admin/questions');
    });
});

// Edit question page
router.get('/questions/edit/:id', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const questionId = req.params.id;

    db.query('SELECT * FROM questions WHERE id = ?', [questionId], (err, results) => {
        if (err) {
            console.error(err);
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

// Edit question process
router.post('/questions/edit/:id', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const questionId = req.params.id;
    const { question, option_a, option_b, option_c, option_d, correct_option, section } = req.body;

    db.query('UPDATE questions SET question = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, correct_option = ?, section = ? WHERE id = ?', 
            [question, option_a, option_b, option_c, option_d, correct_option, section, questionId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating question');
        }

        res.redirect('/admin/questions');
    });
});

// Delete question
router.post('/questions/delete/:id', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const questionId = req.params.id;

    db.query('DELETE FROM questions WHERE id = ?', [questionId], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting question');
        }

        res.redirect('/admin/questions');
    });
});

// ==========================
// LOGOUT
// ==========================
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
