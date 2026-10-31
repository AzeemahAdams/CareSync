CareSync.nav = (() => {
  const init = () => {
    const toggle = document.querySelector('.nav-toggle'), menu = document.getElementById('mobile-menu');
    const here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-menu a, .mobile-menu a').forEach(a => { if (a.getAttribute('href').split('/').pop() === here) a.setAttribute('aria-current', 'page'); });
    if (!toggle || !menu) return;
    const set = open => { toggle.setAttribute('aria-expanded', open); menu.hidden = !open; };
    toggle.addEventListener('click', () => set(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { set(false); toggle.focus(); } });
    if (window.matchMedia) matchMedia('(min-width:1024px)').addEventListener('change', e => e.matches && set(false));
  };
  return { init };
})();
