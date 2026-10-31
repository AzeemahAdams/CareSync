/* Central configuration. Change BASE_URL and USE_MOCK here only. */
window.CareSync = window.CareSync || {};
CareSync.config = {
  BASE_URL: 'http://localhost:3000/api', // TODO(backend): set real base URL
  USE_MOCK: true,                         // true = synthetic demo data, false = live backend
  DEFAULT_LANG: 'en',
  ENDPOINTS: {
    login:'/auth/login', register:'/auth/register', logout:'/auth/logout', me:'/auth/me',
    facilities:'/facilities', facilitySearch:'/facilities/search',
    facilityServices:id=>`/facilities/${id}/services`,
    referrals:'/referrals', referralStatus:id=>`/referrals/${id}/status`,
    users:'/users', adminDashboard:'/admin/dashboard', adminFacilities:'/admin/facilities',
    adminVerify:id=>`/admin/facilities/${id}/verify`, adminUsers:'/admin/users', adminReports:'/admin/reports'
  }
};
