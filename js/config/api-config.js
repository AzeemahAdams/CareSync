/* ─────────────────────────────────────────────────────────────────────────
   api-config.js — Central API configuration for CareRoute.

   To connect a real backend:
     1. Set BASE_URL to your API server's base URL.
     2. Set USE_MOCK to false.
   All service modules (auth, facility, referral, admin) read these values.
   ───────────────────────────────────────────────────────────────────────── */
window.CareSync = window.CareSync || {};

CareSync.config = {
  BASE_URL:     'https://api.careroute.ng/v1', // Production API base URL
  USE_MOCK:     true,                           // Set false when backend is live
  DEFAULT_LANG: 'en',

  ENDPOINTS: {
    // Auth
    login:    '/auth/login',
    register: '/auth/register',
    logout:   '/auth/logout',
    me:       '/auth/me',

    // Facilities
    facilities:      '/facilities',
    facilitySearch:  '/facilities/search',
    facilityServices: id => `/facilities/${id}/services`,

    // Referrals
    referrals:      '/referrals',
    referralStatus: id => `/referrals/${id}/status`,

    // Users
    users: '/users',

    // Admin
    adminDashboard:  '/admin/dashboard',
    adminFacilities: '/admin/facilities',
    adminVerify:     id => `/admin/facilities/${id}/verify`,
    adminUsers:      '/admin/users',
    adminReports:    '/admin/reports',

    // Contact
    contact: '/contact',
  }
};
