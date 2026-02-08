# Aptitude Quest - Online Examination System

A comprehensive online examination platform built with Node.js, Express.js, and MySQL. Features a student-friendly interface with aptitude testing capabilities and admin management tools.

## 🎯 Features

### Student Features
- **Secure Authentication**: Roll number and password-based login
- **60-Minute Timer**: Real-time countdown with auto-submission
- **60 MCQ Questions**: 20 questions each in Quantitative, Logical, and Verbal sections
- **Single Attempt Policy**: Prevents re-attempts as per examination rules
- **Instant Results**: Section-wise and total score display
- **Responsive Design**: Mobile-friendly interface

### Admin Features
- **Dashboard**: Overview of students, questions, and results
- **Question Management**: Add, edit, and delete questions
- **Student Management**: View all students and their test status
- **Result Analysis**: Comprehensive performance analytics
- **Secure Admin Panel**: Email and password authentication

## 🛠️ Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: EJS, HTML, CSS, JavaScript
- **Database**: MySQL
- **Authentication**: bcrypt for password hashing
- **Sessions**: express-session
- **Styling**: Custom CSS with Poppins font

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- XAMPP/WAMP/MAMP (for local development)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd aptitude-quest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

#### Option A: Using XAMPP/phpMyAdmin
1. Start XAMPP and start Apache & MySQL services
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `aptitude_quest`
4. Import the SQL files:
   - Import `database/schema.sql`
   - Import `database/sample-data.sql`

#### Option B: Using MySQL Command Line
```bash
mysql -u root -p
source database/schema.sql
source database/sample-data.sql
```

### 4. Configure Database Connection

Edit `database/connection.js` if your MySQL credentials are different:
```javascript
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Your MySQL password
    database: 'aptitude_quest'
});
```

### 5. Start the Application

#### Development Mode (with auto-restart):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

The application will be available at: http://localhost:3000

## 🔐 Default Credentials

### Student Login
- **Roll Number**: STU001, STU002, or STU003
- **Password**: student123

### Admin Login
- **Email**: admin@aptitudequest.com
- **Password**: admin123

## 📁 Project Structure

```
aptitude-quest/
├── database/
│   ├── connection.js          # Database connection
│   ├── schema.sql            # Database schema
│   └── sample-data.sql       # Sample questions and users
├── public/
│   ├── css/
│   │   └── style.css         # Main stylesheet
│   └── js/                   # JavaScript files
├── routes/
│   ├── admin.js              # Admin routes
│   ├── index.js              # Main routes
│   └── student.js            # Student routes
├── views/
│   ├── admin/                # Admin EJS templates
│   │   ├── dashboard.ejs
│   │   ├── login.ejs
│   │   ├── questions.ejs
│   │   ├── add-question.ejs
│   │   ├── edit-question.ejs
│   │   ├── students.ejs
│   │   └── results.ejs
│   ├── student/              # Student EJS templates
│   │   ├── login.ejs
│   │   ├── dashboard.ejs
│   │   ├── test.ejs
│   │   └── result.ejs
│   └── index.ejs             # Landing page
├── package.json
├── server.js                 # Main server file
└── README.md
```

## 🎨 UI Features

- **Student-Friendly Design**: Clean, modern interface with soft colors
- **Poppins Font**: Professional typography
- **Responsive Layout**: Works on all devices
- **Smooth Animations**: Fade-in effects and hover states
- **Color-Coded Sections**: Visual distinction for different test sections
- **Progress Indicators**: Clear status displays

## 📊 Test Structure

### Quantitative Aptitude (20 Questions)
- Mathematics and numerical ability
- Percentages, ratios, averages
- Time and work problems
- Geometry and algebra

### Logical Reasoning (20 Questions)
- Pattern recognition
- Series completion
- Analogies and classifications
- Logical deductions

### Verbal Ability (20 Questions)
- Synonyms and antonyms
- Grammar and sentence structure
- Reading comprehension
- Vocabulary and idioms

## 🔒 Security Features

- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Secure session handling
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Output encoding in templates

## 🧪 Testing

### Running Tests
1. Start the application
2. Use student credentials to take a test
3. Verify timer functionality
4. Check result calculation
5. Test admin panel features

### Sample Data
The `sample-data.sql` includes:
- 3 student accounts
- 1 admin account
- 60 sample questions (20 per section)

## 🚀 Deployment

### Production Deployment
1. Set environment variables:
   ```bash
   NODE_ENV=production
   PORT=3000
   ```
2. Configure production database
3. Use process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name "aptitude-quest"
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Error
- Check MySQL server is running
- Verify database credentials in `database/connection.js`
- Ensure database `aptitude_quest` exists

#### Port Already in Use
- Change port in `server.js` or kill existing process:
  ```bash
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

#### Session Issues
- Clear browser cookies
- Restart the application

## 📞 Support

For support and queries:
- Create an issue in the repository
- Check existing documentation
- Review troubleshooting section

---

**Aptitude Quest** - Empowering education through technology! 🎓
