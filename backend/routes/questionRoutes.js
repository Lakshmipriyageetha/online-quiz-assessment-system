const express = require("express");
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

const router = express.Router();

// ==========================================
// CREATE QUESTION
// ==========================================
router.post("/", async (req, res) => {
    try {
        // Check login
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const {
            quizId,
            questionText,
            options,
            correctAnswer,
            marks,
            explanation,
            difficulty
        } = req.body;

        // Validate required fields
        if (
            !quizId ||
            !questionText ||
            !options ||
            !correctAnswer ||
            !marks
        ) {
            return res.status(400).json({
                success: false,
                message: "All required question fields are needed"
            });
        }

        // Check exactly 4 options
        if (!Array.isArray(options) || options.length !== 4) {
            return res.status(400).json({
                success: false,
                message: "Please provide exactly 4 options"
            });
        }

        // Check quiz exists
        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }

        // Create question
        const question = new Question({
            quizId,
            questionText,
            options,
            correctAnswer,
            marks,
            explanation,
            difficulty: difficulty || "Medium"
        });

        await question.save();

        res.status(201).json({
            success: true,
            message: "Question created successfully",
            question
        });

    } catch (error) {
        console.error("Create question error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create question"
        });
    }
});


// ==========================================
// GET ALL QUESTIONS FOR A QUIZ
// ==========================================
router.get("/quiz/:quizId", async (req, res) => {
    try {
        const questions = await Question.find({
            quizId: req.params.quizId
        }).sort({ createdAt: 1 });

        res.json({
            success: true,
            count: questions.length,
            questions
        });

    } catch (error) {
        console.error("Get questions error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch questions"
        });
    }
});


// ==========================================
// GET SINGLE QUESTION
// ==========================================
router.get("/:id", async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.json({
            success: true,
            question
        });

    } catch (error) {
        console.error("Get question error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch question"
        });
    }
});


// ==========================================
// UPDATE QUESTION
// ==========================================
router.put("/:id", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const {
            questionText,
            options,
            correctAnswer,
            marks,
            explanation,
            difficulty
        } = req.body;

        // Validate options
        if (!Array.isArray(options) || options.length !== 4) {
            return res.status(400).json({
                success: false,
                message: "Please provide exactly 4 options"
            });
        }

        const question = await Question.findByIdAndUpdate(
            req.params.id,
            {
                questionText,
                options,
                correctAnswer,
                marks,
                explanation,
                difficulty
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.json({
            success: true,
            message: "Question updated successfully",
            question
        });

    } catch (error) {
        console.error("Update question error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update question"
        });
    }
});


// ==========================================
// DELETE QUESTION
// ==========================================
router.delete("/:id", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const question = await Question.findByIdAndDelete(
            req.params.id
        );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.json({
            success: true,
            message: "Question deleted successfully"
        });

    } catch (error) {
        console.error("Delete question error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete question"
        });
    }
});


module.exports = router;