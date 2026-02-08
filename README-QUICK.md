# QUICK FIX GUIDE - SOLVE ALL DATABASE ERRORS

## STEP 1: Fix Database
Run this SQL file in phpMyAdmin:
```
database/SIMPLE_FIX.sql
```

## STEP 2: Restart Server
```bash
npm start
```

## STEP 3: Test Login
Go to: http://localhost:3000/student/login
- Roll Number: 1000
- Password: student123

## WHAT THIS FIXES:
✅ Creates proper database schema
✅ Adds test students with correct passwords
✅ Adds sample questions
✅ Better error handling in connection
✅ Clear error messages

## IF STILL ERRORS:
1. Check XAMPP MySQL service is running
2. Verify database name is "aptitude_quest"
3. Make sure you're running the SQL file completely

## TROUBLESHOOTING:
- Database not found → Run SIMPLE_FIX.sql
- Connection refused → Restart XAMPP MySQL
- Login fails → Check console logs in terminal

This will solve ALL database issues!
