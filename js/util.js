/* TeamVechi demo — utilitários compartilhados (datas, formatação, ícones, gráficos, ilustrações) */
(function () {
  const TV = (window.TV = window.TV || {});
  const U = (TV.U = {});

  U.esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let n = 0;
  U.uid = (p) => (p || 'id') + '-' + Date.now().toString(36) + (++n).toString(36) + Math.random().toString(36).slice(2, 5);
  U.pad = (x) => String(x).padStart(2, '0');
  U.clone = (o) => JSON.parse(JSON.stringify(o));

  /* ---------- datas (sempre em 'AAAA-MM-DD', meio-dia local para evitar fuso) ---------- */
  U.iso = (d) => d.getFullYear() + '-' + U.pad(d.getMonth() + 1) + '-' + U.pad(d.getDate());
  U.date = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d, 12); };
  U.addDays = (iso, k) => { const d = U.date(iso); d.setDate(d.getDate() + k); return U.iso(d); };
  U.addMonths = (iso, k) => { const d = U.date(iso); d.setMonth(d.getMonth() + k); return U.iso(d); };
  U.dow = (iso) => U.date(iso).getDay(); // 0 = domingo
  U.weekStart = (iso) => U.addDays(iso, -((U.dow(iso) + 6) % 7)); // segunda
  U.diffDays = (a, b) => Math.round((U.date(b) - U.date(a)) / 864e5); // b - a
  const WD = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const WDL = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const MON = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  U.wd = (iso) => WD[U.dow(iso)];
  U.wdLong = (iso) => WDL[U.dow(iso)];
  U.dm = (iso) => { const d = U.date(iso); return U.pad(d.getDate()) + '/' + U.pad(d.getMonth() + 1); };
  U.dayLabel = (iso) => U.wd(iso) + ', ' + U.dm(iso);
  U.longDate = (iso) => { const d = U.date(iso); return WDL[d.getDay()] + ', ' + d.getDate() + ' de ' + MON[d.getMonth()]; };
  U.relDay = (iso, today) => {
    const k = U.diffDays(iso, today);
    if (k === 0) return 'hoje';
    if (k === 1) return 'ontem';
    if (k === -1) return 'amanhã';
    return k > 1 ? 'há ' + k + ' dias' : 'em ' + -k + ' dias';
  };
  U.timeNow = () => { const d = new Date(); return U.pad(d.getHours()) + ':' + U.pad(d.getMinutes()); };

  /* ---------- números ---------- */
  U.num = (v) => { const x = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isNaN(x) ? 0 : x; };
  U.fmtNum = (v, d) => Number(v).toFixed(d == null ? 1 : d).replace('.', ',');
  U.money = (v) => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  U.liters = (ml) => { const l = ml / 1000; return (Number.isInteger(l) ? String(l) : U.fmtNum(l, ml % 100 === 0 ? 1 : 2)) + ' L'; };
  U.firstNum = (v) => { const m = String(v || '').match(/\d+/); return m ? m[0] : ''; };
  U.mmss = (s) => Math.floor(s / 60) + ':' + U.pad(s % 60);
  U.restLabel = (r) => { const k = parseInt(r, 10); if (!k) return '—'; if (k < 60) return k + ' s'; return k % 60 ? U.mmss(k) : k / 60 + ' min'; };
  U.initials = (name) => String(name || '?').trim().split(/\s+/).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join('');
  U.firstName = (name) => String(name || '').trim().split(/\s+/)[0];

  /* PRNG determinístico para dados de demonstração */
  U.rng = (seed) => { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };

  /* ---------- ícones (traço) ---------- */
  const P = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
    db: '<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',
    food: '<path d="M7 3v8a2 2 0 0 0 2 2v8M5 3v5M9 3v5M17 21V3c-2 1.5-3 4-3 7s1 4 3 4"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 13h6M9 17h6"/>',
    video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="M16 10l5-3v10l-5-3z"/>',
    clip: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9zM9 12h6M9 16h4"/>',
    wallet: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14h2"/>',
    store: '<path d="M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4"/>',
    check: '<path d="M5 12l5 5L20 7"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    up: '<path d="M12 16V4M7 9l5-5 5 5M5 20h14"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    trend: '<path d="M4 17l6-6 4 4 6-7"/><path d="M14 8h6v6"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
    cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    alert: '<path d="M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>',
    more: '<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    msg: '<path d="M4 5h16v11H8l-4 4z"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    swap: '<path d="M4 7h13l-3-3M20 17H7l3 3"/>',
    fwd: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/>',
    lib: '<path d="M4 4h4v16H4zM10 4h4v16h-4zM16 5l3.5-1 3 15.5-3.5 1z"/>',
    wifi: '<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0M12 19h.01"/>',
    reset: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    phone: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    screen: '<rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>'
  };
  U.ic = (k, s, cls) => '<svg class="ic ' + (cls || '') + '" width="' + (s || 22) + '" height="' + (s || 22) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[k] || '') + '</svg>';
  U.playIc = (s) => '<svg class="ic" width="' + (s || 22) + '" height="' + (s || 22) + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>';

  /* ---------- gráficos SVG ---------- */
  U.lineChart = (pts, o) => {
    o = o || {};
    if (!pts.length) return '<div class="empty sm">Ainda sem dados para o gráfico.</div>';
    const W = o.w || 340, H = o.h || 160, pl = 44, pr = 16, pt = 22, pb = 28;
    const vals = pts.map((p) => p.v);
    let min = Math.min(...vals), max = Math.max(...vals);
    if (min === max) { min -= 1; max += 1; }
    const span = max - min; min -= span * 0.18; max += span * 0.18;
    const x = (i) => pl + (pts.length === 1 ? (W - pl - pr) / 2 : (i * (W - pl - pr)) / (pts.length - 1));
    const y = (v) => pt + (H - pt - pb) * (1 - (v - min) / (max - min));
    const fmt = o.fmt || ((v) => U.fmtNum(v, o.dec == null ? 1 : o.dec));
    const ticks = [max, (max + min) / 2, min];
    let g = '';
    ticks.forEach((tv) => { const yy = y(tv).toFixed(1); g += '<line x1="' + pl + '" x2="' + (W - pr) + '" y1="' + yy + '" y2="' + yy + '" style="stroke:var(--line);stroke-width:1"/><text x="' + (pl - 8) + '" y="' + (+yy + 4) + '" text-anchor="end" style="fill:var(--dim);font-size:11px">' + fmt(tv) + '</text>'; });
    const line = pts.map((p, i) => x(i).toFixed(1) + ',' + y(p.v).toFixed(1)).join(' ');
    const area = 'M' + x(0).toFixed(1) + ',' + (H - pb) + ' L' + line.replace(/ /g, ' L') + ' L' + x(pts.length - 1).toFixed(1) + ',' + (H - pb) + ' Z';
    const last = pts.length - 1;
    let dots = pts.map((p, i) => '<circle cx="' + x(i).toFixed(1) + '" cy="' + y(p.v).toFixed(1) + '" r="' + (i === last ? 5 : 3) + '" style="fill:' + (i === last ? 'var(--brand)' : 'var(--app)') + ';stroke:var(--brand);stroke-width:2"/>').join('');
    const lx = Math.min(W - pr - 4, Math.max(pl + 4, x(last)));
    const anchor = pts.length === 1 ? 'middle' : 'end';
    dots += '<text x="' + lx.toFixed(1) + '" y="' + (y(pts[last].v) - 10).toFixed(1) + '" text-anchor="' + anchor + '" style="fill:var(--fg);font-size:12px;font-weight:700">' + fmt(pts[last].v) + (o.unit ? ' ' + o.unit : '') + '</text>';
    const labs = '<text x="' + x(0).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="' + (pts.length === 1 ? 'middle' : 'start') + '" style="fill:var(--dim);font-size:11px">' + U.esc(pts[0].label) + '</text>' +
      (pts.length > 1 ? '<text x="' + x(last).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="end" style="fill:var(--dim);font-size:11px">' + U.esc(pts[last].label) + '</text>' : '');
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + U.esc(o.label || 'Gráfico') + '">' + g +
      '<path d="' + area + '" style="fill:var(--brand);opacity:.12"/><polyline points="' + line + '" style="fill:none;stroke:var(--brand);stroke-width:2.5;stroke-linejoin:round;stroke-linecap:round"/>' + dots + labs + '</svg>';
  };
  U.bars = (items, o) => {
    o = o || {};
    if (!items.length) return '<div class="empty sm">Ainda sem dados.</div>';
    const W = o.w || 340, H = o.h || 130, pt = 20, pb = 24, gap = 8;
    const nI = items.length, bw = (W - (nI - 1) * gap) / nI;
    const mx = Math.max(o.max || 0, ...items.map((i) => i.v), o.goal || 0, 1);
    const ih = H - pt - pb;
    let s = '';
    if (o.goal) { const gy = pt + ih * (1 - o.goal / mx); s += '<line x1="0" x2="' + W + '" y1="' + gy.toFixed(1) + '" y2="' + gy.toFixed(1) + '" style="stroke:var(--muted);stroke-width:1;stroke-dasharray:4 4"/>'; }
    items.forEach((it, i) => {
      const h = Math.max(it.v > 0 ? 3 : 0, (ih * it.v) / mx), x = i * (bw + gap), y = pt + ih - h;
      s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="4" style="fill:' + (it.hl ? 'var(--brand)' : it.ok ? 'var(--brand)' : 'var(--s3)') + ';opacity:' + (it.ok && !it.hl ? '.55' : '1') + '"/>';
      s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="middle" style="fill:' + (it.hl ? 'var(--fg)' : 'var(--dim)') + ';font-size:11px;font-weight:' + (it.hl ? 700 : 400) + '">' + U.esc(it.label) + '</text>';
      if (it.top) s += '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + Math.max(12, y - 6).toFixed(1) + '" text-anchor="middle" style="fill:var(--muted);font-size:10px">' + U.esc(it.top) + '</text>';
    });
    return '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + U.esc(o.label || 'Gráfico de barras') + '">' + s + '</svg>';
  };
  U.ring = (pct, size, label) => {
    const r = 15.9, c = 2 * Math.PI * r, v = Math.max(0, Math.min(100, pct));
    return '<svg width="' + (size || 64) + '" height="' + (size || 64) + '" viewBox="0 0 36 36" role="img" aria-label="' + U.esc(label || Math.round(v) + '%') + '"><circle cx="18" cy="18" r="' + r + '" style="fill:none;stroke:var(--s3);stroke-width:3.4"/><circle cx="18" cy="18" r="' + r + '" transform="rotate(-90 18 18)" style="fill:none;stroke:var(--brand);stroke-width:3.4;stroke-linecap:round;stroke-dasharray:' + ((c * v) / 100).toFixed(2) + ' ' + c.toFixed(2) + '"/><text x="18" y="21" text-anchor="middle" style="fill:var(--fg);font-size:9px;font-weight:700">' + Math.round(v) + '%</text></svg>';
  };

  /* ---------- ilustrações (sem imagens externas) ---------- */
  U.productArt = (kind) => {
    const bg = '<rect width="200" height="200" rx="0" style="fill:#1E1E1C"/><circle cx="100" cy="100" r="78" style="fill:#262624"/>';
    const tv = (x, y, s) => '<text x="' + x + '" y="' + y + '" text-anchor="middle" style="font-family:\'Barlow Condensed\',sans-serif;font-weight:800;font-size:' + s + 'px;fill:var(--brand)">TV</text>';
    const shapes = {
      camiseta: '<path d="M62 52l26-12h24l26 12 22 26-20 14-12-10v76H72V82l-12 10-20-14z" style="fill:#0E0E0D;stroke:#3A3A36;stroke-width:2"/><path d="M88 40a12 10 0 0 0 24 0" style="fill:none;stroke:#3A3A36;stroke-width:3"/>' + tv(100, 108, 30),
      regata: '<path d="M74 42h14c2 14 22 14 24 0h14l-4 30 8 12v84H70V84l8-12z" style="fill:#0E0E0D;stroke:#3A3A36;stroke-width:2"/><rect x="70" y="128" width="60" height="6" style="fill:var(--brand)"/>' + tv(100, 112, 26),
      bone: '<path d="M52 118c0-34 22-56 50-56s46 22 46 56z" style="fill:#0E0E0D;stroke:#3A3A36;stroke-width:2"/><path d="M40 118h112c8 0 10 12 0 14H58c-14 0-20-14-18-14z" style="fill:#151514;stroke:#3A3A36;stroke-width:2"/>' + tv(100, 106, 26),
      garrafa: '<rect x="80" y="30" width="40" height="18" rx="5" style="fill:var(--brand)"/><rect x="72" y="48" width="56" height="124" rx="14" style="fill:#0E0E0D;stroke:#3A3A36;stroke-width:2"/>' + tv(100, 118, 28),
      coqueteleira: '<rect x="76" y="40" width="48" height="22" rx="6" style="fill:var(--brand)"/><path d="M72 62h56l-6 108H78z" style="fill:#0E0E0D;stroke:#3A3A36;stroke-width:2"/><path d="M80 90h40M80 110h40M80 130h40" style="stroke:#33332F;stroke-width:2"/>' + tv(100, 158, 18),
      toalha: '<rect x="46" y="70" width="108" height="72" rx="8" style="fill:#0E0E0D;stroke:#3A3A36;stroke-width:2"/><rect x="46" y="128" width="108" height="6" style="fill:var(--brand)"/><rect x="46" y="78" width="108" height="4" style="fill:#2A2A27"/>' + tv(100, 116, 24)
    };
    return '<svg viewBox="0 0 200 200" class="art" role="img" aria-label="Ilustração do produto">' + bg + (shapes[kind] || shapes.camiseta) + '</svg>';
  };
  U.bodyPhoto = (pose, variant) => {
    const w = Math.max(0, 6 - (variant || 0)); // cintura diminui um pouco por semana
    const side = pose === 'lado';
    const body = side
      ? '<circle cx="60" cy="34" r="13"/><path d="M52 50h16c' + (6 + w / 2) + ' 8 ' + (8 + w / 2) + ' 24 ' + (4 + w / 3) + ' 42l-2 18 4 50h-10l-6-46-4 46H50l2-50-4-20c-2-18 0-32 4-40z"/>'
      : '<circle cx="60" cy="32" r="13"/><path d="M40 52h40c8 2 10 10 10 18l2 30h-8l-4-26-2 ' + (26 + w) + ' 4 56H68l-8-44-8 44H44l4-56-2-' + (26 + w) + '-4 26h-8l2-30c0-8 2-16 10-18z"/>';
    const label = { frente: 'Frente', lado: 'Lado', costas: 'Costas' }[pose] || '';
    return '<svg viewBox="0 0 120 160" class="art" role="img" aria-label="Foto de exemplo: ' + label + '"><defs><linearGradient id="g' + pose + variant + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2B28"/><stop offset="1" stop-color="#161615"/></linearGradient></defs><rect width="120" height="160" fill="url(#g' + pose + variant + ')"/><g style="fill:' + (pose === 'costas' ? '#55524B' : '#6A665D') + '">' + body + '</g><text x="8" y="152" style="fill:#9C9A92;font-size:10px;font-family:Barlow,sans-serif">Exemplo · ' + label + '</text></svg>';
  };
  U.photo = (src, pose, variant) => {
    if (!src) return '<div class="ph-empty">' + U.ic('image', 22) + '<span>Sem foto</span></div>';
    if (String(src).indexOf('demo:') === 0) { const p = src.split(':'); return U.bodyPhoto(p[1] || pose, +p[2] || variant || 0); }
    return '<img src="' + U.esc(src) + '" alt="Foto de acompanhamento: ' + U.esc(pose || '') + '">';
  };

  /* ---------- feedback ---------- */
  U.toast = (msg, kind) => {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
    t.className = 'toast ' + (kind || '');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(U.toast.h);
    U.toast.h = setTimeout(() => { t.hidden = true; }, 3200);
  };
  U.copy = (text, okMsg) => {
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      ta.remove();
      U.toast(ok ? okMsg || 'Copiado' : 'Não deu para copiar automaticamente. Selecione e copie: ' + text, ok ? 'ok' : 'err');
    };
    try {
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => U.toast(okMsg || 'Copiado', 'ok'), fallback);
      else fallback();
    } catch (e) { fallback(); }
  };
  U.shrinkImage = (file, max) => new Promise((res, rej) => {
    if (!file || !/^image\//.test(file.type)) return rej(new Error('Arquivo não é uma imagem.'));
    const fr = new FileReader();
    fr.onerror = () => rej(new Error('Não foi possível ler o arquivo.'));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => rej(new Error('Imagem inválida.'));
      img.onload = () => {
        const s = Math.min(1, (max || 420) / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * s)); c.height = Math.max(1, Math.round(img.height * s));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        res(c.toDataURL('image/jpeg', 0.72));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
})();
