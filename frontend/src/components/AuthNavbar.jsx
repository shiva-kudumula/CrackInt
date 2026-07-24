import "./AuthNavbar.css";
import { Link } from "react-router-dom";

function AuthNavbar() {
    return (
        <nav className="auth-navbar">

    <div className="logo">
        CrackInt
    </div>

    <div className="nav-links">

        <Link to="/dashboard">Dashboard</Link>

        <Link to="/interview-setup">New Interview</Link>

        <Link to="/resume">Resume</Link>

        <Link to="/history">History</Link>

    </div>

    <div className="profile">

        SK

    </div>

    </nav>
    );
}

export default AuthNavbar;