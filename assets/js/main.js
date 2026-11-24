(() => {
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* Version hors ligne : pages et fichiers sont embarqués dans window.OFFLINE */
  const OFF = window.OFFLINE;
  const asset = (p) => (OFF && OFF.assets[p]) || "/" + p;
  let curPath = OFF ? "/" : location.pathname;

  /* ===== Langue ===== */
  let lang = "en";
  try { lang = localStorage.getItem("lang") || "en"; } catch {}
  if (!SITE.i18n[lang]) lang = "en";

  const t = (v) => (v && typeof v === "object" ? v[lang] ?? v.fr : v ?? "");
  const tk = (k) => SITE.i18n[lang][k] ?? k;

  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((n) => (n.textContent = tk(n.dataset.i18n)));
    document.querySelectorAll(".lang-switch button[data-lang]").forEach((b) =>
      b.classList.toggle("active", b.dataset.lang === lang));
    renderAllCards();
    updateTrackInfo();
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }

  document.querySelectorAll(".lang-switch button[data-lang]").forEach((b) =>
    b.addEventListener("click", () => {
      lang = b.dataset.lang;
      try { localStorage.setItem("lang", lang); } catch {}
      applyLang();
    }));

  /* ===== Style terminal / normal ===== */
  const styleBtns = document.querySelectorAll(".style-switch button");
  function setStyle(st) {
    document.body.classList.toggle("normal", st === "normal");
    // La police du style Normal n'est chargée que si on l'utilise
    if (st === "normal" && !document.getElementById("fontNormal")) {
      const l = document.createElement("link");
      l.id = "fontNormal"; l.rel = "stylesheet";
      l.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap";
      document.head.append(l);
    }
    styleBtns.forEach((b) => b.classList.toggle("active", b.dataset.style === st));
    try { localStorage.setItem("style", st); } catch {}
  }
  styleBtns.forEach((b) => b.addEventListener("click", () => setStyle(b.dataset.style)));
  setStyle(document.body.classList.contains("normal") ? "normal" : "term");

  /* ===== Thème de couleur (blanc / vert) ===== */
  const themeBtns = document.querySelectorAll(".theme-switch button");
  function setTheme(th) {
    document.body.classList.toggle("green", th === "green");
    themeBtns.forEach((b) => b.classList.toggle("active", b.dataset.theme === th));
    try { localStorage.setItem("theme", th); } catch {}
    document.dispatchEvent(new Event("themechange")); // les fonds animés reprennent la couleur
  }
  themeBtns.forEach((b) => b.addEventListener("click", () => setTheme(b.dataset.theme)));
  setTheme(document.body.classList.contains("green") ? "green" : "white");

  /* ===== Profil ===== */
  $("#name").textContent = SITE.name;
  const av = $("#avatar");
  if (SITE.avatar) { av.style.backgroundImage = `url("${asset(SITE.avatar)}")`; av.textContent = ""; }
  else av.textContent = SITE.initial || SITE.name[0];

  /* ===== Cartes de liens ===== */
  const prettyUrl = (u = "") => u.replace(/^(https?:\/\/|mailto:|tel:)/, "").replace(/^www\./, "").replace(/\/$/, "");

  function renderCards(target, list) {
    if (!target) return;
    target.replaceChildren(...list.map((c) => {
      const a = el(c.copy ? "button" : "a", "card reveal visible");
      const sub = el("p", "card-sub", t(c.sub) || prettyUrl(c.url));
      if (c.copy) {
        a.type = "button";
        a.addEventListener("click", async () => {
          try { await navigator.clipboard.writeText(c.copy); } catch {}
          sub.textContent = tk("copied");
          setTimeout(() => (sub.textContent = t(c.sub) || c.copy), 1500);
        });
      } else {
        a.href = c.url;
        if (/^https?:/.test(c.url)) { a.target = "_blank"; a.rel = "noopener"; }
      }
      const ico = el("div", "card-ico");
      if (ICONS[c.icon]) ico.innerHTML = ICONS[c.icon]; // SVG fixes, définis dans icons.js
      else ico.textContent = c.icon || "";
      const txt = el("div", "card-txt");
      txt.append(el("p", "card-name", t(c.name)), sub);
      a.append(ico, txt, el("span", "card-arrow", c.copy ? "⧉" : "→"));
      return a;
    }));
  }

  function renderAllCards() {
    renderCards($("#contactCards"), SITE.contact);
    renderCards($("#linkCards"), SITE.links);
  }

  /* ===== Lecteur ===== */
  const audio = $("#audio"), player = $("#player"), playBtn = $("#playBtn");
  const tracks = SITE.music || [];
  let idx = 0;
  const fmt = (s) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

  function updateTrackInfo() {
    if (!tracks.length) {
      player.classList.add("empty");
      $("#trackTitle").textContent = tk("music.empty");
      $("#trackArtist").textContent = "";
      return;
    }
    const tr = tracks[idx];
    $("#trackTitle").textContent = tr.title;
    $("#trackArtist").textContent = tr.artist || "";
    $("#cover").style.backgroundImage = tr.cover ? `url("${asset(tr.cover)}")` : "";
    document.querySelectorAll(".playlist li").forEach((li, i) => li.classList.toggle("current", i === idx));
  }
  function load(i, autoplay) {
    idx = (i + tracks.length) % tracks.length;
    audio.src = asset(tracks[idx].src);
    const sk = $("#seek"); sk.value = 0; sk.style.setProperty("--p", "0%");
    updateTrackInfo();
    if (autoplay) audio.play().catch(() => {});
  }
  if (tracks.length) {
    $("#playlist").replaceChildren(...tracks.map((tr, i) => {
      const li = el("li", null, `${tr.title}${tr.artist ? " — " + tr.artist : ""}`);
      li.addEventListener("click", () => load(i, true));
      return li;
    }));
    load(0, false); // toujours le premier morceau de la liste au chargement
    // Écran "Click to open" : ce clic autorise le navigateur à lancer la musique
    const splash = $("#splash");
    if (splash) {
      const open = (e) => {
        if (e.type === "keydown" && e.key === "Tab") return;
        audio.play().catch(() => {});
        splash.classList.add("hide");
        setTimeout(() => splash.remove(), 400);
        removeEventListener("keydown", open);
      };
      splash.addEventListener("click", open);
      addEventListener("keydown", open);
      splash.focus();
    }
  }
  playBtn.addEventListener("click", () => (audio.paused ? audio.play().catch(() => {}) : audio.pause()));
  $("#prevBtn").addEventListener("click", () => load(idx - 1, true));
  $("#nextBtn").addEventListener("click", () => load(idx + 1, true));
  audio.addEventListener("ended", () => load(idx + 1, true));
  audio.addEventListener("play", () => { player.classList.add("playing"); playBtn.textContent = "⏸"; });
  audio.addEventListener("pause", () => { player.classList.remove("playing"); playBtn.textContent = "▶"; });
  const seek = $("#seek");
  let seeking = false;
  const paintRange = (r) => r.style.setProperty("--p", (r.value / r.max) * 100 + "%");
  audio.addEventListener("timeupdate", () => {
    if (!seeking && audio.duration) { seek.value = (audio.currentTime / audio.duration) * 1000; paintRange(seek); }
    $("#tCur").textContent = fmt(audio.currentTime);
    $("#tDur").textContent = fmt(audio.duration);
  });
  audio.addEventListener("loadedmetadata", () => ($("#tDur").textContent = fmt(audio.duration)));
  seek.addEventListener("input", () => {
    seeking = true; paintRange(seek);
    if (audio.duration) $("#tCur").textContent = fmt((seek.value / 1000) * audio.duration);
  });
  seek.addEventListener("change", () => {
    if (audio.duration) audio.currentTime = (seek.value / 1000) * audio.duration;
    seeking = false;
  });
  const vol = $("#volume");
  vol.max = 1; audio.volume = vol.value; vol.style.setProperty("--p", vol.value * 100 + "%");
  vol.addEventListener("input", () => { audio.volume = vol.value; vol.style.setProperty("--p", vol.value * 100 + "%"); });

  /* ===== Menu mobile ===== */
  const sidebar = $("#sidebar"), menuBtn = $("#menuBtn");
  const mobile = () => matchMedia("(max-width: 860px)").matches;
  const setMenu = (open) => { document.body.classList.toggle("nav-open", open); menuBtn.setAttribute("aria-expanded", open); };
  menuBtn.addEventListener("click", () => setMenu(!document.body.classList.contains("nav-open")));
  setMenu(!mobile()); // ouverte sur ordi, fermée sur téléphone
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.remove("no-anim")));

  /* ===== Initialisation du contenu (au chargement et après chaque changement de page) ===== */
  let spy, rev;
  function pageInit() {
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();
    document.querySelectorAll("[data-icon]").forEach((n) => (n.innerHTML = ICONS[n.dataset.icon] || ""));
    applyLang(); // traduit + rend les cartes + rend le CV (via "langchange")

    // Lien actif dans la barre
    const path = curPath;
    document.querySelectorAll(".nav-link").forEach((l) => {
      const [lp, lh = ""] = l.getAttribute("href").split("#");
      // Sur la page CV, c'est "Moi" qui reste en surbrillance
      const on = path === "/cv/" ? lp === "/" && lh === "moi" : lp === path && "#" + lh === (location.hash || "#moi");
      l.classList.toggle("active", on);
    });
    spy?.disconnect();
    if (path === "/") {
      const homeLinks = [...document.querySelectorAll(".nav-link")].filter((l) => l.getAttribute("href").split("#")[0] === "/");
      spy = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) homeLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href").split("#")[1] === e.target.id));
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      document.querySelectorAll(".section").forEach((s) => spy.observe(s));
    }

    rev?.disconnect();
    rev = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); rev.unobserve(e.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll(".reveal:not(.visible)").forEach((n) => rev.observe(n));
  }

  /* ===== Navigation sans rechargement : la barre (et la musique) restent en place ===== */
  const pageCache = new Map();
  const isPage = (u) => u.origin === location.origin && (u.pathname === "/" || u.pathname === "/cv/");
  const fetchPage = (url) => {
    if (!pageCache.has(url)) pageCache.set(url, fetch(url).then((r) => (r.ok ? r.text() : Promise.reject())).catch((e) => { pageCache.delete(url); throw e; }));
    return pageCache.get(url);
  };

  async function go(href, push) {
    const u = new URL(href, OFF ? "http://x" : location.href);
    let html;
    if (OFF) html = OFF.pages[u.pathname];
    else try { html = await fetchPage(u.pathname); } catch { location.href = u.href; return; }
    if (!html) return;
    const doc = new DOMParser().parseFromString(html, "text/html");
    const next = doc.querySelector("main.content");
    if (!next) { location.href = u.href; return; }
    if (push && !OFF) history.pushState({}, "", u.href);
    curPath = u.pathname;
    document.title = doc.title;
    document.body.classList.toggle("cv-page", doc.body.classList.contains("cv-page"));
    $("main.content").replaceWith(document.adoptNode(next));
    pageInit();
    const target = u.hash && document.getElementById(u.hash.slice(1));
    if (target) target.scrollIntoView({ behavior: "instant" });
    else scrollTo({ top: 0, behavior: "instant" });
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || a.target || a.hasAttribute("download") || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return;
    const raw = a.getAttribute("href");
    const u = new URL(raw, OFF ? "http://x" : location.href);
    if (OFF ? !raw.startsWith("/") : !isPage(u)) return;
    if (mobile()) setMenu(false);
    if (u.pathname === curPath) { // simple ancre sur la même page : défilement normal
      if (OFF) { e.preventDefault(); document.getElementById(u.hash.slice(1))?.scrollIntoView({ behavior: "smooth" }); }
      return;
    }
    e.preventDefault();
    go(u.pathname + u.hash, true);
  });
  if (!OFF) addEventListener("popstate", () => go(location.href, false));
  // Précharge l'autre page au survol pour un changement instantané
  if (!OFF) document.addEventListener("pointerover", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const u = new URL(a.href);
    if (isPage(u) && u.pathname !== location.pathname) fetchPage(u.pathname).catch(() => {});
  });

  pageInit();
})();
