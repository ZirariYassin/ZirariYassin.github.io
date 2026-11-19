/* AQUAMIROIR — moteur front-end
   eau WebGL (caustiques) · poisson à traînée (canvas) · typo variable réactive
   rideau de vague entre les pages · défilement épinglé · profondeur */
(() => {
'use strict';
const root = document.documentElement;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

const S = { w: innerWidth, h: innerHeight, mx: innerWidth * .62, my: innerHeight * .4, active: false, lastMove: -1e9,
  tone: 0, toneT: 0, sy: scrollY, vel: 0, t: 0, clicks: [], dash: 0, down: false };
const hooks = [];
window.AQ = { S, $, $$, clamp, lerp, reduce, fine, hooks };

/* ---------- Pointeur ---------- */
addEventListener('pointermove', e => { S.mx = e.clientX; S.my = e.clientY; S.active = true; S.lastMove = performance.now(); }, { passive: true });
addEventListener('pointerdown', e => {
  S.down = true; S.mx = e.clientX; S.my = e.clientY; S.active = true; S.lastMove = performance.now();
  S.clicks.push({ x: e.clientX, y: e.clientY, t: S.t }); if (S.clicks.length > 6) S.clicks.shift(); S.dash = 1;
}, { passive: true });
addEventListener('pointerup', () => { S.down = false; }, { passive: true });
addEventListener('resize', () => { S.w = innerWidth; S.h = innerHeight; }, { passive: true });

/* ---------- Tonalité : air (clair) ↔ eau profonde (sombre) ---------- */
function initTone() {
  const secs = $$('[data-tone]');
  if (!secs.length) return;
  const set = t => { root.dataset.tone = t; S.toneT = t === 'dark' ? 1 : 0; const m = $('meta[name=theme-color]'); if (m) m.content = t === 'dark' ? '#041b2d' : '#f5f8fb'; };
  set(secs[0].dataset.tone); S.tone = S.toneT;
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) set(e.target.dataset.tone); }), { rootMargin: '-50% 0px -50% 0px' });
  secs.forEach(s => io.observe(s));
}

/* ---------- Rideau de vague + navigation ---------- */
function initCurtain() {
  const c = $('.curtain');
  if (c && root.classList.contains('is-entering')) {
    void c.offsetHeight;
    root.classList.add('is-exiting'); root.classList.remove('is-entering');
    setTimeout(() => { c.style.transition = 'none'; root.classList.remove('is-exiting'); void c.offsetHeight; c.style.transition = ''; }, 950);
  }
  try { sessionStorage.removeItem('aqNav'); } catch (e) {}
  document.addEventListener('click', e => {
    if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
    const u = new URL(a.href, location.href);
    if (!/^(https?|file):$/.test(u.protocol) || u.origin !== location.origin) return;
    if (u.pathname === location.pathname && u.search === location.search) {
      if (u.hash) { const t = $(u.hash); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); history.replaceState(null, '', u.hash); } }
      else if (a.getAttribute('href') !== '#') { e.preventDefault(); scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); }
      return;
    }
    e.preventDefault();
    try { sessionStorage.setItem('aqNav', '1'); } catch (er) {}
    root.classList.add('is-leaving');
    setTimeout(() => { location.href = u.href; }, reduce ? 0 : 640);
  });
  addEventListener('pageshow', e => { if (e.persisted) root.classList.remove('is-leaving', 'menu-open'); });
}

/* ---------- En-tête, menu, retour en haut ---------- */
function initHeader() {
  const h = $('.site-header'), btn = $('.menu-btn'); let ly = scrollY;
  btn && btn.addEventListener('click', () => { const o = root.classList.toggle('menu-open'); btn.setAttribute('aria-expanded', o); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { root.classList.remove('menu-open'); btn && btn.setAttribute('aria-expanded', false); } });
  $$('.to-top').forEach(b => b.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })));
  hooks.push(() => {
    const y = scrollY; h.classList.toggle('is-solid', y > 40);
    if (Math.abs(y - ly) > 6) { if (y > ly && y > 320 && !root.classList.contains('menu-open')) h.classList.add('is-hidden'); else h.classList.remove('is-hidden'); ly = y; }
  });
}

