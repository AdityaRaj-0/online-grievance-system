import { useState } from "react";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    title: "",
    description: "",
    category: "",
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log("LOGIN RESPONSE:", data);

    setMessage(data.message);

    if (data.token) {
      setToken(data.token);
      setRole(data.role);
    }
  };

  const submitComplaint = async () => {
    const res = await fetch("http://localhost:5000/api/complaints", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        category: formData.category,
      }),
    });

    const data = await res.json();
    alert(data.message);
  };

  const fetchComplaints = async () => {
    const res = await fetch("http://localhost:5000/api/complaints/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setComplaints(data);
  };

  const fetchAllComplaints = async () => {
    const res = await fetch("http://localhost:5000/api/complaints", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setAllComplaints(data);
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
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)}>
        Switch to {isLogin ? "Register" : "Login"}
      </button>

      <div>{message}</div>

      {/* USER DASHBOARD */}
      {token && role === "user" && (
        <div style={{ marginTop: "20px" }}>
          <h3>User Dashboard</h3>

          <input
            type="text"
            placeholder="Title"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Description"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Category"
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          />

          <button onClick={submitComplaint}>
            Submit Complaint
          </button>

          <button onClick={fetchComplaints} style={{ marginTop: "10px" }}>
            Show My Complaints
          </button>

          {complaints.map((c) => (
            <div key={c._id} className="card">
              <h4>{c.title}</h4>
              <p>{c.description}</p>
              <p
                className={
                  c.status === "Pending"
                    ? "status-pending"
                    : c.status === "In Progress"
                    ? "status-progress"
                    : "status-resolved"
                }
              >
                Status: {c.status}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {token && role === "admin" && (
        <div style={{ marginTop: "20px" }}>
          <h3>Admin Dashboard</h3>

          <button onClick={fetchAllComplaints}>
            Show All Complaints
          </button>

          {allComplaints.map((c) => (
            <div key={c._id} className="card">
              <h4>{c.title}</h4>
              <p>{c.description}</p>
              <p
                className={
                  c.status === "Pending"
                    ? "status-pending"
                    : c.status === "In Progress"
                    ? "status-progress"
                    : "status-resolved"
                }
              >
                Status: {c.status}
              </p>

              <button
                onClick={async () => {
                  await fetch(
                    `http://localhost:5000/api/complaints/${c._id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ status: "In Progress" }),
                    }
                  );
                  fetchAllComplaints();
                }}
              >
                Mark In Progress
              </button>

              <button
                onClick={async () => {
                  await fetch(
                    `http://localhost:5000/api/complaints/${c._id}`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                      },
                      body: JSON.stringify({ status: "Resolved" }),
                    }
                  );
                  fetchAllComplaints();
                }}
              >
                Mark Resolved
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;