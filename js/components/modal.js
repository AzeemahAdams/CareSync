CareSync.modal = (() => {
  let last, cleanup;
  const close = () => { document.querySelector('.modal-backdrop')?.remove(); cleanup && cleanup(); document.body.style.overflow = ''; last && last.focus(); };
  const open = ({ title, body, actions = [{ label: 'Close', variant: 'secondary' }] }) => {
    last = document.activeElement;
    const back = document.createElement('div'); back.className = 'modal-backdrop';
    const m = document.createElement('div'); m.className = 'modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'modal-title');
    const h = document.createElement('h2'); h.id = 'modal-title'; h.textContent = title; h.style.fontSize = 'var(--fs-h3)';
    const c = document.createElement('div'); c.className = 'stack'; typeof body === 'string' ? c.textContent = body : c.appendChild(body);
    const a = document.createElement('div'); a.className = 'modal-actions';
    actions.forEach(x => { const b = document.createElement('button'); b.type = 'button'; b.className = `btn btn-${x.variant || 'secondary'}`; b.textContent = x.label; b.addEventListener('click', () => { close(); x.onClick && x.onClick(); }); a.appendChild(b); });
    m.append(h, c, a); back.appendChild(m); document.body.appendChild(back); document.body.style.overflow = 'hidden';
    const f = () => [...m.querySelectorAll('button,[href],input,select,textarea')];
    const onKey = e => { if (e.key === 'Escape') close(); if (e.key === 'Tab') { const x = f(), first = x[0], end = x[x.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); end.focus(); } else if (!e.shiftKey && document.activeElement === end) { e.preventDefault(); first.focus(); } } };
    document.addEventListener('keydown', onKey); cleanup = () => document.removeEventListener('keydown', onKey);
    back.addEventListener('click', e => { if (e.target === back) close(); });
    f()[0]?.focus();
  };
  const confirm = (title, message, onConfirm, danger) => open({ title, body: message, actions: [{ label: 'Cancel' }, { label: 'Confirm', variant: danger ? 'danger' : 'primary', onClick: onConfirm }] });
  return { open, close, confirm };
})();
