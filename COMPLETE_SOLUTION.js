const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const path = require('path');

// Database connection with better error handling
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aptitude_quest',
    debug: true,
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('SOLUTION: Run database/SIMPLE_FIX.sql in phpMyAdmin');
        }
        return;
    }
    console.log('✅ Connected to MySQL database');
});

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
    secret: 'aptitude-quest-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 3600000 // 1 hour
    }
}));

// Test route to verify server is working
app.get('/test', (req, res) => {
    res.json({ 
        status: 'Server is running',
        time: new Date().toISOString(),
        session: req.session
    });
});

// Student routes
app.get('/student/login', (req, res) => {
    console.log('Student login page accessed');
    res.render('student/login', { title: 'Student Login - Aptitude Quest' });
});

app.post('/student/login', async (req, res) => {
    console.log('=== STUDENT LOGIN ATTEMPT ===');
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
    
    const { roll_no, password } = req.body;
    
    // Validate input
    if (!roll_no || !password) {
        console.log('❌ Missing credentials');
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
            
            // Verify password
            const passwordMatch = await bcrypt.compare(password, student.password);
            console.log('🔐 Password match:', passwordMatch);
            
            if (!passwordMatch) {
                console.log('❌ Password does not match');
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
            
            console.log('💾 Session saved:', req.session.student);
            console.log('=== STUDENT LOGIN SUCCESS ===');
            
            // Redirect to student dashboard
            res.redirect('/student/dashboard');
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.render('student/login', { 
            title: 'Student Login - Aptitude Quest',
            error: 'Login failed. Please try again.' 
        });
    }
});

app.get('/student/dashboard', (req, res) => {
    if (!req.session.student) {
        console.log('❌ No student session, redirecting to login');
        return res.redirect('/student/login');
    }
    
    const student = req.session.student;
    console.log('📋 Student dashboard accessed by:', student.roll_no);
    
    // Simple dashboard without database check for now
    res.render('student/dashboard', { 
        title: 'Student Dashboard - Aptitude Quest',
        student: student,
        hasAttempted: student.has_attempted || false
    });
});

app.get('/student/logout', (req, res) => {
    console.log('👋 Student logout');
    req.session.destroy();
    res.redirect('/');
});

// Admin routes
app.get('/admin/login', (req, res) => {
    console.log('Admin login page accessed');
    res.render('admin/login', { title: 'Admin Login - Aptitude Quest' });
});

app.post('/admin/login', async (req, res) => {
    console.log('=== ADMIN LOGIN ATTEMPT ===');
    console.log('Request body:', req.body);
    
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.render('admin/login', { 
            title: 'Admin Login - Aptitude Quest',
            error: 'Please enter email and password' 
        });
    }
    
    try {
        db.query('SELECT * FROM admins WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('❌ Admin database error:', err);
                return res.render('admin/login', { 
                    title: 'Admin Login - Aptitude Quest',
                    error: 'Database error. Please try again.' 
                });
            }
            
            if (results.length === 0) {
                console.log('❌ No admin found with email:', email);
                return res.render('admin/login', { 
                    title: 'Admin Login - Aptitude Quest',
                    error: 'Invalid email or password' 
                });
            }
            
            const admin = results[0];
            const passwordMatch = await bcrypt.compare(password, admin.password);
            
            if (!passwordMatch) {
                console.log('❌ Admin password does not match');
                return res.render('admin/login', { 
                    title: 'Admin Login - Aptitude Quest',
                    error: 'Invalid email or password' 
                });
            }
            
            req.session.admin = admin;
            console.log('✅ Admin login successful');
            res.redirect('/admin/dashboard');
        });
    } catch (error) {
        console.error('❌ Admin login error:', error);
        res.render('admin/login', { 
            title: 'Admin Login - Aptitude Quest',
            error: 'Login failed. Please try again.' 
        });
    }
});

app.get('/admin/dashboard', (req, res) => {
    if (!req.session.admin) {
        console.log('❌ No admin session, redirecting to login');
        return res.redirect('/admin/login');
    }
    
    console.log('📊 Admin dashboard accessed');
    res.render('admin/dashboard', {
        title: 'Admin Dashboard - Aptitude Quest',
        admin: req.session.admin,
        stats: {
            students: 0,
            questions: 0,
            results: 0
        }
    });
});

app.get('/admin/logout', (req, res) => {
    console.log('👋 Admin logout');
    req.session.destroy();
    res.redirect('/');
});

// Main route
app.get('/', (req, res) => {
    console.log('🏠 Landing page accessed');
    res.render('index', { 
        title: 'Aptitude Quest - Online Examination System',
        user: req.session.user 
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Aptitude Quest server running on port ${PORT}`);
    console.log(`🌐 Access the application at: http://localhost:${PORT}`);
    console.log('📝 Test server status at: http://localhost:${PORT}/test');
});

module.exports = app;
