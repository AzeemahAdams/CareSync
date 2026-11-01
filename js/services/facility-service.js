// js/services/facility-service.js
CareSync.facilityService = (() => {
  function delay(ms = 500) { return new Promise(r => setTimeout(r, ms)); }

  // Resolve the facility ID for the currently logged-in facility user.
  // Extracts the user ID from the session token and maps it to a facility record.
  // When USE_MOCK = false, the backend returns the facility profile directly.
  function _myId() {
    try {
      const token  = CareSync.api.getToken() || '';
      const userId = token.replace('session_', '').split('_')[0]; // e.g. 'u2'
      // u2 is mapped to facility f2 in mock data (Lagos General / St. Nicholas)
      const userMap = { u2: 'f2', u6: 'f4' }; // extend as needed
      return userMap[userId] || CareSync.mockData.FACILITY_PROFILE.id;
    } catch {
      return CareSync.mockData.FACILITY_PROFILE.id;
    }
  }

  async function search(params = {}) {
    if (CareSync.config.USE_MOCK) {
      await delay(400);
      let results = [...CareSync.mockData.FACILITIES];
      if (params.q)       results = results.filter(f => f.name.toLowerCase().includes(params.q.toLowerCase()) || f.location.toLowerCase().includes(params.q.toLowerCase()));
      if (params.service) results = results.filter(f => f.services.some(s => s.toLowerCase().includes(params.service.toLowerCase())));
      if (params.type)    results = results.filter(f => f.type === params.type);
      if (params.sort === 'distance') results.sort((a, b) => a.distance - b.distance);
      else if (params.sort === 'name') results.sort((a, b) => a.name.localeCompare(b.name));
      else results.sort((a, b) => b.matchScore - a.matchScore);
      return { results, total: results.length };
    }
    const qs = new URLSearchParams(params).toString();
    return CareSync.api.get(CareSync.config.ENDPOINTS.facilitySearch + (qs ? '?' + qs : ''));
  }

  async function getById(id) {
    if (CareSync.config.USE_MOCK) {
      await delay(300);
      const f = CareSync.mockData.FACILITIES.find(x => x.id === id);
      if (!f) throw { message: 'Facility not found.' };
      return f;
    }
    return CareSync.api.get('/facilities/' + id);
  }

  async function getAll() {
    if (CareSync.config.USE_MOCK) {
      await delay(300);
      return CareSync.mockData.FACILITIES;
    }
    return CareSync.api.get(CareSync.config.ENDPOINTS.facilities);
  }

  async function getMyProfile() {
    if (CareSync.config.USE_MOCK) {
      await delay(300);
      // Return a copy so mutations don't affect the source object until saved
      return JSON.parse(JSON.stringify(CareSync.mockData.FACILITY_PROFILE));
    }
    return CareSync.api.get('/facility/profile');
  }

  async function updateProfile(data) {
    if (CareSync.config.USE_MOCK) {
      await delay(600);
      Object.assign(CareSync.mockData.FACILITY_PROFILE, data);
      return JSON.parse(JSON.stringify(CareSync.mockData.FACILITY_PROFILE));
    }
    return CareSync.api.put('/facility/profile', data);
  }

  async function addService(service) {
    if (CareSync.config.USE_MOCK) {
      await delay(400);
      const s = { ...service, id: 's' + Date.now() };
      CareSync.mockData.FACILITY_PROFILE.services.push(s);
      return s;
    }
    return CareSync.api.post('/facility/services', service);
  }

  async function removeService(id) {
    if (CareSync.config.USE_MOCK) {
      await delay(300);
      const idx = CareSync.mockData.FACILITY_PROFILE.services.findIndex(s => s.id === id);
      if (idx > -1) CareSync.mockData.FACILITY_PROFILE.services.splice(idx, 1);
      return { ok: true };
    }
    return CareSync.api.del('/facility/services/' + id);
  }

  // ── Smart matching ────────────────────────────────────────────────────────
  // Transparent scoring algorithm with configurable weights.
  // Factors: service fit, proximity, accessibility, verification, info freshness.
  function computeMatch(facility, preferences) {
    const weights = { service: 35, distance: 25, accessibility: 15, verification: 15, freshness: 10 };
    const scores  = { service: 0,  distance: 0,  accessibility: 0,  verification: 0,  freshness: 0 };

    // Service
    if (preferences.service) {
      scores.service = facility.services.some(s => s.toLowerCase().includes(preferences.service.toLowerCase())) ? 100 : 20;
    } else { scores.service = 70; }

    // Distance (0–maxDist km → 100–0%)
    const maxDist      = parseFloat(preferences.maxDistance) || 20;
    scores.distance    = Math.max(0, Math.round((1 - facility.distance / maxDist) * 100));

    // Accessibility
    const needed = preferences.accessibility || [];
    scores.accessibility = needed.length === 0 ? 80
      : Math.round((needed.filter(a => facility.accessibility.includes(a)).length / needed.length) * 100);

    // Verification
    scores.verification = facility.status === 'Verified' ? 100 : facility.status === 'Pending' ? 50 : 10;

    // Freshness (days since last update)
    const days       = Math.floor((Date.now() - new Date(facility.updatedAt)) / 86400000);
    scores.freshness = days < 30 ? 100 : days < 90 ? 70 : days < 180 ? 40 : 20;

    const total = Object.entries(weights).reduce((acc, [k, w]) => acc + (scores[k] * w / 100), 0);
    return { total: Math.round(total), breakdown: scores, weights };
  }

  return { search, getById, getAll, getMyProfile, updateProfile, addService, removeService, computeMatch, _myId };
})();
