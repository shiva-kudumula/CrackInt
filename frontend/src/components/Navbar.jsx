import "./Navbar.css"; 
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
     <h2 className="logo">CrackInt</h2>

      <div>
        <Link to="/login" className="login-btn">
          Login
        </Link>
        <Link to="/register" className="register-btn">
            Register
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;