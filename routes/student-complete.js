const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// ==========================
// STUDENT LOGIN (ANY 4 DIGIT)
// ==========================
router.get('/login', (req, res) => {
    res.render('student/login', { title: 'Student Login - Aptitude Quest' });
});

router.post('/login', (req, res) => {
    const { roll_no } = req.body;

    if (!roll_no || !/^\d{4}$/.test(roll_no)) {
        return res.redirect('/student/login');
    }

    const checkQuery = "SELECT * FROM students WHERE roll_no = ?";

    db.query(checkQuery, [roll_no], (err, results) => {
        if (err) {
            console.error(err);
            return res.redirect('/student/login');
        }

        if (results.length === 0) {
            const insertQuery = "INSERT INTO students (roll_no, has_attempted) VALUES (?, 0)";

            db.query(insertQuery, [roll_no], (err2, insertResult) => {
                if (err2) {
                    console.error(err2);
                    return res.redirect('/student/login');
                }

                req.session.student = {
                    id: insertResult.insertId,
                    roll_no
                };

                console.log("STUDENT LOGIN SUCCESS:", roll_no);
                res.redirect('/student/dashboard');
            });
        } else {
            req.session.student = {
                id: results[0].id,
                roll_no: results[0].roll_no
            };

            console.log("STUDENT LOGIN SUCCESS:", roll_no);
            res.redirect('/student/dashboard');
        }
    });
});

// ==========================
// STUDENT DASHBOARD
// ==========================
router.get('/dashboard', (req, res) => {
    if (!req.session.student) {
        return res.redirect('/student/login');
    }

    const roll_no = req.session.student.roll_no;

    db.query("SELECT has_attempted FROM students WHERE roll_no = ?", [roll_no], (err, results) => {
        if (err || results.length === 0) {
            return res.redirect('/student/login');
        }

        const hasAttempted = results[0].has_attempted === 1;

        res.render('student/dashboard', {
            title: 'Student Dashboard - Aptitude Quest',
            student: req.session.student,
            hasAttempted: hasAttempted
        });
    });
});

// ==========================
// TEST PAGE (ONE TIME ONLY)
// ==========================
router.get('/test', (req, res) => {
    if (!req.session.student) {
        return res.redirect('/student/login');
    }

    const roll_no = req.session.student.roll_no;

    db.query("SELECT has_attempted FROM students WHERE roll_no = ?", [roll_no], (err, results) => {
        if (err || results.length === 0) {
            return res.redirect('/student/login');
        }

        if (results[0].has_attempted === 1) {
            return res.render('student/test-attempted', {
                title: 'Test Already Attempted - Aptitude Quest',
                student: req.session.student
            });
        }

        // Get questions grouped by sections (20 each)
        db.query("SELECT * FROM questions WHERE section = 'quantitative' ORDER BY RAND() LIMIT 20", (err, quantQuestions) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error fetching quantitative questions');
            }

            db.query("SELECT * FROM questions WHERE section = 'logical' ORDER BY RAND() LIMIT 20", (err, logicalQuestions) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error fetching logical questions');
                }

                db.query("SELECT * FROM questions WHERE section = 'verbal' ORDER BY RAND() LIMIT 20", (err, verbalQuestions) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Error fetching verbal questions');
                    }

                    res.render('student/test', {
                        title: 'Aptitude Test - Aptitude Quest',
                        student: req.session.student,
                        quantQuestions: quantQuestions,
                        logicalQuestions: logicalQuestions,
                        verbalQuestions: verbalQuestions
                    });
                });
            });
        });
    });
});

// ==========================
// TEST SUBMIT
// ==========================
router.post('/submit', (req, res) => {
    if (!req.session.student) {
        return res.redirect('/student/login');
    }

    const roll_no = req.session.student.roll_no;

    // Calculate scores for each section
    db.query("SELECT * FROM questions", (err, allQuestions) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching questions');
        }

        let quant_score = 0;
        let logical_score = 0;
        let verbal_score = 0;

        allQuestions.forEach(question => {
            const answer = req.body[`q${question.id}`];
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

        // Save result
        db.query("INSERT INTO results (student_id, quant_score, logical_score, verbal_score, total_score) VALUES (?, ?, ?, ?, ?)", 
                [req.session.student.id, quant_score, logical_score, verbal_score, total_score], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error saving result');
            }

            // Update student status
            db.query("UPDATE students SET has_attempted = 1 WHERE roll_no = ?", [roll_no], (err) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error updating student');
                }

                res.render('student/result', {
                    title: 'Test Result - Aptitude Quest',
                    student: req.session.student,
                    quant_score: quant_score,
                    logical_score: logical_score,
                    verbal_score: verbal_score,
                    total_score: total_score
                });
            });
        });
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
