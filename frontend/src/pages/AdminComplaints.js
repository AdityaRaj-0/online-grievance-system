import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { GRIEVANCE_STATUSES } from "../utils/constants";
import {
  formatDate,
  getPriorityBadgeClass,
  getStatusBadgeClass,
} from "../utils/helpers";

function AdminComplaints() {
  const [grievances, setGrievances] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadComplaints = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.search) params.search = filters.search;
        if (filters.status) params.status = filters.status;
        const res = await axios.get("/api/grievances/admin/all", { params });
        setGrievances(res.data.grievances || []);
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, [filters]);

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="container">
          <section className="hero-panel compact-hero">
            <div>
              <span className="section-kicker">Complaint Management System</span>
              <h1>All grievances</h1>
              <p>Search and review submitted complaints across the available jurisdiction.</p>
            </div>
          </section>

          <section className="card">
            <div className="toolbar">
              <div className="toolbar-field grow">
                <label className="form-label">Search</label>
                <input className="form-control" placeholder="Search by ticket, title, or student" value={filters.search} onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} />
              </div>
              <div className="toolbar-field">
                <label className="form-label">Status</label>
                <select className="form-control" value={filters.status} onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}>
                  <option value="">All statuses</option>
                  {GRIEVANCE_STATUSES.map((status) => <option key={status}>{status}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="loading-center"><div className="spinner" /></div>
            ) : grievances.length ? (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Student</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grievances.map((item) => (
                      <tr key={item._id}>
                        <td>{item.ticketId}</td>
                        <td>{item.studentName}</td>
                        <td>{item.title}</td>
                        <td>{item.category}</td>
                        <td><span className={getStatusBadgeClass(item.status)}>{item.status}</span></td>
                        <td><span className={getPriorityBadgeClass(item.priority)}>{item.priority}</span></td>
                        <td>{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <h3>No complaints found</h3>
                <p>Try adjusting the current search and status filters.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default AdminComplaints;
