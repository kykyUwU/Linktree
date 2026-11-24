/* Rendu du CV — ne fait rien si on n'est pas sur la page CV */
(() => {
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  let lang = "fr";
  const t = (v) => (v && typeof v === "object" ? v[lang] ?? v.fr : v ?? "");
  const tk = (k) => SITE.i18n[lang][k] ?? k;
  const pdfOf = () => SITE.cvPdf[lang] || SITE.cvPdf.fr;
  const OFF = window.OFFLINE;
  const asset = (p) => (OFF && OFF.assets[p]) || "/" + p;

  function timeline(target, items) {
    target.replaceChildren(...items.map((it) => {
      const li = el("li");
      const title = el("p", "tl-title");
      if (it.link) {
        const a = el("a", "tl-link", t(it.title));
        a.href = it.link; a.target = "_blank"; a.rel = "noopener";
        title.append(a);
      } else title.textContent = t(it.title);
      li.append(el("div", "tl-date", t(it.date)), title, el("div", "tl-place", t(it.place)));
      if (it.bullets?.length) {
        const ul = el("ul", "tl-bullets");
        it.bullets.forEach((b) => ul.append(el("li", null, t(b))));
        li.append(ul);
      }
      if (it.tags?.length) {
        const tags = el("div", "tl-tags");
        it.tags.forEach((g) => tags.append(el("span", "chip", t(g))));
        li.append(tags);
      }
      if (it.link) {
        const go = el("a", "tl-visit", tk("cv.visit") + " ↗");
        go.href = it.link; go.target = "_blank"; go.rel = "noopener";
        li.append(go);
      }
      return li;
    }));
  }

  function render() {
    if (!$("#cvName")) return;
    const cv = SITE.cv;
    const av = $("#cvAvatar");
    if (SITE.avatar) av.style.backgroundImage = `url("${asset(SITE.avatar)}")`;
    else av.textContent = SITE.initial || "K";

    $("#cvName").textContent = cv.fullName;
    $("#cvTitle").textContent = t(cv.title);
    $("#cvSummary").textContent = t(cv.summary);
    $("#cvFacts").replaceChildren(...cv.facts.map((f) => el("span", "chip", t(f.text))));
    timeline($("#tlExperience"), SITE.experience);
    timeline($("#tlEducation"), SITE.education);

    $("#skills").replaceChildren(...SITE.skills.map((g) => {
      const box = el("div");
      const chips = el("div", "chips");
      g.items.forEach((i) => chips.append(el("span", "chip", t(i))));
      box.append(el("h4", null, t(g.group)), chips);
      return box;
    }));

    $("#languages").replaceChildren(...SITE.languages.map((l) => {
      const row = el("div", "lang-row");
      const head = el("div", "lang-head");
      head.append(el("span", null, t(l.name)), el("span", null, t(l.level)));
      const bar = el("div", "lang-bar");
      const fill = el("i");
      fill.style.setProperty("--v", (l.value || 0) + "%");
      bar.append(fill);
      row.append(head, bar);
      return row;
    }));

    $("#interests").replaceChildren(...SITE.interests.map((i) => el("div", "interest", t(i.text))));

    const dl = $("#cvDownload");
    dl.href = asset(pdfOf().file);
    dl.download = pdfOf().name;
  }

  // main.js envoie "langchange" au démarrage, au changement de langue et après chaque changement de page
  document.addEventListener("langchange", (e) => { lang = e.detail; render(); });

  /* PDF selon la langue — s'il n'existe pas encore, on imprime la page (→ "Enregistrer en PDF") */
  const pdfExists = {};
  document.addEventListener("click", async (e) => {
    const dl = e.target.closest("#cvDownload");
    if (!dl) return;
    const file = pdfOf().file;
    if (pdfExists[file] === true) return;
    e.preventDefault();
    if (pdfExists[file] === undefined && OFF) pdfExists[file] = !!OFF.assets[file];
    if (pdfExists[file] === true) return dl.click();
    if (pdfExists[file] === undefined) {
      try { pdfExists[file] = (await fetch("/" + file, { method: "HEAD" })).ok; } catch { pdfExists[file] = false; }
      if (pdfExists[file]) return dl.click();
    }
    document.querySelectorAll(".reveal").forEach((n) => n.classList.add("visible"));
    print();
  });
})();
