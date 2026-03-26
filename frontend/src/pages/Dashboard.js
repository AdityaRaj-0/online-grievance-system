import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { getPriorityBadgeClass, getStatusBadgeClass, formatShortDate } from "../utils/helpers";

function Dashboard() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [grievanceRes, announcementRes] = await Promise.all([
          axios.get("/api/grievances/my", { params: { limit: 5 } }),
          axios.get("/api/announcements"),
        ]);
        setGrievances(grievanceRes.data.grievances || []);
        setAnnouncements(announcementRes.data.announcements || []);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = {
    total: grievances.length,
    pending: grievances.filter((item) => item.status === "Pending").length,
    progress: grievances.filter((item) => ["Under Review", "In Progress"].includes(item.status)).length,
    resolved: grievances.filter((item) => item.status === "Resolved").length,
  };

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="container">
          <section className="hero-panel">
            <div>
              <span className="section-kicker">Student Interface</span>
              <h1>Welcome, {user?.name}</h1>
              <p>
                Review announcements, monitor complaint progress, and submit new grievances with
                complete transparency.
              </p>
            </div>
            <div className="hero-actions">
              <Link className="btn btn-primary" to="/lodge-complaint">Lodge Complaint</Link>
              <Link className="btn btn-secondary" to="/my-complaints">Open Complaint History</Link>
            </div>
          </section>

          <section className="stats-grid">
            <div className="stat-card accent-blue">
              <span className="stat-label">Total Complaints</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-card accent-amber">
              <span className="stat-label">Pending</span>
              <span className="stat-value">{stats.pending}</span>
            </div>
            <div className="stat-card accent-sky">
              <span className="stat-label">Under Process</span>
              <span className="stat-value">{stats.progress}</span>
            </div>
            <div className="stat-card accent-green">
              <span className="stat-label">Resolved</span>
              <span className="stat-value">{stats.resolved}</span>
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">General Announcements</div>
                  <p className="section-copy">Latest updates from the institution and grievance team.</p>
                </div>
              </div>

              {loading ? (
                <div className="loading-center"><div className="spinner" /></div>
              ) : announcements.length ? (
                <div className="stack-list">
                  {announcements.map((announcement) => (
                    <div key={announcement._id} className="info-strip">
                      <div>
                        <strong>{announcement.title}</strong>
                        <p>{announcement.content}</p>
                      </div>
                      <span className="info-meta">{formatShortDate(announcement.createdAt)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state compact-empty">
                  <h3>No announcements yet</h3>
                  <p>Important student notices will appear here.</p>
                </div>
              )}
            </section>

            <section className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Recent Complaint Responses</div>
                  <p className="section-copy">Track the latest action on your submitted grievances.</p>
                </div>
              </div>

              {loading ? (
                <div className="loading-center"><div className="spinner" /></div>
              ) : grievances.length ? (
                <div className="stack-list">
                  {grievances.map((grievance) => (
                    <div key={grievance._id} className="complaint-item">
                      <div className="complaint-row">
                        <strong>{grievance.title}</strong>
                        <span className={getStatusBadgeClass(grievance.status)}>{grievance.status}</span>
                      </div>
                      <div className="complaint-row muted">
                        <span>{grievance.ticketId}</span>
                        <span className={getPriorityBadgeClass(grievance.priority)}>{grievance.priority}</span>
                      </div>
                      <p>{grievance.description}</p>
                      <div className="timeline-note">
                        {grievance.responses?.length
                          ? grievance.responses[grievance.responses.length - 1].message
                          : "Awaiting first admin response."}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state compact-empty">
                  <h3>No complaints submitted yet</h3>
                  <p>Use the lodge complaint portal to submit your first grievance.</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
