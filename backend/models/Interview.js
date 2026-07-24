const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  role: {
    type: String,
    required: true,
  },

  difficulty: {
    type: String,
    required: true,
  },

  numberOfQuestions: {
    type: Number,
    required: true,
  },
 questions: [
    {
        question: {
            type: String,
        },

        expectedAnswer: {
            type: String,
        },

        userAnswer: {
            type: String,
            default: "",
        },

        score: {
            type: Number,
            default: null,
        },

        feedback: {
            type: String,
            default: "",
        },
    },
],
});

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;