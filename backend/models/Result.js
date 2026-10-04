const mongoose = require("mongoose");


// =====================================================
// ANSWER SUB-SCHEMA
// =====================================================

const answerSchema = new mongoose.Schema(
    {
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },

        questionText: {
            type: String,
            default: ""
        },

        selectedAnswer: {
            type: String,
            default: ""
        },

        correctAnswer: {
            type: String,
            default: ""
        },

        isCorrect: {
            type: Boolean,
            default: false
        },

        marks: {
            type: Number,
            default: 1,
            min: 0
        },

        marksObtained: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        _id: false
    }
);


// =====================================================
// RESULT SCHEMA
// =====================================================

const resultSchema = new mongoose.Schema(
    {
        // -------------------------------------------------
        // NEW FIELD
        // Used by the updated application
        // -------------------------------------------------

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },


        // -------------------------------------------------
        // OLD FIELD
        // Kept for compatibility with previous results
        // -------------------------------------------------

        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },


        // -------------------------------------------------
        // QUIZ
        // -------------------------------------------------

        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },


        // -------------------------------------------------
        // SCORE
        // -------------------------------------------------

        score: {
            type: Number,
            required: true,
            min: 0
        },


        // -------------------------------------------------
        // TOTAL MARKS
        // -------------------------------------------------

        totalMarks: {
            type: Number,
            required: true,
            min: 0
        },


        // -------------------------------------------------
        // PERCENTAGE
        // -------------------------------------------------

        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },


        // -------------------------------------------------
        // ANSWERS
        // -------------------------------------------------

        answers: {
            type: [answerSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);


// =====================================================
// VALIDATION
// At least one student field must exist
// =====================================================

resultSchema.pre("validate", function (next) {

    if (!this.student && !this.studentId) {
        return next(
            new Error("Student information is required")
        );
    }

    next();
});


module.exports = mongoose.model(
    "Result",
    resultSchema
);