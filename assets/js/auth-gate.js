// Real auth gate — every course page requires a logged-in session (our own
// /api/session + SQLite, not a 3rd party). No session -> redirect to /login/.
// With a session -> log this visit, send periodic heartbeats so /admin can
// show "online now", and reveal the logged-in-as/logout slot in the navbar
// (layouts/_partials/header/header.html, #auth-navbar-slot — hidden by
// default since the theme's header renders server-side with no knowledge of
// login state).
// Never breaks the page: every request is wrapped and failures are swallowed.

const HEARTBEAT_MS = 20000;

async function getMe() {
  try {
    const res = await fetch('/api/session', { credentials: 'same-origin' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function showNavbarAuthSlot(email) {
  const slot = document.getElementById('auth-navbar-slot');
  if (!slot) return;

  const emailSpan = document.createElement('span');
  emailSpan.className = 'text-body-secondary small';
  emailSpan.textContent = email;

  const logoutBtn = document.createElement('button');
  logoutBtn.type = 'button';
  logoutBtn.className = 'btn btn-link nav-link p-0';
  logoutBtn.textContent = 'התנתקות';
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch('/api/session', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch {
      // ignore
    }
    location.href = '/login/';
  });

  slot.appendChild(emailSpan);
  slot.appendChild(logoutBtn);
  slot.classList.remove('d-none');
  slot.classList.add('d-flex');
}

function track() {
  fetch('/api/activity', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'track', path: location.pathname }),
    keepalive: true,
  }).catch(() => {});
}

function startHeartbeat() {
  setInterval(() => {
    fetch('/api/activity', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'heartbeat' }),
    }).catch(() => {});
  }, HEARTBEAT_MS);
}

async function init() {
  const me = await getMe();

  if (!me) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    location.href = `/login/?redirect=${redirect}`;
    return;
  }

  track();
  startHeartbeat();
  showNavbarAuthSlot(me.email);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