/* ---------- Curseur ---------- */
function initCursor() {
  if (!fine || reduce) return;
  const el = $('.cursor'); if (!el) return;
  root.classList.add('has-cursor');
  const ring = $('b', el), lab = $('span', ring); let rx = S.mx, ry = S.my;
  document.addEventListener('pointerover', e => {
    const t = e.target.closest && e.target.closest('[data-cursor],a,button,.ph,input,textarea,label,summary');
    el.classList.toggle('is-link', !!t);
    const l = t && t.closest('[data-cursor]');
    if (l) { lab.textContent = l.dataset.cursor; el.classList.add('has-label'); } else el.classList.remove('has-label');
  });
  addEventListener('pointerdown', () => el.classList.add('is-down'));
  addEventListener('pointerup', () => el.classList.remove('is-down'));
  hooks.push(() => {
    rx = lerp(rx, S.mx, .2); ry = lerp(ry, S.my, .2);
    el.style.transform = `translate3d(${S.mx}px,${S.my}px,0)`;
    ring.style.translate = `${rx - S.mx}px ${ry - S.my}px`;
  });
}

/* ---------- Texte : découpe en mots, révélations, texte qui s'allume ---------- */
function splitWords(el, cls) {
  let i = 0; const out = [];
  const walk = n => Array.from(n.childNodes).forEach(c => {
    if (c.nodeType === 3) {
      const frag = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(p => {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.append(' '); return; }
        if (cls === 'sw') { const s = document.createElement('span'); s.className = 'sw'; s.textContent = p; frag.append(s); out.push(s); }
        else { const w = document.createElement('span'); w.className = 'w'; const wi = document.createElement('span'); wi.className = 'wi'; wi.style.setProperty('--i', i++); wi.textContent = p; w.append(wi); frag.append(w); }
      });
      c.replaceWith(frag);
    } else if (c.nodeType === 1) walk(c);
  });
  const label = el.textContent.replace(/\s+/g, ' ').trim();
  walk(el); el.setAttribute('aria-label', label);
  return out;
}
function initReveal() {
  $$('[data-split]').forEach(el => splitWords(el));
  const scr = $$('[data-scrub]').map(el => ({ el, ws: splitWords(el, 'sw') }));
  $$('[data-stagger]').forEach(p => Array.from(p.children).filter(c => c.hasAttribute('data-reveal')).forEach((c, i) => c.style.setProperty('--d', Math.min(i, 9) * 90 + 'ms')));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -7% 0px', threshold: .06 });
  $$('[data-reveal],[data-split],.chap,.widget').forEach(el => io.observe(el));
  if (scr.length) hooks.push(() => scr.forEach(({ el, ws }) => {
    const r = el.getBoundingClientRect(); if (r.bottom < -80 || r.top > S.h + 80) return;
    const p = clamp((S.h * .86 - r.top) / (r.height + S.h * .34), 0, 1), n = ws.length;
    ws.forEach((w, i) => w.style.setProperty('--o', clamp(p * (n + 8) - i, 0, 1).toFixed(3)));
  }));
}

/* ---------- Effets de pointeur : magnétisme, halos ---------- */
function initPointerFX() {
  $$('.brand-card').forEach(el => el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); }));
  if (!fine || reduce) return;
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .38}px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
  $$('.tile').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5) * -26 + 'px'); el.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5) * -18 + 'px'); });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--px', '0px'); el.style.setProperty('--py', '0px'); });
  });
}

