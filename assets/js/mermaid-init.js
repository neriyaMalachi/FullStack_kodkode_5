import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.esm.min.mjs';

(() => {
  const elements = Array.from(document.querySelectorAll('.mermaid'));
  if (!elements.length) {
    return;
  }

  // Store original content
  elements.forEach((ele) => {
    ele.setAttribute('data-mermaid-src', ele.innerHTML);
  });

  const resetElements = () => {
    return new Promise((resolve) => {
      elements.forEach((ele) => {
        ele.innerHTML = ele.getAttribute('data-mermaid-src') || '';
        ele.removeAttribute('data-processed');
      });
      resolve();
    });
  };

  const getTheme = () => {
    const theme = document.documentElement.getAttribute('data-bs-theme');
    return theme === 'dark' ? 'dark' : 'default';
  };

  // Larger base font + useMaxWidth:false so diagrams render at their natural
  // (bigger) size instead of auto-shrinking to fit the content column; the
  // .mermaid-scroll wrapper already handles horizontal overflow on narrow
  // screens, so it's safe to let diagrams be wider than the column.
  const init = (theme) => {
    mermaid.initialize({
      theme,
      themeVariables: { fontSize: '19px' },
      flowchart: { useMaxWidth: false, htmlLabels: true },
      sequence: { useMaxWidth: false, actorFontSize: 16, messageFontSize: 16, noteFontSize: 15 },
      classDiagram: { useMaxWidth: false },
      stateDiagram: { useMaxWidth: false },
      gitGraph: { useMaxWidth: false },
      er: { useMaxWidth: false, fontSize: 16 },
    });
    mermaid.run({ nodes: elements });
  };

  // Initial render
  init(getTheme());

  // Listen for theme changes
  document.addEventListener('themeChanged', () => {
    resetElements()
      .then(() => init(getTheme()))
      .catch(console.error);
  });
})();
