const express = require("express");
const mongoose = require("mongoose");

const Quiz = require("../models/Quiz");
const Result = require("../models/Result");

const router = express.Router();


// =====================================================
// CACHE CONTROL
// =====================================================

function disableCache(res) {

    res.set(
        "Cache-Control",
        "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    res.set("Pragma", "no-cache");
    res.set("Expires", "0");
}


// =====================================================
// AUTHENTICATION HELPER
// =====================================================

function requireLogin(req, res) {

    if (!req.session || !req.session.userId) {

        res.status(401).json({
            success: false,
            message: "Please login first"
        });

        return false;
    }

    return true;
}


// =====================================================
// GET CURRENT USER ID
// =====================================================

function getCurrentUserId(req) {

    return new mongoose.Types.ObjectId(
        req.session.userId
    );
}


// =====================================================
// SUBMIT QUIZ
// POST /api/results/submit
// =====================================================

router.post("/submit", async (req, res) => {

    try {

        disableCache(res);


        // -------------------------------------------------
        // LOGIN CHECK
        // -------------------------------------------------

        if (!requireLogin(req, res)) {
            return;
        }


        // -------------------------------------------------
        // GET REQUEST DATA
        // -------------------------------------------------

        const {
            quizId,
            answers
        } = req.body;


        // -------------------------------------------------
        // VALIDATE QUIZ ID
        // -------------------------------------------------

        if (
            !quizId ||
            !mongoose.Types.ObjectId.isValid(quizId)
        ) {

            return res.status(400).json({
                success: false,
                message: "Valid quiz ID is required"
            });
        }


        // -------------------------------------------------
        // VALIDATE ANSWERS
        // -------------------------------------------------

        if (!Array.isArray(answers)) {

            return res.status(400).json({
                success: false,
                message: "Answers must be an array"
            });
        }


        // -------------------------------------------------
        // FIND QUIZ
        // -------------------------------------------------

        const quiz = await Quiz
            .findById(quizId)
            .lean();


        if (!quiz) {

            return res.status(404).json({
                success: false,
                message: "Quiz not found"
            });
        }


        // -------------------------------------------------
        // CHECK QUESTIONS
        // -------------------------------------------------

        if (
            !quiz.questions ||
            quiz.questions.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "This quiz does not contain any questions"
            });
        }


        // -------------------------------------------------
        // CALCULATE TOTAL MARKS
        // -------------------------------------------------

        let totalMarks = 0;

        quiz.questions.forEach(question => {

            totalMarks +=
                Number(question.marks) || 1;

        });


        // -------------------------------------------------
        // EVALUATE ANSWERS
        // -------------------------------------------------

        let score = 0;

        const evaluatedAnswers =
            quiz.questions.map(question => {

                const submittedAnswer =
                    answers.find(answer => {

                        return String(
                            answer.questionId
                        ) === String(
                            question._id
                        );

                    });


                const selectedAnswer =
                    submittedAnswer &&
                    submittedAnswer.selectedAnswer
                        ? String(
                            submittedAnswer.selectedAnswer
                        ).trim()
                        : "";


                const correctAnswer =
                    String(
                        question.correctAnswer || ""
                    ).trim();


                const marks =
                    Number(question.marks) || 1;


                const isCorrect =
                    selectedAnswer !== "" &&
                    selectedAnswer === correctAnswer;


                const marksObtained =
                    isCorrect
                        ? marks
                        : 0;


                if (isCorrect) {
                    score += marksObtained;
                }


                return {

                    questionId:
                        question._id,

                    questionText:
                        question.questionText || "",

                    selectedAnswer:
                        selectedAnswer,

                    correctAnswer:
                        correctAnswer,

                    isCorrect:
                        isCorrect,

                    marks:
                        marks,

                    marksObtained:
                        marksObtained

                };

            });


        // -------------------------------------------------
        // CALCULATE PERCENTAGE
        // -------------------------------------------------

        const percentage =
            totalMarks > 0
                ? Number(
                    (
                        (score / totalMarks) *
                        100
                    ).toFixed(2)
                )
                : 0;


        // -------------------------------------------------
        // CURRENT STUDENT
        // -------------------------------------------------

        const currentUserId =
            getCurrentUserId(req);


        // -------------------------------------------------
        // SAVE RESULT
        //
        // Save BOTH student and studentId.
        // This keeps old and new data compatible.
        // -------------------------------------------------

        const result = new Result({

            student:
                currentUserId,

            studentId:
                currentUserId,

            quizId:
                quiz._id,

            score:
                score,

            totalMarks:
                totalMarks,

            percentage:
                percentage,

            answers:
                evaluatedAnswers

        });


        await result.save();


        // -------------------------------------------------
        // SERVER LOG
        // -------------------------------------------------

        console.log(
            "=============================================="
        );

        console.log(
            "QUIZ RESULT SAVED SUCCESSFULLY"
        );

        console.log(
            "Student ID:",
            currentUserId.toString()
        );

        console.log(
            "Quiz:",
            quiz.title
        );

        console.log(
            "Score:",
            score + " / " + totalMarks
        );

        console.log(
            "Percentage:",
            percentage + "%"
        );

        console.log(
            "Result ID:",
            result._id.toString()
        );

        console.log(
            "=============================================="
        );


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.status(201).json({

            success: true,

            message:
                "Quiz submitted successfully",

            result: {

                _id:
                    result._id,

                quizId:
                    result.quizId,

                score:
                    result.score,

                totalMarks:
                    result.totalMarks,

                percentage:
                    result.percentage,

                createdAt:
                    result.createdAt

            }

        });

    }

    catch (error) {

        console.error(
            "Submit quiz error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to submit quiz",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

});


// =====================================================
// GET MY RESULTS
// GET /api/results/my-results
//
// Supports BOTH:
// student
// studentId
// =====================================================

router.get("/my-results", async (req, res) => {

    try {

        disableCache(res);


        if (!requireLogin(req, res)) {
            return;
        }


        const currentUserId =
            getCurrentUserId(req);


        // -------------------------------------------------
        // SEARCH OLD + NEW RESULT RECORDS
        // -------------------------------------------------

        const results =
            await Result.find({

                $or: [

                    {
                        student:
                            currentUserId
                    },

                    {
                        studentId:
                            currentUserId
                    }

                ]

            })

            .populate(
                "quizId",
                "title subject duration description"
            )

            .sort({
                createdAt: -1
            });


        return res.json({

            success: true,

            count:
                results.length,

            results:
                results

        });

    }

    catch (error) {

        console.error(
            "Get my results error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch results"

        });

    }

});


