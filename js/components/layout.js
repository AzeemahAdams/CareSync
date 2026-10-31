/* layout.js — renders shared header/footer into #site-header / #site-footer.
   body[data-base] is the relative path back to the project root ('' or '../'). */
CareSync.layout = (() => {
  const render = () => {
    const b = document.body.dataset.base || '';

    // ── Nav links ──────────────────────────────────────────────────────────
    const publicLinks = [
      ['nav.home',    'index.html',            'Home'],
      ['nav.about',   'about.html',            'About'],
      ['nav.how',     'how-it-works.html',     'How It Works'],
      ['nav.find',    'find-care.html',        'Find Care'],
      ['nav.contact', 'contact.html',          'Contact'],
    ];

    const li = links =>
      links.map(([k, h, l]) => `<a href="${b + h}" data-i18n="${k}">${l}</a>`).join('');

    // ── Auth state ─────────────────────────────────────────────────────────
    const session = (typeof CareSync !== 'undefined' && CareSync.api)
      ? { token: CareSync.api.getToken(), role: CareSync.api.getRole() }
      : null;
    const isLoggedIn = session && session.token;

    let dashboardHref = b + 'auth/login.html';
    if (isLoggedIn) {
      switch (session.role) {
        case 'facility': dashboardHref = b + 'facility/dashboard.html'; break;
        case 'admin':    dashboardHref = b + 'admin/dashboard.html';    break;
        default:         dashboardHref = b + 'patient/dashboard.html';  break;
      }
    }

    const authActions = isLoggedIn
      ? `<a class="btn btn-ghost nav-menu" href="${dashboardHref}" data-i18n="nav.dashboard">Dashboard</a>
         <button type="button" class="btn btn-outline-light nav-menu" id="nav-logout-btn" data-i18n="nav.logout">Log out</button>`
      : `<a class="btn btn-ghost nav-menu" href="${b}auth/login.html" data-i18n="nav.login">Login</a>
         <a class="btn btn-primary nav-menu" href="${b}auth/register.html" data-i18n="nav.start">Get Started</a>`;

    const mobileAuthActions = isLoggedIn
      ? `<a href="${dashboardHref}" data-i18n="nav.dashboard">Dashboard</a>
         <button type="button" class="btn btn-outline-mobile" id="nav-logout-btn-mobile" data-i18n="nav.logout">Log out</button>`
      : `<a href="${b}auth/login.html" data-i18n="nav.login">Login</a>
         <a class="btn btn-primary" href="${b}auth/register.html" data-i18n="nav.start">Get Started</a>`;

    // ── Replace #site-header ──────────────────────────────────────────────
    const h = document.getElementById('site-header');
    if (h) h.outerHTML = `
<a class="skip-link" href="#main" data-i18n="skip">Skip to main content</a>
<header class="site-header">
  <div class="container nav">
    <a class="logo" href="${b}index.html" aria-label="CareRoute home">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="8" fill="#3B82F6"/>
        <path d="M8 14h4l2-4 3 8 2-4h1" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Care<span>Route</span>
    </a>
    <nav class="nav-menu" aria-label="Main">${li(publicLinks)}</nav>
    <div class="nav-actions">
      <label class="sr-only" for="lang-desktop" data-i18n="lang.label">Language</label>
      <select id="lang-desktop" class="lang-select"></select>
      ${authActions}
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>
  <nav id="mobile-menu" class="mobile-menu" aria-label="Mobile" hidden>
    ${li(publicLinks)}
    ${mobileAuthActions}
  </nav>
</header>`;

    // ── Logout handler ────────────────────────────────────────────────────
    ['nav-logout-btn', 'nav-logout-btn-mobile'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', async () => {
          if (typeof CareSync.auth !== 'undefined') {
            await CareSync.auth.logout();
          } else {
            CareSync.api.clearToken();
          }
          window.location.href = b + 'index.html';
        });
      }
    });

    // ── Replace #site-footer ──────────────────────────────────────────────
    const f = document.getElementById('site-footer');
    if (f) f.outerHTML = `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <p class="logo">Care<span>Route</span></p>
        <p>Healthcare access, navigation and referral coordination. Not a diagnosis tool or emergency dispatch service.</p>
      </div>
      <div>
        <h3 data-i18n="footer.product">Product</h3>
        <a href="${b}find-care.html" data-i18n="nav.find">Find Care</a>
        <a href="${b}how-it-works.html" data-i18n="nav.how">How It Works</a>
        <a href="${b}about.html" data-i18n="nav.about">About</a>
      </div>
      <div>
        <h3 data-i18n="footer.support">Support</h3>
        <a href="${b}contact.html" data-i18n="nav.contact">Contact</a>
        <a href="${b}how-it-works.html#faq">FAQ</a>
        <a href="${b}auth/login.html" data-i18n="nav.login">Login</a>
      </div>
      <div>
        <h3>Contact</h3>
        <p>support@careroute.ng</p>
        <p>+234 800 CAR ROUTE</p>
        <p>Abeokuta, Nigeria</p>
      </div>
    </div>
    <p class="footer-bottom">
      &copy; <span id="year">${new Date().getFullYear()}</span> CareRoute.
      <span data-i18n="footer.rights">All rights reserved.</span>
      <button type="button" class="link-btn" data-legal="privacy" data-i18n="footer.privacy">Privacy policy</button>
      <button type="button" class="link-btn" data-legal="terms" data-i18n="footer.terms">Terms of service</button>
    </p>
  </div>
</footer>`;

    // ── Legal modals ──────────────────────────────────────────────────────
    const LEGAL = {
      privacy: ['Privacy policy',   'CareRoute collects only the information necessary to provide healthcare navigation services. We do not store personal health records. Full privacy policy available on request.'],
      terms:   ['Terms of service', 'CareRoute is an information and navigation tool. It does not provide medical advice, diagnosis, or emergency dispatch services. Use of this platform does not replace consultation with a qualified healthcare professional.']
    };
    document.querySelectorAll('[data-legal]').forEach(btn =>
      btn.addEventListener('click', () =>
        CareSync.modal.open({ title: LEGAL[btn.dataset.legal][0], body: LEGAL[btn.dataset.legal][1] })
      )
    );

    CareSync.icons.render();
  };

  return { render };
})();
