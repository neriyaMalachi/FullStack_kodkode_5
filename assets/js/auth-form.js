// Login/signup form handler — shared by content/login.md and content/signup.md
// (layouts/auth/single.html), which render the same markup with a
// data-auth-mode of "login" or "signup" on #auth-card.
// Also wires the show/hide-password eye toggle on every password field.

function initPasswordToggles() {
  document.querySelectorAll('.auth-toggle-password').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.input-group').querySelector('input');
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.querySelector('.auth-eye-open').classList.toggle('d-none', !showing);
      btn.querySelector('.auth-eye-closed').classList.toggle('d-none', showing);
      btn.setAttribute('aria-label', showing ? 'הצג סיסמה' : 'הסתר סיסמה');
    });
  });
}

function showMsg(el, text, kind) {
  el.textContent = text;
  el.className = `alert alert-${kind}`;
}

// Visual "this is actually loading" feedback on a button click — spinner
// replaces the label, disabled so it can't be double-submitted. dataset
// stores the original label so it comes back correctly on error/reset.
function setBtnLoading(btn, loading) {
  if (loading) {
    btn.dataset.label = btn.dataset.label || btn.textContent;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  } else {
    btn.disabled = false;
    btn.textContent = btn.dataset.label || btn.textContent;
  }
}

function redirectAfterLogin() {
  const params = new URLSearchParams(location.search);
  location.href = params.get('redirect') || '/';
}

function showSuccessThenRedirect(msg, text) {
  showMsg(msg, text, 'success');
  setTimeout(redirectAfterLogin, 900);
}

function initForm() {
  const card = document.getElementById('auth-card');
  if (!card) return;

  const mode = card.dataset.authMode;
  const form = document.getElementById('auth-form');
  const msg = document.getElementById('auth-msg');
  const submitBtn = document.getElementById('auth-submit');
  const emailInput = document.getElementById('auth-email');
  const passwordInput = document.getElementById('auth-password');
  const password2Input = document.getElementById('auth-password2');

  // Already logged in? skip straight through.
  fetch('/api/me', { credentials: 'same-origin' })
    .then((res) => {
      if (res.ok) redirectAfterLogin();
    })
    .catch(() => {});

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    (async () => {
      try {
        if (mode === 'signup' && passwordInput.value !== password2Input.value) {
          showMsg(msg, 'הסיסמאות לא תואמות', 'danger');
          return;
        }

        setBtnLoading(submitBtn, true);
        msg.classList.add('d-none');

        const payload = {
          email: emailInput.value.trim(),
          password: passwordInput.value,
        };

        const endpoint = mode === 'signup' ? '/api/signup' : '/api/login';

        const res = await fetch(endpoint, {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (mode === 'signup' && res.status === 409) {
          showMsg(msg, 'כבר קיים חשבון עם אימייל זה', 'danger');
          setBtnLoading(submitBtn, false);
          return;
        }

        if (mode === 'login' && res.status === 401) {
          showMsg(msg, 'אימייל או סיסמה שגויים', 'danger');
          setBtnLoading(submitBtn, false);
          return;
        }

        if (!res.ok) {
          showMsg(msg, 'שגיאה, נסו שוב', 'danger');
          setBtnLoading(submitBtn, false);
          return;
        }

        showSuccessThenRedirect(msg, mode === 'signup' ? 'נרשמת בהצלחה! מעביר אותך פנימה…' : 'התחברת בהצלחה! מעביר אותך פנימה…');
      } catch {
        showMsg(msg, 'שגיאת תקשורת, נסו שוב', 'danger');
        setBtnLoading(submitBtn, false);
      }
    })();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggles();
    initForm();
  });
} else {
  initPasswordToggles();
  initForm();
}