// =====================================================
// DASHBOARD RESULTS
// GET /api/results/dashboard
// =====================================================

router.get("/dashboard", async (req, res) => {

    try {

        disableCache(res);


        if (!requireLogin(req, res)) {
            return;
        }


        const currentUserId =
            getCurrentUserId(req);


        // -------------------------------------------------
        // GET STUDENT RESULTS
        //
        // IMPORTANT:
        // Search BOTH student AND studentId.
        // -------------------------------------------------

        const results =
            await Result.find({

                $or: [

                    {
                        student:
                            currentUserId
                    },

                    {
                        studentId:
                            currentUserId
                    }

                ]

            })

            .populate(
                "quizId",
                "title subject duration description"
            )

            .sort({
                createdAt: -1
            });


        // -------------------------------------------------
        // TOTAL ATTEMPTS
        // -------------------------------------------------

        const totalAttempts =
            results.length;


        // -------------------------------------------------
        // AVERAGE PERCENTAGE
        // -------------------------------------------------

        let averagePercentage = 0;


        if (totalAttempts > 0) {

            const totalPercentage =
                results.reduce(
                    (sum, result) => {

                        return sum +
                            Number(
                                result.percentage || 0
                            );

                    },
                    0
                );


            averagePercentage =
                Number(
                    (
                        totalPercentage /
                        totalAttempts
                    ).toFixed(2)
                );

        }


        // -------------------------------------------------
        // HIGHEST PERCENTAGE
        // -------------------------------------------------

        let highestPercentage = 0;


        if (totalAttempts > 0) {

            highestPercentage =
                Math.max(
                    ...results.map(
                        result =>
                            Number(
                                result.percentage || 0
                            )
                    )
                );

        }


        // -------------------------------------------------
        // PREPARE RECENT RESULTS
        // -------------------------------------------------

        const dashboardResults =
            results.map(result => {

                return {

                    _id:
                        result._id,

                    quizId:
                        result.quizId,

                    score:
                        result.score,

                    totalMarks:
                        result.totalMarks,

                    percentage:
                        result.percentage,

                    createdAt:
                        result.createdAt

                };

            });


        // -------------------------------------------------
        // DEBUG LOG
        // -------------------------------------------------

        console.log(
            "=============================================="
        );

        console.log(
            "DASHBOARD RESULT CHECK"
        );

        console.log(
            "Logged-in Student:",
            currentUserId.toString()
        );

        console.log(
            "Total Attempts:",
            totalAttempts
        );

        console.log(
            "Average Percentage:",
            averagePercentage
        );

        console.log(
            "Highest Percentage:",
            highestPercentage
        );

        console.log(
            "=============================================="
        );


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.json({

            success: true,

            summary: {

                totalAttempts:
                    totalAttempts,

                averagePercentage:
                    averagePercentage,

                highestPercentage:
                    highestPercentage

            },

            results:
                dashboardResults

        });

    }

    catch (error) {

        console.error(
            "Dashboard results error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to load dashboard results"

        });

    }

});


// =====================================================
// GET SINGLE RESULT
// GET /api/results/:id
//
// Used by result-details.html
// =====================================================

router.get("/:id", async (req, res) => {

    try {

        disableCache(res);


        if (!requireLogin(req, res)) {
            return;
        }


        // -------------------------------------------------
        // VALIDATE RESULT ID
        // -------------------------------------------------

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid result ID"

            });

        }


        const currentUserId =
            getCurrentUserId(req);


        // -------------------------------------------------
        // FIND RESULT
        //
        // Supports old + new student fields.
        // -------------------------------------------------

        const result =
            await Result.findOne({

                _id:
                    req.params.id,

                $or: [

                    {
                        student:
                            currentUserId
                    },

                    {
                        studentId:
                            currentUserId
                    }

                ]

            })

            .populate(
                "quizId",
                "title subject duration description"
            );


        if (!result) {

            return res.status(404).json({

                success: false,

                message:
                    "Result not found"

            });

        }


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return res.json({

            success: true,

            result:
                result

        });

    }

    catch (error) {

        console.error(
            "Get result details error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch result details"

        });

    }

});


module.exports = router;