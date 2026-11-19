/* AQUAMIROIR — galerie : filtres animés + visionneuse plein écran */
(() => {
'use strict';
const A = window.AQ; if (!A) return;
const { $, $$, reduce } = A;
const items = $$('.ph'), filters = $$('.filters button'), count = $('.js-shown');
const lb = $('.lb'), im = $('.lb__stage img'), cap = $('.lb__cap'), cnt = $('.lb__count');
let list = [], idx = 0, lastFocus = null, cat = 'all';

/* chargement : fondu + repli si l'image manque */
items.forEach(ph => {
  const i = $('img', ph); if (!i) return;
  const ok = () => ph.classList.add('is-loaded');
  if (i.complete && i.naturalWidth) ok(); else i.addEventListener('load', ok);
  i.addEventListener('aq-broken', () => ph.classList.add('is-failed'));
});

/* filtres (avec transition de vue quand le navigateur sait le faire) */
const apply = k => {
  cat = k;
  const run = () => {
    items.forEach(el => el.classList.toggle('is-hidden', k !== 'all' && el.dataset.k !== k));
    list = items.filter(el => !el.classList.contains('is-hidden') && !el.classList.contains('is-failed'));
    if (count) count.textContent = list.length;
  };
  filters.forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
  if (document.startViewTransition && !reduce) document.startViewTransition(run); else run();
  try { const u = new URL(location.href); if (k === 'all') u.searchParams.delete('cat'); else u.searchParams.set('cat', k); history.replaceState(null, '', u); } catch (e) {}
};
filters.forEach(b => b.addEventListener('click', () => apply(b.dataset.k)));
const q = new URLSearchParams(location.search).get('cat');
apply(filters.some(b => b.dataset.k === q) ? q : 'all');

/* visionneuse */
const show = (i, dir = 0) => {
  idx = (i + list.length) % list.length; const el = list[idx], f = $('img', el);
  im.classList.remove('is-in'); im.hidden = false; delete im.dataset.t;
  const fullL = el.dataset.full, fullR = el.dataset.fullfb;
  im.dataset.fb = fullR; im.onerror = () => { if (im.dataset.t) { im.src = f.currentSrc || f.src; } else AQfb(im); };
  im.onload = () => im.classList.add('is-in');
  im.alt = el.dataset.cap || ''; im.src = fullL;
  cap.textContent = el.dataset.cap; cnt.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(list.length).padStart(2, '0')}`;
  [1, -1].forEach(d => { const n = list[(idx + d + list.length) % list.length]; if (n) { const p = new Image(); p.src = n.dataset.full; } });
};
const open = el => { lastFocus = el; list = items.filter(x => !x.classList.contains('is-hidden') && !x.classList.contains('is-failed')); show(list.indexOf(el)); lb.classList.add('is-open'); lb.removeAttribute('inert'); document.documentElement.style.overflow = 'hidden'; $('.lb__close').focus(); };
const close = () => { lb.classList.remove('is-open'); lb.setAttribute('inert', ''); document.documentElement.style.overflow = ''; lastFocus && lastFocus.focus(); };
items.forEach(el => el.addEventListener('click', () => open(el)));
$('.lb__close').addEventListener('click', close);
$('.lb__nav.prev').addEventListener('click', () => show(idx - 1));
$('.lb__nav.next').addEventListener('click', () => show(idx + 1));
lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('lb__stage')) close(); });
addEventListener('keydown', e => {
  if (!lb.classList.contains('is-open')) return;
  if (e.key === 'Escape') close(); else if (e.key === 'ArrowRight') show(idx + 1); else if (e.key === 'ArrowLeft') show(idx - 1);
  else if (e.key === 'Tab') { const f = $$('button', lb); const first = f[0], last = f[f.length - 1]; if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); } else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); } }
});
let sx = 0; const st = $('.lb__stage');
st.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
st.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) show(idx + (d < 0 ? 1 : -1)); }, { passive: true });
lb.setAttribute('inert', '');
})();
