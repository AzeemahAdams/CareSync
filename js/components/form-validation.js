CareSync.forms = (() => {
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const check = el => {
    const v = el.value.trim(); let msg = '';
    if (el.required && !v) msg = `${el.dataset.label || 'This field'} is required.`;
    else if (el.type === 'email' && v && !EMAIL.test(v)) msg = 'Enter a valid email address.';
    else if (el.minLength > 0 && v && v.length < el.minLength) msg = `Enter at least ${el.minLength} characters.`;
    const err = document.getElementById(el.id + '-error');
    if (err) err.textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };
  const validate = form => { const bad = [...form.querySelectorAll('input,select,textarea')].filter(e => !check(e)); bad[0]?.focus(); return !bad.length; };
  const bind = form => form.querySelectorAll('input,select,textarea').forEach(e => e.addEventListener('blur', () => check(e)));
  const loading = (btn, on, label) => { btn.disabled = on; btn.setAttribute('aria-busy', on); if (label) btn.textContent = on ? 'Please wait…' : label; };
  return { check, validate, bind, loading };
})();
