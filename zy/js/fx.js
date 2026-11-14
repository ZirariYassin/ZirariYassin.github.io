/* Motion layer.
   Everything here is progressive enhancement:
   - html.fx is only added when this script runs; the CSS gates every effect on it.
   - Ambient motion pauses when its section is off screen, and is skipped for prefers-reduced-motion.
   Modules: hero aurora (WebGL), scroll depth, tech ticker, project art, card light and tilt,
   timeline signal, heading wipes, magnetic buttons, contact dot grid. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var hasIO = "IntersectionObserver" in window;
  root.classList.add("fx");

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function hex(h) {
    h = (h || "").trim().replace("#", "");
    if (h.length === 3) h = h.replace(/(.)/g, "$1$1");
    var n = parseInt(h, 16);
    return isNaN(n) || h.length !== 6 ? null : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgbOf(s) {
    var m = /rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)/.exec(s || "");
    return m ? [+m[1], +m[2], +m[3]] : null;
  }
  function watch(el, cb, margin) {
    if (!hasIO) { cb(true); return; }
    new IntersectionObserver(function (en) { cb(en[en.length - 1].isIntersecting); }, { rootMargin: margin || "0px" }).observe(el);
  }

  var hero = $("#top");

  /* ====================================================================
     Hero aurora: a slow noise field on the GPU, rendered at low resolution
     (it is all soft gradients) and pulled toward the pointer.
     ==================================================================== */
  var scrollNorm = 0; // 0 at top, 1 once the hero has scrolled away
  (function aurora() {
    var cv = $("#aurora");
    if (!cv || !hero) return;
    var gl = null;
    try { gl = cv.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" }); } catch (e) {}
    if (!gl) { cv.remove(); return; }

    var VS = "attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }";
    var FS = [
      "#ifdef GL_FRAGMENT_PRECISION_HIGH", "precision highp float;", "#else", "precision mediump float;", "#endif",
      "uniform vec2 uRes; uniform float uT; uniform vec2 uM; uniform float uMA; uniform vec3 uBg; uniform vec3 uA; uniform vec3 uB; uniform float uK; uniform float uS;",
      "float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
      "float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);",
      "  return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x), mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y); }",
      "float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * n(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }",
      "void main(){",
      "  vec2 uv = gl_FragCoord.xy / uRes; float asp = uRes.x / uRes.y;",
      "  vec2 p = vec2(uv.x * asp, uv.y + uS * 0.12);",
      "  float t = uT * 0.045;",
      "  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, 1.3) - t));",
      "  vec2 r = vec2(fbm(p * 1.5 + 2.2 * q + vec2(1.7, 9.2) + t * 1.2), fbm(p * 1.5 + 2.2 * q + vec2(8.3, 2.8) - t));",
      "  float f = fbm(p * 1.1 + 2.4 * r);",
      "  float side = smoothstep(0.1, 0.95, uv.x);",
      "  float a = smoothstep(0.3, 0.85, f);",
      "  float b = smoothstep(0.55, 0.95, f * (0.4 + r.x * 1.5));",
      "  vec2 mp = vec2(uM.x * asp, uM.y);",
      "  float cg = exp(-pow(distance(vec2(uv.x * asp, uv.y), mp) * 2.6, 2.0)) * uMA;",
      "  vec3 col = uBg;",
      "  col = mix(col, uA, a * uK * (0.3 + 0.7 * side));",
      "  col = mix(col, uB, clamp(b * uK * 0.9 * side + cg * 0.5 * uK, 0.0, 1.0));",
      "  col += (h(gl_FragCoord.xy + uT) - 0.5) * 0.012;",
      "  gl_FragColor = vec4(col, 1.0);",
      "}"
    ].join("\n");

    function shader(type, src) {
      var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    }
    var prog;
    try {
      prog = gl.createProgram();
      gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS));
      gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error("link failed");
    } catch (e) { cv.remove(); return; }
    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var U = {};
    ["uRes", "uT", "uM", "uMA", "uBg", "uA", "uB", "uK", "uS"].forEach(function (k) { U[k] = gl.getUniformLocation(prog, k); });

    var bg = [.95, .96, .97], A = [.6, .75, .92], B = [1, .78, .47], K = .5;
    var m = { x: .7, y: .5 }, mt = { x: .7, y: .5 }, ma = 0, mat = 0;
    var t0 = performance.now(), last = 0, raf = 0, running = false, seen = true;

    function colors() {
      var cs = getComputedStyle(root);
      var b = hex(cs.getPropertyValue("--bg")), a = hex(cs.getPropertyValue("--aurora-a")), c = hex(cs.getPropertyValue("--aurora-b"));
      if (b) bg = b.map(function (v) { return v / 255; });
      if (a) A = a.map(function (v) { return v / 255; });
      if (c) B = c.map(function (v) { return v / 255; });
      K = parseFloat(cs.getPropertyValue("--aurora-k")) || .5;
    }
    function size() {
      var r = hero.getBoundingClientRect();
      var s = window.innerWidth < 720 ? .34 : .5; // soft gradients: a half-resolution buffer is indistinguishable
      cv.width = Math.max(2, Math.round(r.width * s)); cv.height = Math.max(2, Math.round(r.height * s));
    }
    function render(now) {
      var t = reduce ? 38 : (now - t0) / 1000;
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(U.uRes, cv.width, cv.height);
      gl.uniform1f(U.uT, t);
      gl.uniform2f(U.uM, m.x, m.y);
      gl.uniform1f(U.uMA, ma);
      gl.uniform3f(U.uBg, bg[0], bg[1], bg[2]);
      gl.uniform3f(U.uA, A[0], A[1], A[2]);
      gl.uniform3f(U.uB, B[0], B[1], B[2]);
      gl.uniform1f(U.uK, K);
      gl.uniform1f(U.uS, scrollNorm);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function loop(now) {
      raf = 0;
      if (!running) return;
      if (now - last >= 32) { // ~30 fps is plenty for a slow field
        last = now;
        m.x += (mt.x - m.x) * .08; m.y += (mt.y - m.y) * .08; ma += (mat - ma) * .06;
        render(now);
      }
      raf = requestAnimationFrame(loop);
    }
    function start() { if (reduce || running || !seen || document.hidden) return; running = true; raf = requestAnimationFrame(loop); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
    function still() { colors(); size(); render(performance.now()); }

    colors(); size(); render(performance.now());
    if (!reduce) {
      if (fine) {
        hero.addEventListener("pointermove", function (e) {
          if (e.pointerType === "touch") return;
          var r = hero.getBoundingClientRect();
          mt.x = clamp((e.clientX - r.left) / r.width, 0, 1); mt.y = clamp(1 - (e.clientY - r.top) / r.height, 0, 1); mat = 1;
        }, { passive: true });
        hero.addEventListener("pointerleave", function () { mat = 0; });
      }
      watch(hero, function (on) { seen = on; on ? start() : stop(); });
      document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
      start();
    }
    document.addEventListener("themechange", function () { colors(); render(performance.now()); });
    if ("ResizeObserver" in window) {
      var rt;
      new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(function () { size(); render(performance.now()); }, 100); }).observe(hero);
    }
    cv.addEventListener("webglcontextlost", function (e) { e.preventDefault(); stop(); });
  })();

  /* ====================================================================
     Scroll: hero depth, timeline signal, ticker speed. One rAF-throttled handler.
     ==================================================================== */
  var roles = $(".roles"), roleEls = [], rail = null;
  var ticking = false, lastY = window.scrollY, lastT = performance.now();
  var heroH = hero ? hero.offsetHeight : 800;

  function initRail() {
    if (!roles) return;
    rail = document.createElement("div");
    rail.className = "rail"; rail.setAttribute("aria-hidden", "true");
    roles.appendChild(rail);
    roleEls = $$(".role", roles);
    roleEls.forEach(function (r) { $$("li", r).forEach(function (li, i) { li.style.setProperty("--i", i); }); });
  }
  function updateRail() {
    if (!roles) return;
    var vh = window.innerHeight, line = vh * .66, rect = roles.getBoundingClientRect();
    roles.style.setProperty("--p", clamp((line - rect.top) / rect.height, 0, 1).toFixed(4));
    roleEls.forEach(function (r) { r.classList.toggle("is-reached", r.getBoundingClientRect().top + 14 < line); });
  }

  var ticker = { kick: function () {} };
  function update(now) {
    ticking = false;
    var y = window.scrollY, dt = Math.max(1, now - lastT);
    var v = (y - lastY) / dt * 16; // px per 60 fps frame
    lastY = y; lastT = now;
    if (hero && y < heroH + 300) {
      hero.style.setProperty("--sy", Math.max(0, y).toFixed(1));
      scrollNorm = clamp(y / heroH, 0, 1);
    }
    updateRail();
    ticker.kick(v);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }

  initRail();
  if (!reduce) window.addEventListener("scroll", onScroll, { passive: true });
  else window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function (n) { ticking = false; updateRail(); }); } }, { passive: true });
  window.addEventListener("resize", function () { heroH = hero ? hero.offsetHeight : heroH; updateRail(); });
  updateRail();
  document.addEventListener("langchange", function () { requestAnimationFrame(updateRail); });

  /* ====================================================================
     Technology ticker: two rows drifting in opposite directions.
     Scrolling speeds them up and leans them with the scroll direction.
     ==================================================================== */
  (function marquee() {
    var box = $(".marquee");
    if (!box) return;
    var rows = $$(".mq-row", box);
    rows.forEach(function (row) {
      var track = row.firstElementChild;
      if (!track) return;
      var need = Math.ceil(Math.max(window.innerWidth, 2200) / Math.max(1, track.scrollWidth)) + 1;
      for (var i = 1; i < need; i++) {
        var c = track.cloneNode(true); c.setAttribute("aria-hidden", "true"); row.appendChild(c);
      }
    });
    if (reduce) return;

    var list = null, rate = 1, skew = 0, tRate = 1, tSkew = 0, looping = false, inView = false;
    function anims() {
      var a = [];
      $$(".mq-track", box).forEach(function (t) { if (t.getAnimations) t.getAnimations().forEach(function (x) { a.push(x); }); });
      return a;
    }
    function apply() {
      if (!list) list = anims();
      list.forEach(function (a) { try { a.updatePlaybackRate(rate); } catch (e) {} });
      rows.forEach(function (r) { r.style.transform = skew ? "skewX(" + skew.toFixed(2) + "deg)" : ""; });
    }
    function loop() {
      rate += (tRate - rate) * .1; skew += (tSkew - skew) * .12;
      tRate += (1 - tRate) * .05; tSkew *= .92;
      apply();
      if (Math.abs(rate - 1) > .02 || Math.abs(skew) > .05 || Math.abs(tRate - 1) > .02) requestAnimationFrame(loop);
      else { looping = false; rate = 1; skew = 0; apply(); }
    }
    ticker.kick = function (v) {
      if (!inView) return;
      tRate = 1 + clamp(Math.abs(v) * .5, 0, 9);
      tSkew = clamp(-v * .25, -9, 9);
      if (!looping) { looping = true; requestAnimationFrame(loop); }
    };
    watch(box, function (on) { inView = on; box.classList.toggle("is-paused", !on); }, "120px 0px");
  })();

  /* ====================================================================
     Headings wipe in once, the first time they are seen.
     ==================================================================== */
  $$("h2").forEach(function (h) {
    if (hero && hero.contains(h)) return;
    h.setAttribute("data-wipe", "");
    var done = false;
    /* Observe the heading's container, not the heading: while it is clipped, a browser can report
       the heading itself as not visible and the wipe would never run (instant jumps to an anchor). */
    watch(h.parentElement || h, function (on) { if (on && !done) { done = true; h.classList.add("in-view"); } }, "0px 0px -12% 0px");
  });

  /* ====================================================================
     Project art: animates only while on screen. SMIL (packets, dunes) is paused otherwise.
     ==================================================================== */
  (function covers() {
    var all = $$(".cover");
    var eyeCover = $(".cover-inconito"), speedEl = $(".cover-sandwake .spd");
    var ptr = { x: 0, y: 0 }, ptrDirty = false, eyeOn = false, sandOn = false, running = false, lastSpd = 0;

    function loop(now) {
      if (!(eyeOn || sandOn)) { running = false; return; }
      if (sandOn && speedEl && now - lastSpd > 90) {
        lastSpd = now;
        speedEl.textContent = Math.round(96 + 64 * Math.sin(now / 1100) + 22 * Math.sin(now / 370)) + " km/h";
      }
      if (eyeOn && ptrDirty && fine) {
        ptrDirty = false;
        var r = eyeCover.getBoundingClientRect();
        var dx = ptr.x - (r.left + r.width / 2), dy = ptr.y - (r.top + r.height / 2);
        var d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260) * 3.2;
        eyeCover.style.setProperty("--ex", (dx / d * k).toFixed(2) + "px");
        eyeCover.style.setProperty("--ey", (dy / d * k).toFixed(2) + "px");
      }
      requestAnimationFrame(loop);
    }
    function ensure() { if (!running && (eyeOn || sandOn)) { running = true; requestAnimationFrame(loop); } }

    all.forEach(function (c) {
      var svg = c.querySelector("svg");
      var smil = svg && svg.pauseAnimations;
      if (smil) svg.pauseAnimations();
      if (reduce) return;
      watch(c, function (on) {
        c.classList.toggle("live", on);
        if (smil) on ? svg.unpauseAnimations() : svg.pauseAnimations();
        if (c === eyeCover) eyeOn = on;
        if (c.classList.contains("cover-sandwake")) sandOn = on;
        ensure();
      }, "0px");
    });

    if (fine && !reduce) {
      document.addEventListener("pointermove", function (e) {
        if (e.pointerType === "touch") return;
        ptr.x = e.clientX; ptr.y = e.clientY; ptrDirty = true;
        pointerFx(e);
      }, { passive: true });
      document.documentElement.addEventListener("mouseleave", function () { if (tiltEl) { release(tiltEl); tiltEl = null; } });
    }
  })();

  /* ====================================================================
     Cards and focus columns: light follows the pointer; cards also tilt.
     ==================================================================== */
  var tiltEl = null;
  function release(t) { t.classList.remove("is-tilting"); t.style.removeProperty("--rx"); t.style.removeProperty("--ry"); }
  function pointerFx(e) {
    var t = e.target && e.target.closest ? e.target.closest(".proj, .focus > div") : null;
    if (t !== tiltEl) { if (tiltEl) release(tiltEl); tiltEl = t; }
    if (!t) return;
    var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    t.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
    t.style.setProperty("--my", (y * 100).toFixed(1) + "%");
    if (t.classList.contains("proj")) {
      t.classList.add("is-tilting");
      t.style.setProperty("--ry", ((x - .5) * 7).toFixed(2) + "deg");
      t.style.setProperty("--rx", ((.5 - y) * 5).toFixed(2) + "deg");
    }
  }

  /* ====================================================================
     Magnetic buttons in the hero and contact.
     ==================================================================== */
  if (fine && !reduce) {
    $$(".hero .btn, .contact .btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2);
        b.style.transform = "translate(" + (x * .14).toFixed(1) + "px," + (y * .22).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* ====================================================================
     Contact: a grid of dots that swell around the pointer; a click sends a ripple through it.
     ==================================================================== */
  (function dots() {
    var cv = $("#dotgrid"), sec = $("#contact");
    if (!cv || !sec || !cv.getContext) return;
    var ctx = cv.getContext("2d");
    var W = 0, H = 0, GAP = 28, base = [242, 244, 247], acc = [255, 169, 40];
    var ptr = null, inten = 0, ripples = [], raf = 0, inView = false;

    function colors() {
      base = rgbOf(getComputedStyle(sec).color) || base;
      acc = hex(getComputedStyle(root).getPropertyValue("--accent")) || acc;
    }
    function size() {
      var r = sec.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function draw(now) {
      ctx.clearRect(0, 0, W, H);
      var cols = Math.ceil(W / GAP) + 1, rows = Math.ceil(H / GAP) + 1, hot = [];
      ctx.fillStyle = "rgba(" + base[0] + "," + base[1] + "," + base[2] + ",.17)";
      ctx.beginPath();
      for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
          var x = i * GAP + GAP / 2, y = j * GAP + GAP / 2, t = 0, k;
          if (ptr && inten > .01) {
            var d = Math.hypot(x - ptr.x, y - ptr.y);
            if (d < 170) { k = 1 - d / 170; t = k * k * (3 - 2 * k) * inten; }
          }
          for (var q = 0; q < ripples.length; q++) {
            var rp = ripples[q], age = now - rp.t, dd = Math.abs(Math.hypot(x - rp.x, y - rp.y) - age * .55);
            if (dd < 46) t = Math.max(t, (1 - dd / 46) * (1 - age / 1700));
          }
          if (t > .02) hot.push(x, y, t);
          else { ctx.moveTo(x + 1.15, y); ctx.arc(x, y, 1.15, 0, 6.283); }
        }
      }
      ctx.fill();
      for (var h = 0; h < hot.length; h += 3) {
        var tt = hot[h + 2];
        var r = base[0] + (acc[0] - base[0]) * tt, g = base[1] + (acc[1] - base[1]) * tt, b = base[2] + (acc[2] - base[2]) * tt;
        ctx.fillStyle = "rgba(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + "," + (.17 + tt * .83).toFixed(2) + ")";
        ctx.beginPath(); ctx.arc(hot[h], hot[h + 1], 1.15 + tt * 2.6, 0, 6.283); ctx.fill();
      }
    }
    function frame(now) {
      raf = 0;
      inten += ((ptr ? 1 : 0) - inten) * .12;
      ripples = ripples.filter(function (r) { return now - r.t < 1700; });
      draw(now);
      if (inView && (ptr || inten > .02 || ripples.length)) raf = requestAnimationFrame(frame);
    }
    function poke() { if (!raf && inView) raf = requestAnimationFrame(frame); }
    function local(e) { var r = sec.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

    colors(); size(); draw(performance.now());
    if (!reduce) {
      sec.addEventListener("pointermove", function (e) { if (e.pointerType === "touch") return; ptr = local(e); poke(); });
      sec.addEventListener("pointerleave", function () { ptr = null; poke(); });
      sec.addEventListener("pointerdown", function (e) {
        if (e.target.closest("a, button, input, textarea, label, select")) return;
        var p = local(e); ripples.push({ x: p.x, y: p.y, t: performance.now() }); poke();
      });
      watch(sec, function (on) { inView = on; if (on) poke(); }, "0px");
    }
    document.addEventListener("themechange", function () { colors(); draw(performance.now()); });
    if ("ResizeObserver" in window) {
      var rt;
      new ResizeObserver(function () { clearTimeout(rt); rt = setTimeout(function () { size(); draw(performance.now()); }, 100); }).observe(sec);
    }
  })();
})();