/* ---------- Typographie variable réactive + reflet ---------- */
function initVT() {
  const groups = $$('[data-vt]'); if (!groups.length) return;
  const letters = [];
  groups.forEach(g => {
    const [base, peak] = g.dataset.vt.split(',').map(Number);
    const text = g.textContent.trim(); g.textContent = ''; g.setAttribute('aria-label', text);
    text.split(/(\s+)/).forEach(tok => {
      if (!tok) return;
      if (/^\s+$/.test(tok)) { const s = document.createElement('span'); s.className = 'vsp'; s.setAttribute('aria-hidden', 'true'); g.append(s); return; }
      const word = document.createElement('span'); word.className = 'vword'; word.style.cssText = 'display:inline-block;white-space:nowrap'; word.setAttribute('aria-hidden', 'true');
      Array.from(tok).forEach(ch => { const l = document.createElement('span'); l.className = 'vl'; l.textContent = ch; l.style.setProperty('--li', letters.length); word.append(l); letters.push({ el: l, base, peak, k: 0, cx: 0, cy: 0, clone: null, sig: 100 }); });
      g.append(word);
    });
  });
  const hero = $('.hero__title'), refl = $('.hero__reflect');
  /* positions indépendantes des transforms (l'entrée des lettres est animée) */
  const pos = el => { let x = 0, y = 0; for (let e = el; e; e = e.offsetParent) { x += e.offsetLeft; y += e.offsetTop; } return { x, y }; };
  const measure = () => {
    letters.forEach(L => { L.el.style.width = ''; L.el.style.fontWeight = Math.round((L.base + L.peak) / 2); });
    letters.forEach(L => {
      const r = L.el.getBoundingClientRect(), fs = parseFloat(getComputedStyle(L.el).fontSize) || 16;
      L.wem = r.width / fs; L.sig = fs * 1.15;
    });
    letters.forEach(L => { L.el.style.width = L.wem + 'em'; });
    letters.forEach(L => { const p = pos(L.el); L.cx = p.x + L.el.offsetWidth / 2; L.cy = p.y + L.el.offsetHeight / 2; });
    if (hero && refl) {
      const probe = document.createElement('i'); probe.style.cssText = 'display:inline-block;width:0;height:0';
      const first = $('.vl', hero); first.append(probe);
      const fs = parseFloat(getComputedStyle(hero).fontSize) || 16;
      const b = (pos(probe).y - pos(hero).y) / fs, H = hero.offsetHeight / fs; probe.remove();
      refl.style.setProperty('--k', (b - H).toFixed(4) + 'em');
      refl.innerHTML = ''; const cl = hero.cloneNode(true); cl.setAttribute('aria-hidden', 'true'); cl.removeAttribute('aria-label'); refl.append(cl);
      const cls = $$('.vl', cl); letters.forEach((L, i) => { L.clone = cls[i] || null; });
    }
  };
  const go = () => { measure(); root.classList.add('is-ready'); };
  const ready = document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1800))]) : Promise.resolve();
  ready.then(() => requestAnimationFrame(go));
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 200); });
  hooks.push(() => {
    if (reduce) return;
    const near = scrollY < S.h * 1.1 || $('.phero');
    if (!near) return;
    const act = S.active && performance.now() - S.lastMove < 6000;
    letters.forEach((L, i) => {
      const dx = S.mx - L.cx, dy = S.my - (L.cy - S.sy), d2 = dx * dx + dy * dy;
      const f = act ? Math.exp(-d2 / (2 * L.sig * L.sig)) : 0;
      const wave = (Math.sin(S.t * 1.5 - i * .6) * .5 + .5) * .3;
      L.k = lerp(L.k, Math.max(f, wave), .16);
      const wt = (L.base + (L.peak - L.base) * L.k).toFixed(0);
      L.el.style.fontWeight = wt; if (L.clone) L.clone.style.fontWeight = wt;
    });
  });
}

