import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { dashboardPathForRole } from "../utils/helpers";

function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    studentId: "",
    college: "",
    university: "",
    department: "",
    year: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = isRegistering
        ? await register(form)
        : await login(form.email, form.password);

      navigate(dashboardPathForRole(user?.role));
    } catch (err) {
      setError(err.response?.data?.message || "Unable to continue. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="auth-badge">Student Grievance Management System</div>
        <h1>A secure grievance platform built for students, departments, and institutional teams.</h1>
        <p>
          Centralize complaint submission, case review, and resolution workflows in a single
          professional workspace.
        </p>
        <div className="auth-stats">
          <div className="auth-stat">
            <strong>Student Workspace</strong>
            <span>Submit grievances, monitor updates, and manage your requests with clarity.</span>
          </div>
          <div className="auth-stat">
            <strong>Resolution Console</strong>
            <span>Coordinate review, assignments, announcements, and response handling efficiently.</span>
          </div>
        </div>
      </div>

      <div className="auth-card">
        <div className="section-heading">
          <span className="section-kicker">{isRegistering ? "Student Onboarding" : "Secure Login"}</span>
          <h2>{isRegistering ? "Create student account" : "Welcome back"}</h2>
          <p>{isRegistering ? "Register to lodge and track grievances." : "Sign in to access your grievance workspace."}</p>
        </div>

        {error ? <div className="alert alert-error">{error}</div> : null}

        <form onSubmit={handleSubmit}>
          {isRegistering ? (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Student ID</label>
                  <input className="form-control" name="studentId" value={form.studentId} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">College</label>
                  <input className="form-control" name="college" value={form.college} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">University</label>
                  <input className="form-control" name="university" value={form.university} onChange={handleChange} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input className="form-control" name="department" value={form.department} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input className="form-control" name="year" value={form.year} onChange={handleChange} required />
                </div>
              </div>
            </>
          ) : (
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-control" type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-control" type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>

          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isRegistering ? "Create Account" : "Login"}
          </button>
        </form>

        <button className="btn btn-secondary btn-full auth-switch" onClick={() => setIsRegistering((prev) => !prev)} type="button">
          {isRegistering ? "Already have an account? Login" : "New student? Register here"}
        </button>
      </div>
    </div>
  );
}

export default Login;
