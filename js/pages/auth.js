// js/pages/auth.js
// Handles all interactions on login.html and register.html.
// Plain script — no ES module syntax.

(function () {
  'use strict';

  // ─── Shared helpers ───────────────────────────────────────────────────────

  function setLoading(btn, on) {
    btn.disabled = on;
    btn.setAttribute('aria-busy', String(on));
    const span = btn.querySelector('[data-label]');
    if (span) span.textContent = on ? 'Please wait…' : span.dataset.label;
  }

  function showAlert(el, msg, type) {
    if (!el) return;
    el.className = 'auth-alert is-' + type;
    el.querySelector('.alert-msg').textContent = msg;
    el.removeAttribute('hidden');
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideAlert(el) {
    if (el) el.setAttribute('hidden', '');
  }

  // Password strength scorer
  function scorePassword(pw) {
    let s = 0;
    if (pw.length >= 8)  s++;
    if (pw.length >= 12) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s; // 0–5
  }

  function updateStrengthBar(pw, barEl, labelEl) {
    if (!barEl) return;
    const score = scorePassword(pw);
    const pct   = pw.length === 0 ? 0 : Math.max(10, score * 20);
    const colors = ['', '#DC2626', '#D97706', '#D97706', '#16A34A', '#16A34A'];
    const labels = ['', 'Very weak', 'Weak', 'Fair', 'Strong', 'Very strong'];
    barEl.style.width     = pct + '%';
    barEl.style.background = colors[score] || '#DC2626';
    if (labelEl) labelEl.textContent = pw.length ? labels[score] || '' : '';
  }

  // Toggle password visibility
  function bindPasswordToggle(toggleBtn, inputEl) {
    if (!toggleBtn || !inputEl) return;
    toggleBtn.addEventListener('click', () => {
      const show = inputEl.type === 'password';
      inputEl.type = show ? 'text' : 'password';
      toggleBtn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      const icon = toggleBtn.querySelector('svg');
      if (icon) {
        icon.innerHTML = show
          ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
          : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
      }
    });
  }

  // ─── LOGIN PAGE ───────────────────────────────────────────────────────────

  function initLogin() {
    const form     = document.getElementById('login-form');
    if (!form) return;

    const emailEl  = document.getElementById('login-email');
    const passEl   = document.getElementById('login-password');
    const toggleEl = document.getElementById('toggle-password');
    const submitEl = document.getElementById('login-submit');
    const alertEl  = document.getElementById('login-alert');

    bindPasswordToggle(toggleEl, passEl);

    // If already logged in, redirect
    if (CareSync.auth.isLoggedIn()) {
      const session = CareSync.auth.getSession();
      window.location.href = CareSync.auth.getRoleRedirect(session.role);
      return;
    }

    // Pre-fill ?next= redirect for after login
    const params = new URLSearchParams(window.location.search);
    const next   = params.get('next') || '';

    form.addEventListener('submit', async e => {
      e.preventDefault();
      hideAlert(alertEl);

      // Field-level validation first
      const valid = CareSync.forms.validate(form);
      if (!valid) return;

      setLoading(submitEl, true);

      try {
        const result = await CareSync.auth.login(
          emailEl.value.trim(),
          passEl.value
        );

        // Determine redirect
        const dest = next || CareSync.auth.getRoleRedirect(result.user.role);
        CareSync.toast.show('Welcome back, ' + result.user.name + '.', 'success');

        // Small pause so the toast is visible before redirect
        setTimeout(() => { window.location.href = dest; }, 800);

      } catch (err) {
        setLoading(submitEl, false);
        const msg = (err && err.message) || 'Something went wrong. Please try again.';
        showAlert(alertEl, msg, 'error');
      }
    });

    // Inline validation on blur
    [emailEl, passEl].forEach(el => {
      if (el) el.addEventListener('blur', () => CareSync.forms.check(el));
    });
  }

  // ─── REGISTER PAGE ────────────────────────────────────────────────────────

  function initRegister() {
    const form = document.getElementById('register-form');
    if (!form) return;

    const nameEl      = document.getElementById('reg-name');
    const emailEl     = document.getElementById('reg-email');
    const phoneEl     = document.getElementById('reg-phone');
    const passEl      = document.getElementById('reg-password');
    const confirmEl   = document.getElementById('reg-confirm');
    const togglePass  = document.getElementById('toggle-reg-password');
    const toggleConf  = document.getElementById('toggle-reg-confirm');
    const strengthBar = document.getElementById('strength-fill');
    const strengthLbl = document.getElementById('strength-label');
    const submitEl    = document.getElementById('register-submit');
    const alertEl     = document.getElementById('register-alert');
    const termsEl     = document.getElementById('reg-terms');

    bindPasswordToggle(togglePass, passEl);
    bindPasswordToggle(toggleConf, confirmEl);

    // Password strength live update
    if (passEl) {
      passEl.addEventListener('input', () => {
        updateStrengthBar(passEl.value, strengthBar, strengthLbl);
      });
    }

    // Confirm password custom validation
    if (confirmEl) {
      confirmEl.addEventListener('blur', () => {
        const errEl = document.getElementById('reg-confirm-error');
        if (!confirmEl.value) return;
        if (confirmEl.value !== (passEl ? passEl.value : '')) {
          confirmEl.setAttribute('aria-invalid', 'true');
          if (errEl) errEl.textContent = 'Passwords do not match.';
        } else {
          confirmEl.setAttribute('aria-invalid', 'false');
          if (errEl) errEl.textContent = '';
        }
      });
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      hideAlert(alertEl);

      // Standard validation
      let valid = CareSync.forms.validate(form);

      // Terms checkbox
      if (termsEl && !termsEl.checked) {
        const errEl = document.getElementById('reg-terms-error');
        if (errEl) errEl.textContent = 'You must accept the terms to continue.';
        valid = false;
      } else if (termsEl) {
        const errEl = document.getElementById('reg-terms-error');
        if (errEl) errEl.textContent = '';
      }

      // Password match
      if (passEl && confirmEl && passEl.value !== confirmEl.value) {
        confirmEl.setAttribute('aria-invalid', 'true');
        const errEl = document.getElementById('reg-confirm-error');
        if (errEl) errEl.textContent = 'Passwords do not match.';
        valid = false;
      }

      // Password strength minimum
      if (passEl && scorePassword(passEl.value) < 2) {
        passEl.setAttribute('aria-invalid', 'true');
        const errEl = document.getElementById('reg-password-error');
        if (errEl) errEl.textContent = 'Password is too weak. Use at least 8 characters with a number.';
        valid = false;
      }

      if (!valid) return;

      // Account type
      const accountTypeEl = form.querySelector('input[name="accountType"]:checked');
      const accountType   = accountTypeEl ? accountTypeEl.value : 'patient';

      setLoading(submitEl, true);

      try {
        const result = await CareSync.auth.register({
          name:        nameEl  ? nameEl.value.trim()  : '',
          email:       emailEl ? emailEl.value.trim() : '',
          phone:       phoneEl ? phoneEl.value.trim() : '',
          password:    passEl  ? passEl.value         : '',
          accountType
        });

        showAlert(alertEl, 'Account created! Redirecting to your dashboard…', 'success');
        setTimeout(() => {
          window.location.href = CareSync.auth.getRoleRedirect(result.user.role);
        }, 1200);

      } catch (err) {
        setLoading(submitEl, false);
        const msg = (err && err.message) || 'Registration failed. Please try again.';
        showAlert(alertEl, msg, 'error');
      }
    });

    // Blur validation for all standard fields
    form.querySelectorAll('input[data-label], select[data-label]').forEach(el => {
      el.addEventListener('blur', () => CareSync.forms.check(el));
    });
  }

  // ─── Boot ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initRegister();
  });

}());