/* ---------- Eau : caustiques WebGL ---------- */
function initWater() {
  const cv = $('#water'); if (!cv) return;
  let gl = null; try { gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }); } catch (e) {}
  if (!gl) { root.classList.add('no-gl'); return; }
  const mk = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; } return s; };
  const vs = mk(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');
  const fs = mk(gl.FRAGMENT_SHADER, `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uTime; uniform float uDark; uniform float uScroll; uniform vec2 uMouse; uniform vec3 uRip[4];
float caustic(vec2 uv, float t){
  vec2 p = mod(uv * 6.28318530718, 6.28318530718) - 250.0;
  vec2 i = p; float c = 1.0; float inten = .005;
  for (int n = 0; n < 5; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / inten), p.y / (cos(i.y + tt) / inten)));
  }
  c /= 5.0; c = 1.17 - pow(c, 1.4);
  return pow(abs(c), 8.0);
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes.y;
  vec2 d = uv - uMouse / uRes.y; float l = length(d);
  uv += d / (l + .0001) * sin(l * 26.0 - uTime * 3.0) * exp(-l * 7.0) * .012;
  for (int i = 0; i < 4; i++) {
    vec3 r = uRip[i];
    if (r.z >= 0.0) { vec2 dd = uv - r.xy / uRes.y; float ll = length(dd); uv += dd / (ll + .0001) * sin(ll * 34.0 - r.z * 9.0) * exp(-ll * 4.5) * exp(-r.z * 1.3) * .03; }
  }
  float c = caustic(uv * .55 + vec2(0.0, uScroll * .00028), uTime * .32 + 23.0);
  float v = 1.0 - gl_FragCoord.y / uRes.y;
  vec3 lightB = mix(vec3(.972, .984, .992), vec3(.925, .949, .969), v);
  vec3 lightC = lightB - vec3(.115, .05, .0) * c * 1.15;
  vec3 darkB = mix(vec3(.017, .106, .176), vec3(.006, .05, .095), v);
  vec3 darkC = darkB + vec3(.09, .38, .58) * c * .7;
  gl_FragColor = vec4(mix(lightC, darkC, uDark), 1.0);
}`);
  const pr = gl.createProgram();
  if (!vs || !fs) { root.classList.add('no-gl'); return; }
  gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { root.classList.add('no-gl'); return; }
  gl.useProgram(pr);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n);
  const uRes = U('uRes'), uTime = U('uTime'), uDark = U('uDark'), uScroll = U('uScroll'), uMouse = U('uMouse'), uRip = U('uRip');
  let sc = .5, cw = 0, ch = 0;
  const size = () => { sc = innerWidth > 1400 ? .4 : .5; cw = Math.max(2, Math.ceil(innerWidth * sc)); ch = Math.max(2, Math.ceil(innerHeight * sc)); cv.width = cw; cv.height = ch; gl.viewport(0, 0, cw, ch); };
  size(); addEventListener('resize', size);
  const rip = new Float32Array(12);
  hooks.push(() => {
    if (document.hidden) return;
    for (let i = 0; i < 4; i++) {
      const c = S.clicks[S.clicks.length - 1 - i];
      if (c && S.t - c.t < 3.2) { rip[i * 3] = c.x * sc; rip[i * 3 + 1] = ch - c.y * sc; rip[i * 3 + 2] = S.t - c.t; } else { rip[i * 3] = 0; rip[i * 3 + 1] = 0; rip[i * 3 + 2] = -1; }
    }
    gl.uniform2f(uRes, cw, ch); gl.uniform1f(uTime, reduce ? 5 : S.t); gl.uniform1f(uDark, S.tone); gl.uniform1f(uScroll, S.sy);
    gl.uniform2f(uMouse, S.mx * sc, ch - S.my * sc); gl.uniform3fv(uRip, rip);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  });
}

