const express = require("express");
const Quiz = require("../models/Quiz");

const router = express.Router();

// ===============================
// CREATE QUIZ
// ===============================

router.post("/", async (req, res) => {
    try {
          console.log("=================================");
console.log("CREATE QUIZ REQUEST BODY:");
console.log(req.body);
console.log("SESSION USER ID:");
console.log(req.session.userId);
console.log("=================================");
        // Check login
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const {
            title,
            description,
            subject,
            duration
        } = req.body;

        // Validate fields
        if (!title || !description || !subject || !duration) {
            return res.status(400).json({
                success: false,
                message: "All quiz fields are required"
            });
        }

        const quiz = new Quiz({
            title: title.trim(),
            description: description.trim(),
            subject: subject.trim(),
            duration: Number(duration),
            createdBy: req.session.userId
        });

        await quiz.save();

        res.status(201).json({
            success: true,
            message: "Quiz created successfully",
            quiz
        });

    } catch (error) {

        console.error("Create quiz error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create quiz"
        });
    }
});


// ===============================
// GET ALL QUIZZES
// ===============================

router.get("/", async (req, res) => {
    try {

        const quizzes = await Quiz.find()
            .populate("createdBy", "name email role")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: quizzes.length,
            quizzes
        });

    } catch (error) {

        console.error("Get quizzes error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch quizzes"
        });
    }
});


// ===============================
// GET QUIZ BY ID
// ===============================

router.get("/:id", async (req, res) => {
    try {

        const quiz = await Quiz.findById(req.params.id)
            .populate("createdBy", "name email role");

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        res.json({
            success: true,
            quiz
        });

    } catch (error) {

        console.error("Get quiz error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch quiz"
        });
    }
});


// ===============================
// UPDATE QUIZ
// ===============================

router.put("/:id", async (req, res) => {
    try {

        // Check login
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const {
            title,
            description,
            subject,
            duration
        } = req.body;

        // Validate fields
        if (!title || !description || !subject || !duration) {
            return res.status(400).json({
                success: false,
                message: "All quiz fields are required"
            });
        }

        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            {
                title: title.trim(),
                description: description.trim(),
                subject: subject.trim(),
                duration: Number(duration)
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        res.json({
            success: true,
            message: "Quiz updated successfully",
            quiz
        });

    } catch (error) {

        console.error("Update quiz error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update quiz"
        });
    }
});


// ===============================
// DELETE QUIZ
// ===============================

router.delete("/:id", async (req, res) => {
    try {

        // Check login
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const quiz = await Quiz.findByIdAndDelete(
            req.params.id
        );

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        res.json({
            success: true,
            message: "Quiz deleted successfully"
        });

    } catch (error) {

        console.error("Delete quiz error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete quiz"
        });
    }
});


module.exports = router;