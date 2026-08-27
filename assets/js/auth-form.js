// Login/signup form handler — shared by content/login.md and content/signup.md
// (layouts/auth/single.html), which render the same markup with a
// data-auth-mode of "login" or "signup" on #auth-card.
//
// Login stays a single step (email+password -> session, via api/session.js).
// Signup is two steps: step 1 (email+password) requests a verification code
// by email (api/signup.js, action "request-code") instead of creating the
// account directly; step 2 confirms that code (action "verify-code"), which
// is the only place the real account actually gets created.
//
// Also wires the show/hide-password eye toggle on every password/code field.

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
  const msg = document.getElementById('auth-msg');
  const stepRequest = document.getElementById('auth-step-request');
  const submitBtn = document.getElementById('auth-submit');
  const emailInput = document.getElementById('auth-email');
  const passwordInput = document.getElementById('auth-password');
  const password2Input = document.getElementById('auth-password2');

  // Already logged in? skip straight through.
  fetch('/api/session', { credentials: 'same-origin' })
    .then((res) => {
      if (res.ok) redirectAfterLogin();
    })
    .catch(() => {});

  if (mode === 'login') {
    initLogin({ msg, submitBtn, emailInput, passwordInput });
  } else {
    initSignup({ msg, stepRequest, submitBtn, emailInput, passwordInput, password2Input });
  }
}

function initLogin({ msg, submitBtn, emailInput, passwordInput }) {
  const form = document.getElementById('auth-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    (async () => {
      setBtnLoading(submitBtn, true);
      msg.classList.add('d-none');

      try {
        const res = await fetch('/api/session', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'login', email: emailInput.value.trim(), password: passwordInput.value }),
        });

        if (res.status === 401) {
          showMsg(msg, 'אימייל או סיסמה שגויים', 'danger');
          setBtnLoading(submitBtn, false);
          return;
        }
        if (!res.ok) {
          showMsg(msg, 'שגיאה, נסו שוב', 'danger');
          setBtnLoading(submitBtn, false);
          return;
        }

        showSuccessThenRedirect(msg, 'התחברת בהצלחה! מעביר אותך פנימה…');
      } catch {
        showMsg(msg, 'שגיאת תקשורת, נסו שוב', 'danger');
        setBtnLoading(submitBtn, false);
      }
    })();
  });
}

function initSignup({ msg, stepRequest, submitBtn, emailInput, passwordInput, password2Input }) {
  const form = document.getElementById('auth-form');
  const stepVerify = document.getElementById('auth-step-verify');
  const codeInput = document.getElementById('auth-verify-code');
  const verifyBtn = document.getElementById('auth-verify-btn');
  const resendBtn = document.getElementById('auth-resend-btn');

  // Kept from step 1 so "resend" and step 2 don't need the user to retype
  // anything — the account isn't created until the code round-trips.
  let pendingEmail = null;
  let pendingPassword = null;

  async function requestCode(btn) {
    setBtnLoading(btn, true);
    msg.classList.add('d-none');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-code', email: pendingEmail, password: pendingPassword }),
      });

      if (res.status === 429) {
        showMsg(msg, 'קוד כבר נשלח לפני רגע — המתינו קצת לפני שמבקשים קוד נוסף', 'danger');
        return false;
      }
      if (res.status === 409) {
        showMsg(msg, 'כבר קיים חשבון עם אימייל זה', 'danger');
        return false;
      }
      if (!res.ok) {
        showMsg(msg, 'שגיאה בשליחת הקוד, נסו שוב', 'danger');
        return false;
      }

      return true;
    } catch {
      showMsg(msg, 'שגיאת תקשורת, נסו שוב', 'danger');
      return false;
    } finally {
      setBtnLoading(btn, false);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    (async () => {
      if (passwordInput.value !== password2Input.value) {
        showMsg(msg, 'הסיסמאות לא תואמות', 'danger');
        return;
      }

      pendingEmail = emailInput.value.trim();
      pendingPassword = passwordInput.value;

      const ok = await requestCode(submitBtn);
      if (!ok) return;

      stepRequest.classList.add('d-none');
      stepVerify.classList.remove('d-none');
      codeInput.focus();
    })();
  });

  resendBtn.addEventListener('click', () => requestCode(resendBtn));

  verifyBtn.addEventListener('click', () => {
    (async () => {
      const code = codeInput.value.trim();
      if (!code) return;

      setBtnLoading(verifyBtn, true);
      msg.classList.add('d-none');

      try {
        const res = await fetch('/api/signup', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'verify-code', email: pendingEmail, code }),
        });

        if (res.status === 401) {
          showMsg(msg, 'קוד שגוי או שפג תוקפו — שלחו קוד חדש', 'danger');
          setBtnLoading(verifyBtn, false);
          return;
        }
        if (res.status === 409) {
          showMsg(msg, 'כבר קיים חשבון עם אימייל זה', 'danger');
          setBtnLoading(verifyBtn, false);
          return;
        }
        if (!res.ok) {
          showMsg(msg, 'שגיאה, נסו שוב', 'danger');
          setBtnLoading(verifyBtn, false);
          return;
        }

        showSuccessThenRedirect(msg, 'נרשמת בהצלחה! מעביר אותך פנימה…');
      } catch {
        showMsg(msg, 'שגיאת תקשורת, נסו שוב', 'danger');
        setBtnLoading(verifyBtn, false);
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
