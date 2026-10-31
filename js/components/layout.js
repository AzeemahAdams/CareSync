/* Renders the shared header/footer into #site-header / #site-footer.
   body[data-base] is the relative path back to the project root ('' or '../'). */
CareSync.layout = (() => {
  const render = () => {
    const b = document.body.dataset.base || '';
    const links = [['nav.home','index.html','Home'],['nav.about','about.html','About'],['nav.how','how-it-works.html','How It Works'],['nav.find','patient/find-care.html','Find Care'],['nav.contact','contact.html','Contact']];
    const li = (cls) => links.map(([k,h,l]) => `<a href="${b+h}" data-i18n="${k}">${l}</a>`).join('');
    const h = document.getElementById('site-header');
    if (h) h.outerHTML = `
<a class="skip-link" href="#main" data-i18n="skip">Skip to main content</a>
<div class="demo-label" data-i18n="demo.banner">Demo mode: all data shown is synthetic and not live.</div>
<header class="site-header"><div class="container nav">
  <a class="logo" href="${b}index.html" aria-label="CareSync home"><svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8" fill="#3B82F6"/><path d="M8 14h4l2-4 3 8 2-4h1" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>Care<span>Sync</span></a>
  <nav class="nav-menu" aria-label="Main">${li()}</nav>
  <div class="nav-actions">
    <label class="sr-only" for="lang-desktop" data-i18n="lang.label">Language</label><select id="lang-desktop" class="lang-select"></select>
    <a class="btn btn-ghost nav-menu" href="${b}auth/login.html" data-i18n="nav.login">Login</a>
    <a class="btn btn-primary nav-menu" href="${b}auth/register.html" data-i18n="nav.start">Get Started</a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
  </div>
</div>
<nav id="mobile-menu" class="mobile-menu" aria-label="Mobile" hidden>${li()}<a href="${b}auth/login.html" data-i18n="nav.login">Login</a><a class="btn btn-primary" href="${b}auth/register.html" data-i18n="nav.start">Get Started</a></nav></header>`;
    const f = document.getElementById('site-footer');
    if (f) f.outerHTML = `
<footer class="site-footer"><div class="container">
  <div class="footer-grid">
    <div><p class="logo">Care<span>Sync</span></p><p>Healthcare access, navigation and referral coordination. Not a diagnosis tool or emergency dispatch service.</p></div>
    <div><h3 data-i18n="footer.product">Product</h3><a href="${b}patient/find-care.html" data-i18n="nav.find">Find Care</a><a href="${b}how-it-works.html" data-i18n="nav.how">How It Works</a><a href="${b}about.html" data-i18n="nav.about">About</a></div>
    <div><h3 data-i18n="footer.support">Support</h3><a href="${b}contact.html" data-i18n="nav.contact">Contact</a><a href="${b}how-it-works.html#faq">FAQ</a><a href="${b}auth/login.html" data-i18n="nav.login">Login</a></div>
    <div><h3>Contact</h3><p>support@example.com <small>(placeholder)</small></p><p>+234 000 000 0000 <small>(placeholder)</small></p><p>Abeokuta, Nigeria <small>(placeholder)</small></p></div>
  </div>
  <p class="footer-bottom">© <span id="year">2026</span> CareSync. <span data-i18n="footer.rights">All rights reserved.</span>
    <button type="button" class="link-btn" data-legal="privacy" data-i18n="footer.privacy">Privacy policy</button>
    <button type="button" class="link-btn" data-legal="terms" data-i18n="footer.terms">Terms of service</button></p>
</div></footer>`;
    const LEGAL = { privacy:['Privacy policy','Placeholder text. A reviewed privacy policy must be supplied before launch. This demo does not collect or store personal health information.'], terms:['Terms of service','Placeholder text. CareSync is an information and navigation tool. It does not provide medical advice, diagnosis, or emergency dispatch.'] };
    document.querySelectorAll('[data-legal]').forEach(btn => btn.addEventListener('click', () => CareSync.modal.open({ title: LEGAL[btn.dataset.legal][0], body: LEGAL[btn.dataset.legal][1] })));
    CareSync.icons.render();
  };
  return { render };
})();
