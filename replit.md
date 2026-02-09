# Aptitude Quest - Online Examination System

## Overview
An online aptitude examination platform built with Node.js, Express, and EJS templates. Students can log in with a 4-digit roll number and take aptitude tests. Admins can manage questions, students, and view results.

## Recent Changes
- 2026-02-09: Imported from GitHub and adapted for Replit environment
  - Converted from MySQL to PostgreSQL (Replit built-in database)
  - Updated server to bind to 0.0.0.0:5000
  - Installed `pg` package for PostgreSQL connectivity

## Project Architecture
- **Runtime**: Node.js 20 with Express
- **Templating**: EJS
- **Database**: PostgreSQL (Replit built-in, accessed via DATABASE_URL)
- **Session**: express-session (cookie-based, 1 hour expiry)

### Directory Structure
- `server.js` - Main entry point, Express app setup
- `database/connection.js` - PostgreSQL pool connection wrapper
- `routes/` - Express route handlers (index, student, admin)
- `views/` - EJS templates (index, student/, admin/)
- `public/` - Static assets (CSS)

### Key Credentials
- **Admin login**: email: `admin@aptitudequest.com`, password: `admin123`
- **Student login**: Any 4-digit roll number (auto-creates account)

### Database Tables
- `students` - Student accounts (roll_no, has_attempted)
- `admins` - Admin accounts (email, password)
- `questions` - Exam questions (section: quantitative/logical/verbal)
- `results` - Student test results with section scores

## User Preferences
- None recorded yet
