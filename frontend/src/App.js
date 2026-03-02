import { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    setMessage(data.message);

    if (data.token) {
      setToken(data.token);
    }
  };

  return (
  <div className="container">
    <h2>{isLogin ? "Login" : "Register"}</h2>

    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />
      )}

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <button type="submit">
        {isLogin ? "Login" : "Register"}
      </button>
    </form>

    <button
      className="switch-btn"
      onClick={() => setIsLogin(!isLogin)}
    >
      Switch to {isLogin ? "Register" : "Login"}
    </button>

    <div className="message">{message}</div>

    {token && (
      <div className="token-box">
        <strong>JWT Token:</strong>
        <br />
        {token}
      </div>
    )}
  </div>
);}

export default App;