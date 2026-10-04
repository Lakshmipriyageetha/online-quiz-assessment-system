const express = require("express");
const mongoose = require("mongoose");
const Quiz = require("../models/Quiz");

const router = express.Router();


// ======================================================
// HELPER FUNCTIONS
// ======================================================

function requireLogin(req, res) {
    if (!req.session.userId) {
        res.status(401).json({
            success: false,
            message: "Please login first"
        });

        return false;
    }

    return true;
}


function validObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}


// ======================================================
// CREATE QUIZ
// POST /api/quizzes
// ======================================================

router.post("/", async (req, res) => {

    try {

        console.log("=================================");
        console.log("CREATE QUIZ REQUEST");
        console.log("BODY:", req.body);
        console.log("USER:", req.session.userId);
        console.log("=================================");


        if (!requireLogin(req, res)) {
            return;
        }


        const {
            title,
            description,
            subject,
            duration
        } = req.body;


        if (
            !title ||
            !description ||
            !subject ||
            !duration
        ) {

            return res.status(400).json({
                success: false,
                message: "All quiz fields are required"
            });

        }


        const durationNumber = Number(duration);


        if (
            Number.isNaN(durationNumber) ||
            durationNumber <= 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Duration must be greater than 0"
            });

        }


        const quiz = new Quiz({

            title: title.trim(),

            description: description.trim(),

            subject: subject.trim(),

            duration: durationNumber,

            createdBy: req.session.userId,

            questions: []

        });


        await quiz.save();


        return res.status(201).json({

            success: true,

            message: "Quiz created successfully",

            quiz

        });

    }

    catch (error) {

        console.error(
            "Create quiz error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to create quiz"

        });

    }

});


// ======================================================
// GET ALL QUIZZES
// GET /api/quizzes
// ======================================================

router.get("/", async (req, res) => {

    try {

        const quizzes = await Quiz.find()
            .populate(
                "createdBy",
                "name email role"
            )
            .sort({
                createdAt: -1
            });


        return res.json({

            success: true,

            count: quizzes.length,

            quizzes

        });

    }

    catch (error) {

        console.error(
            "Get quizzes error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to fetch quizzes"

        });

    }

});


// ======================================================
// ADD QUESTION TO QUIZ
// POST /api/quizzes/:id/questions
// ======================================================

router.post("/:id/questions", async (req, res) => {

    try {

        if (!requireLogin(req, res)) {
            return;
        }


        const quizId = req.params.id;


        if (!validObjectId(quizId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid quiz ID"

            });

        }


        const {
            questionText,
            options,
            correctAnswer,
            marks
        } = req.body;


        // ----------------------------------------------
        // VALIDATION
        // ----------------------------------------------

        if (!questionText || !questionText.trim()) {

            return res.status(400).json({

                success: false,

                message: "Question text is required"

            });

        }


        if (
            !Array.isArray(options) ||
            options.length < 2
        ) {

            return res.status(400).json({

                success: false,

                message: "At least 2 options are required"

            });

        }


        const cleanedOptions = options
            .map(option => String(option).trim())
            .filter(option => option !== "");


        if (cleanedOptions.length < 2) {

            return res.status(400).json({

                success: false,

                message: "At least 2 non-empty options are required"

            });

        }


        if (!correctAnswer) {

            return res.status(400).json({

                success: false,

                message: "Correct answer is required"

            });

        }


        const cleanedCorrectAnswer =
            String(correctAnswer).trim();


        // Correct answer must be one of the options
        const answerExists =
            cleanedOptions.includes(
                cleanedCorrectAnswer
            );


        if (!answerExists) {

            return res.status(400).json({

                success: false,

                message:
                    "Correct answer must exactly match one of the options"

            });

        }


        const questionMarks =
            Number(marks) || 1;


        if (questionMarks < 1) {

            return res.status(400).json({

                success: false,

                message: "Marks must be at least 1"

            });

        }


        // ----------------------------------------------
        // FIND QUIZ
        // ----------------------------------------------

        const quiz =
            await Quiz.findById(quizId);


        if (!quiz) {

            return res.status(404).json({

                success: false,

                message: "Quiz not found"

            });

        }


        // ----------------------------------------------
        // CREATE EMBEDDED QUESTION
        // ----------------------------------------------

        quiz.questions.push({

            questionText:
                questionText.trim(),

            options:
                cleanedOptions,

            correctAnswer:
                cleanedCorrectAnswer,

            marks:
                questionMarks

        });


        await quiz.save();


        const addedQuestion =
            quiz.questions[
                quiz.questions.length - 1
            ];


        console.log(
            "Question added to quiz:",
            quiz._id
        );


        return res.status(201).json({

            success: true,

            message: "Question added successfully",

            question: addedQuestion,

            quizId: quiz._id,

            totalQuestions:
                quiz.questions.length

        });

    }

    catch (error) {

        console.error(
            "Add question error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to add question"

        });

    }

});


// ======================================================
// GET QUESTIONS FOR QUIZ
// GET /api/quizzes/:id/questions
// ======================================================

router.get("/:id/questions", async (req, res) => {

    try {

        const quizId = req.params.id;


        if (!validObjectId(quizId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid quiz ID"

            });

        }


        const quiz =
            await Quiz.findById(quizId);


        if (!quiz) {

            return res.status(404).json({

                success: false,

                message: "Quiz not found"

            });

        }


        return res.json({

            success: true,

            quizId: quiz._id,

            title: quiz.title,

            subject: quiz.subject,

            count: quiz.questions.length,

            questions: quiz.questions

        });

    }

    catch (error) {

        console.error(
            "Get questions error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to fetch questions"

        });

    }

});


