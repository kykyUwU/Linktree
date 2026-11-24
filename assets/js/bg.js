/* Fonds animés : matrix · life (Conway) · lightning · neutral */
(() => {
  const cv = document.getElementById("bgCanvas");
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, dpr = 1, raf = 0, mode = null, state = {};
  const css = getComputedStyle(document.documentElement);
  const readFx = () => (getComputedStyle(document.body).getPropertyValue("--fx") || "255,255,255").trim();
  let FX = readFx();
  document.addEventListener("themechange", () => { FX = readFx(); });
  const BG = (css.getPropertyValue("--bg") || "#000").trim();
  const fx = (a) => `rgba(${FX}, ${a})`;

  function resize() {
    dpr = 1; // fond décoratif : pas besoin de haute résolution
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (mode) init[mode]();
  }

  /* ---------- Matrix ---------- */
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const rnd = () => glyphs[(Math.random() * glyphs.length) | 0];
  const init = {
    matrix() {
      const size = 16;
      const rows = Math.ceil(H / size) + 1;
      // Chaque colonne : position de la tête, longueur de traînée, vitesse, caractères
      const cols = Array.from({ length: Math.ceil(W / size) }, () => ({
        y: Math.random() * -rows, len: 8 + ((Math.random() * 18) | 0),
        speed: 0.5 + Math.random() * 0.7, chars: Array.from({ length: rows }, rnd),
      }));
      state = { size, rows, cols, last: 0 };
      ctx.clearRect(0, 0, W, H);
    },
    life() {
      const cell = 12, cols = Math.ceil(W / cell), rows = Math.ceil(H / cell);
      const grid = new Uint8Array(cols * rows).map(() => (Math.random() < 0.22 ? 1 : 0));
      state = { cell, cols, rows, grid, next: new Uint8Array(cols * rows), last: 0, age: new Uint8Array(cols * rows) };
    },
    lightning() { state = { bolts: [], flash: 0, nextAt: 0 }; },
    neutral() { state = {}; ctx.clearRect(0, 0, W, H); },
  };

  const draw = {
    matrix(t) {
      if (t - state.last < 50) return;
      state.last = t;
      const { size, rows, cols } = state;
      ctx.clearRect(0, 0, W, H); // on redessine tout : aucune trace ne reste
      ctx.font = `${size}px monospace`;
      for (let i = 0; i < cols.length; i++) {
        const c = cols[i], head = Math.floor(c.y);
        for (let k = 0; k < c.len; k++) {
          const r = head - k;
          if (r < 0 || r >= rows) continue;
          ctx.fillStyle = k === 0 ? fx(0.95) : fx(0.55 * (1 - k / c.len));
          ctx.fillText(c.chars[r], i * size, (r + 1) * size);
        }
        c.y += c.speed;
        if (head - c.len > rows) { c.y = -Math.random() * 20; c.len = 8 + ((Math.random() * 18) | 0); c.speed = 0.5 + Math.random() * 0.7; c.chars = c.chars.map(rnd); }
      }
    },

    life(t) {
      if (t - state.last < 110) return;
      state.last = t;
      const { cols, rows, cell, grid, next, age } = state;
      let alive = 0;
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          let n = 0;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
              if (!dx && !dy) continue;
              n += grid[((y + dy + rows) % rows) * cols + ((x + dx + cols) % cols)];
            }
          const i = y * cols + x, live = grid[i];
          next[i] = live ? (n === 2 || n === 3 ? 1 : 0) : n === 3 ? 1 : 0;
          age[i] = next[i] ? Math.min(age[i] + 1, 40) : 0;
          alive += next[i];
        }
      }
      grid.set(next);
      // Ré-ensemence un peu pour que ça ne meure jamais
      if (alive < cols * rows * 0.04 || Math.random() < 0.08) {
        const cx = (Math.random() * cols) | 0, cy = (Math.random() * rows) | 0;
        for (let k = 0; k < 14; k++)
          grid[((cy + ((Math.random() * 6) | 0)) % rows) * cols + ((cx + ((Math.random() * 6) | 0)) % cols)] = 1;
      }
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = fx(0.22); // même couleur pour tous les blocs
      for (let i = 0; i < grid.length; i++) {
        if (!grid[i]) continue;
        ctx.fillRect((i % cols) * cell + 1, ((i / cols) | 0) * cell + 1, cell - 2, cell - 2);
      }
    },

    lightning(t) {
      if (t > state.nextAt) {
        state.bolts.push(makeBolt(Math.random() * W, 0, Math.random() * W, H * (0.6 + Math.random() * 0.4), 1));
        state.flash = 0.12;
        state.nextAt = t + 250 + Math.random() * 900;
      }
      ctx.clearRect(0, 0, W, H);
      if (state.flash > 0) {
        ctx.fillStyle = fx(state.flash);
        ctx.fillRect(0, 0, W, H);
        state.flash *= 0.85;
        if (state.flash < 0.01) state.flash = 0;
      }
      ctx.lineCap = "round";
      state.bolts = state.bolts.filter((b) => (b.life -= 0.035) > 0);
      for (const b of state.bolts) {
        for (const s of b.segs) {
          ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2);
          ctx.strokeStyle = fx(b.life * s.w * 0.15); ctx.lineWidth = 9 * s.w; ctx.stroke(); // halo
          ctx.strokeStyle = fx(b.life * s.w); ctx.lineWidth = 2 * s.w; ctx.stroke();
        }
      }
    },
    neutral() {},
  };

  function makeBolt(x1, y1, x2, y2, w) {
    let pts = [[x1, y1], [x2, y2]];
    let off = Math.hypot(x2 - x1, y2 - y1) / 4;
    for (let g = 0; g < 7; g++) {
      const np = [pts[0]];
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
        np.push([(ax + bx) / 2 + (Math.random() - 0.5) * off, (ay + by) / 2 + (Math.random() - 0.5) * off * 0.3], [bx, by]);
      }
      pts = np; off /= 2;
    }
    const segs = [];
    for (let i = 1; i < pts.length; i++) segs.push({ x1: pts[i - 1][0], y1: pts[i - 1][1], x2: pts[i][0], y2: pts[i][1], w });
    // Ramifications
    if (w > 0.5) for (let k = 0; k < 3; k++) {
      const p = pts[(pts.length * (0.2 + Math.random() * 0.6)) | 0];
      segs.push(...makeBolt(p[0], p[1], p[0] + (Math.random() - 0.5) * 300, p[1] + 100 + Math.random() * 200, w * 0.45).segs);
    }
    return { segs, life: 1 };
  }

  function loop(t) { draw[mode](t); raf = requestAnimationFrame(loop); }

  function set(m) {
    if (!init[m]) m = "neutral";
    mode = m;
    cancelAnimationFrame(raf);
    document.body.dataset.bg = m;
    document.querySelectorAll(".bg-switch button").forEach((b) => b.classList.toggle("active", b.dataset.bg === m));
    try { localStorage.setItem("bg", m); } catch {}
    init[m]();
    if (m !== "neutral") raf = requestAnimationFrame(loop);
  }

  addEventListener("resize", resize);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else if (mode !== "neutral") raf = requestAnimationFrame(loop);
  });
  document.querySelectorAll(".bg-switch button").forEach((b) => b.addEventListener("click", () => set(b.dataset.bg)));

  resize();
  let saved = null;
  try { saved = localStorage.getItem("bg"); } catch {}
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  set(saved || (reduced ? "neutral" : "matrix"));
})();
