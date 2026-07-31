import "./Register.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import  axios  from "axios";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleRegister(event) {
  event.preventDefault();
  
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  setError("");

  axios
  .post("https://crackint.onrender.com/register", {
    name,
    email,
    password,
  })
  .then((response) => {
    alert(response.data);
  })
  .catch((error) => {
    console.log(error);
    console.log(error.response);
    alert(error.response?.data || "Registration Failed");
  });
}
return (
  <div className="register-container">

    <form className="register-form" onSubmit={handleRegister}>
    <h1>Create Account</h1>

    <label htmlFor="name">Full Name</label>
    <br />
    <input
      id="name"
      type="text"
      autoComplete="name"
      value={name}
      onChange={(event) => setName(event.target.value)}
    />

    <br />
    <br />

    <label htmlFor="email">Email</label>
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

    <label htmlFor="password">Password</label>
    <br />
    <input
      id="password"
      type="password"
      name="password"
      autoComplete="new-password"
      value={password}
      onChange={(event) => setPassword(event.target.value)}
    />

    <br />
    <br />

    <label htmlFor="confirmPassword">Confirm Password</label>
    <br />
    <input
      id="confirmPassword"
      type="password"
      autoComplete="new-password"
      value={confirmPassword}
      onChange={(event) => setConfirmPassword(event.target.value)}
    />
    {error && <p className="error">{error}</p>}

    <br />
    <br />

    <button>Sign Up</button>

    <p className="login-text">
    Already have an account?{" "}
    <Link to="/login">Login</Link>
    </p>

  </form>
  </div>
);
}


export default Register;