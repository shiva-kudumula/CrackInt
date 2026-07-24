import "./Dashboard.css";
import { Link } from "react-router-dom";
import AuthNavbar from "../components/AuthNavbar";

import { useState } from "react";
function Dashboard() {
  const [userName] = useState("Shiva");
  const [totalInterviews] = useState(0);
  const [completedInterviews] = useState(0);
  const [averageScore] = useState(0);

  return (
  <div >
    <AuthNavbar/>
    <div>
    <div className="dashboard-header">

    <h1>Welcome back, {userName} 👋</h1>

    <p>
        Ready to practice your next interview?
    </p>

</div>

    <div className="stats">

  <div className="card">
    <h3>Total Interviews</h3>
    <p>{totalInterviews}</p>
  </div>

  <div className="card">
    <h3>Completed Interviews</h3>
    <p>{completedInterviews}</p>
  </div>

  <div className="card">
    <h3>Average Score</h3>
    <p>{averageScore}%</p>
  </div>

</div>

    <Link to="/interview-setup" className="start-btn">
    Start Interview
    </Link>

    <hr />

    <div className="recent-interviews">

    <h3>Recent Interviews</h3>

    <div className="recent-card">
        <p>No interviews yet.</p>
    </div>

    </div>
  </div>
  </div>
);
}

export default Dashboard;