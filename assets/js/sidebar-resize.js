// Desktop-only drag-to-resize for the docs sidebar (the column itself is
// d-none below the lg breakpoint, so this never runs on mobile). Width is
// remembered in localStorage — purely local, same account-free pattern as
// assets/js/progress.js — so it stays put across page loads and navigation.

const WIDTH_STORAGE_KEY = "docsSidebarWidth";
const MIN_WIDTH = 220;
const MAX_WIDTH = 560;

function getSavedWidth() {
  try {
    const raw = localStorage.getItem(WIDTH_STORAGE_KEY);
    const parsed = raw ? parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveWidth(px) {
  try {
    localStorage.setItem(WIDTH_STORAGE_KEY, String(px));
  } catch {
    // quota exceeded / private browsing — fine to just not persist
  }
}

function applyWidth(sidebar, px) {
  const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, px));
  sidebar.style.setProperty("--sidebar-width", `${clamped}px`);
  return clamped;
}

function initSidebarResize() {
  const sidebar = document.querySelector(".docs-sidebar");
  const handle = document.querySelector(".docs-sidebar-resize-handle");
  if (!sidebar || !handle) return;

  const saved = getSavedWidth();
  if (saved) applyWidth(sidebar, saved);

  let dragging = false;
  let startX = 0;
  let startWidth = 0;

  handle.addEventListener("mousedown", (event) => {
    dragging = true;
    startX = event.clientX;
    startWidth = sidebar.getBoundingClientRect().width;
    handle.classList.add("is-dragging");
    document.body.style.userSelect = "none";
    event.preventDefault();
  });

  document.addEventListener("mousemove", (event) => {
    if (!dragging) return;
    // The sidebar sits on the visual right in this RTL layout, with the
    // handle on its left (inline-end) edge — dragging left (negative
    // deltaX) should widen it, dragging right should narrow it.
    const deltaX = event.clientX - startX;
    applyWidth(sidebar, startWidth - deltaX);
  });

  document.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;
    handle.classList.remove("is-dragging");
    document.body.style.userSelect = "";
    saveWidth(Math.round(sidebar.getBoundingClientRect().width));
  });

  // Double-click resets to the theme's default width.
  handle.addEventListener("dblclick", () => {
    sidebar.style.removeProperty("--sidebar-width");
    try {
      localStorage.removeItem(WIDTH_STORAGE_KEY);
    } catch {
      // ignore
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSidebarResize);
} else {
  initSidebarResize();
}
