# Security Checklist
## Online Quiz and Assessment System

### 1. Input Validation
- [x] Required fields are checked
- [x] Email format is validated
- [x] Password minimum length is validated
- [x] Quiz fields are validated
- [x] Invalid requests return appropriate error messages

### 2. Password Security
- [x] Passwords are hashed using bcrypt
- [x] Plaintext passwords are not stored in MongoDB
- [x] Login uses bcrypt password comparison

### 3. Session Security
- [x] Login creates a session
- [x] Protected routes check the logged-in session
- [x] Session cookie uses httpOnly
- [x] Session cookie uses sameSite protection
- [x] Logout destroys the session

### 4. CORS
- [x] CORS middleware is configured
- [x] Cross-origin API requests are handled by the Express application

### 5. Error Handling
- [x] Route errors are handled using try/catch
- [x] Central error-handling middleware is implemented
- [x] Server errors return appropriate HTTP responses

### 6. Logging
- [x] Morgan logging middleware is configured
- [x] HTTP requests are logged
- [x] Debugging messages are used during development

### 7. Environment Variables
- [x] MongoDB connection string is stored in .env
- [x] Session secret is stored in .env
- [x] .env is excluded from Git using .gitignore

### 8. Database Security
- [x] Mongoose schemas are used
- [x] Required fields are defined in schemas
- [x] Validation is enabled for quiz updates

### 9. Security Testing
- [x] Protected routes were tested without login
- [x] Login and logout were tested
- [x] Invalid input was tested
- [x] Debugging route was tested
- [x] API request logging was verified

### 10. Known Security Issue
- [ ] npm audit still reports one moderate vulnerability in the qs package.
- [ ] This vulnerability should be reviewed before production deployment.