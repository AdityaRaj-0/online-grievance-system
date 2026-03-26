export const ROLE_LABELS = {
  student: "Student",
  user: "Student",
  admin: "Main Admin",
  department: "Department Admin",
  college: "College Admin",
  university: "University Admin",
  department_admin: "Department Admin",
  college_admin: "College Admin",
  university_admin: "University Admin",
  main_admin: "Main Admin",
};

export const GRIEVANCE_CATEGORIES = [
  "Academic",
  "Administration",
  "Infrastructure",
  "Faculty",
  "Hostel",
  "Library",
  "Transportation",
  "Financial",
  "Examination",
  "Other",
];

export const GRIEVANCE_LEVELS = [
  { value: "department", label: "Department Level" },
  { value: "college", label: "College Level" },
  { value: "university", label: "University Level" },
];

export const GRIEVANCE_PRIORITIES = ["Low", "Medium", "High", "Critical"];

export const GRIEVANCE_STATUSES = [
  "Pending",
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
  "Closed",
];

export const DEPARTMENTS = [
  "Academic",
  "Administration",
  "Infrastructure",
  "Faculty",
  "Hostel",
  "Library",
  "Transportation",
  "Financial",
  "Examination",
  "Other",
];

export const AUDIENCE_OPTIONS = [
  { value: "all", label: "All Users" },
  { value: "students", label: "Students" },
  { value: "admins", label: "Admins" },
];
