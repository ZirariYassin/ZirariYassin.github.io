/* AQUAMIROIR — widgets pédagogiques (pages techniques) */
(() => {
'use strict';
const A = window.AQ; if (!A) return;
const { S, $, $$, clamp, lerp, reduce, hooks } = A;
const fmt = n => Math.round(n).toLocaleString('fr-BE');
const setP = (el, v, min, max) => el.style.setProperty('--p', ((v - min) / (max - min) * 100).toFixed(1) + '%');
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
const watch = el => { const o = { on: true }; new IntersectionObserver(es => es.forEach(e => { o.on = e.isIntersecting; })).observe(el); return o; };
const ink = () => (S.tone > .5 ? '234,245,255' : '11,18,24');
const rng = seed => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const sizeCanvas = cv => { const d = Math.min(devicePixelRatio || 1, 2), r = cv.getBoundingClientRect(); cv.width = Math.max(2, r.width * d); cv.height = Math.max(2, r.height * d); const c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); return { c, w: r.width, h: r.height }; };

/* niveau d'eau animé dans un aquarium SVG */
function tankAnim(w) {
  const g = $('.wg', w), r = $('.wr', w); let cur = .5, tgt = .5;
  const draw = () => { const h = lerp(12, 112, clamp(cur, 0, 1)); g.setAttribute('transform', `translate(0 ${(136 - h).toFixed(1)})`); r.setAttribute('height', (h + 12).toFixed(1)); };
  draw();
  hooks.push(() => { if (Math.abs(tgt - cur) > .0004) { cur = reduce ? tgt : lerp(cur, tgt, .14); draw(); } });
  return t => { tgt = t; if (reduce) { cur = t; draw(); } };
}
function sweetBand(w, min, max, lo, hi) {
  const sw = $('.sweet', w); if (!sw) return;
  const i = $('i', sw), e = $('em', sw);
  i.style.left = ((lo - min) / (max - min) * 100) + '%'; i.style.width = ((hi - lo) / (max - min) * 100) + '%';
  e.style.left = (((lo + hi) / 2 - min) / (max - min) * 100) + '%';
}

const W = {};

/* 1 — Taille et poids */
W.size = w => {
  const inp = $('input', w), vol = $('.js-vol', w), wt = $('.js-wt', w), eq = $('.js-eq', w), vd = $('.verdict', w);
  const min = +inp.min, max = +inp.max, lo = +w.dataset.lo, hi = +w.dataset.hi, set = tankAnim(w);
  sweetBand(w, min, max, lo, hi);
  const upd = () => {
    const v = +inp.value; setP(inp, v, min, max); vol.textContent = v;
    const kg = v * 1.5; wt.textContent = fmt(kg); const n = Math.round(kg / 75);
    eq.textContent = n >= 2 ? `, soit le poids d'environ ${n} adultes.` : '.';
    vd.textContent = v < 80 ? 'Petit volume : eau moins stable, plus d\'attention'
      : v < lo ? 'Compact : surveillez-le de près'
      : v <= hi ? 'Idéal pour débuter'
      : v <= 300 ? 'Grand volume : eau stable, mais plus de travail'
      : 'Très grand : beaucoup de travail et un meuble costaud';
    set((v - min) / (max - min));
  };
  inp.addEventListener('input', upd); upd();
};

/* 2 — Mélange d'eau */
W.mix = w => {
  const inp = $('input', w), top = $('.m-top', w), bot = $('.m-bot', w), out = $('.js-pct', w), vd = $('.verdict', w), lab = $('.m-lab', w);
  const upd = () => {
    const v = +inp.value; setP(inp, v, 0, 100); out.textContent = v;
    const H = 100, o = H * v / 100;
    top.setAttribute('height', o.toFixed(1)); bot.setAttribute('y', (30 + o).toFixed(1)); bot.setAttribute('height', (H - o).toFixed(1));
    lab.textContent = `${v} % osmosée · ${100 - v} % robinet`;
    vd.textContent = v < 45 ? 'Encore trop de calcaire : visez 50 %' : v <= 55 ? 'La proportion conseillée' : 'Au-delà de 50 % : demandez-nous conseil';
  };
  inp.addEventListener('input', upd); upd();
};

/* 3 — Le temps des bactéries (canvas) */
W.cycle = w => {
  const cv = $('canvas', w), btns = $$('.stage', w), vis = watch(cv);
  let c, cw, ch, parts = [], peb = [], speck = [], cur = 0, tgt = .06, bar = $('.js-col', w);
  const build = () => {
    ({ c, w: cw, h: ch } = sizeCanvas(cv)); const R = rng(7);
    parts = Array.from({ length: 340 }, (_, i) => ({ media: i < 190, thr: R() * .92, ph: R() * 6.28, u: R(), v: R(), r: 1.3 + R() * 2 }));
    peb = Array.from({ length: 70 }, () => ({ u: R(), v: R(), r: .018 + R() * .02, a: .1 + R() * .18 }));
    speck = Array.from({ length: 70 }, () => ({ x: R(), y: R(), s: .3 + R(), r: .8 + R() * 1.6 }));
  };
  const draw = dt => {
    cur = reduce ? tgt : lerp(cur, tgt, .045);
    const t = S.t, I = ink(); c.clearRect(0, 0, cw, ch);
    const bx = cw * .06, by = ch * .14, bw = cw * .5, bh = ch * .72, gx = cw * .6, gy = ch * .56, gw = cw * .36, gh = ch * .32;
    const turb = Math.max(0, 1 - Math.abs(cur - .42) / .38) * .5;
    c.fillStyle = `rgba(${I},.06)`; c.beginPath(); c.roundRect(bx, by, bw, bh, 18); c.fill();
    c.strokeStyle = `rgba(${I},.45)`; c.lineWidth = 1; c.stroke();
    c.fillStyle = `rgba(${I},.2)`; peb.forEach(p => { c.globalAlpha = 1; c.beginPath(); c.arc(gx + p.u * gw, gy + gh * .15 + p.v * gh * .85, p.r * cw * .7, 0, 6.2832); c.fillStyle = `rgba(${I},${p.a})`; c.fill(); });
    c.strokeStyle = `rgba(${I},.3)`; c.strokeRect(gx, gy, gw, gh);
    parts.forEach(p => {
      if (p.thr > cur) return; const a = Math.min(1, (cur - p.thr) * 7) * (.62 + .38 * Math.sin(t * 2.2 + p.ph));
      const x = p.media ? bx + 12 + p.u * (bw - 24) : gx + 5 + p.u * (gw - 10), y = p.media ? by + 12 + p.v * (bh - 24) : gy + gh * .18 + p.v * gh * .75;
      c.beginPath(); c.arc(x, y, p.r, 0, 6.2832); c.fillStyle = `rgba(${S.tone > .5 ? '120,255,200' : '8,150,110'},${a.toFixed(2)})`; c.fill();
    });
    if (turb > .01) { c.fillStyle = `rgba(${S.tone > .5 ? '160,175,170' : '175,170,150'},${(turb * .55).toFixed(3)})`; c.fillRect(0, 0, cw, ch);
      speck.forEach(s => { s.x = (s.x + dt * .01 * s.s) % 1; c.beginPath(); c.arc(s.x * cw, s.y * ch + Math.sin(t + s.x * 9) * 5, s.r, 0, 6.2832); c.fillStyle = `rgba(${I},${(turb * .5).toFixed(3)})`; c.fill(); }); }
    c.font = '500 10px "DM Mono",monospace'; c.fillStyle = `rgba(${I},.7)`; c.textBaseline = 'top';
    c.fillText('MASSE FILTRANTE', bx + 14, by + 12); c.fillText('GRAVIER', gx + 2, gy - 18);
    c.fillStyle = `rgba(${I},.14)`; c.fillRect(bx, ch - 26, cw - bx * 2, 2); c.fillStyle = S.tone > .5 ? '#66bdf7' : '#2b7bb9'; c.fillRect(bx, ch - 26, (cw - bx * 2) * cur, 2);
    c.fillStyle = `rgba(${I},.7)`; c.fillText('COLONISATION (SCHÉMA)', bx, ch - 20);
  };
  build(); addEventListener('resize', () => { build(); });
  const stages = [.06, .42, .75, 1];
  btns.forEach((b, i) => b.addEventListener('click', () => { tgt = stages[i]; btns.forEach((x, j) => x.setAttribute('aria-pressed', j === i)); }));
  btns[0] && btns[0].setAttribute('aria-pressed', 'true');
  hooks.push(dt => { if (vis.on) draw(dt); });
};

/* 4 — Photopériode */
W.photo = w => {
  const inp = $('input', w), fg = $('.fg', w), t = $('.js-h', w), vd = $('.verdict', w), C = 2 * Math.PI * 80;
  const upd = () => {
    const h = +inp.value; setP(inp, h, +inp.min, +inp.max); t.textContent = h + ' h';
    fg.style.strokeDasharray = `${C} ${C}`; fg.style.strokeDashoffset = (C * (1 - h / 24)).toFixed(1);
    vd.textContent = h < 10 ? 'Trop court pour les plantes' : h <= 12 ? 'La photopériode conseillée : 10 à 12 h' : 'Trop long : les algues vont apprécier';
  };
  sweetBand(w, +inp.min, +inp.max, 10, 12);
  inp.addEventListener('input', upd); upd();
};

/* 5 — Acclimatation : minuteur */
W.accl = w => {
  const fg = $('.fg', w), tx = $('.js-time', w), sub = $('.sub', w), go = $('.js-go', w), rs = $('.js-reset', w), steps = $$('.steps li', w), C = 2 * Math.PI * 80, TOT = 20 * 60;
  let left = TOT, run = false, last = 0;
  fg.style.strokeDasharray = `${C} ${C}`;
  const draw = () => {
    const m = Math.floor(left / 60), s = Math.floor(left % 60); tx.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    fg.style.strokeDashoffset = (C * (1 - left / TOT)).toFixed(1);
    const el = TOT - left;
    steps.forEach((li, i) => li.classList.toggle('is-on', i === 0 ? (run || el > 0) : i === 1 ? el >= 15 * 60 : left <= 0));
    sub.textContent = left <= 0 ? 'terminé' : run ? 'le sac flotte' : el > 0 ? 'en pause' : 'prêt';
    go.textContent = run ? 'Pause' : el > 0 && left > 0 ? 'Reprendre' : 'Démarrer';
  };
  const tick = () => { const n = performance.now(); left = Math.max(0, left - (n - last) / 1000); last = n; if (left <= 0) { run = false; clearInterval(id); } draw(); };
  let id = 0;
  go.addEventListener('click', () => { if (left <= 0) return; run = !run; if (run) { last = performance.now(); id = setInterval(tick, 250); } else clearInterval(id); draw(); });
  rs.addEventListener('click', () => { run = false; clearInterval(id); left = TOT; draw(); });
  draw();
};

/* 6 — Liste à cocher mémorisée */
W.check = w => {
  const key = 'aq-' + (w.dataset.key || 'c'), boxes = $$('input', w), cnt = $('.js-count', w), bar = $('.prog i', w);
  const saved = store.get(key) || [];
  boxes.forEach((b, i) => { b.checked = !!saved[i]; });
  const upd = () => { const n = boxes.filter(b => b.checked).length; cnt.textContent = `${n} / ${boxes.length}`; bar.style.setProperty('--p', n / boxes.length); w.classList.toggle('is-done', n === boxes.length); store.set(key, boxes.map(b => b.checked)); };
  boxes.forEach(b => b.addEventListener('change', upd)); upd();
  const rs = $('.js-reset', w); rs && rs.addEventListener('click', () => { boxes.forEach(b => { b.checked = false; }); upd(); });
};

/* 7 — Scénarios de déménagement */
W.scenario = w => {
  const btns = $$('.seg button', w), panels = $$('[data-p]', w);
  const show = k => { btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.t === k)); panels.forEach(p => { p.hidden = p.dataset.p !== k; }); };
  btns.forEach(b => b.addEventListener('click', () => show(b.dataset.t))); show(btns[0].dataset.t);
};

