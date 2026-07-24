import { useLocation } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

function InterviewResult() {

    const location = useLocation();

    const interview = location.state.interview;
   
    const totalScore = interview.questions.reduce((sum, question) => {
        return sum + question.score;
    }, 0);

    const maxScore = interview.questions.length * 10;

        return (
            <div>
                <AuthNavbar/>
                <h1>Interview Result</h1>

                <p><strong>Role:</strong> {interview.role}</p>

                <p><strong>Difficulty:</strong> {interview.difficulty}</p>

                <p><strong>Total Questions:</strong> {interview.questions.length}</p>

                <h1><strong>Overall Score:</strong> {totalScore} / {maxScore}</h1>
                
                {interview.questions.map((question, index) => (
                    <div key={question._id}>
                        <h2>Question {index + 1}</h2>

                        <p>
                            <strong>Question:</strong> {question.question}
                        </p>

                        <p>
                            <strong>Your Answer:</strong> {question.userAnswer}
                        </p>

                        <p>
                            <strong>Score:</strong> {question.score}/10
                        </p>

                        <p>
                            <strong>Feedback:</strong> {question.feedback}
                        </p>

                        <hr />
                    </div>
                ))}
            </div>
        );
}
export default InterviewResult;