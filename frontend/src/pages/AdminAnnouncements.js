import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { AUDIENCE_OPTIONS } from "../utils/constants";
import { formatDate } from "../utils/helpers";

function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState({
    title: "",
    content: "",
    targetAudience: "all",
    expiresAt: "",
  });

  const loadAnnouncements = async () => {
    const res = await axios.get("/api/announcements");
    setAnnouncements(res.data.announcements || []);
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/announcements", {
      ...form,
      expiresAt: form.expiresAt || null,
    });
    setForm({ title: "", content: "", targetAudience: "all", expiresAt: "" });
    loadAnnouncements();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/announcements/${id}`);
    loadAnnouncements();
  };

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="container">
          <section className="hero-panel compact-hero">
            <div>
              <span className="section-kicker">Broadcast Center</span>
              <h1>Announcements</h1>
              <p>Create institutional notices for students, admins, or the full platform audience.</p>
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="card">
              <div className="card-header"><div className="card-title">Create announcement</div></div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input className="form-control" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Content</label>
                  <textarea className="form-control" rows="5" value={form.content} onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Target Audience</label>
                    <select className="form-control" value={form.targetAudience} onChange={(e) => setForm((prev) => ({ ...prev, targetAudience: e.target.value }))}>
                      {AUDIENCE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expires At</label>
                    <input className="form-control" type="date" value={form.expiresAt} onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))} />
                  </div>
                </div>
                <button className="btn btn-primary" type="submit">Publish Announcement</button>
              </form>
            </section>

            <section className="card">
              <div className="card-header"><div className="card-title">Published announcements</div></div>
              <div className="stack-list">
                {announcements.map((announcement) => (
                  <div key={announcement._id} className="complaint-item">
                    <div className="complaint-row">
                      <strong>{announcement.title}</strong>
                      <span className="badge badge-under-review">{announcement.targetAudience}</span>
                    </div>
                    <p>{announcement.content}</p>
                    <div className="complaint-row muted">
                      <span>{formatDate(announcement.createdAt)}</span>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(announcement._id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminAnnouncements;
