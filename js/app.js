/* Shubhangi's World — map, character movement, building states, windows,
   directory, sound, reduced motion and deep links. No build step needed. */
(function () {
  'use strict';

  const P = window.PORTFOLIO, Art = window.Art, UI = window.UI;
  const { icon, esc, txt } = UI;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  /* ------------------------------------------------------------ Places */

  const ART_FOR = { 'visit-health': 'visitHealth', 'interview-kickstart': 'interviewKickstart', affixious: 'affixious' };
  const THEME_FOR = { 'visit-health': 'violet', 'interview-kickstart': 'blue', affixious: 'pink' };
  const WORK = P.workplaces.filter((w) => ART_FOR[w.id]);

  const PLACES = [
    { id: 'home', art: 'home', name: 'Shubhangi’s Home', kind: 'home', theme: 'coral', hint: 'About me, art and personal projects' },
    ...WORK.map((w) => ({ id: w.id, art: ART_FOR[w.id], name: w.name, kind: 'work', theme: THEME_FOR[w.id], hint: 'See the projects I worked on', data: w })),
    { id: 'future', art: 'future', name: 'Future workplace', kind: 'contact', theme: 'sun', hint: 'Contact me — let’s build what’s next' }
  ];
  const place = (id) => PLACES.find((p) => p.id === id);

  /* ----------------------------------------------------------- Layouts
     Each place has its base position and a path from the central plaza (hub)
     to its door; the character walks along these paths. "wide" is used for
     landscape screens, "tall" for portrait phones and tablets. */

  const LAYOUTS = {
    wide: {
      vb: [0, 0, 1600, 1000], hub: [800, 610], plaza: 80,
      places: {
        home: { x: 330, y: 800, d: 'M800 610 C790 800 560 840 330 840' },
        'visit-health': { x: 380, y: 430, d: 'M800 610 C700 520 560 470 380 470' },
        'interview-kickstart': { x: 800, y: 410, d: 'M800 610 L800 450' },
        affixious: { x: 1220, y: 430, d: 'M800 610 C900 520 1040 470 1220 470' },
        future: { x: 1250, y: 800, d: 'M800 610 C810 800 1040 840 1250 840' }
      },
      extraPaths: ['M800 610 L800 1400'],
      sign: [950, 1000],
      pond: [600, 712, 84, 36],
      trees: [[110, 250], [170, 430, 'dark'], [80, 640], [140, 950, 'blossom'], [590, 330, 'blossom'], [1010, 330], [1460, 260], [1520, 470, 'dark'], [1500, 690, 'blossom'], [1520, 940], [470, 985], [1120, 990, 'dark'], [1015, 665], [585, 590, 'plain']],
      pines: [[200, 150], [470, 140], [1110, 150], [1400, 140], [1330, 170], [60, 90], [1560, 110]],
      bushes: [[268, 814], [396, 814], [298, 446], [462, 446], [1140, 446], [1302, 446], [714, 424], [886, 424], [1098, 816], [1408, 816]],
      lamps: [[722, 548], [878, 548], [722, 700], [878, 700]],
      benches: [[915, 500]],
      rocks: [[520, 900], [1400, 610], [160, 760], [1030, 560]],
      flowers: [[480, 620], [1120, 640], [250, 530], [1360, 560], [690, 900], [560, 420], [1050, 410], [240, 900], [1450, 860], [900, 780]],
      butterflies: [[600, 560], [1060, 720]]
    },
    tall: {
      vb: [0, 0, 900, 1500], hub: [450, 860], plaza: 70,
      places: {
        'interview-kickstart': { x: 450, y: 540, d: 'M450 860 L450 580' },
        'visit-health': { x: 215, y: 790, d: 'M450 860 C380 845 300 830 215 830' },
        affixious: { x: 685, y: 790, d: 'M450 860 C520 845 600 830 685 830' },
        home: { x: 225, y: 1190, d: 'M450 860 C450 1080 360 1230 225 1230' },
        future: { x: 680, y: 1190, d: 'M450 860 C450 1080 545 1230 680 1230' }
      },
      extraPaths: ['M450 860 L450 1800'],
      sign: [235, 1440],
      pond: null,
      trees: [[90, 380], [810, 380, 'blossom'], [220, 300, 'dark'], [690, 280], [80, 640, 'blossom'], [830, 1430, 'dark'], [640, 1460], [60, 1480, 'blossom']],
      pines: [[120, 170], [780, 170], [330, 160], [580, 150]],
      bushes: [[160, 1204], [290, 1204], [380, 556], [520, 556], [130, 806], [300, 806], [600, 806], [770, 806]],
      lamps: [[395, 760], [505, 760], [385, 960], [515, 960]],
      benches: [],
      rocks: [[60, 900], [840, 900], [560, 1360]],
      flowers: [[350, 680], [560, 690], [120, 1080], [800, 1080], [450, 1340], [100, 1320], [780, 1320]],
      butterflies: [[300, 1000], [620, 1010]]
    }
  };

  /* ------------------------------------------------------------- State */

  const store = {
    get(k) { try { const v = localStorage.getItem('sw:' + k); return v === null ? null : JSON.parse(v); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem('sw:' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqTouch = window.matchMedia('(hover: none)');

  const state = {
    layout: null, L: null,
    pos: { x: 0, y: 0 }, at: 'home', facing: 'front',
    walkToken: 0, open: null, project: 0, selected: null,
    reduced: store.get('reduced') ?? mqReduce.matches,
    muted: store.get('muted') ?? true,
    returnFocus: null, interacted: false
  };

  const el = {};
  let charEl, entityEls = [], routeEls = {};

  /* ------------------------------------------------------------- Sound
     Tiny synthesized blips via Web Audio; muted by default. */

  const Sfx = {
    ctx: null,
    ensure() {
      if (state.muted) return null;
      if (!this.ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; this.ctx = new AC(); }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    },
    tone(freq, dur = 0.12, type = 'sine', vol = 0.06, delay = 0) {
      const ctx = this.ensure(); if (!ctx) return;
      const t = ctx.currentTime + delay, o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + 0.02);
    },
    step() {
      const ctx = this.ensure(); if (!ctx) return;
      const len = Math.floor(ctx.sampleRate * 0.05), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      f.type = 'lowpass'; f.frequency.value = 700 + Math.random() * 200; g.gain.value = 0.09;
      s.buffer = buf; s.connect(f).connect(g).connect(ctx.destination); s.start();
    },
    door() { this.tone(523, 0.14, 'triangle', 0.07); this.tone(784, 0.22, 'triangle', 0.06, 0.1); },
    open() { this.tone(660, 0.1, 'sine', 0.05); this.tone(990, 0.16, 'sine', 0.045, 0.07); },
    close() { this.tone(620, 0.09, 'sine', 0.05); this.tone(415, 0.14, 'sine', 0.045, 0.07); },
    tick() { this.tone(1400, 0.035, 'square', 0.012); }
  };

  /* --------------------------------------------------------- Helpers */

  function rng(seed) { return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  function worldMetrics(rect) {
    const [vx, vy, vw, vh] = state.L.vb;
    const s = Math.min(rect.width / vw, rect.height / vh);
    return { s, ox: rect.left + (rect.width - vw * s) / 2 - vx * s, oy: rect.top + (rect.height - vh * s) / 2 - vy * s };
  }
  // On-screen position of a world point (includes the current camera offset).
  function worldToScreen(x, y) {
    const m = worldMetrics(el.svg.getBoundingClientRect());
    return { x: m.ox + x * m.s, y: m.oy + y * m.s };
  }
  function screenToWorld(cx, cy) {
    const m = worldMetrics(el.svg.getBoundingClientRect());
    return { x: (cx - m.ox) / m.s, y: (cy - m.oy) / m.s };
  }

  const bEl = (id) => el.svg.querySelector(`.building[data-id="${id}"]`);
  function doorOf(id) {
    const r = routeEls[id], p = r.getPointAtLength(r.getTotalLength());
    return { x: p.x, y: p.y };
  }
  function sample(path) {
    const L = path.getTotalLength(), n = Math.max(2, Math.ceil(L / 6)), pts = [];
    for (let i = 0; i <= n; i++) { const p = path.getPointAtLength((L * i) / n); pts.push([p.x, p.y]); }
    return pts;
  }

  /* ------------------------------------------------------- Build world */

  function chooseLayout() {
    const r = el.world.getBoundingClientRect();
    return r.width / Math.max(1, r.height) < 0.95 ? 'tall' : 'wide';
  }

  function buildingMarkup(p, pos) {
    const m = Art.meta(p.art), hw = m.w / 2;
    return `<g class="building" data-id="${p.id}" data-y="${pos.y}" transform="translate(${pos.x} ${pos.y})"
        tabindex="0" role="button" aria-label="${esc(p.name)}: ${esc(p.hint)}">
      <rect class="b-hit" x="${-hw}" y="${m.top}" width="${m.w}" height="${-m.top + 24}" rx="20"/>
      <ellipse class="b-ring" cx="0" cy="8" rx="${hw + 6}" ry="30"/>
      <g class="b-art">${Art.building(p.art)}</g>
      <rect class="b-focus" x="${-hw - 12}" y="${m.top - 12}" width="${m.w + 24}" height="${-m.top + 52}" rx="24"/>
      <g class="b-marker" transform="translate(0 ${m.top - 14})"><g class="b-marker-inner">${Art.marker()}</g></g>
    </g>`;
  }

  const deco = (x, y, inner, cls = 'deco', s = 1) =>
    ({ y, html: `<g class="${cls}" data-y="${y}" transform="translate(${x} ${y})${s !== 1 ? ` scale(${s})` : ''}" aria-hidden="true">${inner}</g>` });

  function buildWorld() {
    const L = state.L = LAYOUTS[state.layout];
    const [vx, vy, vw, vh] = L.vb;
    el.svg.setAttribute('viewBox', L.vb.join(' '));
    const rand = rng(state.layout === 'wide' ? 7 : 11);

    const defs = `<defs><pattern id="grass" width="140" height="140" patternUnits="userSpaceOnUse">
        <rect width="140" height="140" fill="${Art.C.grass}"/>
        <circle cx="20" cy="30" r="3" fill="${Art.C.grassDark}" opacity=".5"/><circle cx="90" cy="16" r="2.5" fill="${Art.C.grassDark}" opacity=".5"/>
        <circle cx="64" cy="88" r="3" fill="${Art.C.grassDark}" opacity=".45"/><circle cx="118" cy="110" r="2.5" fill="#fff" opacity=".25"/>
        <circle cx="30" cy="118" r="2" fill="#fff" opacity=".25"/></pattern></defs>`;

    let ground = `${defs}<rect x="${vx - 3000}" y="${vy - 3000}" width="${vw + 6000}" height="${vh + 6000}" fill="url(#grass)"/>`;
    for (let i = 0; i < 70; i++) {
      ground += `<g transform="translate(${(vx - 300 + rand() * (vw + 600)).toFixed(0)} ${(vy - 200 + rand() * (vh + 400)).toFixed(0)})">${Art.tuft()}</g>`;
    }

    const paths = [...Object.values(L.places).map((p) => p.d), ...L.extraPaths];
    ground += `<g fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      ${paths.map((d) => `<path d="${d}" stroke="${Art.C.sandEdge}" stroke-width="56"/>`).join('')}
      ${paths.map((d) => `<path d="${d}" stroke="${Art.C.sand}" stroke-width="46"/>`).join('')}
      ${paths.map((d) => `<path d="${d}" stroke="#fff" stroke-opacity=".35" stroke-width="3" stroke-dasharray="2 22"/>`).join('')}
    </g>`;
    ground += `<g transform="translate(${L.hub[0]} ${L.hub[1]})" aria-hidden="true">${Art.plaza(L.plaza)}</g>`;
    if (L.pond) ground += `<g transform="translate(${L.pond[0]} ${L.pond[1]})" aria-hidden="true">${Art.pond(L.pond[2], L.pond[3])}</g>`;
    L.flowers.forEach(([x, y], i) => { ground += `<g transform="translate(${x} ${y})" aria-hidden="true">${Art.flowers(i)}</g>`; });
    L.rocks.forEach(([x, y]) => { ground += `<g transform="translate(${x} ${y})" aria-hidden="true">${Art.rock()}</g>`; });
    ground += `<g class="routes" fill="none" stroke="none">${Object.entries(L.places).map(([id, p]) => `<path data-route="${id}" d="${p.d}"/>`).join('')}</g>`;
    ground += '<g id="pings"></g>';

    const ents = [];
    PLACES.forEach((p) => { const pos = L.places[p.id]; if (pos) ents.push({ y: pos.y, html: buildingMarkup(p, pos) }); });
    L.trees.forEach(([x, y, v]) => ents.push(deco(x, y, Art.tree(v || 'fruit'))));
    L.pines.forEach(([x, y]) => ents.push(deco(x, y, Art.pine())));
    L.bushes.forEach(([x, y]) => ents.push(deco(x, y, Art.bush(), 'deco', 0.85)));
    L.lamps.forEach(([x, y]) => ents.push(deco(x, y, Art.lamp())));
    L.benches.forEach(([x, y]) => ents.push(deco(x, y, Art.bench())));
    ents.push({ y: L.sign[1], html: `<g class="signboard" data-y="${L.sign[1]}" transform="translate(${L.sign[0]} ${L.sign[1]})" tabindex="0" role="button" aria-label="How to explore — open the project directory">${Art.signboard()}</g>` });

    // A ring of trees outside the map so wide screens never show an edge.
    for (let gx = vx - 600; gx < vx + vw + 600; gx += 120) {
      for (let gy = vy - 500; gy < vy + vh + 500; gy += 120) {
        const x = gx + rand() * 70, y = gy + rand() * 70;
        const inside = x > vx + 30 && x < vx + vw - 30 && y > vy + 20 && y < vy + vh + 40;
        if (inside || rand() < 0.3) continue;
        const r = rand();
        ents.push(deco(x.toFixed(0), y.toFixed(0), r < 0.35 ? Art.pine() : Art.tree(r < 0.5 ? 'blossom' : r < 0.75 ? 'dark' : 'plain'), 'deco', 0.9 + rand() * 0.3));
      }
    }
    ents.push({ y: 0, html: `<g id="char" class="char face-front" aria-hidden="true">${Art.character()}</g>` });
    ents.sort((a, b) => a.y - b.y);

    const fx = L.butterflies.map(([x, y], i) => `<g transform="translate(${x} ${y})" aria-hidden="true"><g class="d-butterfly" style="animation-delay:${-i * 3}s">${Art.butterfly()}</g></g>`).join('');
    const clouds = [0, 1, 2].map((i) => `<ellipse class="d-cloud" style="animation-delay:${-i * 22}s" cx="${vx + vw * (0.2 + i * 0.3)}" cy="${vy + vh * (0.25 + (i % 2) * 0.4)}" rx="${vw * 0.16}" ry="${vw * 0.07}" fill="#23263A" opacity=".045"/>`).join('');

    el.svg.innerHTML = `${ground}<g id="entities">${ents.map((e) => e.html).join('')}</g>${fx}<g pointer-events="none" aria-hidden="true">${clouds}</g>`;

    charEl = $('#char', el.svg);
    entityEls = $$('#entities > [data-y]', el.svg).map((n) => ({ n, y: +n.dataset.y }));
    routeEls = {};
    $$('[data-route]', el.svg).forEach((p) => { routeEls[p.dataset.route] = p; });

    $$('.building', el.svg).forEach((b) => {
      b.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { showTip(b, false); Sfx.tick(); } });
      b.addEventListener('pointerleave', hideTip);
      b.addEventListener('focus', () => { if (b.matches(':focus-visible')) showTip(b, true); });
      b.addEventListener('blur', hideTip);
    });

    // Restore the character and building states after a layout switch.
    const id = state.at && routeEls[state.at] ? state.at : null;
    const p = id ? doorOf(id) : doorOf('home');
    if (!id) state.at = 'home';
    setCharPos(p.x, p.y);
    setFacing(state.open ? 'back' : 'front');
    if (state.selected) bEl(state.selected)?.classList.add('is-selected');
    if (state.open && bEl(state.open)) bEl(state.open).classList.add('is-open');
  }

  /* --------------------------------------------------------- Character */

  function setCharPos(x, y) {
    state.pos = { x, y };
    charEl.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    // Depth sort: draw the character in front of anything whose base is above her feet.
    const next = entityEls.find((e) => e.n !== charEl && e.y > y);
    const ref = next ? next.n : null;
    if (charEl.nextSibling !== ref) charEl.parentNode.insertBefore(charEl, ref);
  }

  function setFacing(f) {
    if (state.facing === f && charEl.classList.contains('face-' + (f === 'left' || f === 'right' ? 'side' : f))) return;
    state.facing = f;
    charEl.classList.remove('face-front', 'face-back', 'face-side');
    charEl.classList.add('face-' + (f === 'left' || f === 'right' ? 'side' : f));
    $('.view-side', charEl).setAttribute('transform', f === 'left' ? 'scale(-1 1)' : '');
  }

  function walk(points, token) {
    return new Promise((resolve) => {
      const cum = [0];
      for (let i = 1; i < points.length; i++) cum[i] = cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
      const total = cum[cum.length - 1];
      if (total < 2) { resolve(true); return; }
      const dur = Math.min(3200, Math.max(380, (total / 360) * 1000));
      charEl.classList.add('is-walking');
      let start = null, lastStep = 0, i = 1;
      const frame = (t) => {
        if (token !== state.walkToken) { charEl.classList.remove('is-walking'); resolve(false); return; }
        if (start === null) start = t;
        const k = Math.min(1, (t - start) / dur), d = k * total;
        while (i < cum.length - 1 && cum[i] < d) i++;
        const a = points[i - 1], b = points[i], f = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1);
        const x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f;
        const j = Math.min(points.length - 1, i + 3), dx = points[j][0] - x, dy = points[j][1] - y;
        if (Math.hypot(dx, dy) > 1) setFacing(Math.abs(dx) > Math.abs(dy) * 0.9 ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'front' : 'back'));
        setCharPos(x, y);
        if (t - lastStep > 270) { Sfx.step(); lastStep = t; }
        if (k < 1) requestAnimationFrame(frame);
        else { charEl.classList.remove('is-walking'); resolve(true); }
      };
      requestAnimationFrame(frame);
    });
  }

  function routeTo(id) {
    const target = sample(routeEls[id]);
    const here = [state.pos.x, state.pos.y];
    if (state.at === id) return [here, target[target.length - 1]];
    if (state.at && routeEls[state.at]) return [...sample(routeEls[state.at]).reverse(), ...target];
    // From a free spot: join the target path at its nearest point.
    let best = 0, bd = Infinity;
    target.forEach((p, i) => { const dd = (p[0] - here[0]) ** 2 + (p[1] - here[1]) ** 2; if (dd < bd) { bd = dd; best = i; } });
    return [here, ...target.slice(best)];
  }

  /* ---------------------------------------------------- Main journey */

  function setSelected(id) {
    $$('.building.is-selected, .building.is-approaching', el.svg).forEach((b) => b.classList.remove('is-selected', 'is-approaching'));
    state.selected = id;
    if (id) bEl(id)?.classList.add('is-selected');
  }

  async function goTo(id, opts = {}) {
    if (!place(id) || !routeEls[id]) return;
    markInteracted();
    hideTip(); say('');
    if (state.open) closePanel({ focus: false, quiet: true });
    if (el.dir.classList.contains('is-visible')) closeDirectory(false);
    setSelected(id);
    const token = ++state.walkToken;
    const b = bEl(id);
    state.returnFocus = opts.returnFocus || b;

    if (opts.direct || state.reduced) {
      const p = doorOf(id);
      setCharPos(p.x, p.y);
    } else {
      b.classList.add('is-approaching');
      const ok = await walk(routeTo(id), token);
      if (!ok) return;
      b.classList.remove('is-approaching');
    }
    state.at = id;
    setFacing('back');
    b.classList.add('is-open');
    Sfx.door();
    await wait(opts.direct || state.reduced ? 0 : 420);
    if (token !== state.walkToken) return;
    openPanel(id, opts.project || 0);
  }

  async function walkFree(pt) {
    markInteracted();
    if (state.open) { closePanel(); return; }
    hideTip(); say(''); setSelected(null);
    const [vx, vy, vw, vh] = state.L.vb;
    const x = Math.max(vx + 40, Math.min(vx + vw - 40, pt.x)), y = Math.max(vy + 120, Math.min(vy + vh - 20, pt.y));
    const ping = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    ping.setAttribute('transform', `translate(${x} ${y})`);
    ping.innerHTML = '<ellipse class="ping" rx="16" ry="7"/>';
    $('#pings', el.svg).appendChild(ping);
    setTimeout(() => ping.remove(), 700);
    const token = ++state.walkToken;
    state.at = null;
    if (state.reduced) setCharPos(x, y);
    else if (!(await walk([[state.pos.x, state.pos.y], [x, y]], token))) return;
    setFacing('front');
  }

  /* -------------------------------------------------------- Speech bubble */

  let sayTimer = 0;
  function say(text, ms = 3200) {
    clearTimeout(sayTimer);
    if (!text) { el.bubble.classList.remove('is-visible'); return; }
    el.bubble.textContent = text;
    el.bubble.classList.add('is-visible');
    if (ms) sayTimer = setTimeout(() => el.bubble.classList.remove('is-visible'), ms);
  }
  function followLoop() {
    if (el.bubble.classList.contains('is-visible') && charEl) {
      const p = worldToScreen(state.pos.x, state.pos.y - 100);
      const w = el.bubble.offsetWidth, h = el.bubble.offsetHeight;
      const x = Math.max(10, Math.min(innerWidth - w - 10, p.x - w / 2));
      el.bubble.style.setProperty('--arrow-x', `${Math.max(18, Math.min(w - 18, p.x - x))}px`);
      el.bubble.style.transform = `translate(${Math.round(x)}px, ${Math.round(p.y - h)}px)`;
    }
    requestAnimationFrame(followLoop);
  }

  /* ------------------------------------------------------------- Tooltip */

  function showTip(b, keyboard) {
    if (state.open === b.dataset.id) return;
    const p = place(b.dataset.id);
    el.tip.innerHTML = `<strong>${esc(p.name)}</strong><span>${esc(p.hint)}</span>
      <span class="tip-key">${keyboard ? '<kbd>Enter</kbd> to visit' : `${icon('pointer')} Click to visit`}</span>`;
    el.tip.hidden = false;
    const r = $('.b-art', b).getBoundingClientRect(), tw = el.tip.offsetWidth, th = el.tip.offsetHeight;
    const navB = el.nav.getBoundingClientRect().bottom;
    let x = r.left + r.width / 2 - tw / 2, y = r.top - th - 14;
    if (y < navB + 8) y = r.bottom + 10;
    x = Math.max(10, Math.min(innerWidth - tw - 10, x));
    el.tip.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    el.tip.classList.add('is-visible');
  }
  function hideTip() { el.tip.classList.remove('is-visible'); el.tip.hidden = true; }

  /* --------------------------------------------------------------- Camera
     Slides the world so the open building and the character stay visible
     beside (desktop) or above (mobile) the window. */

  const isSheet = () => window.matchMedia('(max-width: 759px)').matches;
  function updateCamera() {
    if (!state.open || !state.L.places[state.open]) { el.stage.style.transform = ''; return; }
    const base = el.world.getBoundingClientRect();
    const m = worldMetrics(base);
    const pos = state.L.places[state.open], meta = Art.meta(place(state.open).art);
    const wx = pos.x, wy = isSheet() ? pos.y + meta.top * 0.25 : pos.y + meta.top * 0.45;
    const sx = m.ox + wx * m.s, sy = m.oy + wy * m.s;
    const region = isSheet()
      ? { l: 0, r: innerWidth, t: base.top, b: el.panel.offsetTop }
      : { l: 0, r: el.panel.offsetLeft, t: base.top, b: base.bottom };
    const dx = (region.l + region.r) / 2 - sx, dy = (region.t + region.b) / 2 - sy;
    el.stage.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  }

  /* --------------------------------------------------------------- Panel */

  function panelHead(kicker, title, metaHtml) {
    return `<div class="panel-head-text">
        <p class="eyebrow">${kicker}</p>
        <h2 id="panel-title" tabindex="-1">${title}</h2>
        ${metaHtml ? `<p class="panel-meta">${metaHtml}</p>` : ''}
      </div>`;
  }

  function nextStop(id) {
    const order = PLACES.map((p) => p.id);
    const n = place(order[(order.indexOf(id) + 1) % order.length]);
    return `<button type="button" class="btn" data-go="${n.id}">Next stop: ${esc(n.name)} ${icon('arrowRight')}</button>`;
  }

  function panelFoot(id) {
    return `<div class="panel-foot">
      <button type="button" class="btn btn-quiet" data-close>${icon('arrowLeft')} Back to the world</button>
      ${nextStop(id)}</div>`;
  }

  function renderWork(p, idx) {
    const w = p.data, n = w.projects.length;
    el.panelHead.innerHTML = panelHead(`Workplace · ${String(WORK.indexOf(w) + 1).padStart(2, '0')}`, esc(w.name),
      `<span>${icon('briefcase')} ${txt(w.role)}</span><span>${icon('calendar')} ${txt(w.dates)}</span>`);
    if (!n) {
      el.panelBody.innerHTML = `<p class="lead">${txt(w.intro)}</p>
        ${UI.emptyState('Projects coming soon', 'Case studies from this chapter are being written up. Check back soon, or get in touch to hear about them.')}
        ${panelFoot(w.id)}`;
      return;
    }
    const tabs = w.projects.map((pr, i) => `<button type="button" role="tab" class="ptab" id="ptab-${i}" aria-controls="pcard"
        aria-selected="${i === idx}" tabindex="${i === idx ? 0 : -1}" data-project="${i}">
        <span class="ptab-num">${String(i + 1).padStart(2, '0')}</span><span class="ptab-label">${txt(pr.title)}</span></button>`).join('');
    el.panelBody.innerHTML = `<p class="lead">${txt(w.intro)}</p>
      ${n > 1 ? `<div class="ptabs" role="tablist" aria-label="Projects at ${esc(w.name)}">${tabs}</div>` : ''}
      <div class="pcard-slot">${UI.projectCard(w.projects[idx], idx, n)}</div>
      ${n > 1 ? `<div class="pager">
        <button type="button" class="btn" data-step="-1" ${idx === 0 ? 'disabled' : ''}>${icon('arrowLeft')} <span>Previous project</span></button>
        <span class="pager-count" aria-live="polite">Project ${idx + 1} of ${n}</span>
        <button type="button" class="btn" data-step="1" ${idx === n - 1 ? 'disabled' : ''}><span>Next project</span> ${icon('arrowRight')}</button>
      </div>` : ''}
      ${panelFoot(w.id)}`;
  }

  function showProject(i, focusTab) {
    const w = place(state.open).data, n = w.projects.length;
    i = Math.max(0, Math.min(n - 1, i));
    state.project = i;
    $('.pcard-slot', el.panelBody).innerHTML = UI.projectCard(w.projects[i], i, n);
    $$('.ptab', el.panelBody).forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
    const active = $(`#ptab-${i}`, el.panelBody);
    if (active) { active.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: state.reduced ? 'auto' : 'smooth' }); $('#pcard', el.panelBody).setAttribute('aria-labelledby', `ptab-${i}`); }
    if (focusTab && active) active.focus();
    const [prev, next] = $$('[data-step]', el.panelBody);
    if (prev) { prev.disabled = i === 0; next.disabled = i === n - 1; }
    const cnt = $('.pager-count', el.panelBody);
    if (cnt) cnt.textContent = `Project ${i + 1} of ${n}`;
    setHash(state.open, i);
    Sfx.tick();
  }

  function renderHome() {
    const h = P.home, person = P.person;
    el.panelHead.innerHTML = panelHead('Home · About me', 'Hi, I’m Shubhangi',
      `<span>${icon('briefcase')} ${esc(person.title)}</span><span>${icon('sparkle')} ${esc(person.experience)} of experience</span>`);
    const portrait = h.portrait
      ? `<img src="${esc(h.portrait)}" alt="Portrait of ${esc(person.name)}">`
      : `<svg viewBox="-34 -104 68 70" role="img" aria-label="Illustrated portrait of Shubhangi">${Art.viewFront()}</svg>`;
    el.panelBody.innerHTML = `
      <nav class="jump" aria-label="Sections in Home">
        ${[['about', 'About'], ['paintings', 'Paintings'], ['illustrations', 'Illustrations'], ['hobbies', 'Hobbies'], ['projects', 'Personal projects']]
          .map(([k, l]) => `<a class="chip-link" href="#home-${k}" data-jump="home-${k}">${l}</a>`).join('')}
      </nav>
      <section class="about" id="home-about" aria-labelledby="about-title">
        <div class="about-portrait">${portrait}</div>
        <div class="about-text">
          <h3 id="about-title">About me</h3>
          <p>${txt(h.about)}</p>
          <div class="btn-row">
            <a class="btn btn-primary" data-resume data-download href="#">${icon('download')} Download resume</a>
            <button type="button" class="btn" data-go="future" data-direct>${icon('mail')} Contact me</button>
          </div>
        </div>
      </section>
      <div id="home-paintings">${UI.carousel({ id: 'paintings', title: 'Paintings', label: 'painting', items: h.paintings })}</div>
      <div id="home-illustrations">${UI.carousel({ id: 'illustrations', title: 'Illustrations', label: 'illustration', items: h.illustrations })}</div>
      <section id="home-hobbies" aria-labelledby="hobbies-title">
        <h3 class="section-title" id="hobbies-title">Hobbies &amp; interests</h3>
        ${h.hobbies.length ? `<ul class="hobbies">${h.hobbies.map((x) => `<li class="hobby">${icon(x.icon || 'sparkle')}<strong>${txt(x.title)}</strong><span>${txt(x.text)}</span></li>`).join('')}</ul>`
          : UI.emptyState('Coming soon', 'Hobbies will be added here.', 'sparkle')}
      </section>
      <section id="home-projects" aria-labelledby="live-title">
        <h3 class="section-title" id="live-title">Live personal projects</h3>
        ${h.liveProjects.length ? `<ul class="live-grid">${h.liveProjects.map((x) => `<li class="live-card">
            <div class="live-media">${UI.media(x.image, x.imageAlt, x.title)}</div>
            <div class="live-body"><h4>${txt(x.title)}</h4><p>${txt(x.description)}</p>${UI.chips(x.tags)}
            ${x.url ? `<a class="btn btn-sm" href="${esc(x.url)}" target="_blank" rel="noopener">Visit project ${icon('external')}<span class="sr-only">(opens in a new tab)</span></a>` : ''}</div>
          </li>`).join('')}</ul>` : UI.emptyState('Coming soon', 'Personal projects will be added here.')}
      </section>
      ${panelFoot('home')}`;
    UI.initCarousels(el.panelBody, () => state.reduced);
  }

  function renderContact() {
    const person = P.person;
    el.panelHead.innerHTML = panelHead('Future workplace · Contact', esc(P.future.headline), '');
    const email = person.email
      ? `<li class="contact-row">${icon('mail')}<div><strong>Email</strong><a href="mailto:${esc(person.email)}">${esc(person.email)}</a></div>
          <button type="button" class="btn icon-btn sm" data-copy="${esc(person.email)}" aria-label="Copy email address">${icon('copy')}</button></li>`
      : `<li class="contact-row">${icon('mail')}<div><strong>Email</strong><span class="ph">Email address will be added here</span></div></li>`;
    const links = person.links.map((l) => l.url
      ? `<li class="contact-row">${icon('link')}<div><strong>${esc(l.label)}</strong><a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.url.replace(/^https?:\/\/(www\.)?/, ''))}<span class="sr-only"> (opens in a new tab)</span></a></div></li>`
      : `<li class="contact-row">${icon('link')}<div><strong>${esc(l.label)}</strong><span class="ph">Link will be added here</span></div></li>`).join('');
    el.panelBody.innerHTML = `
      <div class="contact-hero">
        <svg viewBox="-190 -290 380 310" aria-hidden="true">${Art.building('future')}</svg>
        <p class="lead">${txt(P.future.text)}</p>
      </div>
      <ul class="contact-list">${email}${links}</ul>
      <div class="btn-row">
        <a class="btn btn-primary" data-resume href="#">${icon('file')} View resume</a>
        ${person.email ? `<a class="btn" href="mailto:${esc(person.email)}">${icon('mail')} Email me</a>` : ''}
      </div>
      ${panelFoot('future')}`;
  }

  function openPanel(id, project = 0) {
    const p = place(id);
    state.open = id;
    el.panel.dataset.theme = p.theme;
    if (p.kind === 'work') { state.project = Math.max(0, Math.min(project, p.data.projects.length - 1 || 0)); renderWork(p, state.project); }
    else if (p.kind === 'home') renderHome();
    else renderContact();
    el.panelBody.scrollTop = 0;
    syncResumeLinks(el.panel);
    el.panel.hidden = false;
    void el.panel.offsetWidth;
    el.panel.classList.add('is-visible');
    document.body.classList.add('panel-open');
    Sfx.open();
    setHash(id, p.kind === 'work' ? state.project : null);
    requestAnimationFrame(updateCamera);
    $('#panel-title', el.panel).focus({ preventScroll: true });
  }

  let hideTimer = 0;
  function closePanel({ focus = true, quiet = false } = {}) {
    if (!state.open) return;
    const id = state.open;
    state.open = null;
    el.panel.classList.remove('is-visible');
    document.body.classList.remove('panel-open');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { if (!state.open) el.panel.hidden = true; }, state.reduced ? 0 : 340);
    bEl(id)?.classList.remove('is-open');
    setSelected(null);
    updateCamera();
    setHash(null);
    if (quiet) return;
    Sfx.close();
    setFacing('front');
    if (focus) { const f = state.returnFocus && document.contains(state.returnFocus) ? state.returnFocus : bEl(id); f?.focus({ preventScroll: true }); }
    setTimeout(() => { if (!state.open) say('Where to next?', 2400); }, state.reduced ? 0 : 400);
  }

  /* ----------------------------------------------------------- Directory */

  function renderDirectory() {
    const mini = (art) => { const m = Art.meta(art); return `<svg class="dir-mini" viewBox="${-m.w / 2 - 10} ${m.top - 6} ${m.w + 20} ${-m.top + 30}" aria-hidden="true">${Art.building(art)}</svg>`; };
    $('#dir-list').innerHTML = PLACES.map((p) => {
      const sub = p.kind === 'work' ? `${txt(p.data.role)} · ${txt(p.data.dates)}` : esc(p.hint);
      const projects = p.kind === 'work' && p.data.projects.length
        ? `<ol class="dir-projects">${p.data.projects.map((pr, i) => `<li><button type="button" class="dir-project" data-go="${p.id}" data-project="${i}" data-direct>
            <span class="dir-num">${String(i + 1).padStart(2, '0')}</span>${txt(pr.title)}</button></li>`).join('')}</ol>` : '';
      return `<li class="dir-item"><button type="button" class="dir-place" data-go="${p.id}" data-direct>${mini(p.art)}
          <span class="dir-text"><strong>${esc(p.kind === 'contact' ? 'Future workplace · Contact' : p.name)}</strong><small>${sub}</small></span>${icon('arrowRight')}</button>
        ${projects}</li>`;
    }).join('');
  }

  function openDirectory() {
    markInteracted(); hideTip();
    el.dirReturn = document.activeElement;
    el.dir.hidden = false; el.scrim.hidden = false;
    void el.dir.offsetWidth;
    el.dir.classList.add('is-visible'); el.scrim.classList.add('is-visible');
    $('#dir-title').focus();
    Sfx.open();
  }
  function closeDirectory(restore = true) {
    el.dir.classList.remove('is-visible'); el.scrim.classList.remove('is-visible');
    setTimeout(() => { if (!el.dir.classList.contains('is-visible')) { el.dir.hidden = true; el.scrim.hidden = true; } }, state.reduced ? 0 : 300);
    if (restore && el.dirReturn && document.contains(el.dirReturn)) el.dirReturn.focus({ preventScroll: true });
  }

  /* ------------------------------------------------- Resume, toast, prefs */

  function syncResumeLinks(root = document) {
    $$('[data-resume]', root).forEach((a) => {
      if (P.person.resumeUrl) {
        a.href = P.person.resumeUrl;
        if (a.hasAttribute('data-download')) a.setAttribute('download', '');
        else { a.target = '_blank'; a.rel = 'noopener'; }
      } else a.href = '#';
    });
  }

  let toastTimer = 0;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.toast.classList.remove('is-visible'), 3200);
  }

  function applyPrefs() {
    document.documentElement.classList.toggle('reduce-motion', state.reduced);
    el.motionBtn.setAttribute('aria-pressed', state.reduced);
    el.motionBtn.innerHTML = `${icon(state.reduced ? 'motionOff' : 'motion')}<span class="btn-label">${state.reduced ? 'Motion off' : 'Motion on'}</span>`;
    el.motionBtn.title = state.reduced ? 'Reduced motion is on — turn animations back on' : 'Reduce motion';
    el.soundBtn.setAttribute('aria-pressed', !state.muted);
    el.soundBtn.innerHTML = `${icon(state.muted ? 'soundOff' : 'soundOn')}<span class="btn-label">${state.muted ? 'Sound off' : 'Sound on'}</span>`;
    el.soundBtn.title = state.muted ? 'Turn sound on' : 'Mute sound';
  }

  function markInteracted() {
    if (state.interacted) return;
    state.interacted = true;
    document.body.classList.add('has-interacted');
  }

  /* -------------------------------------------------------------- Routing */

  function setHash(id, project) {
    const h = id ? `#/${id}${project ? '/' + (project + 1) : ''}` : ' ';
    try { history.replaceState(null, '', h === ' ' ? location.pathname + location.search : h); } catch (e) { /* file:// */ }
  }
  function readHash() {
    const m = location.hash.match(/^#\/([\w-]+)(?:\/(\d+))?/);
    if (!m || !place(m[1])) return null;
    return { id: m[1], project: m[2] ? +m[2] - 1 : 0 };
  }

  /* ---------------------------------------------------------- Keyboard */

  function focusables(root) {
    return $$('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])', root).filter((n) => n.offsetParent !== null || n === document.activeElement);
  }
  function trapTab(root, e) {
    const f = focusables(root);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (!root.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && (document.activeElement === first || document.activeElement.id === 'panel-title' || document.activeElement.id === 'dir-title')) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function moveFocus(from, key) {
    const c = (n) => { const r = n.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.bottom }; };
    const o = c(from);
    let best = null, bs = Infinity;
    $$('.building', el.svg).forEach((b) => {
      if (b === from) return;
      const p = c(b), dx = p.x - o.x, dy = p.y - o.y;
      const ok = key === 'ArrowRight' ? dx > 20 : key === 'ArrowLeft' ? dx < -20 : key === 'ArrowDown' ? dy > 20 : dy < -20;
      if (!ok) return;
      const horiz = key === 'ArrowRight' || key === 'ArrowLeft';
      const score = (horiz ? Math.abs(dx) : Math.abs(dy)) + (horiz ? Math.abs(dy) : Math.abs(dx)) * 1.5;
      if (score < bs) { bs = score; best = b; }
    });
    if (best) best.focus();
  }

  /* ------------------------------------------------------------- Events */

  function bind() {
    el.svg.addEventListener('click', (e) => {
      const b = e.target.closest('.building');
      if (b) { goTo(b.dataset.id); return; }
      if (e.target.closest('.signboard')) { openDirectory(); return; }
      walkFree(screenToWorld(e.clientX, e.clientY));
    });
    el.svg.addEventListener('keydown', (e) => {
      const b = e.target.closest('.building, .signboard');
      if (!b) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (b.classList.contains('signboard')) openDirectory(); else goTo(b.dataset.id);
      } else if (b.classList.contains('building') && /^Arrow/.test(e.key)) { e.preventDefault(); moveFocus(b, e.key); }
    });

    document.addEventListener('click', (e) => {
      const go = e.target.closest('[data-go]');
      if (go) {
        e.preventDefault();
        goTo(go.dataset.go, { direct: go.hasAttribute('data-direct'), project: +(go.dataset.project || 0), returnFocus: el.panel.contains(go) || el.dir.contains(go) ? null : go });
        return;
      }
      if (e.target.closest('[data-open-directory]')) { e.preventDefault(); openDirectory(); return; }
      if (e.target.closest('[data-close-directory]')) { closeDirectory(); return; }
      if (e.target.closest('[data-close]')) { closePanel(); return; }
      const res = e.target.closest('[data-resume]');
      if (res && !P.person.resumeUrl) { e.preventDefault(); toast('The resume will be available here soon.'); return; }
      const step = e.target.closest('[data-step]');
      if (step) { showProject(state.project + +step.dataset.step); return; }
      const tab = e.target.closest('.ptab');
      if (tab) { showProject(+tab.dataset.project); return; }
      const jump = e.target.closest('[data-jump]');
      if (jump) { e.preventDefault(); document.getElementById(jump.dataset.jump)?.scrollIntoView({ behavior: state.reduced ? 'auto' : 'smooth', block: 'start' }); return; }
      const copy = e.target.closest('[data-copy]');
      if (copy) { navigator.clipboard?.writeText(copy.dataset.copy).then(() => toast('Email address copied.'), () => toast(copy.dataset.copy)); }
    });

    el.panelBody.addEventListener('keydown', (e) => {
      const tab = e.target.closest('.ptab');
      if (!tab) return;
      const n = $$('.ptab', el.panelBody).length;
      const map = { ArrowRight: 1, ArrowLeft: -1 };
      if (e.key in map) { e.preventDefault(); showProject((state.project + map[e.key] + n) % n, true); }
      if (e.key === 'Home') { e.preventDefault(); showProject(0, true); }
      if (e.key === 'End') { e.preventDefault(); showProject(n - 1, true); }
    });

    document.addEventListener('keydown', (e) => {
      const dirOpen = el.dir.classList.contains('is-visible');
      if (e.key === 'Escape') {
        if (dirOpen) { closeDirectory(); return; }
        if (state.open) { closePanel(); return; }
        if (state.walkToken && charEl.classList.contains('is-walking')) { state.walkToken++; setSelected(null); setFacing('front'); }
        return;
      }
      if (e.key === 'Tab') {
        if (dirOpen) trapTab(el.dir, e);
        else if (state.open) trapTab(el.panel, e);
        return;
      }
      if ((e.key === 'd' || e.key === 'D') && !e.metaKey && !e.ctrlKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) {
        if (dirOpen) closeDirectory(); else openDirectory();
      }
    });

    el.soundBtn.addEventListener('click', () => { state.muted = !state.muted; store.set('muted', state.muted); applyPrefs(); Sfx.open(); });
    el.motionBtn.addEventListener('click', () => { state.reduced = !state.reduced; store.set('reduced', state.reduced); applyPrefs(); toast(state.reduced ? 'Reduced motion on: no walking or animations.' : 'Animations are back on.'); });
    mqReduce.addEventListener?.('change', (e) => { if (store.get('reduced') === null) { state.reduced = e.matches; applyPrefs(); } });

    window.addEventListener('hashchange', () => { const r = readHash(); if (r && (r.id !== state.open)) goTo(r.id, { direct: true, project: r.project }); });

    let rt = 0;
    window.addEventListener('resize', () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        hideTip();
        const next = chooseLayout();
        if (next !== state.layout) { state.layout = next; buildWorld(); }
        updateCamera();
      }, 120);
    });
  }

  /* ---------------------------------------------------------------- Init */

  function init() {
    Object.assign(el, {
      nav: $('.topnav'), world: $('#world'), stage: $('#stage'), svg: $('#map'),
      tip: $('#tip'), bubble: $('#bubble'), toast: $('#toast'),
      panel: $('#panel'), panelHead: $('#panel-head'), panelBody: $('#panel-body'),
      dir: $('#directory'), scrim: $('#scrim'),
      soundBtn: $('#sound-btn'), motionBtn: $('#motion-btn')
    });
    $$('[data-icon]').forEach((n) => { n.outerHTML = icon(n.dataset.icon); });
    $('#loader-art').innerHTML = `<svg viewBox="-40 -104 80 112" aria-hidden="true"><g class="char face-side is-walking">${Art.character()}</g></svg>`;
    $('.brand-avatar').innerHTML = `<svg viewBox="-26 -98 52 56" aria-hidden="true">${Art.viewFront()}</svg>`;
    if (mqTouch.matches) document.body.classList.add('is-touch');

    applyPrefs();
    renderDirectory();
    syncResumeLinks();
    state.layout = chooseLayout();
    buildWorld();
    bind();
    requestAnimationFrame(followLoop);

    const ready = Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), wait(state.reduced ? 0 : 900)]);
    ready.then(() => {
      document.body.classList.add('is-ready');
      const loader = $('#loader');
      loader.classList.add('is-done');
      setTimeout(() => loader.remove(), state.reduced ? 0 : 500);
      const r = readHash();
      if (r) goTo(r.id, { direct: true, project: r.project });
      else setTimeout(() => say(`Hi, I’m Shubhangi! ${mqTouch.matches ? 'Tap' : 'Click'} a building to explore my journey.`, 7000), state.reduced ? 0 : 450);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
