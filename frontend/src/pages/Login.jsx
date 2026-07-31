import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event) {
    event.preventDefault();

  axios
  .post("https://crackint.onrender.com/login", {
    email,
    password,
  })
    .then((response) => {
    localStorage.setItem("token", response.data.token);

    const token = localStorage.getItem("token");
    

    axios
      .get("https://crackint.onrender.com/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error.response?.data || error.message);
      });
  })
  .catch((error) => {
    console.log(error.response?.data || error.message);
  });
}
  return (
    <div className="login-container">
        <form className="login-form" onSubmit={(handleLogin)}>
      <h1>Welcome Back</h1>

      
        <label htmlFor="email">Email:</label>
      
        <br />
        <input 
          id="email"
          type="email" 
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <br />
        <br />

        <label htmlFor="password">Password:</label>
        <br />
        <input 
          id="password"
          type="password" 
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <br />
        <br />

        <button>Login</button>

        <p className="signup-text">
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
        </p>
      </form>
      </div>
    
  );
}

export default Login;