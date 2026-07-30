require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const Interview = require("./models/Interview");
const User = require("./models/User");
const authenticateToken = require("./middleware/authenticateToken");
const {generateQuestions,evaluateAnswer} = require("./gemini");
const authRoutes = require("./routes/authRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const speechRoutes = require("./routes/speechRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", interviewRoutes);
app.use("/", authRoutes);
app.use("/", speechRoutes);
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch((error) => {
        console.log(error);
    });


app.get("/", (request, response) => {
    response.send("Hello from CrackInt Backend!");
});

app.get("/about", (request, response) => {
    response.send("Welcome to CrackInt Backend!");
});





app.get("/dashboard", authenticateToken, (request, response) => {

    console.log(request.user);

    response.send("Welcome to Dashboard");

});






app.get("/test-ai", async (request, response) => {

    const { role, difficulty, numberOfQuestions } = request.body;
    const result = await generateQuestions(role, difficulty, numberOfQuestions);

    response.send(result);

});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
