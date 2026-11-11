/* Portfolio behaviour: theme, language, navigation, project filters, skill highlighting,
   case dialogs, command menu and terminal. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var t = function (k, v) { return ZY.i18n.t(k, v); };
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var EMAIL = "yas.zirari@gmail.com";
  var PHONE = "+32 475 612 116";
  var CV = "zy/CV_Zirari_Yassin.pdf";

  /* ---------- toast ---------- */
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add("is-on");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2200);
  }

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* ---------- theme (circular reveal via View Transitions) ---------- */
  function setTheme(next, originEl) {
    function apply() {
      root.dataset.theme = next; store("zy-theme", next);
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
  function toggleTheme(el) { setTheme(root.dataset.theme === "dark" ? "light" : "dark", el); }
  $("#theme-toggle").addEventListener("click", function (e) { toggleTheme(e.currentTarget); });

  /* ---------- language ---------- */
  $$("[data-lang]").forEach(function (b) { b.addEventListener("click", function () { ZY.i18n.setLang(b.getAttribute("data-lang")); }); });
  document.addEventListener("langchange", function () {
    applyDialog(); updatePill(); tickClock();
  });

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

  var links = $$(".nav-links a");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        links.forEach(function (a) { a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + id)); });
        if (id === "top" || id === "education") links.forEach(function (a) { a.setAttribute("aria-current", "false"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(function (s) { spy.observe(s); });
  }

  var burger = $("#burger"), menu = $("#menu");
  function setMenu(open) { menu.hidden = !open; nav.classList.toggle("is-open", open); burger.setAttribute("aria-expanded", String(open)); }
  burger.addEventListener("click", function () { setMenu(menu.hidden); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  $("button[data-open-palette]", menu).addEventListener("click", function () { setMenu(false); });

  /* ---------- clock (Brussels) ---------- */
  var clock = $("#clock");
  function tickClock() {
    try { clock.textContent = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Brussels" }).format(new Date()); }
    catch (e) { clock.hidden = true; }
  }
  tickClock(); setInterval(tickClock, 20000);
  $("#year").textContent = new Date().getFullYear();
  $$(".kbd-mod").forEach(function (k) { k.textContent = isMac ? "⌘" : "Ctrl"; });

  /* ---------- project filter ---------- */
  var filterBtns = $$("[data-filter]");
  filterBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var f = b.getAttribute("data-filter");
      filterBtns.forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      $$(".proj").forEach(function (p) { p.classList.toggle("is-out", f !== "all" && p.getAttribute("data-cat") !== f); });
    });
  });

  /* ---------- skills <-> work highlighting ---------- */
  var skillMap = {}, linked = $$("[data-skills]"), activeSkill = null;
  linked.forEach(function (el) {
    (el.getAttribute("data-skills") || "").split(/\s+/).filter(Boolean).forEach(function (k) { (skillMap[k] = skillMap[k] || []).push(el); });
  });
  var chips = $$(".chip[data-skill]");
  function chipLabel(chip) {
    return Array.prototype.filter.call(chip.childNodes, function (n) { return !(n.classList && n.classList.contains("n")); })
      .map(function (n) { return n.textContent; }).join("").trim();
  }
  chips.forEach(function (chip) {
    var k = chip.getAttribute("data-skill"), n = (skillMap[k] || []).length;
    chip.setAttribute("aria-pressed", "false");
    if (n) {
      var b = document.createElement("span"); b.className = "n"; b.textContent = n; b.setAttribute("aria-hidden", "true"); chip.appendChild(b);
    }
    chip.addEventListener("click", function () { selectSkill(k, { scroll: false }); });
  });

  var pill = $("#filter-pill"), pillName = $("#filter-name");
  function updatePill() {
    if (!activeSkill) return;
    var chip = $('.chip[data-skill="' + activeSkill + '"]');
    pillName.textContent = chip ? chipLabel(chip) : activeSkill;
  }
  function clearSkill() {
    activeSkill = null;
    document.body.classList.remove("has-skill");
    linked.forEach(function (el) { el.classList.remove("is-dim", "is-match"); });
    chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
    pill.hidden = true;
  }
  function selectSkill(key, opts) {
    opts = opts || {};
    var matches = skillMap[key] || [];
    if (!matches.length) {
      // Nothing linked yet: take the visitor to the skill itself.
      var chip = $('.chip[data-skill="' + key + '"]');
      if (chip) {
        $("#skills").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        chip.classList.remove("pulse"); void chip.offsetWidth; chip.classList.add("pulse");
      }
      return;
    }
    if (activeSkill === key && !opts.scroll) return clearSkill();
    activeSkill = key;
    document.body.classList.add("has-skill");
    linked.forEach(function (el) { var on = matches.indexOf(el) > -1; el.classList.toggle("is-match", on); el.classList.toggle("is-dim", !on); });
    chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c.getAttribute("data-skill") === key)); });
    // Make sure matching projects are not hidden by the category filter.
    if (matches.some(function (m) { return m.classList.contains("is-out"); })) $('[data-filter="all"]').click();
    updatePill(); pill.hidden = false;
    if (opts.scroll) scrollToMatch();
  }
  function scrollToMatch() {
    var first = linked.filter(function (el) { return el.classList.contains("is-match"); })[0];
    if (first) first.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  }
  $("#filter-clear").addEventListener("click", clearSkill);
  var showBtn = $("#filter-show"); if (showBtn) showBtn.addEventListener("click", scrollToMatch);
  ZY.selectSkill = selectSkill;

  /* ---------- dialogs ---------- */
  function lock(on) { root.classList.toggle("scroll-lock", on); }
  function wireDialog(d) {
    d.addEventListener("close", function () { lock(false); });
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); }); // backdrop click
    $$("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { d.close(); }); });
  }
  function openDialog(d) { if (!d.open) { d.showModal(); lock(true); } }

  var caseDlg = $("#case-dialog");
  wireDialog(caseDlg);
  function setI18n(el, src) {
    el.textContent = src.textContent;
    if (src.getAttribute("data-i18n")) el.setAttribute("data-i18n", src.getAttribute("data-i18n")); else el.removeAttribute("data-i18n");
  }
  function openCase(proj) {
    setI18n($("#case-type"), $(".proj-type", proj));
    setI18n($("#case-title"), $("h3", proj));
    $("#case-body").innerHTML = $(".case", proj).innerHTML;
    $("#case-tags").innerHTML = $(".tags", proj).innerHTML;
    openDialog(caseDlg);
  }
  function applyDialog() { if (caseDlg.open) ZY.i18n.apply(caseDlg); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-case]");
    if (b) openCase(b.closest(".proj"));
  });

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
  var form = $("#contact-form"), formErr = $("#form-error");
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
    var subject = t("js.subject", { name: name });
    var body = msg + "\n\n" + name + " <" + mail + ">";
    window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    toast(t("toast.mail"));
  });

  /* ---------- command menu ---------- */
  var pal = $("#palette"), palIn = $("#pal-input"), palList = $("#pal-list"), palEmpty = $("#pal-empty");
  wireDialog(pal);
  var palItems = [], palShown = [], palSel = 0;

  function go(id) { var el = $(id); if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }
  function icon(id) { return '<svg class="i" aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  function buildItems() {
    var items = [];
    [["#top", "sec.top", "i-up"], ["#about", "nav.about", "i-doc"], ["#experience", "nav.experience", "i-doc"], ["#projects", "nav.projects", "i-doc"],
     ["#skills", "nav.skills", "i-doc"], ["#education", "sec.education", "i-doc"], ["#contact", "nav.contact", "i-mail"]].forEach(function (s) {
      items.push({ group: t("pal.navigate"), label: t(s[1]), hint: t("act.section"), icon: s[2], kw: s[0].slice(1), run: function () { go(s[0]); } });
    });
    $$(".proj").forEach(function (p) {
      var play = $("a.btn[href$='.html']", p);
      items.push({
        group: t("pal.projects"), label: $("h3", p).textContent.trim(), hint: play ? t("act.play") : t("act.read"), icon: play ? "i-play" : "i-doc",
        kw: $(".proj-type", p).textContent, run: function () { if (play) window.location.href = play.getAttribute("href"); else openCase(p); }
      });
    });
    var other = t("pal.actions");
    items.push({ group: other, label: t("act.cv"), icon: "i-download", kw: "resume curriculum", run: function () { var a = document.createElement("a"); a.href = CV; a.download = ""; document.body.appendChild(a); a.click(); a.remove(); toast(t("toast.cv")); } });
    items.push({ group: other, label: t("act.copyEmail"), icon: "i-copy", kw: "mail contact", run: function () { copyText(EMAIL, "toast.email"); } });
    items.push({ group: other, label: t("act.theme"), icon: root.dataset.theme === "dark" ? "i-sun" : "i-moon", kw: "dark light mode", run: function () { toggleTheme($("#theme-toggle")); } });
    items.push({ group: other, label: ZY.i18n.lang === "fr" ? t("act.toEn") : t("act.toFr"), icon: "i-doc", kw: "language langue français english", run: function () { ZY.i18n.setLang(ZY.i18n.lang === "fr" ? "en" : "fr"); } });
    items.push({ group: other, label: t("act.term"), icon: "i-terminal", kw: "shell console cli", hint: "`", run: function () { openTerm(); } });
    return items;
  }

  function renderPal(q) {
    q = (q || "").toLowerCase().trim();
    var toks = q.split(/\s+/).filter(Boolean);
    palShown = palItems.filter(function (it) {
      var hay = (it.label + " " + (it.kw || "") + " " + it.group).toLowerCase();
      return toks.every(function (tk) { return hay.indexOf(tk) > -1; });
    });
    var html = "", last = "", i = 0;
    palShown.forEach(function (it) {
      if (it.group !== last) { html += '<li role="presentation" class="pal-group">' + it.group + "</li>"; last = it.group; }
      html += '<li role="option" id="pal-o' + i + '" class="pal-item" data-i="' + i + '" aria-selected="false">' + icon(it.icon) + "<span>" + it.label.replace(/</g, "&lt;") + "</span>" + (it.hint ? '<span class="hint-r">' + it.hint + "</span>" : "") + "</li>";
      i++;
    });
    palList.innerHTML = html;
    palEmpty.hidden = palShown.length > 0;
    palSel = 0; markSel();
  }
  function markSel() {
    $$(".pal-item", palList).forEach(function (el, i) { el.setAttribute("aria-selected", String(i === palSel)); });
    var cur = $("#pal-o" + palSel);
    if (cur) { palIn.setAttribute("aria-activedescendant", cur.id); cur.scrollIntoView({ block: "nearest" }); } else palIn.removeAttribute("aria-activedescendant");
  }
  function runPal(i) { var it = palShown[i]; if (!it) return; pal.close(); setTimeout(it.run, 60); }
  function openPal() { palItems = buildItems(); palIn.value = ""; renderPal(""); openDialog(pal); palIn.focus(); }

  palIn.addEventListener("input", function () { renderPal(palIn.value); });
  palIn.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); palSel = Math.min(palShown.length - 1, palSel + 1); markSel(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); palSel = Math.max(0, palSel - 1); markSel(); }
    else if (e.key === "Enter") { e.preventDefault(); runPal(palSel); }
  });
  palList.addEventListener("pointermove", function (e) { var li = e.target.closest(".pal-item"); if (li && +li.dataset.i !== palSel) { palSel = +li.dataset.i; markSel(); } });
  palList.addEventListener("click", function (e) { var li = e.target.closest(".pal-item"); if (li) runPal(+li.dataset.i); });
  $$("[data-open-palette]").forEach(function (b) { b.addEventListener("click", openPal); });

  /* ---------- terminal ---------- */
  var term = $("#term"), tout = $("#term-out"), tin = $("#term-in"), tPrev = null, tHist = [], tHi = 0, tBooted = false;
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function out(html, cls) { var d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html; tout.appendChild(d); tout.scrollTop = tout.scrollHeight; }

  function openTerm() {
    tPrev = document.activeElement;
    term.inert = false; term.classList.add("is-open");
    if (!tBooted) {
      tBooted = true;
      out('<span class="ok">zirari-cluster</span> <span class="dim">ready</span>');
      out('Type <span class="cmd">help</span> to list commands.', "dim");
    }
    setTimeout(function () { tin.focus(); }, 60);
  }
  function closeTerm() {
    term.classList.remove("is-open"); term.inert = true;
    if (tPrev && tPrev.focus) tPrev.focus();
  }
  $("[data-close-term]").addEventListener("click", closeTerm);
  $$("[data-open-term]").forEach(function (b) { b.addEventListener("click", openTerm); });

  var SECTIONS = { top: "#top", about: "#about", experience: "#experience", projects: "#projects", skills: "#skills", education: "#education", contact: "#contact" };
  function projList() {
    return $$(".proj").map(function (p) { return { el: p, title: $("h3", p).textContent.trim(), play: $("a.btn[href$='.html']", p) }; });
  }

  var CMDS = {
    help: function () {
      out([
        "<span class=\"cmd\">whoami</span>       who I am",
        "<span class=\"cmd\">neofetch</span>     system summary",
        "<span class=\"cmd\">skills</span>       what I work with",
        "<span class=\"cmd\">experience</span>   where I have worked",
        "<span class=\"cmd\">projects</span>     list projects, then <span class=\"cmd\">open &lt;n&gt;</span>",
        "<span class=\"cmd\">contact</span>      how to reach me",
        "<span class=\"cmd\">cv</span>           download my CV",
        "<span class=\"cmd\">goto</span> &lt;section&gt;   about, experience, projects, skills, education, contact",
        "<span class=\"cmd\">theme</span> [light|dark]   <span class=\"cmd\">lang</span> [en|fr]   <span class=\"cmd\">clear</span>   <span class=\"cmd\">exit</span>"
      ].join("\n"));
    },
    whoami: function () { out("Zirari Yassîn. IT technician and software developer, Brussels. Works in French and English."); },
    neofetch: function () {
      out([
        '<span class="p">ZY</span>  <span class="cmd">visitor@zirari</span>',
        '<span class="p">ZY</span>  ---------------',
        '    Role       IT technician &amp; software developer',
        '    Location   Brussels, BE',
        '    Languages  FR, EN (fluent), NL, AR (basics)',
        '    Code       Java, Python, C#, JavaScript',
        '    Infra      Windows Server, AD, GPO, LAN/Wi-Fi',
        '    Field      4+ years of hands-on IT work'
      ].join("\n"));
    },
    skills: function () {
      $$(".spec-row").forEach(function (r) {
        out('<span class="cmd">' + esc($("dt", r).textContent) + "</span>\n  " + esc($$(".chip", r).map(chipLabel).join(", ")));
      });
    },
    experience: function () {
      $$(".role").forEach(function (r) { out('<span class="cmd">' + esc($(".org", r).textContent) + "</span>  " + esc($("h3", r).textContent)); });
    },
    projects: function () {
      projList().forEach(function (p, i) { out('<span class="p">' + (i + 1) + "</span>  " + esc(p.title) + ' <span class="dim">' + (p.play ? "(playable)" : "(case)") + "</span>"); });
      out("open &lt;n&gt; to view one.", "dim");
    },
    open: function (a) {
      var list = projList(), q = a.join(" ").toLowerCase(), p;
      if (!q) return out("usage: open &lt;n|name&gt;", "dim");
      p = /^\d+$/.test(q) ? list[+q - 1] : list.filter(function (x) { return x.title.toLowerCase().indexOf(q) > -1; })[0];
      if (!p) return out("no such project: " + esc(q), "dim");
      out("opening " + esc(p.title) + "…", "ok");
      closeTerm();
      setTimeout(function () { if (p.play) window.location.href = p.play.getAttribute("href"); else openCase(p.el); }, 250);
    },
    contact: function () {
      out('email  <a href="mailto:' + EMAIL + '">' + EMAIL + "</a>\nphone  " + PHONE + "\nplace  Jette, Brussels");
    },
    cv: function () { out("downloading CV…", "ok"); CMDS._cv(); },
    _cv: function () { var a = document.createElement("a"); a.href = CV; a.download = ""; document.body.appendChild(a); a.click(); a.remove(); },
    goto: function (a) {
      var k = (a[0] || "").toLowerCase();
      if (!SECTIONS[k]) return out("usage: goto &lt;" + Object.keys(SECTIONS).join("|") + "&gt;", "dim");
      closeTerm(); setTimeout(function () { go(SECTIONS[k]); }, 250);
    },
    theme: function (a) {
      var m = (a[0] || "").toLowerCase();
      var next = m === "light" || m === "dark" ? m : (root.dataset.theme === "dark" ? "light" : "dark");
      setTheme(next); out("theme: " + next, "ok");
    },
    lang: function (a) {
      var m = (a[0] || "").toLowerCase();
      if (m !== "en" && m !== "fr") return out("usage: lang &lt;en|fr&gt;", "dim");
      ZY.i18n.setLang(m); out("language: " + m, "ok");
    },
    clear: function () { tout.innerHTML = ""; },
    exit: function () { closeTerm(); },
    sudo: function (a) {
      if (a.join(" ").toLowerCase().replace(/\s+/g, " ") === "hire yassin") {
        out("[sudo] permission granted. Opening contact…", "ok"); closeTerm(); setTimeout(function () { go("#contact"); }, 250);
      } else out("visitor is not in the sudoers file. This incident will be reported.", "dim");
    }
  };
  CMDS.ls = CMDS.projects; CMDS.man = CMDS.help; CMDS["?"] = CMDS.help;

  function runCmd(line) {
    var parts = line.trim().split(/\s+/), name = parts.shift().toLowerCase();
    if (!name) return;
    if (name.charAt(0) !== "_" && CMDS[name]) CMDS[name](parts);
    else out("command not found: " + esc(name) + ". Try <span class=\"cmd\">help</span>.", "dim");
  }
  tin.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      var v = tin.value; tin.value = "";
      if (v.trim()) { tHist.push(v); tHi = tHist.length; }
      out('<span class="p">$</span> <span class="cmd">' + esc(v) + "</span>");
      runCmd(v);
    } else if (e.key === "ArrowUp") { e.preventDefault(); if (tHi > 0) tin.value = tHist[--tHi] || ""; }
    else if (e.key === "ArrowDown") { e.preventDefault(); tin.value = tHi < tHist.length - 1 ? tHist[++tHi] : (tHi = tHist.length, ""); }
    else if (e.key === "Tab") {
      e.preventDefault();
      var v2 = tin.value.toLowerCase(); if (!v2) return;
      var hit = Object.keys(CMDS).filter(function (k) { return k.charAt(0) !== "_" && k.indexOf(v2) === 0; })[0];
      if (hit) tin.value = hit + " ";
    } else if (e.key === "Escape") { closeTerm(); }
  });
  term.addEventListener("click", function () { if (!window.getSelection().toString()) tin.focus(); });

  /* ---------- global shortcuts ---------- */
  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || "")) || e.target.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.open ? pal.close() : openPal(); return; }
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "/") { e.preventDefault(); openPal(); }
    else if (e.key === "`") { e.preventDefault(); term.classList.contains("is-open") ? closeTerm() : openTerm(); }
  });
})();
