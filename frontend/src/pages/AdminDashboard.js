import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { DEPARTMENTS } from "../utils/constants";
import {
  formatShortDate,
  getPriorityBadgeClass,
  getStatusBadgeClass,
} from "../utils/helpers";

function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0, inProgress: 0, recent: [] });
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, grievancesRes] = await Promise.all([
        axios.get("/api/grievances/admin/stats"),
        axios.get("/api/grievances/admin/all", { params: { limit: 8 } }),
      ]);
      setStats(statsRes.data.stats || {});
      setGrievances(grievancesRes.data.grievances || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const assignDepartment = async (id, department) => {
    await axios.put(`/api/grievances/${id}/status`, {
      targetDepartment: department,
      status: "Under Review",
      response: `Complaint assigned to ${department} department for review.`,
    });
    loadData();
  };

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="container">
          <section className="hero-panel">
            <div>
              <span className="section-kicker">Administrator Console</span>
              <h1>Main admin control panel</h1>
              <p>Monitor institution-wide grievances, route complaints, and manage core platform operations.</p>
            </div>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/admin/announcements">Manage Announcements</Link>
              <Link className="btn btn-secondary" to="/admin/users">Manage Users</Link>
            </div>
          </section>

          <section className="stats-grid">
            <div className="stat-card accent-blue"><span className="stat-label">Total</span><span className="stat-value">{stats.total || 0}</span></div>
            <div className="stat-card accent-amber"><span className="stat-label">Pending</span><span className="stat-value">{stats.pending || 0}</span></div>
            <div className="stat-card accent-sky"><span className="stat-label">In Progress</span><span className="stat-value">{stats.inProgress || 0}</span></div>
            <div className="stat-card accent-green"><span className="stat-label">Resolved</span><span className="stat-value">{stats.resolved || 0}</span></div>
          </section>

          <div className="dashboard-grid">
            <section className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Recent submissions</div>
                  <p className="section-copy">Latest grievances submitted across the system.</p>
                </div>
              </div>

              {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                <div className="stack-list">
                  {(stats.recent || []).map((item) => (
                    <div className="complaint-item" key={item._id}>
                      <div className="complaint-row">
                        <strong>{item.title}</strong>
                        <span className={getStatusBadgeClass(item.status)}>{item.status}</span>
                      </div>
                      <div className="complaint-row muted">
                        <span>{item.ticketId}</span>
                        <span>{formatShortDate(item.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Complaint routing desk</div>
                  <p className="section-copy">Assign unresolved complaints to the right department.</p>
                </div>
              </div>

              {loading ? <div className="loading-center"><div className="spinner" /></div> : (
                <div className="stack-list">
                  {grievances.map((grievance) => (
                    <div key={grievance._id} className="complaint-item">
                      <div className="complaint-row">
                        <strong>{grievance.title}</strong>
                        <div className="cluster">
                          <span className={getStatusBadgeClass(grievance.status)}>{grievance.status}</span>
                          <span className={getPriorityBadgeClass(grievance.priority)}>{grievance.priority}</span>
                        </div>
                      </div>
                      <div className="complaint-row muted">
                        <span>{grievance.ticketId}</span>
                        <span>{grievance.studentName}</span>
                      </div>
                      <p>{grievance.description}</p>
                      <select
                        className="form-control"
                        defaultValue=""
                        onChange={(e) => e.target.value && assignDepartment(grievance._id, e.target.value)}
                      >
                        <option value="">Assign department</option>
                        {DEPARTMENTS.map((department) => (
                          <option key={department} value={department}>{department}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
