// Admin panel — gated by an emailed one-time code (see api/admin-request-code.js
// + api/admin-verify-code.js), which starts a 12h admin session (HttpOnly
// cookie). Then live "who's online now" + a management table (filter, add,
// inline edit, delete — see api/admin-manage.js) of every registered
// student. Polls /api/admin-stats every few seconds once unlocked so the
// online list stays current without a manual refresh.
// Also wires the show/hide-password eye toggle (same pattern as auth-form.js).

const POLL_MS = 4000;

function initPasswordToggles(root = document) {
  root.querySelectorAll('.auth-toggle-password').forEach((btn) => {
    if (btn.dataset.wired) return;
    btn.dataset.wired = '1';
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

// Visual "this is actually loading" feedback on a button click — spinner
// replaces the label, disabled so it can't be double-clicked. dataset
// stores the original label so it comes back correctly afterward.
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

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' });
}

function buildProgressCell(completed, total) {
  const td = document.createElement('td');
  if (!total) {
    td.innerHTML = '<span class="text-body-secondary small">—</span>';
    return td;
  }
  const pct = Math.round((completed / total) * 100);
  const wrap = document.createElement('div');
  wrap.style.minWidth = '110px';
  const text = document.createElement('div');
  text.className = 'small mb-1';
  text.textContent = `${completed}/${total} (${pct}%)`;
  const bar = document.createElement('div');
  bar.className = 'course-progress-bar';
  bar.style.margin = '0';
  const fill = document.createElement('div');
  fill.className = 'course-progress-bar-fill';
  fill.style.width = `${pct}%`;
  bar.appendChild(fill);
  wrap.appendChild(text);
  wrap.appendChild(bar);
  td.appendChild(wrap);
  return td;
}

function initAdmin() {
  const loginWrap = document.getElementById('admin-login-wrap');
  const results = document.getElementById('admin-results');
  if (!loginWrap || !results) return;

  const requestStep = document.getElementById('admin-request-step');
  const requestBtn = document.getElementById('admin-request-btn');
  const verifyForm = document.getElementById('admin-verify-form');
  const codeInput = document.getElementById('admin-code');
  const verifyBtn = document.getElementById('admin-verify-btn');
  const resendBtn = document.getElementById('admin-resend-btn');
  const errorEl = document.getElementById('admin-error');
  const summaryEl = document.getElementById('admin-summary');
  const rowsEl = document.getElementById('admin-rows');
  const filterInput = document.getElementById('admin-filter');
  const statusFilter = document.getElementById('admin-status-filter');
  const progressFilter = document.getElementById('admin-progress-filter');
  const sortSelect = document.getElementById('admin-sort');
  const actionMsg = document.getElementById('admin-action-msg');
  const addForm = document.getElementById('admin-add-form');
  const addEmailInput = document.getElementById('admin-add-email');
  const addPasswordInput = document.getElementById('admin-add-password');
  const addBtn = document.getElementById('admin-add-btn');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const totalLessons = Number(results.dataset.totalLessons || 0);

  let pollTimer = null;
  let latestStudents = [];
  let latestOnline = [];
  let editingUserId = null;

  function showActionMsg(text, kind) {
    actionMsg.textContent = text;
    actionMsg.className = `alert alert-${kind} py-2 small`;
    setTimeout(() => actionMsg.classList.add('d-none'), 4000);
  }

  async function call(body) {
    return fetch('/api/admin-manage', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  async function fetchStats() {
    return fetch('/api/admin-stats', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  function applyData(data) {
    latestStudents = data.students || [];
    latestOnline = data.online || [];
    renderRows();
  }

  function renderRows() {
    const filterText = (filterInput.value || '').trim().toLowerCase();
    const onlineSet = new Set(latestOnline);

    let filtered = filterText ? latestStudents.filter((s) => s.email.toLowerCase().includes(filterText)) : latestStudents.slice();

    if (statusFilter.value === 'online') {
      filtered = filtered.filter((s) => onlineSet.has(s.email));
    } else if (statusFilter.value === 'offline') {
      filtered = filtered.filter((s) => !onlineSet.has(s.email));
    }

    if (progressFilter.value !== 'all' && totalLessons) {
      filtered = filtered.filter((s) => {
        const count = s.progress_count || 0;
        if (progressFilter.value === 'none') return count === 0;
        if (progressFilter.value === 'done') return count >= totalLessons;
        return count > 0 && count < totalLessons; // 'started'
      });
    }

    const sortKey = sortSelect.value;
    filtered.sort((a, b) => {
      if (sortKey === 'progress') return (b.progress_count || 0) - (a.progress_count || 0);
      if (sortKey === 'visit_count') return (b.visit_count || 0) - (a.visit_count || 0);
      if (sortKey === 'email') return a.email.localeCompare(b.email);
      return (b.last_seen || '').localeCompare(a.last_seen || ''); // 'last_seen', newest first
    });

    const onlineCount = latestStudents.filter((s) => onlineSet.has(s.email)).length;
    summaryEl.textContent =
      filtered.length === latestStudents.length
        ? `${latestStudents.length} סטודנטים רשומים · ${onlineCount} מחוברים כרגע`
        : `${filtered.length} מתוך ${latestStudents.length} סטודנטים · ${onlineCount} מחוברים כרגע`;

    rowsEl.innerHTML = '';
    for (const s of filtered) {
      rowsEl.appendChild(s.id === editingUserId ? buildEditRow(s) : buildViewRow(s, onlineSet.has(s.email)));
    }
    if (editingUserId) initPasswordToggles(rowsEl);
  }

  function buildViewRow(s, isOnline) {
    const tr = document.createElement('tr');
    if (isOnline) tr.classList.add('table-warning');

    const emailTd = document.createElement('td');
    emailTd.textContent = s.email;
    tr.appendChild(emailTd);

    const countTd = document.createElement('td');
    countTd.textContent = s.visit_count;
    tr.appendChild(countTd);

    const lastTd = document.createElement('td');
    lastTd.textContent = formatDate(s.last_seen);
    tr.appendChild(lastTd);

    const statusTd = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `badge fw-normal ${isOnline ? 'text-bg-warning' : 'text-bg-secondary'}`;
    badge.textContent = isOnline ? 'מחובר' : 'לא מחובר';
    statusTd.appendChild(badge);
    tr.appendChild(statusTd);

    tr.appendChild(buildProgressCell(s.progress_count || 0, totalLessons));

    const actionsTd = document.createElement('td');
    actionsTd.className = 'd-flex gap-2';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'btn btn-sm btn-outline-secondary';
    editBtn.textContent = 'עריכה';
    editBtn.addEventListener('click', () => {
      editingUserId = s.id;
      renderRows();
    });
    actionsTd.appendChild(editBtn);

    const logBtn = document.createElement('button');
    logBtn.type = 'button';
    logBtn.className = 'btn btn-sm btn-outline-info';
    logBtn.textContent = 'לוגים';
    logBtn.setAttribute('data-bs-toggle', 'modal');
    logBtn.setAttribute('data-bs-target', '#admin-log-modal');
    logBtn.dataset.userId = s.id;
    logBtn.dataset.userEmail = s.email;
    actionsTd.appendChild(logBtn);

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'btn btn-sm btn-outline-danger';
    delBtn.textContent = 'מחיקה';
    delBtn.addEventListener('click', async () => {
      if (!confirm(`למחוק את ${s.email}? הפעולה בלתי הפיכה.`)) return;
      setBtnLoading(delBtn, true);
      try {
        const res = await call({ action: 'delete', userId: s.id });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'error');
        applyData(data);
        showActionMsg(`${s.email} נמחק`, 'success');
      } catch {
        showActionMsg('שגיאה במחיקה, נסו שוב', 'danger');
        setBtnLoading(delBtn, false);
      }
    });
    actionsTd.appendChild(delBtn);

    tr.appendChild(actionsTd);
    return tr;
  }

  function buildEditRow(s) {
    const tr = document.createElement('tr');

    const emailTd = document.createElement('td');
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.className = 'form-control form-control-sm';
    emailInput.value = s.email;
    emailTd.appendChild(emailInput);
    tr.appendChild(emailTd);

    const countTd = document.createElement('td');
    countTd.textContent = s.visit_count;
    tr.appendChild(countTd);

    const lastTd = document.createElement('td');
    lastTd.textContent = formatDate(s.last_seen);
    tr.appendChild(lastTd);

    const passTd = document.createElement('td');
    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group input-group-sm';
    const passInput = document.createElement('input');
    passInput.type = 'password';
    passInput.className = 'form-control form-control-sm';
    passInput.placeholder = 'סיסמה חדשה (אופציונלי)';
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'btn btn-outline-secondary auth-toggle-password';
    toggleBtn.innerHTML =
      '<svg class="auth-eye-open" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path><circle cx="12" cy="12" r="3"></circle></svg>' +
      '<svg class="auth-eye-closed d-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.8 21.8 0 0 1 5.06-6.06M9.9 4.24A10.4 10.4 0 0 1 12 4c7 0 11 8 11 8a21.8 21.8 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>';
    inputGroup.appendChild(passInput);
    inputGroup.appendChild(toggleBtn);
    passTd.appendChild(inputGroup);
    tr.appendChild(passTd);

    tr.appendChild(buildProgressCell(s.progress_count || 0, totalLessons));

    const actionsTd = document.createElement('td');
    actionsTd.className = 'd-flex gap-2';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-sm btn-primary';
    saveBtn.textContent = 'שמירה';
    saveBtn.addEventListener('click', async () => {
      const newEmail = emailInput.value.trim();
      const newPassword = passInput.value;
      setBtnLoading(saveBtn, true);
      try {
        const res = await call({
          action: 'update',
          userId: s.id,
          email: newEmail !== s.email ? newEmail : undefined,
          newPassword: newPassword || undefined,
        });
        const data = await res.json();
        if (!res.ok) {
          showActionMsg(data.error === 'email_taken' ? 'האימייל כבר תפוס' : 'שגיאה בשמירה', 'danger');
          setBtnLoading(saveBtn, false);
          return;
        }
        editingUserId = null;
        applyData(data);
        showActionMsg('העדכון נשמר', 'success');
      } catch {
        showActionMsg('שגיאה בשמירה, נסו שוב', 'danger');
        setBtnLoading(saveBtn, false);
      }
    });
    actionsTd.appendChild(saveBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-sm btn-outline-secondary';
    cancelBtn.textContent = 'ביטול';
    cancelBtn.addEventListener('click', () => {
      editingUserId = null;
      renderRows();
    });
    actionsTd.appendChild(cancelBtn);

    tr.appendChild(actionsTd);
    return tr;
  }

  function startPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(async () => {
      if (editingUserId) return; // don't yank the row out from under an in-progress edit
      try {
        const res = await fetchStats();
        if (!res.ok) return;
        applyData(await res.json());
      } catch {
        // ignore transient poll failures
      }
    }, POLL_MS);
  }

  filterInput.addEventListener('input', renderRows);
  statusFilter.addEventListener('change', renderRows);
  progressFilter.addEventListener('change', renderRows);
  sortSelect.addEventListener('change', renderRows);

  addForm.addEventListener('submit', async () => {
    const email = addEmailInput.value.trim();
    const newPassword = addPasswordInput.value;
    if (!email || newPassword.length < 6) {
      showActionMsg('נא למלא אימייל וסיסמה (6+ תווים)', 'danger');
      return;
    }
    setBtnLoading(addBtn, true);
    try {
      const res = await call({ action: 'add', email, newPassword });
      const data = await res.json();
      if (!res.ok) {
        showActionMsg(data.error === 'email_taken' ? 'כבר קיים חשבון עם אימייל זה' : 'שגיאה בהוספה', 'danger');
        return;
      }
      applyData(data);
      addForm.reset();
      showActionMsg(`${email} נוסף בהצלחה`, 'success');
    } catch {
      showActionMsg('שגיאה בהוספה, נסו שוב', 'danger');
    } finally {
      setBtnLoading(addBtn, false);
    }
  });

  function showError(text) {
    errorEl.textContent = text;
    errorEl.classList.remove('d-none');
  }

  async function requestCode(btn) {
    setBtnLoading(btn, true);
    errorEl.classList.add('d-none');
    try {
      const res = await fetch('/api/admin-request-code', { method: 'POST', credentials: 'same-origin' });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        showError(
          data.error === 'hourly_limit'
            ? 'נשלחו יותר מדי קודים בשעה האחרונה — נסו שוב מאוחר יותר'
            : 'קוד כבר נשלח לפני רגע — המתינו קצת לפני שמבקשים קוד נוסף',
        );
        return;
      }
      if (!res.ok) throw new Error('server error');

      requestStep.classList.add('d-none');
      verifyForm.classList.remove('d-none');
      codeInput.focus();
    } catch {
      showError('שגיאה בשליחת הקוד, נסו שוב');
    } finally {
      setBtnLoading(btn, false);
    }
  }

  requestBtn.addEventListener('click', () => requestCode(requestBtn));
  resendBtn.addEventListener('click', () => requestCode(resendBtn));

  verifyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = codeInput.value.trim();
    if (!code) return;

    setBtnLoading(verifyBtn, true);
    errorEl.classList.add('d-none');

    try {
      const verifyRes = await fetch('/api/admin-verify-code', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (verifyRes.status === 401) {
        showError('קוד שגוי או שפג תוקפו — שלחו קוד חדש');
        setBtnLoading(verifyBtn, false);
        return;
      }
      if (!verifyRes.ok) throw new Error('server error');

      const statsRes = await fetchStats();
      if (!statsRes.ok) throw new Error('server error');

      applyData(await statsRes.json());
      loginWrap.classList.add('d-none');
      results.classList.remove('d-none');
      startPolling();
    } catch {
      showError('שגיאה בטעינת הנתונים, נסו שוב');
      setBtnLoading(verifyBtn, false);
    }
  });

  logoutBtn.addEventListener('click', async () => {
    if (pollTimer) clearInterval(pollTimer);
    try {
      await fetch('/api/admin-logout', { method: 'POST', credentials: 'same-origin' });
    } catch {
      // ignore
    }
    location.reload();
  });

  // Per-student visit log — populated only when the modal is actually
  // opened (via a "לוגים" button's data-bs-toggle="modal"), never rendered
  // up front for every student.
  function formatDuration(seconds) {
    if (seconds === null || seconds === undefined) return 'עדיין בעמוד / לא ידוע';
    if (seconds < 60) return `${seconds} שניות`;
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) return `${minutes} דקות`;
    const hours = Math.floor(minutes / 60);
    const remMinutes = minutes % 60;
    return `${hours} שעות ${remMinutes} דקות`;
  }

  const logModal = document.getElementById('admin-log-modal');
  const logModalTitle = document.getElementById('admin-log-modal-title');
  const logModalBody = document.getElementById('admin-log-modal-body');

  function renderLogModal(visits) {
    if (!visits.length) {
      logModalBody.innerHTML = '<p class="text-body-secondary mb-0">אין עדיין נתוני ביקורים לסטודנט הזה.</p>';
      return;
    }
    const table = document.createElement('table');
    table.className = 'table table-sm table-hover align-middle';
    table.innerHTML = '<thead><tr><th>עמוד</th><th>זמן כניסה</th><th>משך זמן בעמוד</th></tr></thead>';
    const tbody = document.createElement('tbody');
    [...visits].reverse().forEach((v) => {
      const tr = document.createElement('tr');
      const pathTd = document.createElement('td');
      pathTd.className = 'text-break small';
      pathTd.textContent = v.path;
      const timeTd = document.createElement('td');
      timeTd.className = 'small';
      timeTd.textContent = formatDate(v.visited_at);
      const durTd = document.createElement('td');
      durTd.className = 'small';
      durTd.textContent = formatDuration(v.duration_seconds);
      tr.appendChild(pathTd);
      tr.appendChild(timeTd);
      tr.appendChild(durTd);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    logModalBody.innerHTML = '';
    logModalBody.appendChild(table);
  }

  logModal.addEventListener('show.bs.modal', async (event) => {
    const btn = event.relatedTarget;
    const userId = Number(btn.dataset.userId);
    logModalTitle.textContent = `יומן פעילות — ${btn.dataset.userEmail}`;
    logModalBody.innerHTML = '<div class="text-center py-4"><span class="spinner-border" role="status" aria-hidden="true"></span></div>';

    try {
      const res = await fetch('/api/admin-visit-log', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error('server error');
      const data = await res.json();
      renderLogModal(data.visits || []);
    } catch {
      logModalBody.innerHTML = '<div class="alert alert-danger mb-0">שגיאה בטעינת היומן</div>';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggles();
    initAdmin();
  });
} else {
  initPasswordToggles();
  initAdmin();
}
