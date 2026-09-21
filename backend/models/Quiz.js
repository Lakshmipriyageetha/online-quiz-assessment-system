const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    duration: {
      type: Number,
      required: true
    },

    questions: [
      {
        question: {
          type: String,
          required: true
        },

        options: {
          type: [String],
          required: true
        },

        answer: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Quiz", quizSchema);