/* ---------- Le poisson : suit le curseur, traîne ses fils comme dans le logo ---------- */
function initFish() {
  const cv = $('#fish'); if (!cv) return; const ctx = cv.getContext('2d');
  let W, H, dpr;
  const size = () => { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener('resize', size);
  const BODY = new Path2D('M 28 0 C 26 -7 14 -11 2 -10 C -8 -9 -18 -6 -26 -2 L -26 2 C -18 6 -8 9 2 10 C 14 11 26 7 28 0 Z');
  const FIN = new Path2D('M 0 0 C -6 -8 -14 -14 -26 -18 C -20 -9 -17 -4 -13 0 Z');
  const mkChain = (n, len, x, y) => ({ len, p: Array.from({ length: n }, (_, i) => ({ x: x - i * len, y })) });
  const hx = W * .7, hy = H * .38;
  const head = { x: hx, y: hy, vx: 0, vy: 0, a: Math.PI * .92, spd: 0 };
  const spine = mkChain(38, 9.5, hx, hy), w1 = mkChain(64, 7.4, hx, hy), w2 = mkChain(46, 6.4, hx, hy);
  let T = 0, orbit = 0, amp = 2; const bubbles = [];
  const follow = (p, q, len, k) => { let dx = p.x - q.x, dy = p.y - q.y; const d = Math.hypot(dx, dy) || 1; p.x += (q.x + dx / d * len - p.x) * k; p.y += (q.y + dy / d * len - p.y) * k; };
  function step(dt) {
    T += dt;
    const useP = S.active && performance.now() - S.lastMove < 5000;
    orbit += dt * (useP ? 1.55 : 1.0);
    let tx, ty;
    if (useP) { const R = 84 + 26 * Math.sin(T * .8); tx = S.mx + Math.cos(orbit) * R; ty = S.my + Math.sin(orbit) * R * .8; }
    else { tx = W * (.5 + .36 * Math.sin(T * .27 + 1)) + Math.cos(orbit) * 110; ty = H * (.5 + .3 * Math.sin(T * .19)) + Math.sin(orbit) * 80; }
    const maxSp = 520 + S.dash * 900;
    let dvx = (tx - head.x) * 3.2, dvy = (ty - head.y) * 3.2; const m = Math.hypot(dvx, dvy);
    if (m > maxSp) { dvx *= maxSp / m; dvy *= maxSp / m; }
    const k = Math.min(1, dt * 3.6); head.vx += (dvx - head.vx) * k; head.vy += (dvy - head.vy) * k;
    head.x += head.vx * dt; head.y += head.vy * dt - S.vel * .3;
    const sp = Math.hypot(head.vx, head.vy); head.spd = lerp(head.spd, sp, .12);
    if (sp > 25) { let da = Math.atan2(head.vy, head.vx) - head.a; da = Math.atan2(Math.sin(da), Math.cos(da)); head.a += da * Math.min(1, dt * 7); }
    S.dash = Math.max(0, S.dash - dt * 1.6);
    amp = lerp(amp, 2 + Math.min(head.spd / 150, 5), .08);
    const ca = Math.cos(head.a), sa = Math.sin(head.a);
    spine.p[0].x = head.x - ca * 22; spine.p[0].y = head.y - sa * 22;
    for (let i = 1; i < spine.p.length; i++) follow(spine.p[i], spine.p[i - 1], spine.len, 1);
    const anc = (c, idx, off, k2) => { const q = spine.p[idx]; c.p[0].x = q.x - sa * off; c.p[0].y = q.y + ca * off; for (let i = 1; i < c.p.length; i++) follow(c.p[i], c.p[i - 1], c.len, k2); };
    anc(w1, 6, 3, .38); anc(w2, 12, -3, .3);
    if (head.spd > 150 && Math.random() < dt * 14 && bubbles.length < 46) bubbles.push({ x: head.x + (Math.random() - .5) * 14, y: head.y + (Math.random() - .5) * 14, r: 1.2 + Math.random() * 3, l: 1, v: 14 + Math.random() * 34, ph: Math.random() * 6 });
    for (let i = bubbles.length - 1; i >= 0; i--) { const b = bubbles[i]; b.l -= dt * .45; b.y -= b.v * dt; b.x += Math.sin(T * 2 + b.ph) * .3; if (b.l <= 0) bubbles.splice(i, 1); }
  }
  function ribbon(c, wMax, wMin, wig, alpha) {
    const pts = c.p, n = pts.length, L = [], R = [];
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[Math.min(i + 1, n - 1)], o = pts[Math.max(i - 1, 0)];
      let tx = q.x - o.x, ty = q.y - o.y; const d = Math.hypot(tx, ty) || 1; tx /= d; ty /= d;
      const nx = -ty, ny = tx, f = i / (n - 1);
      const off = Math.sin(T * 5.5 - i * .42 + wig) * amp * Math.min(1, i / 6) * (.35 + f);
      const w = wMin + (wMax - wMin) * Math.pow(1 - f, 2.2), cx = p.x + nx * off, cy = p.y + ny * off;
      L.push([cx + nx * w / 2, cy + ny * w / 2]); R.push([cx - nx * w / 2, cy - ny * w / 2]);
    }
    ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(L[0][0], L[0][1]);
    for (let i = 1; i < n; i++) ctx.quadraticCurveTo(L[i - 1][0], L[i - 1][1], (L[i - 1][0] + L[i][0]) / 2, (L[i - 1][1] + L[i][1]) / 2);
    ctx.lineTo(L[n - 1][0], L[n - 1][1]); ctx.lineTo(R[n - 1][0], R[n - 1][1]);
    for (let i = n - 1; i > 0; i--) ctx.quadraticCurveTo(R[i][0], R[i][1], (R[i][0] + R[i - 1][0]) / 2, (R[i][1] + R[i - 1][1]) / 2);
    ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
  }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    const t = S.tone, r = Math.round(lerp(11, 234, t)), g = Math.round(lerp(18, 245, t)), b = Math.round(lerp(24, 255, t));
    const col = `rgb(${r},${g},${b})`; ctx.fillStyle = col; ctx.strokeStyle = col;
    for (const c of S.clicks) { const age = S.t - c.t; if (age < 1.7) { ctx.strokeStyle = `rgba(${t > .5 ? '102,189,247' : '43,123,185'},${(1 - age / 1.7) * .55})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(c.x, c.y, age * 230, 0, 6.2832); ctx.stroke(); } }
    ctx.lineWidth = 1; for (const bb of bubbles) { ctx.strokeStyle = `rgba(${r},${g},${b},${bb.l * .5})`; ctx.beginPath(); ctx.arc(bb.x, bb.y, bb.r, 0, 6.2832); ctx.stroke(); }
    ctx.fillStyle = col; ctx.shadowColor = `rgba(102,189,247,${.6 * t})`; ctx.shadowBlur = 14 * t;
    ribbon(w2, 1.5, .35, 2.2, .75); ribbon(w1, 1.9, .4, 1.1, .85); ribbon(spine, 8.5, .7, 0, 1);
    ctx.save(); ctx.translate(head.x, head.y); ctx.rotate(head.a);
    ctx.fill(BODY);
    const flap = Math.sin(T * 7) * .22 * (.4 + Math.min(head.spd / 400, 1));
    ctx.save(); ctx.translate(6, -8); ctx.rotate(.15 + flap); ctx.fill(FIN); ctx.restore();
    ctx.save(); ctx.translate(6, 8); ctx.scale(1, -1); ctx.rotate(.15 + flap); ctx.fill(FIN); ctx.restore();
    ctx.restore(); ctx.shadowBlur = 0;
  }
  for (let i = 0; i < 140; i++) { S.active = false; step(.016); S.dash = 0; }
  if (reduce) { hooks.push(draw); return; }
  hooks.push(dt => { step(dt); draw(); });
}

/* ---------- Horaires : statut en direct (heure de Bruxelles) ---------- */
function initHours() {
  const stat = $$('.js-status'), rows = $$('[data-dow]');
  if (!stat.length && !rows.length) return;
  const SCH = { 0: [[600, 780]], 1: [], 2: [[600, 720], [810, 1110]], 3: [[600, 720], [810, 1110]], 4: [[600, 720], [810, 1110]], 5: [[600, 720], [810, 1110]], 6: [[600, 1080]] };
  const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const fmt = m => `${Math.floor(m / 60)}h${String(m % 60).padStart(2, '0')}`;
  const now = () => {
    const f = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Brussels', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false });
    const p = Object.fromEntries(f.formatToParts(new Date()).map(x => [x.type, x.value]));
    return { dow: { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[p.weekday], min: (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10) };
  };
  const status = () => {
    const { dow, min } = now();
    for (const [a, b] of SCH[dow]) if (min >= a && min < b) return { open: true, dow, text: `Ouvert · jusqu'à ${fmt(b)}` };
    for (let off = 0; off < 8; off++) {
      const d = (dow + off) % 7;
      for (const [a] of SCH[d]) if (off > 0 || a > min) return { open: false, dow, text: `Fermé · ouvre ${off === 0 ? 'à' : off === 1 ? 'demain à' : DAYS[d] + ' à'} ${fmt(a)}` };
    }
    return { open: false, dow, text: 'Fermé' };
  };
  const upd = () => {
    const s = status();
    stat.forEach(el => { el.classList.toggle('is-open', s.open); const em = $('em', el) || el; em.textContent = s.text; });
    rows.forEach(r => r.classList.toggle('is-today', r.dataset.dow.split(' ').includes(String(s.dow))));
  };
  upd(); setInterval(upd, 30000);
}

/* ---------- Jauge de profondeur ---------- */
function initDepth() {
  const d = $('.depth'); if (!d) return;
  const dot = $('i', d), lab = $('span', d); let last = '';
  hooks.push(() => {
    const max = root.scrollHeight - S.h, p = max > 0 ? clamp(S.sy / max, 0, 1) : 0;
    dot.style.top = lab.style.top = (p * 100).toFixed(2) + '%';
    const txt = '−' + (p * 9).toFixed(1).replace('.', ',') + ' m'; if (txt !== last) { lab.textContent = txt; last = txt; }
  });
}

/* ---------- Défilement horizontal épinglé ---------- */
function initHS() {
  const hs = $('.hs'); if (!hs) return;
  const track = $('.hs__track', hs), bar = $('.hs__bar i', hs); let max = 0, on = false, P = 0;
  const measure = () => {
    on = innerWidth >= 900;
    if (!on) { hs.style.height = ''; track.style.transform = ''; return; }
    max = Math.max(0, track.scrollWidth - innerWidth); hs.style.height = (max + innerHeight) + 'px';
  };
  measure(); addEventListener('resize', measure); addEventListener('load', measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  hooks.push(() => {
    if (!on) return;
    const r = hs.getBoundingClientRect(); if (r.bottom < -50 || r.top > S.h + 50) return;
    const p = clamp(-r.top / (hs.offsetHeight - S.h), 0, 1); P = lerp(P, p, .12);
    track.style.transform = `translate3d(${(-P * max).toFixed(1)}px,0,0)`; bar && bar.style.setProperty('--p', P.toFixed(4));
  });
}

/* ---------- Bandeau défilant (réagit à la vitesse de scroll) ---------- */
function initMarquee() {
  $$('.marquee').forEach(m => {
    const tr = $('.marquee__track', m); if (!tr) return;
    m.setAttribute('aria-hidden', 'true'); tr.innerHTML += tr.innerHTML;
    const dir = m.dataset.dir === 'r' ? 1 : -1; let x = 0;
    hooks.push(dt => {
      const half = tr.scrollWidth / 2; if (!half) return;
      x += dir * (reduce ? 0 : 55 + Math.abs(S.vel) * 38) * dt; if (x <= -half) x += half; if (x > 0) x -= half;
      tr.style.transform = `translate3d(${x.toFixed(1)}px,0,0) skewX(${clamp(-S.vel * .45 * -dir, -9, 9).toFixed(2)}deg)`;
    });
  });
}

/* ---------- Parallaxe des figures ---------- */
function initParallax() {
  const figs = $$('.fig'); if (!figs.length || reduce) return;
  hooks.push(() => figs.forEach(f => {
    const r = f.getBoundingClientRect(); if (r.bottom < 0 || r.top > S.h) return;
    const p = (r.top + r.height / 2 - S.h / 2) / S.h, img = $('img', f); if (img) img.style.transform = `translate3d(0,${(p * -7).toFixed(2)}%,0)`;
  }));
}

/* ---------- Sommaire des chapitres ---------- */
function initTOC() {
  const toc = $('.toc'); if (!toc) return;
  const links = $$('a', toc), chaps = links.map(a => $(a.getAttribute('href'))).filter(Boolean), art = $('.article'); let cur = -1;
  hooks.push(() => {
    let c = 0; chaps.forEach((el, i) => { if (el.getBoundingClientRect().top < S.h * .4) c = i; });
    if (c !== cur) { cur = c; links.forEach((a, i) => a.classList.toggle('is-active', i === c)); }
    const r = art.getBoundingClientRect(); toc.style.setProperty('--p', clamp((S.h * .5 - r.top) / r.height, 0, 1).toFixed(3));
  });
}

/* ---------- Boucle principale ---------- */
function start() {
  initTone(); initCurtain(); initHeader(); initCursor(); initReveal(); initPointerFX(); initVT();
  initWater(); initFish(); initHours(); initDepth(); initHS(); initMarquee(); initParallax(); initTOC();
  let last = performance.now(), warned = false;
  const frame = now => {
    const dt = Math.min(.05, (now - last) / 1000); last = now; S.t += dt;
    const y = scrollY; S.vel = lerp(S.vel, y - S.sy, .2); S.sy = y;
    S.tone += (S.toneT - S.tone) * Math.min(1, dt * 2.6);
    for (const h of hooks) { try { h(dt); } catch (e) { if (!warned) { warned = true; console.warn(e); } } }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
