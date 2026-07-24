const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateQuestions(role, difficulty, numberOfQuestions) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
Generate ${numberOfQuestions} ${difficulty}-level ${role} interview questions.

Return ONLY a valid JSON array in this format:

[
  {
    "question": "Question here",
    "expectedAnswer": "Expected answer here"
  }
]

Do not include markdown.
Do not use \`\`\`.
Do not add explanations.
Return only JSON.
`,
    });
    return JSON.parse(response.text);
}

 async function evaluateAnswer(
    question,
    expectedAnswer,
    userAnswer
) {
    const prompt = `
Question:
${question}

Expected Answer:
${expectedAnswer}

User Answer:
${userAnswer}

Evaluate the user's answer.

Return ONLY valid JSON.

{
  "score": <integer between 0 and 10>,
  "feedback": "Short constructive feedback"
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    const result = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
    const evaluation = JSON.parse(result);

    return evaluation;
}

module.exports = {
    generateQuestions,
    evaluateAnswer
};