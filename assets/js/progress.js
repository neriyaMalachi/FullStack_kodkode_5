// Client-side, localStorage-only progress tracking — no server, no accounts.
// One browser = one student's progress. Every read/write of localStorage
// goes through the functions in this first section; nothing else in the
// file (or the rest of the site) touches localStorage directly.

const STORAGE_KEY = "courseProgress:v1";

function getAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function save(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Quota exceeded / private browsing — fail silently rather than break
    // the click that triggered this.
  }
}

function isComplete(id) {
  return Object.prototype.hasOwnProperty.call(getAll(), id);
}

function markComplete(id) {
  const all = getAll();
  all[id] = new Date().toISOString();
  save(all);
}

function markIncomplete(id) {
  const all = getAll();
  delete all[id];
  save(all);
}

function toggle(id) {
  if (isComplete(id)) {
    markIncomplete(id);
  } else {
    markComplete(id);
  }
}

function getStats(ids) {
  const all = getAll();
  const completed = ids.filter((id) => Object.prototype.hasOwnProperty.call(all, id)).length;
  return { completed, total: ids.length };
}

function resetAll() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// --- DOM painting — reads current storage state, updates the page. Safe to
// call on every page even when a given piece of UI isn't present there
// (querySelectorAll on a missing selector is just an empty, harmless loop).

function paintToggleButtons() {
  document.querySelectorAll(".lesson-complete-toggle").forEach((btn) => {
    const id = btn.getAttribute("data-lesson");
    if (!id) return;
    const done = isComplete(id);
    btn.classList.toggle("is-complete", done);
    btn.setAttribute("aria-pressed", String(done));
    const label = btn.querySelector(".lesson-complete-label");
    if (label) label.textContent = done ? "נלמד" : "סמן כנלמד";
  });
}

function paintIndicators() {
  document.querySelectorAll("[data-lesson]:not(.lesson-complete-toggle)").forEach((el) => {
    const id = el.getAttribute("data-lesson");
    if (!id) return;
    const done = isComplete(id);
    el.classList.toggle("is-complete", done);
    const li = el.closest("li");
    if (li) li.classList.toggle("is-complete", done);
  });
}

function paintTopicCounts() {
  document.querySelectorAll(".topic-accordion-count[data-topic-lessons]").forEach((el) => {
    const ids = el.getAttribute("data-topic-lessons").split(",").filter(Boolean);
    const { completed, total } = getStats(ids);
    const textEl = el.querySelector(".topic-accordion-count-text");
    if (textEl) textEl.textContent = `${completed}/${total} שיעורים`;
  });
}

function paintCourseSummary() {
  document.querySelectorAll(".course-progress-summary[data-all-lessons]").forEach((el) => {
    const ids = el.getAttribute("data-all-lessons").split(",").filter(Boolean);
    const { completed, total } = getStats(ids);
    const textEl = el.querySelector(".course-progress-text");
    if (textEl) textEl.textContent = `${completed} / ${total} שיעורים הושלמו`;
    const fillEl = el.querySelector(".course-progress-bar-fill");
    if (fillEl) fillEl.style.width = total ? `${(completed / total) * 100}%` : "0%";
  });
}

function paintLessonPageSummary() {
  document.querySelectorAll(".lesson-page-progress[data-all-lessons]").forEach((el) => {
    const ids = el.getAttribute("data-all-lessons").split(",").filter(Boolean);
    const { completed, total } = getStats(ids);
    const textEl = el.querySelector(".lesson-page-progress-text");
    if (textEl) textEl.textContent = `${completed} / ${total} שיעורים הושלמו בקורס`;
  });
}

// Single re-paint entry point — called once on load, and again after every
// toggle/reset, so every surface (lesson-page button, sidebar checkmark,
// hub counts, hub row highlight, overall bar) stays in sync live with no
// page reload, even though most pages only contain a subset of this UI.
function repaintAll() {
  paintToggleButtons();
  paintIndicators();
  paintTopicCounts();
  paintCourseSummary();
  paintLessonPageSummary();
}

function initToggleButtons() {
  document.querySelectorAll(".lesson-complete-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-lesson");
      if (!id) return;
      toggle(id);
      repaintAll();
    });
  });
}

function initResetButton() {
  document.querySelectorAll(".lesson-reset-progress").forEach((btn) => {
    btn.addEventListener("click", () => {
      const confirmed = window.confirm(
        "לאפס את כל ההתקדמות שנשמרה בדפדפן זה? הפעולה לא ניתנת לביטול.",
      );
      if (!confirmed) return;
      resetAll();
      repaintAll();
    });
  });
}

function initProgress() {
  initToggleButtons();
  initResetButton();
  repaintAll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initProgress);
} else {
  initProgress();
}
