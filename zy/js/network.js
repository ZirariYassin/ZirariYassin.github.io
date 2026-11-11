/* Hero: a small cluster of nodes that "boots" on load.
   Two groups (infrastructure and code) joined by a few bridges, because the work sits between both.
   Labelled nodes are skills. Hover lights a node's links; select one to highlight related work. */
(function () {
  "use strict";

  var canvas = document.getElementById("net");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var hero = canvas.closest(".hero");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var HUBS = [
    { key: "hardware", label: "Hardware", fr: "Matériel", g: "infra" },
    { key: "network", label: "Networking", fr: "Réseau", g: "infra" },
    { key: "winserver", label: "Windows Server", fr: "Windows Server", g: "infra" },
    { key: "ad", label: "Active Directory", fr: "Active Directory", g: "infra" },
    { key: "security", label: "Security", fr: "Sécurité", g: "infra" },
    { key: "java", label: "Java", fr: "Java", g: "code" },
    { key: "python", label: "Python", fr: "Python", g: "code" },
    { key: "csharp", label: "C#", fr: "C#", g: "code" },
    { key: "js", label: "JavaScript", fr: "JavaScript", g: "code" },
    { key: "react", label: "React", fr: "React", g: "code" },
    { key: "sql", label: "SQL", fr: "SQL", g: "code" },
    { key: "git", label: "Git", fr: "Git", g: "code" }
  ];

  var W = 0, H = 0, DPR = 1;
  var nodes = [], edges = [], packets = [];
  var col = { ink: [12, 32, 54], infra: [255, 169, 40], code: [27, 65, 112], bg: [242, 244, 247], accentInk: [12, 32, 54] };
  var pointer = null, hover = null, running = false, visible = true, booted = false;
  var bootStart = 0, lastNow = 0, nextPacket = 0, lastCount = -1;
  var labelW = {};
  var elCount = document.getElementById("net-count");
  var elTotal = document.getElementById("net-total");
  if (elTotal) elTotal.textContent = HUBS.length;

  /* ---------- helpers ---------- */
  function rng(seed) { return function () { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; var t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hex(h) { h = (h || "").trim().replace("#", ""); if (h.length === 3) h = h.replace(/(.)/g, "$1$1"); var n = parseInt(h, 16); return isNaN(n) || h.length !== 6 ? null : [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
  function colorOf(n) { return n.g === "infra" ? col.infra : col.code; }
  function label(n) { return window.ZY && ZY.i18n && ZY.i18n.lang === "fr" ? n.fr : n.label; }

  function readColors() {
    var s = getComputedStyle(document.documentElement);
    col.ink = hex(s.getPropertyValue("--ink")) || col.ink;
    col.infra = hex(s.getPropertyValue("--accent")) || col.infra;
    col.code = hex(s.getPropertyValue("--node-code")) || col.code;
    col.bg = hex(s.getPropertyValue("--bg")) || col.bg;
    col.accentInk = hex(s.getPropertyValue("--accent-ink")) || col.accentInk;
    labelW = {};
    if (W && H) draw(performance.now()); // repaint immediately so a theme change never shows old colours
  }

  /* ---------- layout ---------- */
  function build() {
    var rand = rng(11);
    var wide = W >= 960;
    var x0, x1, y0, y1;
    if (wide) {
      var copy = hero.querySelector(".hero-copy");
      var right = copy ? copy.getBoundingClientRect().right - hero.getBoundingClientRect().left : W * 0.46;
      x0 = Math.min(Math.max(right + 36, W * 0.44), W * 0.62);
      x1 = W - Math.max(40, W * 0.04);
      y0 = 110; y1 = H - 170;
    } else {
      x0 = 30; x1 = W - 30; y0 = 34; y1 = H - 52;
    }
    var rw = x1 - x0, rh = y1 - y0;
    var infraC = { x: x0 + rw * 0.30, y: y0 + rh * 0.68 };
    var codeC = { x: x0 + rw * 0.68, y: y0 + rh * 0.36 };
    var rx = rw * (wide ? 0.2 : 0.25), ry = rh * (wide ? 0.27 : 0.28);

    nodes = []; edges = []; packets = [];

    function place(group, center, count, ringOffset) {
      var hubs = HUBS.filter(function (h) { return h.g === group; });
      hubs.forEach(function (h, i) {
        var a = ringOffset + (i / hubs.length) * Math.PI * 2 + (rand() - 0.5) * 0.35;
        var k = 0.78 + rand() * 0.3;
        nodes.push({ key: h.key, label: h.label, fr: h.fr, g: group, hub: true, r: 6.5, hx: center.x + Math.cos(a) * rx * k, hy: center.y + Math.sin(a) * ry * k, ph: rand() * 6.28 });
      });
      var tries = 0, made = 0;
      while (made < count && tries < 400) {
        tries++;
        var a2 = rand() * 6.28, d = Math.sqrt(rand()) * 1.28;
        var px = center.x + Math.cos(a2) * rx * d, py = center.y + Math.sin(a2) * ry * d;
        if (px < x0 - 10 || px > x1 + 10 || py < y0 - 10 || py > y1 + 10) continue;
        var ok = true;
        for (var j = 0; j < nodes.length; j++) {
          var dx = nodes[j].hx - px, dy = nodes[j].hy - py;
          var min = nodes[j].hub ? 46 : 30;
          if (dx * dx + dy * dy < min * min) { ok = false; break; }
        }
        if (!ok) continue;
        nodes.push({ key: null, g: group, hub: false, r: 2.6 + rand() * 1.6, hx: px, hy: py, ph: rand() * 6.28 });
        made++;
      }
    }
    var scale = Math.min(1, Math.max(0.55, (rw * rh) / 420000));
    place("infra", infraC, Math.round(13 * scale + 4), 0.5);
    place("code", codeC, Math.round(17 * scale + 4), -1.2);

    nodes.forEach(function (n) { n.x = n.hx; n.y = n.hy; n.vx = 0; n.vy = 0; n.online = false; n.at = 0; });

    // Links: each node to its nearest same-group neighbours; hubs get a few more.
    var seen = {};
    function link(i, j, bridge) {
      var id = i < j ? i + "-" + j : j + "-" + i;
      if (seen[id]) return; seen[id] = 1;
      edges.push({ a: nodes[i], b: nodes[j], bridge: !!bridge, i: i, j: j });
    }
    nodes.forEach(function (n, i) {
      var cand = [];
      nodes.forEach(function (m, j) { if (i !== j && m.g === n.g) cand.push({ j: j, d: Math.hypot(n.hx - m.hx, n.hy - m.hy) }); });
      cand.sort(function (p, q) { return p.d - q.d; });
      var take = n.hub ? 3 : 2;
      for (var k = 0; k < take && k < cand.length; k++) link(i, cand[k].j, false);
    });
    // Bridges between groups (hub-to-hub where possible).
    var cross = [];
    nodes.forEach(function (n, i) {
      if (n.g !== "infra") return;
      nodes.forEach(function (m, j) { if (m.g === "code") cross.push({ i: i, j: j, d: Math.hypot(n.hx - m.hx, n.hy - m.hy) - (n.hub && m.hub ? 80 : 0) }); });
    });
    cross.sort(function (p, q) { return p.d - q.d; });
    var usedI = {}, usedJ = {}, bridges = 0;
    for (var c = 0; c < cross.length && bridges < 5; c++) {
      if (usedI[cross[c].i] || usedJ[cross[c].j]) continue;
      usedI[cross[c].i] = usedJ[cross[c].j] = 1; link(cross[c].i, cross[c].j, true); bridges++;
    }

    // Adjacency for hover highlighting
    nodes.forEach(function (n) { n.adj = []; });
    edges.forEach(function (e) { e.a.adj.push(e); e.b.adj.push(e); });

    // Boot order: a wave that sweeps from the left edge.
    var order = nodes.slice().sort(function (p, q) { return p.hx - q.hx; });
    order.forEach(function (n, r) { n.bootDelay = 350 + (r / order.length) * 2300 + rand() * 120; });
    if (reduce || booted) nodes.forEach(function (n) { n.online = true; n.at = -9999; });
    bootStart = performance.now();
    updateCount(true);
  }

  function updateCount(force) {
    var c = 0;
    nodes.forEach(function (n) { if (n.hub && n.online) c++; });
    if (force || c !== lastCount) { lastCount = c; if (elCount) elCount.textContent = c; }
  }

  function resize() {
    var r = canvas.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    if (!W || !H) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
    requestDraw();
  }

  /* ---------- simulation ---------- */
  function step(now, dt) {
    var allOn = true;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (!n.online) {
        if (now - bootStart >= n.bootDelay) { n.online = true; n.at = now; } else allOn = false;
      }
      var tx = n.hx, ty = n.hy;
      if (!reduce) {
        tx += Math.sin(now * 0.00055 + n.ph) * 5;
        ty += Math.cos(now * 0.00047 + n.ph * 1.3) * 5;
        if (pointer) {
          var dx = n.x - pointer.x, dy = n.y - pointer.y, d = Math.hypot(dx, dy), R = 130;
          if (d < R && d > 0.1) { var f = Math.pow(1 - d / R, 2) * 34; tx += (dx / d) * f; ty += (dy / d) * f; }
        }
        n.vx += (tx - n.x) * 0.075; n.vy += (ty - n.y) * 0.075;
        n.vx *= 0.8; n.vy *= 0.8;
        n.x += n.vx * (dt / 16); n.y += n.vy * (dt / 16);
      }
    }
    if (allOn) booted = true;
    updateCount();

    // Packets travelling along links (a little traffic)
    if (!reduce && booted) {
      if (now > nextPacket && packets.length < 8 && edges.length) {
        var e = edges[(Math.random() * edges.length) | 0];
        packets.push({ e: e, t: 0, dir: Math.random() < 0.5 ? 1 : -1, v: 0.00035 + Math.random() * 0.0005 });
        nextPacket = now + 260 + Math.random() * 520;
      }
      for (var p = packets.length - 1; p >= 0; p--) { packets[p].t += packets[p].v * dt; if (packets[p].t >= 1) packets.splice(p, 1); }
    }
  }

  function findHub(x, y, slop) {
    var best = null, bd = slop;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i]; if (!n.hub || !n.online) continue;
      var d = Math.hypot(n.x - x, n.y - y);
      if (d < bd) { bd = d; best = n; }
    }
    return best;
  }

  /* ---------- drawing ---------- */
  function textWidth(s) {
    if (labelW[s] == null) { ctx.font = "600 12.5px 'Hanken Grotesk', system-ui, sans-serif"; labelW[s] = ctx.measureText(s).width; }
    return labelW[s];
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function draw(now) {
    ctx.clearRect(0, 0, W, H);
    var hoverEdges = hover ? hover.adj : null;

    // Links
    ctx.lineCap = "round";
    edges.forEach(function (e) {
      if (!e.a.online || !e.b.online) return;
      var lit = hoverEdges && (e.a === hover || e.b === hover);
      var alpha = lit ? 0.95 : (e.bridge ? 0.34 : 0.17);
      if (hover && !lit) alpha *= 0.55;
      if (e.bridge) {
        var g = ctx.createLinearGradient(e.a.x, e.a.y, e.b.x, e.b.y);
        g.addColorStop(0, rgba(col.infra, alpha)); g.addColorStop(1, rgba(col.code, alpha));
        ctx.strokeStyle = g;
      } else {
        ctx.strokeStyle = lit ? rgba(colorOf(hover), alpha) : rgba(col.ink, alpha);
      }
      ctx.lineWidth = lit ? 1.8 : (e.bridge ? 1.4 : 1);
      ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
    });

    // Packets
    packets.forEach(function (p) {
      var a = p.dir > 0 ? p.e.a : p.e.b, b = p.dir > 0 ? p.e.b : p.e.a;
      var x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
      var c = p.e.bridge ? col.infra : colorOf(p.e.a);
      ctx.fillStyle = rgba(c, 0.18); ctx.beginPath(); ctx.arc(x, y, 6, 0, 6.283); ctx.fill();
      ctx.fillStyle = rgba(c, 1); ctx.beginPath(); ctx.arc(x, y, 2.3, 0, 6.283); ctx.fill();
    });

    // Nodes
    nodes.forEach(function (n) {
      var c = colorOf(n);
      if (!n.online) {
        ctx.strokeStyle = rgba(col.ink, 0.22); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.hub ? 5 : n.r, 0, 6.283); ctx.stroke();
        return;
      }
      var isHover = n === hover;
      var r = n.r + (isHover ? 2.5 : 0);
      var age = now - n.at;
      if (age < 900 && !reduce) { // LED "link up" pulse
        var k = age / 900;
        ctx.strokeStyle = rgba(c, (1 - k) * 0.8); ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(n.x, n.y, r + 4 + k * 18, 0, 6.283); ctx.stroke();
      }
      if (n.hub) {
        ctx.fillStyle = rgba(c, isHover ? 0.3 : 0.16);
        ctx.beginPath(); ctx.arc(n.x, n.y, r + 6, 0, 6.283); ctx.fill();
      }
      ctx.fillStyle = rgba(c, n.hub ? 1 : 0.75);
      ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.283); ctx.fill();
      if (n.hub) { ctx.strokeStyle = rgba(col.bg, 1); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, 6.283); ctx.stroke(); }
    });

    // Labels
    ctx.textBaseline = "middle";
    // Labels pick the first free side (right, left, below, above) so they never overlap each other.
    // A label with no free side stays hidden until its node is hovered or tapped.
    var placed = [];
    function overlaps(r) {
      for (var q = 0; q < placed.length; q++) {
        var p = placed[q];
        if (r.x < p.x + p.w + 3 && r.x + r.w + 3 > p.x && r.y < p.y + p.h + 3 && r.y + r.h + 3 > p.y) return true;
      }
      return false;
    }
    var order = nodes.filter(function (n) { return n.hub && n.online && !(now - n.at < 250 && !reduce); });
    order.sort(function (a, b) { return (b === hover) - (a === hover); });
    order.forEach(function (n) {
      var s = label(n), tw = textWidth(s), padX = 9, h = 24, w = tw + padX * 2, gap = n.r + 11;
      var cands = {
        right: { x: n.x + gap, y: n.y - h / 2 },
        left: { x: n.x - gap - w, y: n.y - h / 2 },
        below: { x: n.x - w / 2, y: n.y + gap - 4 },
        above: { x: n.x - w / 2, y: n.y - gap - h + 4 }
      };
      var sides = ["right", "left", "below", "above"];
      if (n.side) { sides.splice(sides.indexOf(n.side), 1); sides.unshift(n.side); }
      var pos = null;
      for (var k = 0; k < sides.length; k++) {
        var c = cands[sides[k]], r = { x: c.x, y: c.y, w: w, h: h };
        if (r.x < 4 || r.x + w > W - 4 || r.y < 4 || r.y + h > H - 4) continue;
        if (!overlaps(r)) { pos = r; n.side = sides[k]; break; }
      }
      if (!pos) {
        if (n !== hover) return;
        pos = { x: Math.min(Math.max(cands.right.x, 4), W - 4 - w), y: cands.right.y, w: w, h: h };
      }
      placed.push(pos);
      var x = pos.x, y = pos.y;
      var isHover = n === hover;
      ctx.globalAlpha = hover && !isHover && !(hover.adj.some(function (e) { return e.a === n || e.b === n; })) ? 0.5 : 1;
      roundRect(x, y, tw + padX * 2, h, 12);
      ctx.fillStyle = isHover ? rgba(colorOf(n), 1) : rgba(col.bg, 0.86); ctx.fill();
      ctx.strokeStyle = isHover ? rgba(colorOf(n), 1) : rgba(col.ink, 0.2); ctx.lineWidth = 1; ctx.stroke();
      ctx.font = "600 12.5px 'Hanken Grotesk', system-ui, sans-serif";
      ctx.fillStyle = isHover ? (n.g === "infra" ? rgba(col.accentInk, 1) : "#fff") : rgba(col.ink, 0.92);
      ctx.fillText(s, x + padX, y + h / 2 + 0.5);
      ctx.globalAlpha = 1;
    });
  }

  /* ---------- loop ---------- */
  var pending = false;
  function requestDraw() {
    if (running || pending) return;
    pending = true;
    requestAnimationFrame(function (t) { pending = false; draw(t); });
  }

  function frame(now) {
    if (!running) return;
    var dt = Math.min(48, now - (lastNow || now)); lastNow = now;
    step(now, dt);
    draw(now);
    requestAnimationFrame(frame);
  }

  function start() {
    if (running || reduce || !visible || document.hidden) return;
    running = true; lastNow = 0; requestAnimationFrame(frame);
  }
  function stop() { running = false; }

  /* ---------- events ---------- */
  function toLocal(e) { var r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

  hero.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    var p = toLocal(e);
    if (p.x < 0 || p.y < 0 || p.x > W || p.y > H) { pointer = null; setHover(null); return; }
    pointer = p;
    setHover(findHub(p.x, p.y, 26));
  });
  hero.addEventListener("pointerleave", function () { pointer = null; setHover(null); });
  hero.addEventListener("click", function (e) {
    if (e.target.closest("a, button")) return;
    var p = toLocal(e);
    var hub = findHub(p.x, p.y, e.pointerType === "touch" || e.detail === 0 ? 34 : 26) || (hover);
    if (hub && window.ZY && ZY.selectSkill) ZY.selectSkill(hub.key, { scroll: true });
  });

  function setHover(n) {
    if (n === hover) return;
    hover = n;
    canvas.style.cursor = n ? "pointer" : "default";
    requestDraw();
  }

  document.addEventListener("themechange", readColors);
  document.addEventListener("langchange", function () { labelW = {}; requestDraw(); });
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; visible ? start() : stop(); }, { threshold: 0 }).observe(hero);
  }
  if ("ResizeObserver" in window) {
    var t;
    new ResizeObserver(function () { clearTimeout(t); t = setTimeout(function () { resize(); start(); }, 80); }).observe(canvas);
  } else { window.addEventListener("resize", resize); }

  function boot() { readColors(); resize(); start(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { labelW = {}; requestDraw(); });
  boot();
})();
