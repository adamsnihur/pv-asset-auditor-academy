/** Native links retain browser history, keyboard behavior and no-JS access. */
export function initializeAcademyNavigation(root = document) {
  const header = root.querySelector('[data-academy-header]');
  if (!header) return;
  const links = [...header.querySelectorAll('nav a')];
  const sections = links.map((link) => root.getElementById(link.hash.slice(1)));
  let scheduled = false;

  function update() {
    scheduled = false;
    const boundary = header.getBoundingClientRect().bottom + 64;
    let active = -1;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top <= boundary) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  function revealReference(hash) {
    let target;
    try { target = root.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return; }
    const reference = target?.closest('details.reference-library');
    if (reference) reference.open = true;
    return reference ? target : null;
  }

  root.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a[href^="#"]');
    if (anchor) revealReference(anchor.hash);
  });
  window.addEventListener('hashchange', () => {
    const target = revealReference(window.location.hash);
    target?.scrollIntoView({ behavior: 'instant', block: 'start' });
    scheduleUpdate();
  });
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });
  const initialTarget = revealReference(window.location.hash);
  if (initialTarget) requestAnimationFrame(() => initialTarget.scrollIntoView({ behavior: 'instant' }));
  update();
}
