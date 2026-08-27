// Admin panel — gated by an emailed one-time code (api/admin-auth.js,
// actions "request-code"/"verify-code"), which starts a 12h admin session
// (HttpOnly cookie). Then live "who's online now" + a management table
// (filter, add, inline edit, delete, per-student visit log — all via
// api/admin-data.js) of every registered student. Polls for stats every few
// seconds once unlocked so the online list stays current without a manual
// refresh.
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

// The server stores timestamps as SQLite's `datetime('now')` output — UTC,
// but formatted as "YYYY-MM-DD HH:MM:SS" with no timezone marker. Handing
// that straight to `new Date()` gets it silently parsed as LOCAL time
// instead of UTC (off by the browser's UTC offset — this is what made
// visit-log times look wrong). Converting to real ISO-8601 ("...THH:MM:SSZ")
// first makes `new Date()` treat it as UTC, so toLocaleString then correctly
// converts to the viewer's own timezone.
function parseServerDate(iso) {
  return new Date(iso.replace(' ', 'T') + 'Z');
}

function formatDate(iso) {
  if (!iso) return '—';
  return parseServerDate(iso).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' });
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

// { pathTitles, categoryTotals } embedded at build time (layouts/admin/single.html)
// — pathTitles so the visit log can show a readable lesson name instead of a
// raw URL, categoryTotals (per-category lesson counts) so the per-topic
// learning breakdown can compute coverage percentages.
function getAdminMeta() {
  try {
    const el = document.getElementById('admin-meta');
    return el ? JSON.parse(el.textContent) : { pathTitles: {}, categoryTotals: {} };
  } catch {
    return { pathTitles: {}, categoryTotals: {} };
  }
}

// A lesson path looks like "/docs/javascript/8-js-objects-content/" — this
// pulls out "/docs/javascript/", matching how categoryTotals is keyed
// (by the category page's own RelPermalink). Non-lesson paths (homepage,
// /login/, etc.) return null — they don't belong to any topic.
function categoryKeyOf(path) {
  const m = path.match(/^(\/docs\/[^/]+\/)/);
  return m ? m[1] : null;
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
  const { pathTitles, categoryTotals } = getAdminMeta();

  let pollTimer = null;
  let latestStudents = [];
  let latestOnline = [];
  let editingUserId = null;

  function showActionMsg(text, kind) {
    actionMsg.textContent = text;
    actionMsg.className = `alert alert-${kind} py-2 small`;
    setTimeout(() => actionMsg.classList.add('d-none'), 4000);
  }

  async function manage({ action: manageAction, ...rest }) {
    return fetch('/api/admin-data', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'manage', manageAction, ...rest }),
    });
  }

  async function fetchStats() {
    return fetch('/api/admin-data', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'stats' }),
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
        const res = await manage({ action: 'delete', userId: s.id });
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
        const res = await manage({
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

  function unlockPanel(data) {
    applyData(data);
    loginWrap.classList.add('d-none');
    results.classList.remove('d-none');
    startPolling();
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
      const res = await manage({ action: 'add', email, newPassword });
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
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request-code' }),
      });

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
      const verifyRes = await fetch('/api/admin-auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-code', code }),
      });

      if (verifyRes.status === 401) {
        showError('קוד שגוי או שפג תוקפו — שלחו קוד חדש');
        setBtnLoading(verifyBtn, false);
        return;
      }
      if (!verifyRes.ok) throw new Error('server error');

      const statsRes = await fetchStats();
      if (!statsRes.ok) throw new Error('server error');

      unlockPanel(await statsRes.json());
    } catch {
      showError('שגיאה בטעינת הנתונים, נסו שוב');
      setBtnLoading(verifyBtn, false);
    }
  });

  logoutBtn.addEventListener('click', async () => {
    if (pollTimer) clearInterval(pollTimer);
    try {
      await fetch('/api/admin-auth', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
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

  // Groups this student's visits + completed-lesson marks by topic
  // (category), against how many lessons that topic actually has, so the
  // admin can see "knows this well / barely touched that" per subject
  // instead of just a flat visit list.
  function buildCategoryAnalysis(visits, completedLessonIds) {
    const completedSet = new Set(completedLessonIds || []);
    const visitedByCategory = new Map();
    const completedByCategory = new Map();

    visits.forEach((v) => {
      const key = categoryKeyOf(v.path);
      if (!key) return;
      if (!visitedByCategory.has(key)) visitedByCategory.set(key, new Set());
      visitedByCategory.get(key).add(v.path);
    });

    completedSet.forEach((path) => {
      const key = categoryKeyOf(path);
      if (!key) return;
      completedByCategory.set(key, (completedByCategory.get(key) || 0) + 1);
    });

    const allKeys = new Set([...Object.keys(categoryTotals), ...visitedByCategory.keys()]);
    const rows = [...allKeys]
      .map((key) => ({
        key,
        title: pathTitles[key] || key,
        visitedCount: visitedByCategory.has(key) ? visitedByCategory.get(key).size : 0,
        completedCount: completedByCategory.get(key) || 0,
        total: categoryTotals[key] || 0,
      }))
      .filter((row) => row.total > 0); // only real topics we can measure coverage for

    rows.sort((a, b) => a.visitedCount / a.total - b.visitedCount / b.total); // weakest first
    return rows;
  }

  function insightFor(row) {
    if (row.visitedCount === 0) return 'לא נגע בכלל בנושא הזה';
    const visitPct = row.visitedCount / row.total;
    if (row.completedCount === 0) return 'עיין בחומר אבל עדיין לא סימן אף שיעור כ"נלמד"';
    if (visitPct >= 0.9 && row.completedCount >= row.total * 0.8) return 'שולט היטב בנושא — כיסה כמעט הכל וסימן את רוב השיעורים כנלמדים';
    if (visitPct < 0.34) return 'רק התחיל להכיר את הנושא';
    return 'באמצע הלמידה של הנושא';
  }

  function renderAnalysisSection(rows) {
    if (!rows.length) return null;
    const wrap = document.createElement('div');
    wrap.className = 'mb-4';
    const heading = document.createElement('h3');
    heading.className = 'h6 mb-3';
    heading.textContent = 'ניתוח למידה לפי נושא';
    wrap.appendChild(heading);

    rows.forEach((row) => {
      const pct = Math.round((row.visitedCount / row.total) * 100);
      const rowWrap = document.createElement('div');
      rowWrap.className = 'mb-3';

      const label = document.createElement('div');
      label.className = 'd-flex justify-content-between small mb-1';
      const nameSpan = document.createElement('span');
      nameSpan.className = 'fw-semibold';
      nameSpan.textContent = row.title;
      const countSpan = document.createElement('span');
      countSpan.className = 'text-body-secondary';
      countSpan.textContent = `${row.visitedCount}/${row.total} ביקר · ${row.completedCount} סומנו כנלמדים`;
      label.appendChild(nameSpan);
      label.appendChild(countSpan);

      const bar = document.createElement('div');
      bar.className = 'course-progress-bar';
      bar.style.margin = '0 0 4px';
      const fill = document.createElement('div');
      fill.className = 'course-progress-bar-fill';
      fill.style.width = `${pct}%`;
      bar.appendChild(fill);

      const insightEl = document.createElement('div');
      insightEl.className = 'small text-body-secondary';
      insightEl.textContent = insightFor(row);

      rowWrap.appendChild(label);
      rowWrap.appendChild(bar);
      rowWrap.appendChild(insightEl);
      wrap.appendChild(rowWrap);
    });

    return wrap;
  }

  const logModal = document.getElementById('admin-log-modal');
  const logModalTitle = document.getElementById('admin-log-modal-title');
  const logModalBody = document.getElementById('admin-log-modal-body');

  function renderLogModal(visits, completedLessonIds) {
    logModalBody.innerHTML = '';

    const analysisEl = renderAnalysisSection(buildCategoryAnalysis(visits, completedLessonIds));
    if (analysisEl) logModalBody.appendChild(analysisEl);

    if (!visits.length) {
      const p = document.createElement('p');
      p.className = 'text-body-secondary mb-0';
      p.textContent = 'אין עדיין נתוני ביקורים לסטודנט הזה.';
      logModalBody.appendChild(p);
      return;
    }

    const logHeading = document.createElement('h3');
    logHeading.className = 'h6 mb-2';
    logHeading.textContent = 'יומן ביקורים מפורט';
    logModalBody.appendChild(logHeading);

    const table = document.createElement('table');
    table.className = 'table table-sm table-hover align-middle';
    table.innerHTML = '<thead><tr><th>נושא</th><th>זמן כניסה</th><th>משך זמן בעמוד</th></tr></thead>';
    const tbody = document.createElement('tbody');
    [...visits].reverse().forEach((v) => {
      const tr = document.createElement('tr');
      const pathTd = document.createElement('td');
      pathTd.className = 'text-break small';
      pathTd.textContent = pathTitles[v.path] || v.path;
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
    logModalBody.appendChild(table);
  }

  logModal.addEventListener('show.bs.modal', async (event) => {
    const btn = event.relatedTarget;
    const userId = Number(btn.dataset.userId);
    logModalTitle.textContent = `יומן פעילות — ${btn.dataset.userEmail}`;
    logModalBody.innerHTML = '<div class="text-center py-4"><span class="spinner-border" role="status" aria-hidden="true"></span></div>';

    try {
      const res = await fetch('/api/admin-data', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'visit-log', userId }),
      });
      if (!res.ok) throw new Error('server error');
      const data = await res.json();
      renderLogModal(data.visits || [], data.completedLessonIds || []);
    } catch {
      logModalBody.innerHTML = '<div class="alert alert-danger mb-0">שגיאה בטעינת היומן</div>';
    }
  });

  // Admin sessions last 12h server-side (see _auth.js) — but without this
  // check the panel always demanded a fresh code on every page load/refresh
  // regardless of whether the existing cookie was still valid, which is
  // what actually made it feel like it "disconnects too fast". Silently
  // try the existing session first; only fall back to the code screen if
  // there really isn't one.
  fetchStats()
    .then((res) => (res.ok ? res.json().then(unlockPanel) : null))
    .catch(() => {});
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
