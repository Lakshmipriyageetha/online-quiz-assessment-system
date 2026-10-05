ONLINE QUIZ AND ASSESSMENT SYSTEM
1. Project Description

The Online Quiz and Assessment System is a web-based application developed to conduct online quizzes and assessments. The system allows users to securely log in, create and manage quizzes, add questions, participate in quizzes, and automatically evaluate submitted answers. It also stores quiz results and provides students with their performance and result history.

2. Problem Statement

Traditional quiz and assessment processes involve manual question management, answer evaluation, score calculation, and result maintenance. This project aims to provide a digital platform that automates quiz creation, question management, student participation, evaluation, score calculation, and result management.

3. Objectives
To provide secure user registration and login.
To allow users to create and manage quizzes.
To allow questions to be added and managed for each quiz.
To allow students to participate in online quizzes.
To automatically evaluate submitted answers.
To calculate scores and percentages automatically.
To store quiz results in MongoDB.
To provide result history for students.
To provide dashboard-based performance information.
To provide a student profile page.
4. Main Features
4.1 User Authentication
User registration and login
Password hashing using bcrypt
Session and cookie-based authentication
Protected routes
Logout functionality
4.2 Quiz Management
Create new quizzes
View available quizzes
Edit quiz details
Delete quizzes
Manage quiz subject and duration
View the number of questions in each quiz
4.3 Question Management
Add questions to quizzes
Add multiple-choice options
Set the correct answer
Assign marks to questions
View questions
Delete questions
4.4 Quiz Participation
Students can view available quizzes
Students can attend quizzes
Timer-based quiz participation
Students can select answers
Answers are submitted to the server
Automatic evaluation after submission
4.5 Results and Performance
Automatic score calculation
Automatic percentage calculation
Result storage in MongoDB
Result history
Detailed result view
Dashboard statistics
Average score
Highest score
Total quiz attempts
4.6 Student Profile
View student name
View email address
View user role
View quiz performance
View account information
5. Technology Stack
Technology	Purpose
HTML	Web page structure
CSS	Styling and user interface
JavaScript	Frontend functionality
Node.js	Backend runtime environment
Express.js	Backend framework and REST APIs
MongoDB	Database
Mongoose	MongoDB database modeling
bcrypt	Password hashing
Express Session	Session-based authentication
Morgan	Server logging
CORS	Cross-Origin Resource Sharing
Git	Version control
GitHub	Source code management
6. System Modules

The project is divided into the following major modules:

Module 1 – Authentication

This module handles user registration, login, logout, password hashing, sessions, cookies, and protected routes.

Module 2 – Quiz Management

This module allows quizzes to be created, viewed, edited, and deleted. Quiz information includes title, subject, description, and duration.

Module 3 – Question Management

This module allows questions to be added to quizzes with multiple options, correct answers, and marks.

Module 4 – Quiz Participation

This module allows students to open a quiz, answer questions, and submit their answers within the specified duration.

Module 5 – Automatic Evaluation

After submission, the system compares the student's selected answers with the correct answers stored in the database and automatically calculates the score and percentage.

Module 6 – Result Management

This module stores student results and provides result history and detailed result information.

Module 7 – Dashboard

The dashboard displays available quizzes, total attempts, average score, highest score, and recent quiz results.

Module 8 – Student Profile

The profile page displays the logged-in user's basic account information and quiz performance statistics.

7. Database

The project uses MongoDB as the database.

The database stores:

User information
Quiz information
Questions
Answer options
Correct answers
Student quiz results
Scores and percentages

Mongoose is used to define schemas and communicate with MongoDB.

8. Security Features

The system includes several security and quality features:

Password hashing using bcrypt
Session-based authentication
Protected API routes
Input validation
CORS configuration
Error handling
Server logging
Environment variables for sensitive configuration
Prevention of direct access to protected functionality
9. Project Structure

The project contains the following major folders and files:

Backend

server.js – Main Express server
models/ – Database models
routes/ – API routes
seedQuestions.js – Script for adding sample quiz questions
package.json – Project dependencies

Frontend

login.html – Login page
signup.html – Registration page
dashboard.html – Student dashboard
quiz-management.html – Quiz management page
question-management.html – Question management page
take-quiz.html – Quiz participation page
results.html – Result history
result-details.html – Detailed result page
profile.html – Student profile page
10. Working Process

The basic working process of the system is:

User Registration → Login → Dashboard → View Quiz → Attend Quiz → Submit Answers → Automatic Evaluation → Score Calculation → Result Storage → View Results

For quiz management, the process is:

Login → Create Quiz → Add Questions → Set Correct Answers → Save Quiz → Students Attend Quiz

11. Project Status

The core development of the Online Quiz and Assessment System has been completed.

The implemented features include:

User authentication
Password hashing
Session and cookie management
Quiz creation and management
Question management
Quiz participation
Automatic evaluation
Score and percentage calculation
Result storage
Result history
Dashboard statistics
Student profile

The project is currently in the testing and improvement phase.

12. Testing

The application has been tested for the major workflows, including:

User registration
User login
Protected routes
Quiz creation
Question addition
Quiz participation
Answer submission
Automatic score calculation
Result storage
Result history
Dashboard statistics
Student profile

The backend server and MongoDB connection have also been tested successfully.

13. Version Control

The project is maintained using Git and GitHub.

The latest version of the project has been pushed to the GitHub repository:

Online Quiz and Assessment System

Git is used to maintain the project history and track changes during development.

14. Future Enhancements

The following features can be added in future versions:

Email-based password reset
Advanced teacher dashboard
More detailed role-based authorization
Question editing
Quiz scheduling
Randomized questions
Advanced performance charts
More detailed teacher result analysis
Cloud deployment
15. Conclusion

The Online Quiz and Assessment System provides a simple and efficient platform for conducting online assessments. It reduces manual work involved in quiz creation, answer evaluation, score calculation, and result management. The system provides students with a convenient way to attend quizzes and view their performance while providing the necessary tools for quiz and question management.
