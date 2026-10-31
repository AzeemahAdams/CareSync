// js/pages/contact.js
// Handles the public contact form.
// Integration point: replace the simulated fetch below with a real
// POST to CareSync.config.ENDPOINTS.contact (add the endpoint to api-config.js).

document.addEventListener('DOMContentLoaded', () => {
  const form   = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const btn    = form.querySelector('button[type=submit]');

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Reset state
    status.className = 'form-status';
    status.textContent = '';

    if (!CareSync.forms.validate(form)) {
      status.textContent = 'Please fix the highlighted fields.';
      status.classList.add('is-error');
      return;
    }

    CareSync.forms.loading(btn, true, 'Send message');

    const payload = {
      name:    form.querySelector('#c-name').value.trim(),
      email:   form.querySelector('#c-email').value.trim(),
      subject: form.querySelector('#c-subject').value.trim(),
      message: form.querySelector('#c-msg').value.trim(),
    };

    try {
      if (CareSync.config.USE_MOCK) {
        // No backend yet — simulate a successful submission
        await new Promise(res => setTimeout(res, 800));
        if (!navigator.onLine) throw new Error('offline');
      } else {
        // Integration point: swap to live endpoint
        await CareSync.api.post('/contact', payload);
      }

      form.reset();
      status.textContent = 'Thank you — your message has been sent. We\'ll be in touch within one business day.';
      status.classList.add('is-success');
      CareSync.toast.show('Message sent successfully.', 'success');

    } catch (err) {
      const msg = (!navigator.onLine || (err && err.message === 'offline'))
        ? 'You appear to be offline. Please check your connection and try again.'
        : (err && err.message) || 'Something went wrong. Please try again.';
      status.textContent = msg;
      status.classList.add('is-error');
      CareSync.toast.show('Message could not be sent.', 'error');
    } finally {
      CareSync.forms.loading(btn, false, 'Send message');
    }
  });
});
