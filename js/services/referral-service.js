// js/services/referral-service.js
CareSync.referralService = (() => {
  function delay(ms=500){ return new Promise(r=>setTimeout(r,ms)); }

  async function getMyReferrals() {
    if (CareSync.config.USE_MOCK) {
      await delay(400);
      return [...CareSync.mockData.REFERRALS];
    }
    return CareSync.api.get(CareSync.config.ENDPOINTS.referrals);
  }

  async function getById(id) {
    if (CareSync.config.USE_MOCK) {
      await delay(300);
      return CareSync.mockData.REFERRALS.find(r => r.id === id) || null;
    }
    return CareSync.api.get('/referrals/' + id);
  }

  async function updateStatus(id, status, notes) {
    if (CareSync.config.USE_MOCK) {
      await delay(400);
      const r = CareSync.mockData.REFERRALS.find(x => x.id === id);
      if (r) { r.status = status; if (notes) r.notes = notes; }
      return r;
    }
    return CareSync.api.patch(CareSync.config.ENDPOINTS.referralStatus(id), { status, notes });
  }

  async function getFacilityReferrals(facilityId) {
    if (CareSync.config.USE_MOCK) {
      await delay(400);
      return CareSync.mockData.REFERRALS.filter(r => r.toId === facilityId || r.fromId === facilityId);
    }
    return CareSync.api.get('/facility/referrals');
  }

  return { getMyReferrals, getById, updateStatus, getFacilityReferrals };
})();
