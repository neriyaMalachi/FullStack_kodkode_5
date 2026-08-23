// Docs sidebar category accordion: opening one <details> section (e.g.
// "Git", "Server") closes any other open section at the same level, so at
// most one stays expanded at a time. Native <details> elements have no
// built-in group behavior — each one toggles independently by default —
// so this listens for the "toggle" event and closes true siblings only
// (via :scope, matched under the shared parent <ul>), which keeps separate
// nesting levels/branches independent if the tree ever grows deeper.

function closeSiblingDetails(details) {
  const list = details.parentElement && details.parentElement.parentElement;
  if (!list) return;
  list.querySelectorAll(":scope > li > details").forEach((sibling) => {
    if (sibling !== details && sibling.open) sibling.open = false;
  });
}

function initSidebarAccordion() {
  document.querySelectorAll(".docs-links details").forEach((details) => {
    details.addEventListener("toggle", () => {
      if (details.open) closeSiblingDetails(details);
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSidebarAccordion);
} else {
  initSidebarAccordion();
}
