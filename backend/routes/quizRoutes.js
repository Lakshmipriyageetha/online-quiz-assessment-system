const express = require("express");
const Quiz = require("../models/Quiz");

const router = express.Router();

// ===============================
// CREATE QUIZ
// POST /api/quizzes
// ===============================

router.post("/", async (req, res) => {
  try {
    const quiz = new Quiz(req.body);

    await quiz.save();

    res.status(201).json({
      message: "Quiz created successfully",
      quiz: quiz
    });

  } catch (error) {
    res.status(500).json({
      message: "Error creating quiz",
      error: error.message
    });
  }
});


// ===============================
// READ ALL QUIZZES
// GET /api/quizzes
// ===============================

router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find();

    res.json({
      quizzes: quizzes
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching quizzes",
      error: error.message
    });
  }
});


// ===============================
// READ ONE QUIZ
// GET /api/quizzes/:id
// ===============================

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.json({
      quiz: quiz
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching quiz",
      error: error.message
    });
  }
});


// ===============================
// UPDATE QUIZ
// PUT /api/quizzes/:id
// ===============================

router.put("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.json({
      message: "Quiz updated successfully",
      quiz: quiz
    });

  } catch (error) {
    res.status(500).json({
      message: "Error updating quiz",
      error: error.message
    });
  }
});


// ===============================
// DELETE QUIZ
// DELETE /api/quizzes/:id
// ===============================

router.delete("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found"
      });
    }

    res.json({
      message: "Quiz deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Error deleting quiz",
      error: error.message
    });
  }
});


module.exports = router;