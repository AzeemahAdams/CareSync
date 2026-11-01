// js/components/app-shell.js
// Shared dashboard sidebar/topbar interaction handler.
// Included on every dashboard page (patient/, facility/, admin/).

CareSync.appShell = (() => {

  // Returns the absolute URL of the project root regardless of IP/hostname or depth.
  function _rootUrl() {
    const path  = window.location.pathname; // e.g. /patient/dashboard.html
    const parts = path.split('/').filter(Boolean);
    const depth = parts.length - 1; // 1 for /patient/foo.html
    const up    = depth > 0 ? '../'.repeat(depth) : '';
    // Build absolute URL so we never get /patient/auth/login.html
    return window.location.origin + '/' + (up ? up : '');
  }

  function init() {

    // ── Sidebar toggle (mobile) ───────────────────────────────────────────
    const sidebar = document.querySelector('.app-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggles = document.querySelectorAll('.sidebar-toggle');

    function openSidebar()  { sidebar?.classList.add('open');    overlay?.classList.add('visible'); }
    function closeSidebar() { sidebar?.classList.remove('open'); overlay?.classList.remove('visible'); }

    toggles.forEach(btn => btn.addEventListener('click', () => {
      sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
    }));

    overlay?.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sidebar?.classList.contains('open')) closeSidebar();
    });

    if (sidebar) {
      sidebar.querySelectorAll('a').forEach(a =>
        a.addEventListener('click', () => { if (window.innerWidth < 1024) closeSidebar(); })
      );
    }

    // ── Active nav link ───────────────────────────────────────────────────
    const here = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.sidebar-nav-item a').forEach(a => {
      const href = a.getAttribute('href').split('/').pop();
      if (href === here) {
        a.setAttribute('aria-current', 'page');
        a.classList.add('active');
      }
    });

    // ── Logout ────────────────────────────────────────────────────────────
    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        await CareSync.auth.logout();
        window.location.href = _rootUrl() + 'auth/login.html';
      });
    });

    // ── Topbar user name & avatar initial ─────────────────────────────────
    const nameEl = document.querySelector('.topbar-name');
    const avatEl = document.querySelector('.topbar-avatar');
    try {
      const name = sessionStorage.getItem('cr_name') || '';
      if (name) {
        if (nameEl) nameEl.textContent = name;
        if (avatEl) avatEl.textContent = name.charAt(0).toUpperCase();
      }
    } catch {}
  }

  return { init };
})();
