const express = require("express");

const app = express();

const PORT = 5000;

// Middleware
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Online Quiz and Assessment System API is running"
    });
});

// Test API route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working correctly"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});