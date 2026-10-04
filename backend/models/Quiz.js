const mongoose = require("mongoose");

// ===============================
// QUESTION SCHEMA
// ===============================
const questionSchema = new mongoose.Schema(
    {
        questionText: {
            type: String,
            required: true,
            trim: true
        },

        options: {
            type: [String],
            required: true,
            validate: {
                validator: function (value) {
                    return value.length >= 2;
                },
                message: "At least 2 options are required"
            }
        },

        correctAnswer: {
            type: String,
            required: true,
            trim: true
        },

        marks: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        }
    },
    {
        _id: true
    }
);

// ===============================
// QUIZ SCHEMA
// ===============================
const quizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        duration: {
            type: Number,
            required: true,
            min: 1
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        questions: {
            type: [questionSchema],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Quiz", quizSchema);