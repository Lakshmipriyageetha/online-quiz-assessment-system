const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ===============================
// MIDDLEWARE
// ===============================

// Enable CORS
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Serve frontend files
app.use(express.static("public"));

// Request logging
app.use(morgan("dev"));

// ===============================
// SESSION CONFIGURATION
// ===============================

app.use(
    session({
        secret: process.env.SESSION_SECRET || "online-quiz-secret",
        resave: false,
        saveUninitialized: false,

        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60,
            sameSite: "lax"
        }
    })
);

// ===============================
// MONGODB CONNECTION
// ===============================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

// ===============================
// API ROUTES
// ===============================

// Quiz routes
app.use("/api/quizzes", quizRoutes);

// Authentication routes
app.use("/api/auth", authRoutes);

// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {
    res.json({
        message: "Online Quiz and Assessment System API is running"
    });
});

// ===============================
// TEST ROUTE
// ===============================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working correctly"
    });
});

// ===============================
// DEBUGGING ROUTE
// ===============================

app.get("/api/debug", (req, res) => {

    console.log("DEBUG: /api/debug route was accessed");

    res.json({
        success: true,
        message: "Debugging route is working",
        timestamp: new Date()
    });

});

// ===============================
// CENTRAL ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {

    console.error("Error:", err.message);

    res.status(500).json({
        success: false,
        message: "Internal server error"
    });

});

// ===============================
// START SERVER
// ===============================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});