import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../utils/constants";

function Profile() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    college: user?.college || "",
    university: user?.university || "",
    department: user?.department || "",
    year: user?.year || "",
  });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.put("/api/auth/profile", profile);
      updateUser(res.data.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update profile.");
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.put("/api/auth/change-password", passwords);
      setPasswords({ currentPassword: "", newPassword: "" });
      setMessage("Password changed successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to change password.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-shell">
        <div className="container">
          <section className="hero-panel compact-hero">
            <div>
              <span className="section-kicker">Account Settings</span>
              <h1>{user?.name}</h1>
              <p>{ROLE_LABELS[user?.role] || user?.role}</p>
            </div>
          </section>

          {message ? <div className="alert alert-success">{message}</div> : null}
          {error ? <div className="alert alert-error">{error}</div> : null}

          <div className="dashboard-grid">
            <section className="card">
              <div className="card-header">
                <div className="card-title">Profile Information</div>
              </div>

              <form onSubmit={handleProfileSave}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Name</label>
                    <input className="form-control" value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={profile.phone} onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">College</label>
                    <input className="form-control" value={profile.college} onChange={(e) => setProfile((prev) => ({ ...prev, college: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">University</label>
                    <input className="form-control" value={profile.university} onChange={(e) => setProfile((prev) => ({ ...prev, university: e.target.value }))} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Department</label>
                    <input className="form-control" value={profile.department} onChange={(e) => setProfile((prev) => ({ ...prev, department: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input className="form-control" value={profile.year} onChange={(e) => setProfile((prev) => ({ ...prev, year: e.target.value }))} />
                  </div>
                </div>

                <button className="btn btn-primary" type="submit">Save Profile</button>
              </form>
            </section>

            <section className="card">
              <div className="card-header">
                <div className="card-title">Change Password</div>
              </div>

              <form onSubmit={handlePasswordSave}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input className="form-control" type="password" value={passwords.currentPassword} onChange={(e) => setPasswords((prev) => ({ ...prev, currentPassword: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input className="form-control" type="password" value={passwords.newPassword} onChange={(e) => setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))} />
                </div>
                <button className="btn btn-secondary" type="submit">Update Password</button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
