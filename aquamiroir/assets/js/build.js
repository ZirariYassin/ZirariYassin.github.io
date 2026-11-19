/* AQUAMIROIR — pages « en construction » : éclatez des bulles */
(() => {
'use strict';
const A = window.AQ; if (!A) return;
const { $, $$, reduce } = A;
const box = $('.build'); if (!box) return;
const out = $('.js-pop'), msg = $('.js-msg'); let n = 0, live = 0, on = true;
new IntersectionObserver(es => es.forEach(e => { on = e.isIntersecting; })).observe(box);
const spawn = () => {
  if (!on || document.hidden || live > 13) return;
  const b = document.createElement('span'), s = 18 + Math.random() * 54;
  b.className = 'bubble'; b.setAttribute('aria-hidden', 'true');
  b.style.cssText = `left:${(4 + Math.random() * 90).toFixed(1)}%;width:${s}px;height:${s}px;--sx:${((Math.random() - .5) * 120).toFixed(0)}px;animation-duration:${(7 + Math.random() * 7).toFixed(1)}s`;
  const kill = () => { if (b.isConnected) { b.remove(); live--; } };
  b.addEventListener('animationend', kill);
  b.addEventListener('pointerdown', e => {
    e.stopPropagation(); if (b.classList.contains('pop')) return; b.classList.add('pop'); n++; out.textContent = n;
    if (msg) msg.textContent = n >= 10 ? 'Bravo, vous avez la main verte… ou plutôt bleue. Passez nous voir au magasin !' : '';
    setTimeout(kill, 420);
  });
  box.append(b); live++;
};
if (!reduce) setInterval(spawn, 900); else { for (let i = 0; i < 5; i++) spawn(); }
})();
