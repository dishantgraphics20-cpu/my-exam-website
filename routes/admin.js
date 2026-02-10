const express = require('express');
const router = express.Router();
const db = require('../database/connection');

router.get('/login', (req, res) => {
    res.render('admin/login', { title: 'Admin Login - Aptitude Quest' });
});

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM admins WHERE email = $1', [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.render('admin/login', { 
                title: 'Admin Login - Aptitude Quest',
                error: 'Database error. Please try again.' 
            });
        }

        if (results.length > 0) {
            const admin = results[0];
            if (password === admin.password) {
                req.session.admin = {
                    id: admin.id,
                    email: admin.email
                };
                res.redirect('/admin/dashboard');
            } else {
                res.render('admin/login', { 
                    title: 'Admin Login - Aptitude Quest',
                    error: 'Invalid email or password' 
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

router.get('/dashboard', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    db.query('SELECT COUNT(*) as "totalStudents" FROM students', [], (err, studentCount) => {
        if (err) {
            console.error('Error fetching student count:', err);
            return res.status(500).send('Error fetching student count');
        }

        const totalStudents = studentCount[0].totalStudents;

        db.query('SELECT COUNT(*) as "totalQuestions" FROM questions', [], (err, questionCount) => {
            if (err) {
                console.error('Error fetching question count:', err);
                return res.status(500).send('Error fetching question count');
            }

            const totalQuestions = questionCount[0].totalQuestions;

            db.query('SELECT COUNT(*) as "totalResults" FROM results', [], (err, resultCount) => {
                if (err) {
                    console.error('Error fetching result count:', err);
                    return res.status(500).send('Error fetching result count');
                }

                const totalResults = resultCount[0].totalResults;

                const stats = {
                    totalStudents: totalStudents,
                    totalQuestions: totalQuestions,
                    totalResults: totalResults
                };

                res.render('admin/dashboard', {
                    title: 'Admin Dashboard - Aptitude Quest',
                    admin: req.session.admin,
                    stats: stats
                });
            });
        });
    });
});

router.get('/questions', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const currentSection = req.query.section || '';

    db.query('SELECT * FROM questions ORDER BY section, id', [], (err, questions) => {
        if (err) {
            console.error('Error fetching questions:', err);
            return res.status(500).send('Error fetching questions');
        }

        res.render('admin/questions', {
            title: 'Manage Questions - Aptitude Quest',
            admin: req.session.admin,
            questions: questions,
            currentSection: currentSection
        });
    });
});

router.get('/questions/add', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    res.render('admin/add-question', {
        title: 'Add Question - Aptitude Quest',
        admin: req.session.admin
    });
});

router.post('/questions/add', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const { question, option_a, option_b, option_c, option_d, correct_option, section } = req.body;

    db.query('INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_option, section) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
            [question, option_a, option_b, option_c, option_d, correct_option, section], (err) => {
        if (err) {
            console.error('Error adding question:', err);
            return res.status(500).send('Error adding question');
        }

        res.redirect('/admin/questions');
    });
});

router.get('/questions/edit/:id', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const questionId = req.params.id;

    db.query('SELECT * FROM questions WHERE id = $1', [questionId], (err, results) => {
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
        return res.redirect('/admin/login');
    }

    const questionId = req.params.id;
    const { question, option_a, option_b, option_c, option_d, correct_option, section } = req.body;

    db.query('UPDATE questions SET question = $1, option_a = $2, option_b = $3, option_c = $4, option_d = $5, correct_option = $6, section = $7 WHERE id = $8', 
            [question, option_a, option_b, option_c, option_d, correct_option, section, questionId], (err) => {
        if (err) {
            console.error('Error updating question:', err);
            return res.status(500).send('Error updating question');
        }

        res.redirect('/admin/questions');
    });
});

router.get('/questions/delete/:id', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    const questionId = req.params.id;

    db.query('DELETE FROM questions WHERE id = $1', [questionId], (err) => {
        if (err) {
            console.error('Error deleting question:', err);
            return res.status(500).send('Error deleting question');
        }

        res.redirect('/admin/questions');
    });
});

router.get('/students', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    db.query('SELECT * FROM students ORDER BY id', [], (err, students) => {
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

router.get('/results', (req, res) => {
    if (!req.session.admin) {
        return res.redirect('/admin/login');
    }

    db.query('SELECT r.*, s.roll_no FROM results r JOIN students s ON r.student_id = s.id ORDER BY r.id DESC', [], (err, results) => {
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

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