/* 8 — Eau à conserver + bidons */
W.keep = w => {
  const iv = $('.i-vol', w), ik = $('.i-keep', w), set = tankAnim(w), vd = $('.verdict', w);
  sweetBand(w, 0, 100, 50, 100);
  const upd = () => {
    const v = +iv.value, k = +ik.value; setP(iv, v, +iv.min, +iv.max); setP(ik, k, 0, 100);
    const L = v * k / 100, cans = Math.ceil(L / 10);
    $('.js-v', w).textContent = v; $('.js-k', w).textContent = k; $('.js-l', w).textContent = fmt(L); $('.js-cans', w).textContent = cans;
    $('.js-dep', w).textContent = (cans * 2.5).toLocaleString('fr-BE', { minimumFractionDigits: 2 });
    vd.textContent = k < 50 ? 'Gardez au moins la moitié de l\'eau' : k < 100 ? 'Bien : l\'eau conservée protège les bactéries' : 'Impeccable… mais restez prudent avec le poids';
    vd.classList.toggle('is-warn', k < 50);
    set(k / 100);
  };
  iv.addEventListener('input', upd); ik.addEventListener('input', upd); upd();
};

/* 9 — Le filtre respire */
W.oxy = w => {
  const btns = $$('.seg button', w), bar = $('.o-bar i', w), vd = $('.verdict', w), dots = $$('.bac circle', w);
  const set = k => {
    btns.forEach(b => b.setAttribute('aria-pressed', b.dataset.t === k)); w.dataset.mode = k;
    bar.style.setProperty('--p', k === 'air' ? .92 : .14);
    vd.textContent = k === 'air' ? 'L\'air circule : les bactéries respirent' : 'Dans l\'eau, l\'oxygène s\'épuise vite';
  };
  btns.forEach(b => b.addEventListener('click', () => set(b.dataset.t))); set('water');
  dots.forEach((d, i) => d.style.setProperty('--i', i));
};

