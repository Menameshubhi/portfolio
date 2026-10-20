/* Reusable UI pieces shared by the world (app.js) and the style guide:
   icons, placeholder handling, project card, carousel, empty state. */
(function () {
  'use strict';

  const ICONS = {
    map: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z"/><path d="M9 4v14M15 6v14"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    soundOn: '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/>',
    soundOff: '<path d="M4 9v6h4l5 4V5L8 9H4Z"/><path d="m17 9 5 5m0-5-5 5"/>',
    motion: '<path d="M2 12c2.5-5 4.5-5 7 0s4.5 5 7 0 3.5-4 6-2"/>',
    motionOff: '<path d="M3 12h18"/><path d="M8 8v8M16 8v8"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    arrowLeft: '<path d="M19 12H5m6-6-6 6 6 6"/>',
    arrowRight: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
    external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    download: '<path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
    pointer: '<path d="M5 3l14 7-6 2-2 6-6-15Z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/>',
    brush: '<path d="M18 3l3 3-9 9-3-3 9-9Z"/><path d="M9 12c-3 0-5 2-5 5 0 1-1 2-2 2 2 2 7 2 9-1 1-1.5 1-3 1-3"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Z"/><path d="M4 19a2 2 0 0 1 2-2h13"/>',
    plant: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 8-7 0 5-3 7-8 7ZM12 14c0-3-2-5-7-5 0 4 2 5 7 5Z"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4V8Z"/><circle cx="12" cy="13" r="3.5"/>',
    plane: '<path d="M3 11l18-7-7 18-3-8-8-3Z"/>',
    coffee: '<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M12 3v2"/>',
    sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    hammer: '<path d="M14 6l4 4M3 21l9-9M12 4l6 6-3 3-6-6 3-3Z"/>'
  };

  const icon = (name, cls = '') =>
    `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ''}</svg>`;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  // Escapes text and styles every [bracketed] segment as a visible placeholder.
  const txt = (s) => esc(s).replace(/\[([^\]]+)\]/g, '<span class="ph">$1</span>');
  const plain = (s) => String(s ?? '').replace(/[[\]]/g, '');

  function media(src, alt, caption) {
    if (src) return `<img src="${esc(src)}" alt="${esc(alt || '')}" loading="lazy" decoding="async">`;
    return `<div class="ph-media" role="img" aria-label="Image placeholder${caption ? ': ' + esc(plain(caption)) : ''}">
      ${icon('image')}<span>Image placeholder</span></div>`;
  }

  const chips = (list) => (list && list.length)
    ? `<ul class="chips">${list.map((s) => `<li>${txt(s)}</li>`).join('')}</ul>` : '';

  function metrics(list) {
    if (!list || !list.length) return '';
    return `<div class="metrics-wrap"><h4 class="mini-head">${icon('sparkle')} Impact</h4>
      <ul class="metrics">${list.map((m) => `<li><strong>${txt(m.value)}</strong><span>${txt(m.label)}</span></li>`).join('')}</ul></div>`;
  }

  function projectCard(p, i, n, idPrefix = 'pcard') {
    const pad = (x) => String(x).padStart(2, '0');
    return `<article class="pcard" id="${idPrefix}" role="tabpanel" aria-labelledby="${idPrefix}-title" tabindex="-1">
      <div class="pcard-media">${media(p.image, p.imageAlt, p.title)}</div>
      <div class="pcard-body">
        <p class="eyebrow">Project ${pad(i + 1)} / ${pad(n)}</p>
        <h3 class="pcard-title" id="${idPrefix}-title">${txt(p.title)}</h3>
        <p class="pcard-desc">${txt(p.description)}</p>
        <dl class="facts">
          ${p.role ? `<div class="fact"><dt>${icon('user')} My role</dt><dd>${txt(p.role)}</dd></div>` : ''}
          ${p.skills && p.skills.length ? `<div class="fact"><dt>${icon('sparkle')} Skills</dt><dd>${chips(p.skills)}</dd></div>` : ''}
        </dl>
        ${metrics(p.metrics)}
        ${p.caseStudyUrl ? `<a class="btn btn-primary" href="${esc(p.caseStudyUrl)}" target="_blank" rel="noopener">
          Read the case study ${icon('external')}<span class="sr-only">(opens in a new tab)</span></a>` : ''}
      </div>
    </article>`;
  }

  function emptyState(title, text, ic = 'hammer') {
    return `<div class="empty">${icon(ic)}<h3>${esc(title)}</h3><p>${esc(text)}</p></div>`;
  }

  function carousel({ id, title, label, items }) {
    if (!items || !items.length) {
      return `<section class="carousel" aria-labelledby="${id}-title"><div class="carousel-head"><h3 id="${id}-title">${esc(title)}</h3></div>
        ${emptyState('Nothing here yet', `New ${label}s will be added soon.`, 'image')}</section>`;
    }
    const n = items.length;
    return `<section class="carousel" aria-roledescription="carousel" aria-labelledby="${id}-title">
      <div class="carousel-head">
        <h3 id="${id}-title">${esc(title)}</h3>
        <div class="carousel-ctrls">
          <button type="button" class="btn icon-btn sm" data-dir="-1" aria-controls="${id}-track" aria-label="Previous ${esc(label)}">${icon('arrowLeft')}</button>
          <span class="carousel-count" aria-live="polite">1 / ${n}</span>
          <button type="button" class="btn icon-btn sm" data-dir="1" aria-controls="${id}-track" aria-label="Next ${esc(label)}">${icon('arrowRight')}</button>
        </div>
      </div>
      <ul class="carousel-track" id="${id}-track" tabindex="0" aria-label="${esc(title)}, use arrow keys to scroll">
        ${items.map((it, i) => `<li class="slide" aria-roledescription="slide" aria-label="${i + 1} of ${n}">
          <figure>${media(it.image, it.alt, it.title)}
            <figcaption><strong>${txt(it.title)}</strong>${it.caption ? `<span>${txt(it.caption)}</span>` : ''}</figcaption>
          </figure></li>`).join('')}
      </ul>
    </section>`;
  }

  function initCarousels(root, reduced) {
    root.querySelectorAll('.carousel').forEach((c) => {
      const track = c.querySelector('.carousel-track');
      if (!track) return;
      const slides = [...track.children];
      const count = c.querySelector('.carousel-count');
      const [prev, next] = c.querySelectorAll('[data-dir]');
      const index = () => {
        let best = 0, bd = Infinity;
        slides.forEach((s, i) => { const d = Math.abs(s.offsetLeft - track.scrollLeft); if (d < bd) { bd = d; best = i; } });
        return best;
      };
      const update = () => {
        const i = index();
        count.textContent = `${i + 1} / ${slides.length}`;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      };
      const go = (dir) => {
        const i = Math.max(0, Math.min(slides.length - 1, index() + dir));
        track.scrollTo({ left: slides[i].offsetLeft, behavior: reduced() ? 'auto' : 'smooth' });
      };
      prev.addEventListener('click', () => go(-1));
      next.addEventListener('click', () => go(1));
      track.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      });
      let raf = 0;
      track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
      update();
    });
  }

  window.UI = { icon, esc, txt, plain, media, chips, metrics, projectCard, emptyState, carousel, initCarousels };
})();
