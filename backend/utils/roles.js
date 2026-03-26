const LEGACY_ROLE_MAP = {
  user: 'student',
  admin: 'main_admin',
  department: 'department_admin',
  college: 'college_admin',
  university: 'university_admin',
};

const ADMIN_ROLES = ['department_admin', 'college_admin', 'university_admin', 'main_admin'];

const normalizeRole = (role) => LEGACY_ROLE_MAP[role] || role || 'student';

module.exports = {
  ADMIN_ROLES,
  normalizeRole,
};
