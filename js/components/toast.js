CareSync.toast = (() => {
  let region;
  const ensure = () => { if (region) return region; region = document.createElement('div'); region.className = 'toast-region'; region.setAttribute('role', 'status'); region.setAttribute('aria-live', 'polite'); document.body.appendChild(region); return region; };
  const show = (message, type = 'info', ms = 4500) => {
    const el = document.createElement('div'); el.className = `toast toast-${type}`;
    const p = document.createElement('p'); p.textContent = message;
    const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Dismiss notification'); b.textContent = '×';
    b.addEventListener('click', () => el.remove());
    el.append(p, b); ensure().appendChild(el); setTimeout(() => el.remove(), ms);
  };
  return { show };
})();
