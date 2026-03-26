import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ROLE_LABELS } from "../utils/constants";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "department_admin",
    adminDepartment: "",
    adminCollege: "",
    adminUniversity: "",
  });

  const loadUsers = async () => {
    const res = await axios.get("/api/admin/users", { params: { search } });
    setUsers(res.data.users || []);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("/api/admin/users", { params: { search } });
      setUsers(res.data.users || []);
    };

    fetchUsers();
  }, [search]);

  const createAdmin = async (e) => {
    e.preventDefault();
    await axios.post("/api/admin/create", form);
    setForm({
      name: "",
      email: "",
      password: "",
      role: "department_admin",
      adminDepartment: "",
      adminCollege: "",
      adminUniversity: "",
    });
    loadUsers();
  };

  const toggleStatus = async (id) => {
    await axios.put(`/api/admin/users/${id}/toggle`);
    loadUsers();
  };

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="container">
          <section className="hero-panel compact-hero">
            <div>
              <span className="section-kicker">User Administration</span>
              <h1>Users and admin creation</h1>
              <p>Create role-based admin accounts and activate or deactivate platform users.</p>
            </div>
          </section>

          <div className="dashboard-grid">
            <section className="card">
              <div className="card-header"><div className="card-title">Create admin account</div></div>
              <form onSubmit={createAdmin}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-control" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input className="form-control" type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <select className="form-control" value={form.role} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}>
                      <option value="department_admin">Department Admin</option>
                      <option value="college_admin">College Admin</option>
                      <option value="university_admin">University Admin</option>
                      <option value="main_admin">Main Admin</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Admin Department</label>
                    <input className="form-control" value={form.adminDepartment} onChange={(e) => setForm((prev) => ({ ...prev, adminDepartment: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Admin College</label>
                    <input className="form-control" value={form.adminCollege} onChange={(e) => setForm((prev) => ({ ...prev, adminCollege: e.target.value }))} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Admin University</label>
                  <input className="form-control" value={form.adminUniversity} onChange={(e) => setForm((prev) => ({ ...prev, adminUniversity: e.target.value }))} />
                </div>
                <button className="btn btn-primary" type="submit">Create Admin</button>
              </form>
            </section>

            <section className="card">
              <div className="card-header">
                <div className="card-title">Platform users</div>
              </div>

              <div className="form-group">
                <label className="form-label">Search users</label>
                <input className="form-control" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email" />
              </div>

              <div className="stack-list">
                {users.map((user) => (
                  <div key={user._id} className="complaint-item">
                    <div className="complaint-row">
                      <strong>{user.name}</strong>
                      <span className={`badge ${user.isActive ? "badge-resolved" : "badge-rejected"}`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="complaint-row muted">
                      <span>{user.email}</span>
                      <span>{ROLE_LABELS[user.role] || user.role}</span>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => toggleStatus(user._id)}>
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>
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

export default AdminUsers;
