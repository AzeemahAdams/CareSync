document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form'); if (!form) return;
  const status = document.getElementById('form-status'), btn = form.querySelector('button[type=submit]');
  form.addEventListener('submit', async e => {
    e.preventDefault(); status.className = 'form-status'; status.textContent = '';
    if (!CareSync.forms.validate(form)) { status.textContent = 'Please fix the highlighted fields.'; status.classList.add('is-error'); return; }
    CareSync.forms.loading(btn, true, 'Send message');
    try {
      // TODO(backend): POST to a contact endpoint. Demo mode simulates the request.
      await new Promise((res, rej) => setTimeout(() => navigator.onLine ? res() : rej(new Error('offline')), 900));
      form.reset(); status.textContent = 'Thanks! Your message was recorded in demo mode (nothing was actually sent).'; status.classList.add('is-success');
      CareSync.toast.show('Message submitted (demo).', 'success');
    } catch { status.textContent = 'Could not send. Check your connection and try again.'; status.classList.add('is-error'); CareSync.toast.show('Network error.', 'error'); }
    finally { CareSync.forms.loading(btn, false, 'Send message'); }
  });
});
