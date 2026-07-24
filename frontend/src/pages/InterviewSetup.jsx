import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";
import "./InterviewSetup.css";
import axios from "axios";

function InterviewSetup() {

    const [role, setRole] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [numberOfQuestions, setNumberOfQuestions] = useState("");

    const navigate = useNavigate();

  async function handleStartInterview() {

    try {

        if (role === "") {
            alert("Please select a role");
            return;
        }

        if (difficulty === "") {
            alert("Please select a difficulty");
            return;
        }

        if (numberOfQuestions === "") {
            alert("Please select the number of questions");
            return;
        }

        const response = await axios.post(
            "http://localhost:5000/interview",
            {
                role,
                difficulty,
                numberOfQuestions,
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        navigate("/interview", {
            state: {
                role,
                difficulty,
                numberOfQuestions,
                questions: response.data.questions,
                interviewId: response.data.interview._id,
            },
        });

    } catch (error) {
        console.log(error);
    }
}
  return (
    <div>
    <AuthNavbar/>
    <form>
      <h1>Set Up Your Interview</h1>

        <p className="subtitle">
            Choose your interview preferences before you begin.
        </p>
  <div className="setup-section">
      <h2>1. Role</h2>
<p>What role are you preparing for?</p>

<div className="role-options">

  <label className="option-card">
    <input
      type="radio"
      name="role"
      value="Java Developer"
      checked={role === "Java Developer"}
      onChange={(event) => setRole(event.target.value)}
    />
    Java Developer
  </label>

  <label className="option-card">
    <input
      type="radio"
      name="role"
      value="Frontend Developer"
      checked={role === "Frontend Developer"}
      onChange={(event) => setRole(event.target.value)}
    />
    Frontend Developer
  </label>

  <label className="option-card">
    <input
      type="radio"
      name="role"
      value="Full-Stack Developer"
      checked={role === "Full-Stack Developer"}
      onChange={(event) => setRole(event.target.value)}
    />
    Full-Stack Developer
  </label>

  <label className="option-card">
    <input
      type="radio"
      name="role"
      value="Python Developer"
      checked={role === "Python Developer"}
      onChange={(event) => setRole(event.target.value)}
    />
    Python Developer
  </label>

  <label className="option-card">
    <input
      type="radio"
      name="role"
      value="SQL Developer"
      checked={role === "SQL Developer"}
      onChange={(event) => setRole(event.target.value)}
    />
    SQL Developer
  </label>

</div>
</div>


<div className="setup-section">

        <h2>2. Difficulty</h2>
<p>Select your interview difficulty.</p>

<div className="role-options">

  <label className="option-card">
    <input
      type="radio"
      name="difficulty"
      value="Easy"
      checked={difficulty === "Easy"}
      onChange={(event) => setDifficulty(event.target.value)}
    />
    Easy
  </label>

  <label className="option-card">
    <input
      type="radio"
      name="difficulty"
      value="Medium"
      checked={difficulty === "Medium"}
      onChange={(event) => setDifficulty(event.target.value)}
    />
    Medium
  </label>

  <label className="option-card">
    <input
      type="radio"
      name="difficulty"
      value="Hard"
      checked={difficulty === "Hard"}
      onChange={(event) => setDifficulty(event.target.value)}
    />
    Hard
  </label>
</div>
</div>

<div className="setup-section">

        <h2>3. Number of Questions</h2>
<p>Choose how many questions you want.</p>

<div className="role-options">

  <label className="option-card">
    <input
      type="radio"
      name="numberOfQuestions"
      value="5"
      checked={numberOfQuestions === "5"}
      onChange={(event) => setNumberOfQuestions(event.target.value)}
    />
    5 Questions
  </label>

  <label className="option-card">
    <input
      type="radio"
      name="numberOfQuestions"
      value="10"
      checked={numberOfQuestions === "10"}
      onChange={(event) => setNumberOfQuestions(event.target.value)}
    />
    10 Questions
  </label>

  <label className="option-card">
    <input
      type="radio"
      name="numberOfQuestions"
      value="15"
      checked={numberOfQuestions === "15"}
      onChange={(event) => setNumberOfQuestions(event.target.value)}
    />
    15 Questions
  </label>
</div>
</div>
        <button
            className="start-interview-btn"
            type="button"
            onClick={handleStartInterview}
        >
            Start Interview
        </button>
    </form>
    </div>
  );
}

export default InterviewSetup;