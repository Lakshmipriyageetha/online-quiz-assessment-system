const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const router = express.Router();


// ==========================================
// SIGNUP
// ==========================================

router.post("/signup", async (req, res) => {

    try {

        const { name, email, password, role } = req.body;


        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }


        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                message: "Please enter a valid email address"
            });
        }


        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }


        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user
        const user = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: role || "student"
        });


        await user.save();


        res.status(201).json({
            message: "User registered successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: "Signup failed",
            error: error.message
        });

    }

});


// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }


        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }


        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }


        // Create session
        req.session.userId = user._id;
        req.session.role = user.role;


        res.json({

            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

        });


    } catch (error) {

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });

    }

});


// ==========================================
// FORGOT PASSWORD
// ==========================================

router.post("/forgot-password", async (req, res) => {

    try {

        const { email, newPassword } = req.body;


        // Input validation
        if (!email || !newPassword) {
            return res.status(400).json({
                message: "Email and new password are required"
            });
        }


        // Password validation
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }


        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );


        user.password = hashedPassword;

        await user.save();


        res.json({
            message: "Password reset successfully"
        });


    } catch (error) {

        res.status(500).json({
            message: "Password reset failed",
            error: error.message
        });

    }

});


// ==========================================
// PROTECTED PROFILE ROUTE
// ==========================================

router.get("/profile", async (req, res) => {

    try {

        // Check session
        if (!req.session.userId) {

            return res.status(401).json({
                message: "Please login first"
            });

        }


        // Find logged-in user
        const user = await User.findById(
            req.session.userId
        ).select("-password");


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        res.json({

            message: "Protected route accessed successfully",

            user: user

        });


    } catch (error) {

        res.status(500).json({

            message: "Failed to fetch profile",

            error: error.message

        });

    }

});


// ==========================================
// LOGOUT
// ==========================================

router.post("/logout", (req, res) => {

    req.session.destroy((error) => {

        if (error) {

            return res.status(500).json({
                message: "Logout failed"
            });

        }


        res.json({
            message: "Logout successful"
        });

    });

});


module.exports = router;