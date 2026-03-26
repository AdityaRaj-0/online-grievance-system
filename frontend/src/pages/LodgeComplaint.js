import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  DEPARTMENTS,
  GRIEVANCE_CATEGORIES,
  GRIEVANCE_LEVELS,
  GRIEVANCE_PRIORITIES,
} from "../utils/constants";

function LodgeComplaint() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academic",
    level: "department",
    targetDepartment: "",
    targetCollege: "",
    targetUniversity: "",
    priority: "Medium",
    isAnonymous: false,
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== "") payload.append(key, value);
      });

      await axios.post("/api/grievances", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Complaint lodged successfully.");
      setTimeout(() => navigate("/my-complaints"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to submit complaint.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="container narrow-shell">
          <section className="hero-panel compact-hero">
            <div>
              <span className="section-kicker">Lodge Complaint Portal</span>
              <h1>Submit a new grievance</h1>
              <p>
                File department, college, or university level complaints with optional PDF proof
                and anonymous submission.
              </p>
            </div>
          </section>

          <section className="card">
            {error ? <div className="alert alert-error">{error}</div> : null}
            {success ? <div className="alert alert-success">{success}</div> : null}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Complaint Title</label>
                <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="6" name="description" value={form.description} onChange={handleChange} required />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-control" name="category" value={form.category} onChange={handleChange}>
                    {GRIEVANCE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Level</label>
                  <select className="form-control" name="level" value={form.level} onChange={handleChange}>
                    {GRIEVANCE_LEVELS.map((level) => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-control" name="priority" value={form.priority} onChange={handleChange}>
                    {GRIEVANCE_PRIORITIES.map((priority) => <option key={priority}>{priority}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Target Department</label>
                  <select className="form-control" name="targetDepartment" value={form.targetDepartment} onChange={handleChange}>
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((department) => <option key={department}>{department}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target College</label>
                  <input className="form-control" name="targetCollege" value={form.targetCollege} onChange={handleChange} placeholder="College name" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Target University</label>
                  <input className="form-control" name="targetUniversity" value={form.targetUniversity} onChange={handleChange} placeholder="University name" />
                </div>
                <div className="form-group">
                  <label className="form-label">PDF Attachment</label>
                  <input className="form-control" type="file" name="attachment" accept="application/pdf" onChange={handleChange} />
                </div>
              </div>

              <label className="checkbox-row">
                <input type="checkbox" name="isAnonymous" checked={form.isAnonymous} onChange={handleChange} />
                <span>Submit this complaint anonymously</span>
              </label>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Complaint"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate("/dashboard")}>
                  Cancel
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

export default LodgeComplaint;
