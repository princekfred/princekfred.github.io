/* Optional enhancements only: theme switch and enlarged gallery photos.
   Page navigation and gallery display work without JavaScript. */
(() => {
  const root = document.documentElement;
  const button = document.querySelector('[data-theme-toggle]');
  const meta = document.querySelector('meta[name="theme-color"]');
  let stored = null;
  try { stored = localStorage.getItem('pfk-theme'); } catch (_) { /* Storage may be disabled. */ }

  function updateTheme(theme) {
    root.setAttribute('data-theme', theme);
    button?.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    if (meta) meta.content = theme === 'dark' ? '#111923' : '#fbfaf7';
  }
  updateTheme(stored === 'light' ? 'light' : 'dark');
  button?.addEventListener('click', () => {
    const theme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    updateTheme(theme);
    try { localStorage.setItem('pfk-theme', theme); } catch (_) { /* Ignore. */ }
  });

  const dialog = document.getElementById('lightbox');
  const expanded = document.getElementById('lightbox-photo');
  const caption = document.getElementById('lightbox-caption');
  document.querySelectorAll('a[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (!dialog || typeof dialog.showModal !== 'function' || !expanded) return;
      event.preventDefault();
      expanded.src = link.getAttribute('href');
      expanded.alt = link.querySelector('img')?.alt ?? 'Gallery photograph';
      if (caption) caption.textContent = link.closest('figure')?.querySelector('figcaption strong')?.textContent ?? '';
      dialog.showModal();
    });
  });
  document.querySelector('[data-lightbox-close]')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
