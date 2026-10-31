CareSync.i18n = (() => {
  const KEY='caresync.lang';
  const get = () => { try { return localStorage.getItem(KEY) || CareSync.config.DEFAULT_LANG; } catch { return CareSync.config.DEFAULT_LANG; } };
  const t = (k, l = get()) => (CareSync.translations[l] && CareSync.translations[l][k]) || CareSync.translations.en[k] || k;
  const apply = (l = get()) => {
    document.documentElement.lang = l;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n, l); });
    document.querySelectorAll('.lang-select').forEach(s => { s.value = l; });
  };
  const set = l => { try { localStorage.setItem(KEY, l); } catch {} apply(l); CareSync.toast.show(CareSync.languages[l], 'success'); };
  const init = () => {
    document.querySelectorAll('.lang-select').forEach(s => {
      s.innerHTML = Object.entries(CareSync.languages).map(([c, n]) => `<option value="${c}">${n}</option>`).join('');
      s.addEventListener('change', e => set(e.target.value));
    });
    apply();
  };
  return { t, get, set, init };
})();
