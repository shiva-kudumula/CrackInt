const Interview = require("../models/Interview");
const {
    generateQuestions,
    evaluateAnswer,
} = require("../gemini");

const createInterview = async (request, response) => {
    try {

        const { role, difficulty, numberOfQuestions } = request.body;

        const userId = request.user.userId;

        const questions = await generateQuestions(
            role,
            difficulty,
            numberOfQuestions
        );

        const interview = new Interview({
            userId,
            role,
            difficulty,
            numberOfQuestions,
            questions
        });

        await interview.save();

        

        response.status(201).json({
            message: "Interview Created Successfully!",
            interview,
            questions:interview.questions,
        });

    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }

};

const submitInterview = async (request, response) => {
    try {

        const { interviewId, questions } = request.body;

        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return response.status(404).json({
                message: "Interview Not Found",
            });
        }

        interview.questions = questions;

        await interview.save();
        
       for (const question of interview.questions) {

        const evaluation = await evaluateAnswer(
            question.question,
            question.expectedAnswer,
            question.userAnswer
        );

        console.log(evaluation);

        question.score = evaluation.score;
        question.feedback = evaluation.feedback;
       }
        await interview.save();


        response.status(200).json({
            message: "Interview Submitted Successfully!",
            interview,
        });

    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }

};

const getInterviews = async (request, response) => {
    try {
        const userId = request.user.userId;
        const interviews = await Interview.find({ userId });
        response.status(200).json({
            message: "Interviews retrieved successfully!",
            interviews,
        });
    } catch (error) {
        console.log(error);
        response.status(500).send("Internal Server Error");
    }
};

module.exports = {
    createInterview,
    submitInterview,
    getInterviews,
};