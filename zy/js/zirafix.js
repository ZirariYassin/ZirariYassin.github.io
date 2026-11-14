/* ZiraFix behaviour: theme, language, navigation, the service finder, the request picker and the contact form.
   Same patterns as the portfolio's app.js. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = function (k, v) { return ZY.i18n.t(k, v); };
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var EMAIL = "yas.zirari@gmail.com";

  /* ---------- toast ---------- */
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2400);
  }
  function go(el, block) { if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: block || "start" }); }

  /* ---------- theme (shared with the portfolio, circular reveal via View Transitions) ---------- */
  function setTheme(next, originEl) {
    function apply() {
      root.dataset.theme = next;
      try { localStorage.setItem("zy-theme", next); } catch (e) {}
      document.dispatchEvent(new CustomEvent("themechange"));
    }
    if (!document.startViewTransition || reduce) return apply();
    var r = (originEl || $("#theme-toggle")).getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var vt = document.startViewTransition(apply);
    vt.ready.then(function () {
      root.animate({ clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + rad + "px at " + x + "px " + y + "px)"] },
        { duration: 650, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" });
    }).catch(function () {});
  }
  $("#theme-toggle").addEventListener("click", function (e) { setTheme(root.dataset.theme === "dark" ? "light" : "dark", e.currentTarget); });

  /* ---------- language ---------- */
  $$("[data-lang]").forEach(function (b) { b.addEventListener("click", function () { ZY.i18n.setLang(b.getAttribute("data-lang")); }); });

  /* ---------- nav: scrolled state, progress, scroll-spy, mobile menu ---------- */
  var nav = $("#nav"), bar = $(".progress i"), ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY, max = root.scrollHeight - innerHeight;
      nav.classList.toggle("is-scrolled", y > 8);
      bar.style.setProperty("--p", max > 0 ? Math.min(1, y / max).toFixed(4) : 0);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  var links = $$(".nav-links a[href^='#']");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        links.forEach(function (a) { a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + id)); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  var burger = $("#burger"), menu = $("#menu");
  function setMenu(open) { menu.hidden = !open; nav.classList.toggle("is-open", open); burger.setAttribute("aria-expanded", String(open)); }
  burger.addEventListener("click", function () { setMenu(menu.hidden); });
  $$("a, button", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  $("#year").textContent = new Date().getFullYear();
  $$(".kbd-mod").forEach(function (k) { k.textContent = isMac ? "⌘" : "Ctrl"; });

  /* ---------- service finder ----------
     Every service line carries data-kw: its text in the three languages plus a few everyday words
     ("lent", "chauffe", "hors ligne"), lower-cased and without accents. A query matches when every
     word of it is found in that string, so the search works whatever language the page is in. */
  function norm(s) {
    return (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’‘`]/g, "'").replace(/\s+/g, " ").trim();
  }
  function words(s) { s = norm(s); return s ? s.split(" ") : []; }

  var grid = $("#svc-grid"), input = $("#svc-q"), clearBtn = $("#svc-clear"), statusEl = $("#svc-status"), emptyEl = $("#svc-empty");
  var catBtns = $$("#cat-filters [data-cat]"), symBtns = $$("#sym-row [data-sym]");
  var state = { cat: "all", q: "", sym: "" };
  var picked = [];

  var cards = $$(".svc-card").map(function (el) {
    return {
      el: el, id: el.getAttribute("data-cat"), typeEl: $("[data-count]", el), n: 0,
      items: $$(".covers li", el).map(function (li) { var b = $(".svc", li); return { li: li, btn: b, kw: b.getAttribute("data-kw") }; })
    };
  });
  var totalItems = cards.reduce(function (n, c) { return n + c.items.length; }, 0);

  function render() {
    var need = words(state.q).concat(words(state.sym)), shownItems = 0, shownCards = 0, anyAll = 0;
    cards.forEach(function (c) {
      var n = 0;
      c.items.forEach(function (it) {
        var ok = need.every(function (w) { return it.kw.indexOf(w) > -1; });
        it.li.classList.toggle("is-out", !ok);
        if (ok) n++;
      });
      c.n = n; anyAll += n;
      var show = (state.cat === "all" || state.cat === c.id) && n > 0;
      c.el.classList.toggle("is-out", !show);
      if (show) { shownCards++; shownItems += n; }
      c.typeEl.textContent = need.length && n < c.items.length ? t("card.countOf", { n: n, total: c.items.length }) : t("card.count", { n: c.items.length });
    });
    catBtns.forEach(function (b) {
      var id = b.getAttribute("data-cat"), n = id === "all" ? anyAll : (cards.filter(function (c) { return c.id === id; })[0] || { n: 0 }).n;
      $(".n", b).textContent = n;
      b.classList.toggle("is-empty", n === 0);
      b.setAttribute("aria-pressed", String(id === state.cat));
    });
    symBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-sym") === state.sym)); });
    grid.setAttribute("data-n", shownCards);
    clearBtn.hidden = !state.q;
    emptyEl.hidden = shownItems > 0;
    var filtered = need.length || state.cat !== "all";
    statusEl.textContent = !filtered ? t("svc.all", { n: totalItems, c: cards.length }) : shownItems === 0 ? t("svc.none") : shownItems === 1 ? t("svc.one") : t("svc.some", { n: shownItems });
  }

  function setCat(id) { state.cat = id; render(); }
  catBtns.forEach(function (b) { b.addEventListener("click", function () { setCat(b.getAttribute("data-cat")); }); });

  input.addEventListener("input", function () {
    state.q = input.value;
    if (state.q.trim()) state.cat = "all";
    render();
  });
  input.addEventListener("keydown", function (e) { if (e.key === "Escape" && input.value) { e.preventDefault(); input.value = ""; state.q = ""; render(); } });
  clearBtn.addEventListener("click", function () { input.value = ""; state.q = ""; render(); input.focus(); });
  symBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var k = b.getAttribute("data-sym");
      state.sym = state.sym === k ? "" : k;
      if (state.sym) state.cat = "all";
      render();
    });
  });
  $("#svc-reset").addEventListener("click", function () { input.value = ""; state = { cat: "all", q: "", sym: "" }; render(); });

  // Device tiles in the hero open the matching category
  $$(".tile[data-go]").forEach(function (b) {
    b.addEventListener("click", function () {
      input.value = ""; state = { cat: b.getAttribute("data-go"), q: "", sym: "" }; render();
      go($("#services"));
    });
    b.addEventListener("pointermove", function (e) {
      var r = b.getBoundingClientRect();
      b.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
      b.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
    });
  });

  // Ctrl/Cmd + K, or the search button in the header, jumps to the finder
  function focusFinder() {
    go($("#services"));
    setTimeout(function () { input.focus({ preventScroll: true }); }, reduce ? 0 : 350);
  }
  $$("[data-find]").forEach(function (b) { b.addEventListener("click", focusFinder); });
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); focusFinder(); }
  });

  /* ---------- request picker: tap services, send them with the message ---------- */
  var pill = $("#pick-pill"), pillText = $("#pick-text");
  function updatePill() {
    pill.hidden = picked.length === 0;
    pillText.textContent = picked.length === 1 ? t("pick.one") : t("pick.many", { n: picked.length });
  }
  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".svc");
    if (!b) return;
    var li = b.parentNode, i = picked.indexOf(b);
    if (i > -1) picked.splice(i, 1); else picked.push(b);
    var on = i === -1;
    li.classList.toggle("is-picked", on);
    b.setAttribute("aria-pressed", String(on));
    updatePill();
  });
  $("#pick-clear").addEventListener("click", function () {
    picked.forEach(function (b) { b.parentNode.classList.remove("is-picked"); b.setAttribute("aria-pressed", "false"); });
    picked = []; updatePill();
  });

  var form = $("#contact-form"), formErr = $("#form-error"), lastBlock = "";
  $("#pick-send").addEventListener("click", function () {
    var ta = form.elements.message;
    var block = t("pick.intro") + "\n" + picked.map(function (b) { return "- " + b.textContent.trim(); }).join("\n") + "\n\n";
    if (!ta.value.trim()) ta.value = block;
    else if (lastBlock && ta.value.indexOf(lastBlock) > -1) ta.value = ta.value.replace(lastBlock, block);
    else ta.value = ta.value.replace(/\s+$/, "") + "\n\n" + block;
    lastBlock = block;
    toast(t("toast.picked"));
    go($("#contact"));
  });

  document.addEventListener("langchange", function () { render(); updatePill(); });

  /* ---------- copy buttons ---------- */
  function copyText(text, msgKey) {
    function done() { toast(t(msgKey)); }
    if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(text).then(done, fallback); } else fallback();
    function fallback() {
      var ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      ta.remove();
    }
  }
  $$("[data-copy]").forEach(function (b) { b.addEventListener("click", function () { copyText(b.getAttribute("data-copy"), b.getAttribute("data-toast")); }); });

  /* ---------- contact form (opens the visitor's mail app) ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements, name = f.name.value.trim(), mail = f.email.value.trim(), msg = f.message.value.trim();
    [f.name, f.email, f.message].forEach(function (x) { x.removeAttribute("aria-invalid"); });
    var err = "";
    if (!name || !mail || !msg) {
      err = t("form.errRequired");
      [f.name, f.email, f.message].forEach(function (x) { if (!x.value.trim()) x.setAttribute("aria-invalid", "true"); });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      err = t("form.errEmail"); f.email.setAttribute("aria-invalid", "true");
    }
    formErr.hidden = !err; formErr.textContent = err;
    if (err) { var bad = $('[aria-invalid="true"]', form); if (bad) bad.focus(); return; }
    var lines = [];
    if (f.device.value) lines.push(t("js.device") + " : " + f.device.options[f.device.selectedIndex].text);
    if (f.zone.value.trim()) lines.push(t("js.zone") + " : " + f.zone.value.trim());
    if (f.phone.value.trim()) lines.push(t("js.phone") + " : " + f.phone.value.trim());
    var body = msg + "\n\n" + (lines.length ? lines.join("\n") + "\n" : "") + name + " <" + mail + ">";
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(t("js.subject", { name: name })) + "&body=" + encodeURIComponent(body);
    toast(t("toast.mail"));
  });

  render();
})();
