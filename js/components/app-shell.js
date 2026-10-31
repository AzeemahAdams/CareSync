// js/components/app-shell.js
// Shared dashboard sidebar/topbar interaction handler.
// Included on every dashboard page.

CareSync.appShell = (() => {
  function init() {
    // ── Sidebar toggle (mobile) ─────────────────────────────────────────
    const sidebar  = document.querySelector('.app-sidebar');
    const overlay  = document.querySelector('.sidebar-overlay');
    const toggles  = document.querySelectorAll('.sidebar-toggle');

    function openSidebar()  { sidebar && sidebar.classList.add('open');    overlay && overlay.classList.add('visible'); }
    function closeSidebar() { sidebar && sidebar.classList.remove('open'); overlay && overlay.classList.remove('visible'); }

    toggles.forEach(btn => btn.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('open')) closeSidebar(); else openSidebar();
    }));

    overlay && overlay.addEventListener('click', closeSidebar);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) closeSidebar();
    });

    // Close sidebar when a nav link is clicked on mobile
    if (sidebar) {
      sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        if (window.innerWidth < 1024) closeSidebar();
      }));
    }

    // ── Active nav link ─────────────────────────────────────────────────
    const here = window.location.pathname.split('/').pop() || 'dashboard.html';
    document.querySelectorAll('.sidebar-nav-item a').forEach(a => {
      const href = a.getAttribute('href').split('/').pop();
      if (href === here) {
        a.setAttribute('aria-current', 'page');
        a.classList.add('active');
      }
    });

    // ── Logout buttons ──────────────────────────────────────────────────
    document.querySelectorAll('[data-action="logout"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        await CareSync.auth.logout();
        const depth = (window.location.pathname.match(/\//g) || []).length - 1;
        const base  = depth > 2 ? '../../' : '../';
        window.location.href = base + 'auth/login.html';
      });
    });

    // ── Topbar user name ─────────────────────────────────────────────────
    const nameEl = document.querySelector('.topbar-name');
    const avatEl = document.querySelector('.topbar-avatar');
    try {
      const session = CareSync.auth.getSession();
      if (session) {
        // Attempt to get stored name
        const name = sessionStorage.getItem('cr_name') || '';
        if (name && nameEl) nameEl.textContent = name;
        if (name && avatEl) avatEl.textContent = name.charAt(0).toUpperCase();
      }
    } catch {}
  }

  return { init };
})();