/* 10 — Le filtre en coupe (canvas) */
W.filter = w => {
  const cv = $('canvas', w), btns = $$('.stage', w), vis = watch(cv), nOut = $('.js-clear', w);
  let c, cw, ch, active = -1, ps = [], fib = [], grn = [], ring = [], cleared = 0, tAcc = 0;
  const build = () => { ({ c, w: cw, h: ch } = sizeCanvas(cv)); const R = rng(11);
    fib = Array.from({ length: 50 }, () => ({ x: R(), y: R(), l: .05 + R() * .08, a: R() * 3 }));
    grn = Array.from({ length: 130 }, () => ({ x: R(), y: R(), r: 1 + R() * 2.2 }));
    ring = Array.from({ length: 26 }, () => ({ x: R(), y: R(), r: 7 + R() * 4, ph: R() * 6 })); ps = []; };
  const bands = () => { const y0 = ch * .08, hh = ch * .26, g = ch * .03; return [[y0, hh], [y0 + hh + g, hh], [y0 + (hh + g) * 2, hh]]; };
  const draw = dt => {
    const B = bands(), I = ink(), t = S.t, x0 = cw * .1, bw = cw * .8; c.clearRect(0, 0, cw, ch);
    tAcc += dt; if (!reduce && tAcc > .09) { tAcc = 0; ps.push({ x: x0 + 8 + Math.random() * (bw - 16), y: -4, v: 46 + Math.random() * 30, k: Math.random() < .5 ? 'd' : 't', life: 1, st: 0 }); }
    B.forEach(([y, h], i) => {
      const on = active < 0 || active === i; c.globalAlpha = on ? 1 : .32;
      c.fillStyle = `rgba(${I},.05)`; c.beginPath(); c.roundRect(x0, y, bw, h, 14); c.fill(); c.strokeStyle = on && active === i ? (S.tone > .5 ? '#66bdf7' : '#2b7bb9') : `rgba(${I},.4)`; c.lineWidth = on && active === i ? 2 : 1; c.stroke();
      c.save(); c.beginPath(); c.roundRect(x0, y, bw, h, 14); c.clip();
      if (i === 0) { c.strokeStyle = `rgba(${I},.35)`; c.lineWidth = 1; fib.forEach(f => { const x = x0 + f.x * bw, yy = y + f.y * h; c.beginPath(); c.moveTo(x, yy); c.bezierCurveTo(x + 8, yy - 6, x + f.l * bw / 2, yy + 6, x + f.l * bw, yy); c.stroke(); }); }
      if (i === 1) grn.forEach(g => { c.beginPath(); c.arc(x0 + g.x * bw, y + g.y * h, g.r, 0, 6.2832); c.fillStyle = `rgba(${I},.55)`; c.fill(); });
      if (i === 2) ring.forEach(r => { const x = x0 + r.x * bw, yy = y + r.y * h; c.beginPath(); c.arc(x, yy, r.r, 0, 6.2832); c.strokeStyle = S.tone > .5 ? 'rgba(255,170,120,.6)' : 'rgba(190,100,60,.65)'; c.lineWidth = 2; c.stroke();
        const a = .45 + .5 * Math.sin(t * 2.2 + r.ph); c.beginPath(); c.arc(x, yy, 2.2, 0, 6.2832); c.fillStyle = `rgba(${S.tone > .5 ? '120,255,200' : '8,150,110'},${a.toFixed(2)})`; c.fill(); });
      c.restore(); c.globalAlpha = 1;
      c.font = '500 10px "DM Mono",monospace'; c.textBaseline = 'top'; c.fillStyle = `rgba(${I},${on ? .75 : .35})`;
      c.fillText(['MÉCANIQUE', 'CHIMIQUE', 'BIOLOGIQUE'][i], x0 + 12, y + 10);
    });
    for (let i = ps.length - 1; i >= 0; i--) {
      const p = ps[i];
      if (!p.st) { p.y += p.v * dt; p.x += Math.sin(t * 2 + i) * .25; }
      const [m, k] = B;
      if (p.k === 'd' && !p.st && p.y > m[0] + 6 && p.y < m[0] + m[1] - 6 && Math.random() < dt * 2.8) p.st = 1;
      if (p.k === 't' && !p.st && p.y > k[0] + 6 && p.y < k[0] + k[1] - 6 && Math.random() < dt * 3.2) p.st = 2;
      if (p.st) p.life -= dt * (p.st === 1 ? .22 : .9);
      if (p.y > ch + 4) { cleared++; ps.splice(i, 1); continue; }
      if (p.life <= 0) { ps.splice(i, 1); continue; }
      c.beginPath(); c.arc(p.x, p.y, p.k === 'd' ? 2.6 : 3.6, 0, 6.2832);
      c.fillStyle = p.k === 'd' ? `rgba(${S.tone > .5 ? '210,160,110' : '120,80,40'},${p.life.toFixed(2)})` : `rgba(${S.tone > .5 ? '230,210,110' : '200,160,20'},${(p.life * .75).toFixed(2)})`; c.fill();
    }
    if (nOut) nOut.textContent = cleared;
  };
  build(); addEventListener('resize', build);
  btns.forEach((b, i) => b.addEventListener('click', () => { active = active === i ? -1 : i; btns.forEach((x, j) => x.setAttribute('aria-pressed', j === active)); }));
  hooks.push(dt => { if (vis.on) draw(dt); });
};

/* 11 — Rotation d'entretien */
W.rotation = w => {
  const btns = $$('.btn-s', w), vd = $('.verdict', w);
  const upd = () => {
    const n = btns.filter(b => b.getAttribute('aria-pressed') === 'true').length;
    vd.classList.toggle('is-warn', n === 3);
    vd.textContent = n === 0 ? 'Que changez-vous aujourd\'hui ?' : n < 3 ? 'Bon réflexe : une partie reste intacte, vos bactéries aussi' : 'Stop : ne changez jamais tout en même temps !';
  };
  btns.forEach(b => b.addEventListener('click', () => { const on = b.getAttribute('aria-pressed') === 'true'; b.setAttribute('aria-pressed', !on); b.classList.toggle('btn-s--on', !on); upd(); }));
  upd();
};

$$('[data-w]').forEach(el => { const f = W[el.dataset.w]; if (f) { try { f(el); } catch (e) { console.warn(el.dataset.w, e); } } });
})();
