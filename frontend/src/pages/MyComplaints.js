import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { GRIEVANCE_CATEGORIES, GRIEVANCE_STATUSES } from "../utils/constants";
import {
  formatDate,
  getPriorityBadgeClass,
  getStatusBadgeClass,
} from "../utils/helpers";

function MyComplaints() {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", category: "" });

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.status) params.status = filters.status;
        if (filters.category) params.category = filters.category;
        const res = await axios.get("/api/grievances/my", { params });
        setGrievances(res.data.grievances || []);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [filters]);

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="container">
          <section className="hero-panel compact-hero">
            <div>
              <span className="section-kicker">Complaint History</span>
              <h1>My complaints</h1>
              <p>Review each complaint ticket, attached updates, and department responses.</p>
            </div>
          </section>

          <section className="card">
            <div className="toolbar">
              <div className="toolbar-field">
                <label className="form-label">Filter by Status</label>
                <select className="form-control" value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="">All statuses</option>
                  {GRIEVANCE_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
              <div className="toolbar-field">
                <label className="form-label">Filter by Category</label>
                <select className="form-control" value={filters.category} onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}>
                  <option value="">All categories</option>
                  {GRIEVANCE_CATEGORIES.map((category) => <option key={category}>{category}</option>)}
                </select>
              </div>
            </div>

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
                      <div><span>Category</span><strong>{grievance.category}</strong></div>
                      <div><span>Level</span><strong>{grievance.level}</strong></div>
                      <div><span>Department</span><strong>{grievance.targetDepartment || "-"}</strong></div>
                      <div><span>Created</span><strong>{formatDate(grievance.createdAt)}</strong></div>
                    </div>

                    <p>{grievance.description}</p>

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
                    ) : (
                      <div className="timeline-note">No response added yet by the grievance desk.</div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No complaints found</h3>
                <p>Try changing the filters or submit a new grievance.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default MyComplaints;
