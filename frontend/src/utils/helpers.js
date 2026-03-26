export const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatShortDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const getStatusBadgeClass = (status) =>
  `badge badge-${String(status || "").toLowerCase().replace(/\s+/g, "-")}`;

export const getPriorityBadgeClass = (priority) =>
  `badge badge-${String(priority || "").toLowerCase()}`;

export const normalizeRole = (role) => {
  const legacyRoleMap = {
    user: "student",
    admin: "main_admin",
    department: "department_admin",
    college: "college_admin",
    university: "university_admin",
  };

  return legacyRoleMap[role] || role || "student";
};

export const dashboardPathForRole = (role) => {
  const resolvedRole = normalizeRole(role);
  if (resolvedRole === "main_admin") return "/admin/dashboard";
  if (["department_admin", "college_admin", "university_admin"].includes(resolvedRole)) {
    return "/department/dashboard";
  }
  return "/dashboard";
};
