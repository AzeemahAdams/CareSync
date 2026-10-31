// js/services/auth-service.js
// Handles login, registration, logout, and session state.
// Set CareSync.config.USE_MOCK = false to switch to a real backend.

CareSync.auth = (() => {
  'use strict';

  // ── Mock data (demo only) ─────────────────────────────────────────────────
  // Replace with live backend calls by setting USE_MOCK = false.

  const MOCK_USERS = [
    { id: 'u1', name: 'Amara Okafor',    email: 'patient@demo.com',  password: 'Demo1234!', role: 'patient',  phone: '+234 801 234 5678' },
    { id: 'u2', name: 'Lagos General',   email: 'facility@demo.com', password: 'Demo1234!', role: 'facility', phone: '+234 802 345 6789' },
    { id: 'u3', name: 'Admin User',      email: 'admin@demo.com',    password: 'Demo1234!', role: 'admin',    phone: '+234 803 456 7890' },
  ];

  // Simulate network latency
  function _delay(ms = 600) { return new Promise(r => setTimeout(r, ms)); }

  function _mockLogin(email, password) {
    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) throw { type: 'auth', message: 'Incorrect email or password. Please try again.' };
    const token = 'mock_token_' + user.id + '_' + Date.now();
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone } };
  }

  function _mockRegister(data) {
    const exists = MOCK_USERS.find(u => u.email.toLowerCase() === data.email.toLowerCase());
    if (exists) throw { type: 'auth', message: 'An account with this email already exists.' };
    const newUser = {
      id:       'u' + (MOCK_USERS.length + 1),
      name:     data.name,
      email:    data.email,
      password: data.password,
      role:     data.accountType || 'patient',
      phone:    data.phone || ''
    };
    MOCK_USERS.push(newUser);
    const token = 'mock_token_' + newUser.id + '_' + Date.now();
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

  function getRoleRedirect(role) {
    const base = _baseDir();
    switch (role) {
      case 'facility': return base + 'facility/dashboard.html';
      case 'admin':    return base + 'admin/dashboard.html';
      default:         return base + 'patient/dashboard.html';
    }
  }

  // Work out relative base path from current page location
  function _baseDir() {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    return depth > 1 ? '../' : '';
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
    // Integration point ↓
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
    // Integration point ↓
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
  }

  // ── Guard for protected pages ─────────────────────────────────────────────
  // Call on each protected page to redirect unauthenticated users.
  function requireAuth(allowedRoles) {
    const session = getSession();
    if (!session) {
      const base = _baseDir();
      window.location.href = base + 'auth/login.html?next=' + encodeURIComponent(window.location.pathname);
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
