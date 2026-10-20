/* Optional enhancements: theme switch, enlarged gallery photos, and home slideshow.
   Page navigation and gallery display work without JavaScript. */
(() => {
  const root = document.documentElement;
  root.classList.add('has-js');

  const menuButton = document.querySelector('[data-menu-toggle]');
  const siteNav = document.getElementById('site-nav');
  if (menuButton && siteNav) {
    function setMenuOpen(open) {
      siteNav.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menuButton.textContent = open ? 'Close' : 'Menu';
    }

    menuButton.addEventListener('click', () => {
      setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    siteNav.addEventListener('click', event => {
      if (event.target.closest('a')) setMenuOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        menuButton.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.getComputedStyle(menuButton).display === 'none') setMenuOpen(false);
    });
  }

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

  const slideshow = document.querySelector('[data-home-slideshow]');
  if (slideshow) {
    const slides = [...slideshow.querySelectorAll('[data-slide]')];
    const dots = [...document.querySelectorAll('[data-slide-dot]')];
    const slideCaption = document.querySelector('[data-slide-caption]');
    const slideDetail = document.querySelector('[data-slide-detail]');
    const slideCount = document.querySelector('[data-slide-count]');
    const toggle = document.querySelector('[data-slide-toggle]');
    const toggleLabel = document.querySelector('[data-slide-toggle-label]');
    const motion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let current = Math.max(0, slides.findIndex(slide => slide.classList.contains('is-active')));
    let userPaused = false;
    let userPlayed = false;
    let hovering = slideshow.matches(':hover');
    let focusWithin = slideshow.contains(document.activeElement);
    let timer = null;

    function renderSlide() {
      slides.forEach((slide, index) => {
        const active = index === current;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        slide.inert = !active;
      });
      dots.forEach((dot, index) => {
        const active = index === current;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-current', String(active));
      });
      if (slideCaption) slideCaption.textContent = slides[current]?.dataset.caption ?? '';
      if (slideDetail) slideDetail.textContent = slides[current]?.dataset.detail ?? '';
      if (slideCount) slideCount.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
      slides[(current + 1) % slides.length]?.querySelector('img[loading="lazy"]')?.setAttribute('loading', 'eager');
    }

    function scheduleSlide() {
      if (timer !== null) window.clearTimeout(timer);
      timer = null;
      if (slides.length < 2 || userPaused || (!userPlayed && (hovering || focusWithin)) || document.hidden || motion?.matches) return;
      timer = window.setTimeout(() => showSlide(current + 1), 5500);
    }

    function showSlide(index) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      renderSlide();
      scheduleSlide();
    }

    document.querySelector('[data-slide-prev]')?.addEventListener('click', () => showSlide(current - 1));
    document.querySelector('[data-slide-next]')?.addEventListener('click', () => showSlide(current + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));
    toggle?.addEventListener('click', () => {
      userPaused = !userPaused;
      userPlayed = !userPaused;
      toggle.setAttribute('aria-label', userPaused ? 'Play photo slideshow' : 'Pause photo slideshow');
      if (toggleLabel) toggleLabel.textContent = userPaused ? 'Play' : 'Pause';
      scheduleSlide();
    });
    if (toggle) {
      toggle.setAttribute('aria-label', 'Pause photo slideshow');
    }
    slideshow.addEventListener('mouseenter', () => { hovering = true; scheduleSlide(); });
    slideshow.addEventListener('mouseleave', () => { hovering = false; scheduleSlide(); });
    slideshow.addEventListener('focusin', () => { focusWithin = true; scheduleSlide(); });
    slideshow.addEventListener('focusout', event => {
      focusWithin = slideshow.contains(event.relatedTarget);
      scheduleSlide();
    });
    document.addEventListener('visibilitychange', scheduleSlide);
    if (motion?.addEventListener) motion.addEventListener('change', scheduleSlide);
    else motion?.addListener?.(scheduleSlide);
    if (slides.length) renderSlide();
    scheduleSlide();
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
