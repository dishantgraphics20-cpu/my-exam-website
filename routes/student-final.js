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

    // already attempted check
    db.query(
        "SELECT has_attempted FROM students WHERE roll_no = ?",
        [roll_no],
        (err, result) => {
            if (err) {
                console.log(err);
                return res.send("Database error");
            }

            if (result.length === 0) {
                return res.redirect('/student/login');
            }

            if (result[0].has_attempted === 1) {
                return res.send("You have already attempted the test");
            }

            // fetch ALL questions
            db.query(
                "SELECT * FROM questions ORDER BY section, id",
                (err, questions) => {
                    if (err) {
                        console.log(err);
                        return res.send("Question fetch error");
                    }

                    // Group questions by section and add numbering
                    const groupedQuestions = {
                        quantitative: [],
                        logical: [],
                        verbal: []
                    };

                    let quantCount = 1;
                    let logicalCount = 1;
                    let verbalCount = 1;

                    questions.forEach(question => {
                        const questionData = {
                            ...question,
                            display_id: question.id
                        };

                        switch(question.section) {
                            case 'quantitative':
                                questionData.question_number = quantCount++;
                                groupedQuestions.quantitative.push(questionData);
                                break;
                            case 'logical':
                                questionData.question_number = logicalCount++;
                                groupedQuestions.logical.push(questionData);
                                break;
                            case 'verbal':
                                questionData.question_number = verbalCount++;
                                groupedQuestions.verbal.push(questionData);
                                break;
                        }
                    });

                    res.render("student/test", {
                        title: 'Aptitude Test - Aptitude Quest',
                        student: req.session.student,
                        questions: questions,
                        groupedQuestions: groupedQuestions
                    });
                }
            );
        }
    );
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
