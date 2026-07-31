import { useEffect, useState } from "react";
import axios from "axios";
import AuthNavbar from "../components/AuthNavbar";
import { useNavigate } from "react-router-dom";

function History() {
    const [interviews, setInterviews] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {

    async function getInterviews() {

        const token = localStorage.getItem("token");

        const response = await axios.get("https://crackint.onrender.com/interviews", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setInterviews(response.data.interviews);
        console.log(token);
        console.log(localStorage.getItem("token"));

        console.log(response.data);
    }

    getInterviews();

}, []);
    return (
        <>
            <AuthNavbar />
            <h1>Interview History</h1>
            {
                interviews.map((interview) => (

                    <div key={interview._id} >
                        <h3>{interview.role}</h3>
                        <p>Difficulty: {interview.difficulty}</p>
                        <p>Questions: {interview.numberOfQuestions}</p>
                        <button onClick={() => navigate("/interview-result", { state: { interview } })}>
                            View Result
                        </button>
                    </div>

                ))
            }
        </>
    );
}

export default History;