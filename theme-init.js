// Apply the initial theme before the stylesheet can paint the page.
(() => {
  let theme;
  try {
    theme = localStorage.getItem('comfyclub-theme');
  } catch (_) {
    // Storage may be unavailable in private browsing or local-file previews.
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  document.documentElement.dataset.theme = theme;
})();
