// js/services/admin-service.js
CareSync.adminService = (() => {
  function delay(ms=500){ return new Promise(r=>setTimeout(r,ms)); }

  async function getDashboardStats() {
    if (CareSync.config.USE_MOCK) { await delay(400); return { ...CareSync.mockData.ADMIN_STATS }; }
    return CareSync.api.get(CareSync.config.ENDPOINTS.adminDashboard);
  }

  async function getUsers(params={}) {
    if (CareSync.config.USE_MOCK) {
      await delay(400);
      let list = [...CareSync.mockData.USERS];
      if (params.role) list = list.filter(u => u.role === params.role);
      if (params.q)    list = list.filter(u => u.name.toLowerCase().includes(params.q.toLowerCase()) || u.email.toLowerCase().includes(params.q.toLowerCase()));
      return { users: list, total: list.length };
    }
    return CareSync.api.get(CareSync.config.ENDPOINTS.users);
  }

  async function getFacilities(params={}) {
    if (CareSync.config.USE_MOCK) {
      await delay(400);
      let list = [...CareSync.mockData.FACILITIES];
      if (params.status) list = list.filter(f => f.status === params.status);
      if (params.q)      list = list.filter(f => f.name.toLowerCase().includes(params.q.toLowerCase()));
      return { facilities: list, total: list.length };
    }
    return CareSync.api.get(CareSync.config.ENDPOINTS.adminFacilities);
  }

  async function verifyFacility(id, action, notes) {
    if (CareSync.config.USE_MOCK) {
      await delay(600);
      const f = CareSync.mockData.FACILITIES.find(x => x.id === id);
      if (f) { f.status = action === 'approve' ? 'Verified' : 'Unverified'; f.updatedAt = new Date().toISOString().split('T')[0]; }
      return { ok: true, facility: f };
    }
    return CareSync.api.post(CareSync.config.ENDPOINTS.adminVerify(id), { action, notes });
  }

  async function getReferrals() {
    if (CareSync.config.USE_MOCK) { await delay(400); return [...CareSync.mockData.REFERRALS]; }
    return CareSync.api.get('/admin/referrals');
  }

  return { getDashboardStats, getUsers, getFacilities, verifyFacility, getReferrals };
})();
