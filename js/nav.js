async function injectNav(placeholder) {
  const src = placeholder.getAttribute('data-nav-src') || 'partials/nav.html';
  const base = placeholder.getAttribute('data-nav-base') || '.';
  try {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to fetch navigation from ${src}`);
    }
    const html = await response.text();
    placeholder.innerHTML = html;

    const nav = placeholder.querySelector('nav');
    if (nav) {
      const normalizedBase = base === '.' ? '' : base.replace(/\/$/, '') + '/';
      nav.querySelectorAll('a[data-href]').forEach((link) => {
        const target = link.getAttribute('data-href');
        if (!target) {
          return;
        }
        const fullPath = `${normalizedBase}${target}`.replace(/\/\/+/, '/');
        link.setAttribute('href', fullPath);
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function initNavInjection() {
  const placeholders = document.querySelectorAll('[data-include-nav]');
  placeholders.forEach((placeholder) => {
    injectNav(placeholder);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavInjection);
} else {
  initNavInjection();
}
