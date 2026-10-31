// js/services/api-service.js
// Base HTTP client wrapping fetch().
// All service modules (auth, facility, referral, admin) build on this.
// Integration point: change CareSync.config.BASE_URL in api-config.js
// and set USE_MOCK to false when the backend is ready.

CareSync.api = (() => {
  'use strict';

  // ── Token management ──────────────────────────────────────────────────────
  // Tokens are stored in sessionStorage so they are not persisted across
  // browser sessions. Never store passwords here.

  const TOKEN_KEY = 'cr_token';
  const ROLE_KEY  = 'cr_role';

  function getToken()        { try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; } }
  function setToken(t)       { try { sessionStorage.setItem(TOKEN_KEY, t); }    catch {} }
  function clearToken()      { try { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(ROLE_KEY); } catch {} }
  function getRole()         { try { return sessionStorage.getItem(ROLE_KEY); } catch { return null; } }
  function setRole(r)        { try { sessionStorage.setItem(ROLE_KEY, r); }     catch {} }

  // ── Request helper ────────────────────────────────────────────────────────
  async function request(method, path, body, options = {}) {
    const base    = CareSync.config.BASE_URL;
    const url     = base + path;
    const headers = { 'Content-Type': 'application/json' };

    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const init = { method, headers, ...options };
    if (body !== undefined) init.body = JSON.stringify(body);

    let response;
    try {
      response = await fetch(url, init);
    } catch (networkErr) {
      throw { type: 'network', message: 'Unable to reach the server. Check your connection.' };
    }

    // Parse body regardless of status (errors often carry JSON)
    let data;
    try { data = await response.json(); } catch { data = {}; }

    if (!response.ok) {
      throw {
        type:    'api',
        status:  response.status,
        message: data.message || `Request failed (${response.status}).`,
        data
      };
    }

    return data;
  }

  // ── Public helpers ────────────────────────────────────────────────────────
  const get    = (path, opts)       => request('GET',    path, undefined, opts);
  const post   = (path, body, opts) => request('POST',   path, body, opts);
  const put    = (path, body, opts) => request('PUT',    path, body, opts);
  const patch  = (path, body, opts) => request('PATCH',  path, body, opts);
  const del    = (path, opts)       => request('DELETE', path, undefined, opts);

  return { get, post, put, patch, del, getToken, setToken, clearToken, getRole, setRole };
})();
