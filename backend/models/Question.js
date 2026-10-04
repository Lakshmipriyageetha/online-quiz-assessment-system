const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz",
            required: true
        },

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
                    return value.length === 4;
                },
                message: "A question must have exactly 4 options"
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
            min: 1
        },

        explanation: {
            type: String,
            trim: true
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Medium"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Question", questionSchema);