// ======================================================
// DELETE QUESTION
// DELETE /api/quizzes/:quizId/questions/:questionId
// ======================================================

router.delete(
    "/:quizId/questions/:questionId",
    async (req, res) => {

        try {

            if (!requireLogin(req, res)) {
                return;
            }


            const {
                quizId,
                questionId
            } = req.params;


            if (!validObjectId(quizId)) {

                return res.status(400).json({

                    success: false,

                    message: "Invalid quiz ID"

                });

            }


            if (!validObjectId(questionId)) {

                return res.status(400).json({

                    success: false,

                    message: "Invalid question ID"

                });

            }


            const quiz =
                await Quiz.findById(quizId);


            if (!quiz) {

                return res.status(404).json({

                    success: false,

                    message: "Quiz not found"

                });

            }


            const questionIndex =
                quiz.questions.findIndex(
                    question =>
                        String(question._id) ===
                        String(questionId)
                );


            if (questionIndex === -1) {

                return res.status(404).json({

                    success: false,

                    message: "Question not found"

                });

            }


            quiz.questions.splice(
                questionIndex,
                1
            );


            await quiz.save();


            return res.json({

                success: true,

                message: "Question deleted successfully",

                totalQuestions:
                    quiz.questions.length

            });

        }

        catch (error) {

            console.error(
                "Delete question error:",
                error
            );


            return res.status(500).json({

                success: false,

                message: "Failed to delete question"

            });

        }

    }
);


// ======================================================
// STUDENT TAKE QUIZ
// IMPORTANT: THIS MUST COME BEFORE /:id
//
// GET /api/quizzes/:id/take
// ======================================================

router.get("/:id/take", async (req, res) => {

    try {

        if (!requireLogin(req, res)) {
            return;
        }


        const quizId = req.params.id;


        if (!validObjectId(quizId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid quiz ID"

            });

        }


        const quiz =
            await Quiz.findById(quizId)
                .populate(
                    "createdBy",
                    "name email role"
                )
                .lean();


        if (!quiz) {

            return res.status(404).json({

                success: false,

                message: "Quiz not found"

            });

        }


        if (
            !quiz.questions ||
            quiz.questions.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message: "This quiz has no questions"

            });

        }


        // ----------------------------------------------
        // NEVER SEND correctAnswer TO STUDENT
        // ----------------------------------------------

        const studentQuestions =
            quiz.questions.map(question => ({

                _id: question._id,

                questionText:
                    question.questionText,

                options:
                    question.options,

                marks:
                    question.marks

            }));


        return res.json({

            success: true,

            quiz: {

                _id: quiz._id,

                title: quiz.title,

                description: quiz.description,

                subject: quiz.subject,

                duration: quiz.duration,

                questions:
                    studentQuestions

            }

        });

    }

    catch (error) {

        console.error(
            "Take quiz error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to load quiz"

        });

    }

});


// ======================================================
// GET QUIZ BY ID
// GET /api/quizzes/:id
//
// Management endpoint
// This can contain correct answers.
// Do NOT use this endpoint for students.
// ======================================================

router.get("/:id", async (req, res) => {

    try {

        const quizId = req.params.id;


        if (!validObjectId(quizId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid quiz ID"

            });

        }


        const quiz =
            await Quiz.findById(quizId)
                .populate(
                    "createdBy",
                    "name email role"
                );


        if (!quiz) {

            return res.status(404).json({

                success: false,

                message: "Quiz not found"

            });

        }


        return res.json({

            success: true,

            quiz

        });

    }

    catch (error) {

        console.error(
            "Get quiz error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to fetch quiz"

        });

    }

});


// ======================================================
// UPDATE QUIZ
// PUT /api/quizzes/:id
// ======================================================

router.put("/:id", async (req, res) => {

    try {

        if (!requireLogin(req, res)) {
            return;
        }


        const quizId = req.params.id;


        if (!validObjectId(quizId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid quiz ID"

            });

        }


        const {
            title,
            description,
            subject,
            duration
        } = req.body;


        if (
            !title ||
            !description ||
            !subject ||
            !duration
        ) {

            return res.status(400).json({

                success: false,

                message: "All quiz fields are required"

            });

        }


        const durationNumber =
            Number(duration);


        if (
            Number.isNaN(durationNumber) ||
            durationNumber <= 0
        ) {

            return res.status(400).json({

                success: false,

                message: "Duration must be greater than 0"

            });

        }


        const quiz =
            await Quiz.findByIdAndUpdate(

                quizId,

                {

                    title:
                        title.trim(),

                    description:
                        description.trim(),

                    subject:
                        subject.trim(),

                    duration:
                        durationNumber

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


        return res.json({

            success: true,

            message: "Quiz updated successfully",

            quiz

        });

    }

    catch (error) {

        console.error(
            "Update quiz error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to update quiz"

        });

    }

});


// ======================================================
// DELETE QUIZ
// DELETE /api/quizzes/:id
// ======================================================

router.delete("/:id", async (req, res) => {

    try {

        if (!requireLogin(req, res)) {
            return;
        }


        const quizId = req.params.id;


        if (!validObjectId(quizId)) {

            return res.status(400).json({

                success: false,

                message: "Invalid quiz ID"

            });

        }


        const quiz =
            await Quiz.findByIdAndDelete(
                quizId
            );


        if (!quiz) {

            return res.status(404).json({

                success: false,

                message: "Quiz not found"

            });

        }


        return res.json({

            success: true,

            message: "Quiz deleted successfully"

        });

    }

    catch (error) {

        console.error(
            "Delete quiz error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to delete quiz"

        });

    }

});


module.exports = router;