// js/services/auth-service.js
// Handles login, registration, logout, and session state.
//
// BACKEND INTEGRATION:
//   Set CareSync.config.USE_MOCK = false in api-config.js.
//   All functions below automatically switch to real API calls.

CareSync.auth = (() => {
  'use strict';

  // ── Placeholder accounts used while USE_MOCK = true ──────────────────────
  // Loaded from sessionStorage so registrations survive page navigation
  // within the same browser session. Cleared on tab close.
  const STORAGE_KEY = 'cr_users';

  function _loadUsers() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    // Default accounts
    return [
      { id: 'u1', name: 'Amara Okafor',  email: 'patient@CareSync.ng',  password: 'CareSync1!', role: 'patient',  phone: '+234 801 234 5678' },
      { id: 'u2', name: 'Lagos General', email: 'facility@CareSync.ng', password: 'CareSync1!', role: 'facility', phone: '+234 802 345 6789' },
      { id: 'u3', name: 'Admin User',    email: 'admin@CareSync.ng',    password: 'CareSync1!', role: 'admin',    phone: '+234 803 456 7890' },
    ];
  }

  function _saveUsers(users) {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(users)); } catch {}
  }

  function _delay(ms = 600) { return new Promise(r => setTimeout(r, ms)); }

  function _mockLogin(email, password) {
    const users = _loadUsers();
    const user  = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) throw { type: 'auth', message: 'Incorrect email or password. Please try again.' };
    const token = 'session_' + user.id + '_' + Date.now();
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone } };
  }

  function _mockRegister(data) {
    const users  = _loadUsers();
    const exists = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) throw { type: 'auth', message: 'An account with this email already exists.' };

    const newUser = {
      id:       'u' + (users.length + 1) + '_' + Date.now(),
      name:     data.name,
      email:    data.email,
      password: data.password,
      role:     data.accountType || 'patient',
      phone:    data.phone || ''
    };
    users.push(newUser);
    _saveUsers(users);   // persist within session so login works immediately after

    const token = 'session_' + newUser.id + '_' + Date.now();
    return { token, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } };
  }

  // ── Session helpers ───────────────────────────────────────────────────────

  function getSession() {
    const token = CareSync.api.getToken();
    const role  = CareSync.api.getRole();
    if (!token || !role) return null;
    return { token, role };
  }

  function isLoggedIn() { return !!getSession(); }

  // ── Reliable base-path resolution ─────────────────────────────────────────
  // Uses the page's actual depth relative to the project root instead of
  // counting slashes, which breaks on IP addresses like 127.0.0.1.

  function _rootUrl() {
    // Walk up from the current page to the project root.
    // Pages are at depths:
    //   root level  (index.html, find-care.html)        → depth 0
    //   one level   (auth/, patient/, facility/, admin/) → depth 1
    const path   = window.location.pathname; // e.g. /patient/dashboard.html
    const parts  = path.split('/').filter(Boolean); // ['patient','dashboard.html']
    const depth  = parts.length - 1;                // 1 for /patient/foo.html, 0 for /foo.html
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    return window.location.origin + '/' + prefix;
  }

  function getRoleRedirect(role) {
    const root = _rootUrl();
    switch (role) {
      case 'facility': return root + 'facility/dashboard.html';
      case 'admin':    return root + 'admin/dashboard.html';
      default:         return root + 'patient/dashboard.html';
    }
  }

  // ── Auth operations ───────────────────────────────────────────────────────

  async function login(email, password) {
    if (CareSync.config.USE_MOCK) {
      await _delay();
      const result = _mockLogin(email, password);
      CareSync.api.setToken(result.token);
      CareSync.api.setRole(result.user.role);
      return result;
    }
    // Live backend ↓
    const result = await CareSync.api.post(CareSync.config.ENDPOINTS.login, { email, password });
    CareSync.api.setToken(result.token);
    CareSync.api.setRole(result.user.role);
    return result;
  }

  async function register(data) {
    if (CareSync.config.USE_MOCK) {
      await _delay(800);
      const result = _mockRegister(data);
      CareSync.api.setToken(result.token);
      CareSync.api.setRole(result.user.role);
      return result;
    }
    // Live backend ↓
    const result = await CareSync.api.post(CareSync.config.ENDPOINTS.register, data);
    CareSync.api.setToken(result.token);
    CareSync.api.setRole(result.user.role);
    return result;
  }

  async function logout() {
    if (!CareSync.config.USE_MOCK) {
      try { await CareSync.api.post(CareSync.config.ENDPOINTS.logout); } catch {}
    }
    CareSync.api.clearToken();
    try { sessionStorage.removeItem('cr_name'); } catch {}
  }

  // ── Route guard ───────────────────────────────────────────────────────────
  // Call this at the top of every protected page's DOMContentLoaded handler.
  // Returns true if access is allowed, false + redirects if not.

  function requireAuth(allowedRoles) {
    const session = getSession();
    if (!session) {
      // Redirect to login with an absolute ?next= URL so the server
      // never resolves to /patient/auth/login.html
      const root      = _rootUrl();
      const loginUrl  = root + 'auth/login.html';
      const nextParam = encodeURIComponent(window.location.href);
      window.location.href = loginUrl + '?next=' + nextParam;
      return false;
    }
    if (allowedRoles && !allowedRoles.includes(session.role)) {
      window.location.href = getRoleRedirect(session.role);
      return false;
    }
    return true;
  }

  return { login, register, logout, getSession, isLoggedIn, getRoleRedirect, requireAuth };
})();
