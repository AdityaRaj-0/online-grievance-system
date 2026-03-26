import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLE_LABELS } from "../utils/constants";
import { dashboardPathForRole, normalizeRole } from "../utils/helpers";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const resolvedRole = normalizeRole(user?.role);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  let navLinks = [];

  if (resolvedRole === "student") {
    navLinks = [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/lodge-complaint", label: "Lodge Complaint" },
      { to: "/my-complaints", label: "My Complaints" },
      { to: "/profile", label: "Profile" },
    ];
  } else if (resolvedRole === "main_admin") {
    navLinks = [
      { to: "/admin/dashboard", label: "Admin Dashboard" },
      { to: "/admin/complaints", label: "Complaint Desk" },
      { to: "/admin/announcements", label: "Announcements" },
      { to: "/admin/users", label: "Users & Admins" },
      { to: "/profile", label: "Profile" },
    ];
  } else if (resolvedRole) {
    navLinks = [
      { to: "/department/dashboard", label: "Resolution Desk" },
      { to: "/admin/complaints", label: "All Complaints" },
      { to: "/admin/announcements", label: "Announcements" },
      { to: "/profile", label: "Profile" },
    ];
  }

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link
          to={dashboardPathForRole(resolvedRole)}
          className="navbar-brand"
          onClick={() => setMenuOpen(false)}
        >
          <div className="brand-icon">SG</div>
          <div className="brand-text">
            <span className="brand-name">Student Grievance</span>
            <span className="brand-sub">Management System</span>
          </div>
        </Link>

        <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${location.pathname === link.to ? "active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          {user && (
            <div className="user-info">
              <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
              <div className="user-details">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{ROLE_LABELS[resolvedRole] || resolvedRole}</span>
              </div>
            </div>
          )}
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? "X" : "="}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
