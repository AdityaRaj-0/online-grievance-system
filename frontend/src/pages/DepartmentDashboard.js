import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import {
  formatDate,
  getPriorityBadgeClass,
  getStatusBadgeClass,
} from "../utils/helpers";

function DepartmentDashboard() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draftResponses, setDraftResponses] = useState({});

  const loadComplaints = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("/api/grievances/admin/all", { params: { limit: 20 } });
      setGrievances(res.data.grievances || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load complaints. Check that the backend is running and the account has access.");
      setGrievances([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      setError("");
      await axios.put(`/api/grievances/${id}/status`, {
        status,
        response: `Complaint moved to ${status} by the grievance desk.`,
      });
      loadComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update complaint status.");
    }
  };

  const submitResponse = async (id) => {
    if (!draftResponses[id]?.trim()) return;
    try {
      setError("");
      await axios.put(`/api/grievances/${id}/status`, { response: draftResponses[id] });
      setDraftResponses((prev) => ({ ...prev, [id]: "" }));
      loadComplaints();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send response.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="container">
          <section className="hero-panel">
            <div>
              <span className="section-kicker">Grievance Manager</span>
              <h1>Department and escalation desk</h1>
              <p>Review assigned cases, post responses, and move complaints toward resolution.</p>
            </div>
          </section>

          <section className="card">
            {error ? <div className="alert alert-error">{error}</div> : null}
            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : grievances.length ? (
              <div className="stack-list">
                {grievances.map((grievance) => (
                  <article key={grievance._id} className="complaint-item detailed">
                    <div className="complaint-row">
                      <div>
                        <h3>{grievance.title}</h3>
                        <p className="ticket-copy">{grievance.ticketId}</p>
                      </div>
                      <div className="cluster">
                        <span className={getStatusBadgeClass(grievance.status)}>{grievance.status}</span>
                        <span className={getPriorityBadgeClass(grievance.priority)}>{grievance.priority}</span>
                      </div>
                    </div>

                    <div className="meta-grid">
                      <div><span>Student</span><strong>{grievance.studentName}</strong></div>
                      <div><span>Department</span><strong>{grievance.targetDepartment || "-"}</strong></div>
                      <div><span>Level</span><strong>{grievance.level}</strong></div>
                      <div><span>Date</span><strong>{formatDate(grievance.createdAt)}</strong></div>
                    </div>

                    <p>{grievance.description}</p>

                    <div className="action-row">
                      <button className="btn btn-secondary" onClick={() => updateStatus(grievance._id, "In Progress")}>Mark In Progress</button>
                      <button className="btn btn-success" onClick={() => updateStatus(grievance._id, "Resolved")}>Mark Resolved</button>
                      <button className="btn btn-outline" onClick={() => updateStatus(grievance._id, "Rejected")}>Reject</button>
                    </div>

                    <div className="response-editor">
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Write response to student"
                        value={draftResponses[grievance._id] || ""}
                        onChange={(e) => setDraftResponses((prev) => ({ ...prev, [grievance._id]: e.target.value }))}
                      />
                      <button className="btn btn-primary" onClick={() => submitResponse(grievance._id)}>Send Response</button>
                    </div>

                    {grievance.responses?.length ? (
                      <div className="response-list">
                        {grievance.responses.map((response) => (
                          <div key={response._id} className="response-card">
                            <div className="complaint-row muted">
                              <strong>{response.respondedByName}</strong>
                              <span>{formatDate(response.createdAt)}</span>
                            </div>
                            <p>{response.message}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No complaints available</h3>
                <p>Assigned grievances will appear here once routed from the main admin desk.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default DepartmentDashboard;
