/* TeamVechi demo — app do aluno (Início, Treino, Alimentação, Loja, Perfil + convite e check-in) */
(function () {
  const TV = window.TV;
  const U = TV.U;
  const UI = TV.UI;
  const A = TV.A;
  const e_ = U.esc;

  const cur = () => TV.stu(TV.S.ui.as) || TV.stu('s-lucas');
  const T = () => TV.today();
  const fn = (s) => U.firstName(s.name);
  const head = (title, back, sub, right) => '<header class="sc-head">' + (back ? '<a class="back" href="#/aluno/' + back + '" aria-label="Voltar">' + U.ic('back', 20) + '</a>' : '') + '<div class="grow"><h1 class="d h1">' + title + '</h1>' + (sub ? '<p class="muted sm">' + sub + '</p>' : '') + '</div>' + (right || '') + '</header>';

  /* ---------- casca do app ---------- */
  TV.V.aluno = function (p) {
    const st = cur();
    const page = p[0] || 'inicio';
    let content, tab = null;
    if (UI.loading) content = TV.skel(5);
    else if (!st.anamnese || page === 'novo') { content = vNovo(st, st.anamnese && page !== 'novo' ? 'fim' : p[1] || 'convite'); }
    else {
      const map = { inicio: vInicio, treino: vTreino, exercicio: vExercicio, resumo: vResumo, alimentacao: vAlimentacao, loja: vLoja, produto: vProduto, perfil: vPerfil, checkin: vCheckin, dicas: vDica };
      content = (map[page] || vInicio)(st, p[1], p[2]);
      tab = { inicio: 'inicio', checkin: 'inicio', dicas: 'inicio', treino: 'treino', resumo: 'treino', alimentacao: 'alimentacao', loja: 'loja', produto: 'loja', perfil: 'perfil' }[page] || (page === 'exercicio' ? null : 'inicio');
    }
    const focus = page === 'exercicio' || page === 'novo' || !st.anamnese;
    const screen = '<div class="screen" id="scr" data-page="' + e_(focus && page !== 'exercicio' ? 'novo' : page) + '">' + TV.netBanner() + content + '</div>';
    if (TV.alWide()) {
      // computador, modo ampliado: menu lateral e conteúdo reorganizado em colunas
      return '<div class="al-wrap wide"><aside class="al-nav"><div class="al-brand">' + TV.logo() + '<div><b class="d">TeamVechi</b><br><span class="muted xs">App do aluno</span></div></div>' +
        (focus && page !== 'exercicio' ? '<p class="muted sm al-nav-note">Primeiro acesso: o menu aparece depois da anamnese.</p>' : navList(tab, 'al-menu')) +
        '<div class="al-foot"><a class="row al-me" href="#/aluno/perfil">' + TV.avatar(st) + '<div><b>' + e_(st.name) + '</b><br><span class="muted xs">Aluno</span></div></a>' + viewSwitch() +
        '<a class="btn sm ghost block" href="#/pedro/inicio" data-act="as" data-arg="pedro">' + U.ic('swap', 16) + ' Ver o lado do Pedro</a></div></aside>' +
        '<main class="al-main">' + screen + '</main></div>';
    }
    return '<div class="al-wrap">' +
      '<aside class="al-side"><p class="eyebrow">App do aluno</p><div class="row">' + TV.avatar(st) + '<div><b>' + e_(st.name) + '</b><br><span class="muted sm">Como o aluno vê no celular</span></div></div>' +
      viewSwitch() + '<a class="btn block" href="#/pedro/inicio" data-act="as" data-arg="pedro">' + U.ic('swap', 18) + ' Ver o lado do Pedro</a><p class="dim xs">O mesmo app roda no Android e no iPhone. No celular de verdade ele ocupa a tela inteira, sem moldura.</p></aside>' +
      '<div class="phone"><div class="phone-notch" aria-hidden="true"></div>' + screen + (focus ? '' : tabbar(tab)) + '</div></div>';
  };
  /* modos de visualização no computador: ampliado (padrão) ou dentro de um celular */
  const WIDE_MQ = window.matchMedia ? window.matchMedia('(min-width: 1024px)') : null;
  TV.alView = () => { try { return localStorage.getItem('tv-view') === 'celular' ? 'celular' : 'ampliado'; } catch (e) { return 'ampliado'; } };
  TV.alWide = () => !!(WIDE_MQ && WIDE_MQ.matches) && TV.alView() === 'ampliado';
  if (WIDE_MQ) { const h = () => { if ((location.hash || '').indexOf('#/aluno') === 0) TV.render(); }; if (WIDE_MQ.addEventListener) WIDE_MQ.addEventListener('change', h); else if (WIDE_MQ.addListener) WIDE_MQ.addListener(h); }
  function viewSwitch() {
    const v = TV.alView();
    return '<div class="seg block view-seg" role="group" aria-label="Como mostrar o app no computador"><button aria-pressed="' + (v === 'ampliado') + '" data-act="alView" data-arg="ampliado">' + U.ic('grid', 16) + ' Ampliado</button><button aria-pressed="' + (v === 'celular') + '" data-act="alView" data-arg="celular">' + U.ic('phone', 16) + ' Celular</button></div>';
  }
  A.alView = (v) => { try { localStorage.setItem('tv-view', v === 'celular' ? 'celular' : 'ampliado'); } catch (e) { /* sem armazenamento: vale só nesta sessão */ } U.toast(v === 'celular' ? 'Mostrando o app dentro de um celular' : 'Mostrando o app ampliado'); };
  function navList(cur, cls) {
    const t = [['inicio', 'Início', 'home'], ['treino', 'Treino', 'db'], ['alimentacao', 'Alimentação', 'food'], ['loja', 'Loja', 'bag'], ['perfil', 'Perfil', 'user']];
    return '<nav class="' + cls + '" aria-label="Menu do app">' + t.map((x) => '<a href="#/aluno/' + x[0] + '"' + (cur === x[0] ? ' aria-current="page"' : '') + '>' + U.ic(x[2], 22) + '<span>' + x[1] + '</span></a>').join('') + '</nav>';
  }
  function tabbar(cur) { return navList(cur, 'tabbar'); }

  /* =================== INÍCIO =================== */
  function vInicio(st) {
    const today = T(), f = TV.pub(st.id), ws = U.weekStart(today);
    let h = '<div class="hello"><div><p class="muted sm">' + e_(U.longDate(today)) + '</p><h1 class="d h1">Olá, ' + e_(fn(st)) + '</h1></div><a class="av-link" href="#/aluno/perfil" aria-label="Abrir perfil">' + TV.avatar(st, 'lg') + '</a></div>';
    // semana
    const doneDates = TV.doneSessions(st.id).map((x) => x.date);
    const wk = TV.weekSessions(st.id, ws).length, meta = TV.plannedPerWeek(st.id);
    h += '<div class="weekstrip" aria-label="Treinos da semana: ' + wk + ' de ' + meta + '">' + Array.from({ length: 7 }, (_, i) => {
      const d = U.addDays(ws, i), done = doneDates.includes(d), isT = d === today;
      return '<div class="wd' + (done ? ' done' : '') + (isT ? ' today' : '') + (d > today ? ' future' : '') + '"><span>' + U.wd(d).charAt(0).toUpperCase() + '</span><i>' + (done ? U.ic('check', 14) : U.date(d).getDate()) + '</i></div>';
    }).join('') + '</div>';
    h += '<div class="wgrid"><div class="wcol a">';
    // 1) treino do dia, com os exercícios à vista
    const open = f ? TV.openSession(st.id) : null, doneToday = f ? TV.doneSessions(st.id).find((x) => x.date === today) : null;
    if (!f) {
      h += '<div class="card"><p class="eyebrow">Sua ficha</p><b class="lg">O Pedro está montando o seu treino</b><span class="muted sm">Ele já recebeu a sua anamnese. Você recebe um aviso quando a ficha for publicada.</span></div>';
    } else {
      const sub = 'Semana ' + TV.weekNum(f) + ' de ' + f.published.weeks + ' · ' + wk + ' de ' + meta + ' treinos nesta semana';
      const exList = (t, ses) => '<ul class="hero-list">' + t.items.slice(0, 6).map((it) => { const d = ses && ses.items[it.id] && ses.items[it.id].done; return '<li class="' + (d ? 'done' : '') + '"><span class="dotk">' + (d ? U.ic('check', 12) : '') + '</span><span>' + e_(TV.ex(it.exId).name) + '</span></li>'; }).join('') + '</ul>';
      if (open) {
        const ss = TV.sessionStats(open), t = f.published.treinos.find((x) => x.id === open.treinoId);
        h += '<div class="card hero-card"><p class="eyebrow">Treino em andamento</p><div class="row between"><div class="d big">Treino ' + e_(open.label.split(' · ')[0]) + '</div><b class="num">' + ss.exDone + '/' + ss.exTotal + '</b></div><div class="bar"><i style="width:' + Math.round((ss.exDone / ss.exTotal) * 100) + '%"></i></div>' + (t ? exList(t, open) : '') + '<a class="btn pri lg block" href="#/aluno/treino">' + U.playIc(18) + ' Continuar treino</a></div>';
      } else if (doneToday) {
        const nt = f.published.treinos[TV.nextTreinoIdx(st.id)];
        h += '<div class="card hero-card"><p class="eyebrow">' + e_(sub) + '</p><div class="row"><span class="okdot">' + U.ic('check', 18) + '</span><div class="d big">Treino ' + e_(doneToday.label.split(' · ')[0]) + ' feito</div></div><span class="muted sm">Próximo: Treino ' + e_(nt.letter) + ' · ' + e_(nt.name) + '</span><a class="btn block" href="#/aluno/resumo/' + doneToday.id + '">Ver resumo do treino</a></div>';
      } else {
        const ti = TV.nextTreinoIdx(st.id), t = f.published.treinos[ti];
        h += '<div class="card hero-card"><p class="eyebrow">Treino de hoje · ' + e_(sub) + '</p><div class="d big">Treino ' + e_(t.letter) + '</div><span class="sub">' + e_(t.name) + ' · cerca de ' + estMin(t) + ' min</span>' + exList(t, null) + '<button class="btn pri lg block" data-act="startTreino" data-arg="' + ti + '">' + U.playIc(18) + ' Começar treino</button></div>';
      }
    }
    h += '</div><div class="wcol b">';
    // 2) "Hoje": o que falta, com check
    const rows = [];
    const row = (done, ico, title, sub, href, right) => '<' + (href ? 'a href="' + href + '"' : 'div') + ' class="today-row' + (done ? ' done' : '') + '"><span class="tk">' + (done ? U.ic('check', 16) : U.ic(ico, 16)) + '</span><span class="grow"><b>' + title + '</b><br><span class="muted sm">' + sub + '</span></span>' + (right || (href ? U.ic('chev', 18) : '')) + '</' + (href ? 'a' : 'div') + '>';
    if (f && doneToday) rows.push(row(true, 'db', 'Treino', doneToday ? 'Feito hoje' : open ? 'Em andamento · ' + TV.sessionStats(open).exDone + ' de ' + TV.sessionStats(open).exTotal + ' exercícios' : 'Ainda não feito', '#/aluno/treino'));
    const goal = TV.waterGoal(st.id), tot = TV.waterTotal(st.id, today);
    rows.push(row(goal && tot >= goal, 'drop', 'Água', U.liters(tot) + (goal ? ' de ' + U.liters(goal) : ''), null, '<button class="btn sm" data-act="addWater" data-arg="250">+250 ml</button>'));
    const g = TV.guidePub(st.id);
    if (g) { const n = TV.mealLogsDay(st.id, today).length; rows.push(row(n >= g.meals.length, 'food', 'Refeições', n + ' de ' + g.meals.length + ' registradas', '#/aluno/alimentacao')); }
    const ck = TV.checkinStatus(st.id, ws), sat = U.addDays(ws, 5);
    if (ck === 'pendente') rows.push(row(false, 'clip', 'Check-in da semana disponível', 'Fecha domingo às 23h59', '#/aluno/checkin', TV.pill('brand', 'Fazer')));
    else if (ck === 'enviado' || ck === 'revisado') rows.push(row(true, 'clip', 'Check-in enviado', ck === 'revisado' ? 'O Pedro já respondeu' : 'O Pedro vai revisar e te responder', '#/aluno/checkin'));
    else if (ck === 'aguardando') rows.push(row(false, 'cal', 'Check-in da semana', 'Abre no sábado, ' + U.dm(sat), '#/aluno/checkin'));
    const left = rows.filter((r) => r.indexOf('today-row done') < 0).length;
    h += '<section class="card"><div class="row between"><h2 class="h2">Hoje</h2><span class="muted sm">' + (left ? (left === 1 ? 'Falta 1 coisa' : 'Faltam ' + left + ' coisas') : 'Tudo em dia') + '</span></div><div class="today-list">' + rows.join('') + '</div></section>';
    // 3) Pedro: feedback e avisos
    const fb = TV.S.checkins.filter((c) => c.studentId === st.id && c.reviewedAt && c.feedback).sort((a, b) => (a.reviewedAt < b.reviewedAt ? 1 : -1))[0];
    if (fb && U.diffDays(fb.reviewedAt.slice(0, 10), today) <= 7) h += '<div class="card hl"><div class="row">' + TV.avatar(TV.PEDRO, 'sm') + '<p class="eyebrow">Feedback do Pedro · check-in de ' + U.dm(fb.week) + '</p></div><span class="quote-txt">' + e_(fb.feedback) + '</span></div>';
    const prevSt = TV.checkinStatus(st.id, U.addDays(ws, -7));
    if (prevSt === 'enviado') h += '<div class="inline-note">' + U.ic('clock', 18) + '<span>O check-in da semana passada está com o Pedro para revisão.</span></div>';
    const nts = TV.S.notices.slice().sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 2);
    if (nts.length) h += '<section class="sec"><h2 class="h2">Avisos do Pedro</h2>' + nts.map((n) => '<div class="card notice">' + TV.avatar(TV.PEDRO) + '<span class="grow"><b class="sm">Pedro</b><br><span>' + e_(n.text) + '</span><br><span class="dim xs">' + U.relDay(n.at.slice(0, 10), today) + '</span></span></div>').join('') + '</section>';
    h += '</div></div>';
    h += '<section class="sec"><h2 class="h2">Dicas do Pedro</h2><div class="hscroll">' + TV.S.tips.map((t) => '<a class="tip" href="#/aluno/dicas/' + t.id + '"><span class="eyebrow">' + e_(t.kind) + (t.dur ? ' · vídeo ' + t.dur : '') + '</span><b>' + e_(t.title) + '</b></a>').join('') + '</div></section>';
    return h;
  }
  function estMin(t) { let s = 0; t.items.forEach((it) => it.sets.forEach((x) => { s += 45 + (parseInt(x.rest, 10) || 60); })); return Math.max(15, Math.round(s / 60 / 5) * 5); }

  function vDica(st, id) {
    const t = TV.S.tips.find((x) => x.id === id) || TV.S.tips[0];
    return head(e_(t.title), 'inicio', e_(t.kind)) + (t.dur ? TV.videoBox({ id: 'tip-' + t.id, name: t.title, video: { kind: 'demo', dur: t.dur } }) : '') + '<div class="card"><p>' + e_(t.body) + '</p></div><a class="btn block" href="https://www.instagram.com/vechi.fit/" target="_blank" rel="noopener">Mais conteúdo no Instagram do Pedro</a>';
  }

  /* =================== TREINO =================== */
  // Tela única: lista do treino com um check por exercício. O exercício aberto mostra vídeo, séries e descanso.
  const lastFor = (sid, itemId, k, exclude) => TV.prevSet(sid, itemId, k, exclude);
  const pendingOf = (t, open) => t.items.find((it) => !open.items[it.id].done) || null;
  const openIdOf = (t, open) => {
    if (UI.exOpen === '') return '';
    if (UI.exOpen && t.items.some((i) => i.id === UI.exOpen)) return UI.exOpen;
    const p = pendingOf(t, open); return p ? p.id : '';
  };
  function lastLine(st, it, exclude) {
    const l = lastFor(st.id, it.id, it.sets.findIndex((x) => x.type !== 'aquec'), exclude) || lastFor(st.id, it.id, 0, exclude);
    return l ? 'Última vez: ' + e_(l.kg || '–') + ' kg × ' + e_(l.reps || '–') : 'Primeira vez neste exercício';
  }
  function doneLine(rec) {
    const ok = rec.sets.filter((x) => x.ok && x.kg);
    if (!ok.length) return 'Feito';
    const best = ok.reduce((m, x) => (parseFloat(String(x.kg).replace(',', '.')) > parseFloat(String(m.kg).replace(',', '.')) ? x : m), ok[0]);
    return 'Feito · até ' + e_(best.kg) + ' kg × ' + e_(best.reps || '–');
  }
  function setRows(st, it, rec, open) {
    let c = { top: 0, back: 0, valida: 0, aquec: 0 };
    const curIdx = rec.sets.findIndex((s) => !s.ok);
    return '<div class="logger"><div class="loghead"><span>Série</span><span>Kg</span><span>Reps</span><span>RIR</span><span><span class="sr">Feita</span></span></div>' + it.sets.map((ps, k) => {
      c[ps.type]++;
      const s = rec.sets[k]; TV.reg(s);
      const label = ps.type === 'top' ? 'Top' : ps.type === 'back' ? 'Back ' + c.back : ps.type === 'aquec' ? 'Aquec.' : 'Série ' + c.valida;
      const prev = lastFor(st.id, it.id, k, open.id);
      const kgPh = (prev && prev.kg) || ps.kg || 'kg';
      const inp = (key, ph, mode) => '<input class="in num" id="' + key + '-' + s.id + '" inputmode="' + mode + '" aria-label="' + label + ': ' + { kg: 'carga em kg', reps: 'repetições', rir: 'RIR' }[key] + '" placeholder="' + e_(ph) + '" data-obj="' + s.id + '" data-key="' + key + '" value="' + e_(s[key]) + '">';
      return '<div class="logrow' + (k === curIdx && !rec.done ? ' cur' : '') + (s.ok ? ' ok' : '') + '"><span class="lr-l t-' + ps.type + '">' + label + '<small class="num" title="Última vez">' + (prev ? e_(prev.kg || '–') + ' × ' + e_(prev.reps || '–') : 'novo') + '</small></span>' + inp('kg', kgPh, 'decimal') + inp('reps', ps.reps, 'numeric') + inp('rir', ps.rir === '' ? '–' : ps.rir, 'numeric') + '<button class="okbtn' + (s.ok ? ' on' : '') + '" data-act="toggleSet" data-arg="' + it.id + '|' + k + '" aria-pressed="' + s.ok + '" aria-label="' + (s.ok ? 'Desmarcar ' : 'Marcar ') + label + ' como feita">' + U.ic('check', 18) + '</button></div>';
    }).join('') + '</div>';
  }
  function vTreino(st) {
    const f = TV.pub(st.id);
    if (!f) return head('Treino') + TV.empty('Sua ficha ainda não foi publicada', 'Assim que o Pedro publicar, os treinos aparecem aqui.');
    const pub = f.published, open = TV.openSession(st.id);
    const openIdx = open ? pub.treinos.findIndex((t) => t.id === open.treinoId) : -1;
    let ti = UI.treinoSel != null && pub.treinos[UI.treinoSel] ? +UI.treinoSel : openIdx >= 0 ? openIdx : TV.nextTreinoIdx(st.id);
    const t = pub.treinos[ti];
    const updated = U.diffDays(pub.at.slice(0, 10), T()) <= 7 && f.version > 1;
    const onThis = open && open.treinoId === t.id;
    let h = head('Treino ' + e_(t.letter), null, e_(t.name) + ' · semana ' + TV.weekNum(f) + ' de ' + pub.weeks, updated ? TV.pill('brand', 'Atualizada v' + f.version) : '');
    if (pub.treinos.length > 1) h += '<div class="chips" role="tablist" aria-label="Escolher o treino">' + pub.treinos.map((x, i) => '<button class="chip' + (i === ti ? ' on' : '') + '" role="tab" aria-selected="' + (i === ti) + '" data-act="treinoSel" data-arg="' + i + '">Treino ' + e_(x.letter) + (i === openIdx ? ' ●' : '') + '</button>').join('') + '</div>';
    if (open && openIdx !== ti) h += '<div class="inline-note warn">' + U.ic('alert', 18) + '<span class="grow">O Treino ' + e_(pub.treinos[openIdx].letter) + ' está em andamento.</span><button class="btn sm" data-act="treinoSel" data-arg="' + openIdx + '">Ver</button></div>';
    h += '<div class="wgrid' + (onThis ? ' solo' : '') + '"><div class="wcol a">';
    if (onThis) {
      const ss = TV.sessionStats(open), min = Math.max(1, Math.round((Date.now() - (open.startMs || Date.now())) / 60000));
      h += '<div class="ses-bar" role="status"><div class="row between"><b class="num">' + ss.exDone + ' de ' + ss.exTotal + ' exercícios</b><span class="muted sm num">' + U.ic('clock', 14) + ' ' + min + ' min</span></div><div class="bar"><i style="width:' + Math.round((ss.exDone / ss.exTotal) * 100) + '%"></i></div>' +
        (UI.rest ? '<div class="rest-mini" role="timer"><span>' + U.ic('clock', 16) + ' Descanso</span><b id="rest-left" class="num">' + U.mmss(Math.max(0, Math.round((UI.rest.end - Date.now()) / 1000))) + '</b><button class="btn sm" data-act="skipRest">Pular</button></div>' : '') + '</div>';
    } else {
      h += '<div class="card start-card"><span class="muted sm">' + t.items.length + ' exercícios · cerca de ' + estMin(t) + ' min</span><button class="btn pri lg block" data-act="startTreino" data-arg="' + ti + '">' + U.playIc(18) + ' Começar Treino ' + e_(t.letter) + '</button><span class="dim xs">Ou já vá marcando o check de cada exercício: o treino começa sozinho.</span></div>';
    }
    const oid = onThis ? openIdOf(t, open) : '';
    h += '<ol class="xc-list">' + t.items.map((it, i) => {
      const ex = TV.ex(it.exId), rec = onThis ? open.items[it.id] : null;
      const done = !!(rec && rec.done), isOpen = onThis && oid === it.id;
      const okN = rec ? rec.sets.filter((s) => s.ok).length : 0;
      let x = '<li class="xc' + (done ? ' done' : '') + (isOpen ? ' open' : '') + '" id="xc-' + it.id + '"><div class="xc-head">' +
        '<button class="xc-main" data-act="exToggle" data-arg="' + ti + '|' + it.id + '" aria-expanded="' + isOpen + '"><span class="xc-n num">' + (i + 1) + '</span><span class="xc-t"><b>' + e_(ex.name) + '</b><span class="muted sm">' + e_(TV.setSummary(it.sets)) + '</span><span class="xc-meta">' + (rec && !done && okN ? '<span class="pill brand xs-pill">' + okN + ' de ' + rec.sets.length + ' séries</span>' : done ? '<span class="dim xs">' + doneLine(rec) + '</span>' : '<span class="dim xs">' + lastLine(st, it, open && open.id) + '</span>') + '</span></span></button>' +
        '<button class="xc-check" data-act="exCheck" data-arg="' + ti + '|' + it.id + '" aria-pressed="' + done + '" aria-label="' + (done ? 'Desmarcar ' : 'Marcar como feito: ') + e_(ex.name) + '">' + U.ic('check', 22) + '</button></div>';
      if (isOpen) {
        x += '<div class="xc-body">' + TV.videoBox(ex) +
          '<div class="presc">' + TV.prescLines(it.sets) + (it.note ? '<p class="note">' + e_(it.note) + '</p>' : '') + (it.prog && it.prog.rule ? '<p class="prog">' + U.ic('trend', 16) + '<span>' + e_(it.prog.rule) + '</span></p>' : '') + '</div>' +
          setRows(st, it, rec, open) +
          '<p class="dim xs">Em branco, a série é salva com a carga da última vez e as repetições da ficha.</p>' +
          '<div class="row">' + (done ? '<button class="btn grow" data-act="exCheck" data-arg="' + ti + '|' + it.id + '">Desmarcar exercício</button>' : '<button class="btn pri grow" data-act="exCheck" data-arg="' + ti + '|' + it.id + '">' + U.ic('check', 20) + ' Concluir exercício</button>') +
          '<a class="btn ghost" href="#/aluno/exercicio/' + it.id + '" aria-label="Abrir ' + e_(ex.name) + ' em tela cheia">' + U.ic('fwd', 18) + '</a></div></div>';
      }
      return x + '</li>';
    }).join('') + '</ol>';
    if (onThis) {
      const ss = TV.sessionStats(open), all = ss.exDone === ss.exTotal;
      h += '<div class="end-cta">' + (all ? '<span class="sm ok-txt">' + U.ic('check', 16) + ' Tudo feito! Finalize para registrar.</span>' : '') + '<button class="btn ' + (all ? 'pri' : '') + ' lg block" data-act="finishTreino">Finalizar treino</button></div>';
      return h + '</div></div>';
    }
    h += '</div><div class="wcol b">';
    // recordes e histórico (fora do treino, para não atrapalhar)
    const best = TV.bestByExercise(st.id), bk = Object.keys(best).sort((a, b) => best[b].kg - best[a].kg).slice(0, 3);
    if (bk.length) h += '<section class="sec"><h2 class="h2">Recordes pessoais</h2><div class="card">' + bk.map((k) => '<div class="row between"><span>' + e_(TV.ex(k).name) + '</span><b class="num">' + U.fmtNum(best[k].kg, best[k].kg % 1 ? 1 : 0) + ' kg × ' + e_(best[k].reps) + '</b></div>').join('') + '<a class="linkbtn" href="#/aluno/perfil/cargas">Ver evolução das cargas</a></div></section>';
    const hist = TV.doneSessions(st.id).slice(0, 3);
    if (hist.length) h += '<section class="sec"><h2 class="h2">Últimos treinos</h2>' + hist.map((x) => '<a class="item" href="#/aluno/resumo/' + x.id + '"><span class="okdot">' + U.ic('check', 16) + '</span><span class="grow"><b>Treino ' + e_(x.label) + '</b><br><span class="muted sm">' + e_(U.dayLabel(x.date)) + ' · ' + x.durationMin + ' min</span></span>' + U.ic('chev', 18) + '</a>').join('') + '<a class="linkbtn" href="#/aluno/perfil/treinos">Ver todo o histórico</a></section>';
    return h + '</div></div>';
  }
  // preenche uma série marcada: o que o aluno digitou > última vez > ficha
  function fillSet(st, itemId, k, s, pres, sesId) {
    const prev = lastFor(st.id, itemId, k, sesId);
    if (!s.kg) s.kg = (prev && prev.kg) || pres.kg || '';
    if (!s.reps) s.reps = U.firstNum(pres.reps);
    if (s.rir === '' && pres.rir !== '') s.rir = pres.rir;
  }
  // depois de concluir um exercício, abre o próximo pendente
  function advance(t, open, fromId) {
    const idx = t.items.findIndex((i) => i.id === fromId);
    const next = t.items.slice(idx + 1).find((i) => !open.items[i.id].done) || t.items.find((i) => !open.items[i.id].done);
    UI.exOpen = next ? next.id : '';
    UI.scrollEx = next ? next.id : 'end';
    return next;
  }
  TV.after = TV.after || [];
  TV.after.push(() => {
    if (!UI.scrollEx) return;
    const id = UI.scrollEx; UI.scrollEx = null;
    const el = id === 'end' ? document.querySelector('.end-cta') : document.getElementById('xc-' + id);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: id === 'end' ? 'end' : 'start', behavior: 'smooth' });
  });

  function newSession(st, f, t) {
    const items = {};
    t.items.forEach((it) => { items[it.id] = { done: false, sets: it.sets.map(() => ({ id: U.uid('lg'), kg: '', reps: '', rir: '', ok: false })) }; });
    const ses = { id: U.uid('ses'), studentId: st.id, fichaId: f.id, ver: f.version, treinoId: t.id, label: t.letter + ' · ' + t.name, date: T(), status: 'andamento', startT: U.timeNow(), startMs: Date.now(), items, comment: '' };
    TV.S.sessions.push(ses);
    TV.log(fn(st) + ' começou o Treino ' + t.letter, st.id, 'treino');
    return ses;
  }
  Object.assign(A, {
    treinoSel(i) { UI.treinoSel = +i; },
    startTreino(arg) {
      const st = cur(), f = TV.pub(st.id); if (!f) return;
      const [tiS, itemId] = String(arg).split('|');
      const t = f.published.treinos[+tiS]; if (!t) return;
      let open = TV.openSession(st.id);
      if (open && open.treinoId !== t.id) {
        if (TV.sessionStats(open).done > 0) { TV.openModal('switchTreino', { ti: +tiS, itemId, openId: open.id }); return; }
        TV.S.sessions = TV.S.sessions.filter((x) => x.id !== open.id); open = null;
      }
      if (!open) open = newSession(st, f, t);
      UI.treinoSel = +tiS; UI.rest = null;
      UI.exOpen = itemId || null; UI.scrollEx = itemId || null;
      TV.save(); TV.go('aluno/treino'); return false;
    },
    exToggle(arg) {
      const [tiS, itemId] = String(arg).split('|');
      const st = cur(), open = TV.openSession(st.id), f = TV.pub(st.id);
      const t = f && f.published.treinos[+tiS];
      if (!open || !t || open.treinoId !== t.id) return A.startTreino(arg);
      UI.exOpen = openIdOf(t, open) === itemId ? '' : itemId;
    },
    exCheck(arg) {
      const [tiS, itemId] = String(arg).split('|');
      const st = cur(), f = TV.pub(st.id); if (!f) return;
      const t = f.published.treinos[+tiS]; if (!t) return;
      let open = TV.openSession(st.id);
      if (!open || open.treinoId !== t.id) {
        if (open && TV.sessionStats(open).done > 0) { TV.openModal('switchTreino', { ti: +tiS, itemId, openId: open.id, check: true }); return; }
        if (open) TV.S.sessions = TV.S.sessions.filter((x) => x.id !== open.id);
        open = newSession(st, f, t); UI.treinoSel = +tiS;
      }
      const rec = open.items[itemId], it = t.items.find((i) => i.id === itemId); if (!rec || !it) return;
      if (rec.done) { rec.done = false; UI.exOpen = itemId; UI.rest = null; U.toast('Exercício desmarcado. Corrija o que precisar.'); TV.save(); return; }
      rec.sets.forEach((s, k) => { if (!s.ok) { s.ok = true; fillSet(st, itemId, k, s, it.sets[k], open.id); } });
      rec.done = true; UI.rest = null;
      const next = advance(t, open, itemId);
      TV.save();
      U.toast(next ? TV.ex(it.exId).name + ' feito. Agora: ' + TV.ex(next.exId).name : 'Todos os exercícios feitos. Agora é só finalizar.', 'ok');
    },
    discardAndStart(arg) {
      const d = UI.modal.data; const st = cur(); const f = TV.pub(st.id); const t = f.published.treinos[d.ti];
      TV.S.sessions = TV.S.sessions.filter((x) => x.id !== d.openId); UI.modal = null;
      const ses = newSession(st, f, t); UI.treinoSel = d.ti; UI.rest = null;
      if (d.check && d.itemId) { TV.save(); return A.exCheck(d.ti + '|' + d.itemId); }
      UI.exOpen = d.itemId || null; UI.scrollEx = d.itemId || null;
      TV.save(); TV.go('aluno/treino'); void ses; return false;
    },
    backToOpen() { const st = cur(), f = TV.pub(st.id), open = TV.openSession(st.id); UI.modal = null; UI.treinoSel = f.published.treinos.findIndex((t) => t.id === open.treinoId); TV.go('aluno/treino'); return false; },
    toggleSet(arg) {
      const [itemId, k] = arg.split('|');
      const st = cur(), open = TV.openSession(st.id); if (!open) return;
      const rec = open.items[itemId], s = rec.sets[+k];
      const fi = TV.findItem(TV.fichaOf(st.id), itemId); const pres = fi.it.sets[+k];
      s.ok = !s.ok;
      if (s.ok) {
        fillSet(st, itemId, +k, s, pres, open.id);
        const sec = parseInt(pres.rest, 10) || 0; UI.rest = sec ? { end: Date.now() + sec * 1000, total: sec } : null;
        if (!rec.done && rec.sets.every((x) => x.ok)) {
          rec.done = true;
          const onList = location.hash.indexOf('#/aluno/treino') === 0;
          const next = onList ? advance(fi.t, open, itemId) : null;
          U.toast(TV.ex(fi.it.exId).name + ': todas as séries feitas' + (next ? '. Próximo: ' + TV.ex(next.exId).name : ''), 'ok');
        }
      } else { UI.rest = null; if (rec.done) rec.done = false; }
    },
    concludeEx(itemId) {
      const st = cur(), open = TV.openSession(st.id); if (!open) return;
      const f = TV.fichaOf(st.id), fi = TV.findItem(f, itemId);
      open.items[itemId].done = true; UI.rest = null;
      const items = fi.t.items, idx = items.findIndex((i) => i.id === itemId);
      const next = items.slice(idx + 1).find((i) => !open.items[i.id].done) || items.find((i) => !open.items[i.id].done);
      TV.save();
      UI.exOpen = next ? next.id : ''; UI.scrollEx = next ? next.id : 'end';
      if (next) U.toast('Exercício concluído. Próximo: ' + TV.ex(next.exId).name, 'ok');
      else U.toast('Todos os exercícios concluídos. Agora é só finalizar o treino.', 'ok');
      TV.go('aluno/treino');
      return false;
    },
    reopenEx(itemId) { const open = TV.openSession(cur().id); if (open) open.items[itemId].done = false; },
    finishTreino() {
      const open = TV.openSession(cur().id); if (!open) return;
      const ss = TV.sessionStats(open);
      if (ss.exDone < ss.exTotal) { TV.openModal('finishConfirm', { left: ss.exTotal - ss.exDone, id: open.id }); return; }
      TV.go('aluno/resumo/' + open.id); return false;
    },
    goResumo(id) { UI.modal = null; TV.go('aluno/resumo/' + id); return false; },
    saveSession(id) {
      const ses = TV.S.sessions.find((x) => x.id === id); if (!ses || ses.status !== 'andamento') return;
      if (!TV.net('salvar o treino', 'saveSession', id)) return;
      const st = cur();
      ses.status = 'concluida'; ses.endT = U.timeNow(); ses.durationMin = Math.max(1, Math.round((Date.now() - (ses.startMs || Date.now())) / 60000));
      ses.comment = String(ses.comment || '').trim();
      UI.rest = null; UI.treinoSel = null;
      TV.log(fn(st) + ' concluiu o Treino ' + ses.label + (ses.comment ? ' · "' + ses.comment + '"' : ''), st.id, 'treino');
      U.toast('Treino concluído e registrado no seu dia', 'ok');
    }
  });
  TV.M.switchTreino = (d) => {
    const st = cur(), open = TV.S.sessions.find((x) => x.id === d.openId);
    return { title: 'Treino em andamento', body: '<p>Você já registrou séries no Treino ' + e_(open ? open.label : '') + '. Se começar outro treino agora, esses registros serão descartados.</p>', foot: '<button class="btn" data-act="backToOpen">Voltar ao treino em andamento</button><button class="btn danger" data-act="discardAndStart">Descartar e começar</button>' };
  };
  TV.M.finishConfirm = (d) => ({ title: 'Finalizar o treino?', body: '<p>Ainda ' + (d.left === 1 ? 'falta 1 exercício' : 'faltam ' + d.left + ' exercícios') + ' sem concluir. Você pode finalizar assim mesmo; eles ficam registrados como não feitos.</p>', foot: '<button class="btn" data-act="closeModal">Continuar treinando</button><button class="btn pri" data-act="goResumo" data-arg="' + d.id + '">Finalizar mesmo assim</button>' });

  function vExercicio(st, itemId) {
    const f = TV.pub(st.id), fi = TV.findItem(f, itemId);
    if (!f || !fi) return head('Exercício', 'treino') + TV.empty('Exercício não encontrado', 'Ele pode ter sido removido da ficha.', '<a class="btn" href="#/aluno/treino">Voltar ao treino</a>');
    const open = TV.openSession(st.id), it = fi.it, t = fi.t, ex = TV.ex(it.exId);
    const idx = t.items.findIndex((i) => i.id === itemId);
    let h = '<header class="sc-head"><a class="back" href="#/aluno/treino" aria-label="Voltar ao treino">' + U.ic('back', 20) + '</a><div class="grow"><p class="eyebrow">Treino ' + e_(t.letter) + ' · exercício ' + (idx + 1) + ' de ' + t.items.length + '</p><h1 class="d h1">' + e_(ex.name) + '</h1></div></header>';
    h += TV.videoBox(ex);
    h += '<div class="card presc">' + TV.prescLines(it.sets) + (it.note ? '<p class="note">' + e_(it.note) + '</p>' : '') + (it.prog && it.prog.rule ? '<p class="prog">' + U.ic('trend', 16) + '<span>' + e_(it.prog.rule) + '</span></p>' : '') + '</div>';
    if (!open || open.treinoId !== t.id) {
      return h + '<button class="btn pri lg block" data-act="startTreino" data-arg="' + f.published.treinos.findIndex((x) => x.id === t.id) + '|' + itemId + '">Começar o Treino ' + e_(t.letter) + ' para registrar</button>';
    }
    const rec = open.items[itemId];
    if (rec.done) h += '<div class="inline-note ok">' + U.ic('check', 18) + '<span class="grow">Exercício concluído. Se precisar, corrija os registros abaixo.</span></div>';
    if (UI.rest) h += '<div class="restbar" role="timer"><span>Descanso</span><b id="rest-left" class="num">' + U.mmss(Math.max(0, Math.round((UI.rest.end - Date.now()) / 1000))) + '</b><button class="btn sm" data-act="skipRest">Pular</button></div>';
    h += setRows(st, it, rec, open);
    const okN = rec.sets.filter((s) => s.ok).length;
    h += '<p class="dim xs">Em branco, a série é salva com a carga da última vez e as repetições da ficha.</p>';
    const prevIt = t.items[idx - 1], nextIt = t.items[idx + 1];
    if (!rec.done) h += '<button class="btn pri lg block" data-act="concludeEx" data-arg="' + itemId + '">' + U.ic('check', 20) + ' Concluir exercício</button><p class="center muted sm">' + okN + ' de ' + rec.sets.length + ' séries marcadas</p>';
    else h += '<div class="grid2">' + (nextIt ? '<a class="btn pri" href="#/aluno/exercicio/' + nextIt.id + '">Próximo exercício</a>' : '<a class="btn pri" href="#/aluno/treino">Voltar ao treino</a>') + '<button class="btn" data-act="reopenEx" data-arg="' + itemId + '">Desmarcar conclusão</button></div>';
    h += '<nav class="exnav" aria-label="Navegar entre exercícios">' + (prevIt ? '<a href="#/aluno/exercicio/' + prevIt.id + '">' + U.ic('back', 16) + ' ' + e_(TV.ex(prevIt.exId).name) + '</a>' : '<span></span>') + (nextIt ? '<a href="#/aluno/exercicio/' + nextIt.id + '">' + e_(TV.ex(nextIt.exId).name) + ' ' + U.ic('chev', 16) + '</a>' : '<span></span>') + '</nav>';
    return h;
  }

  function vResumo(st, id) {
    const ses = TV.S.sessions.find((x) => x.id === id && x.studentId === st.id);
    if (!ses) return head('Resumo', 'treino') + TV.empty('Treino não encontrado');
    const f = TV.fichaOf(st.id), isOpen = ses.status === 'andamento', ss = TV.sessionStats(ses);
    const dur = isOpen ? Math.max(1, Math.round((Date.now() - (ses.startMs || Date.now())) / 60000)) : ses.durationMin;
    // recordes desta sessão
    const prevBest = {};
    TV.doneSessions(st.id).filter((x) => x.id !== ses.id && (x.date < ses.date || (x.date === ses.date && x.endT < (ses.endT || '99')))).forEach((x) => Object.keys(x.items).forEach((k) => { const fi = TV.findItem(f, k); if (!fi) return; x.items[k].sets.forEach((s) => { if (s.ok) prevBest[fi.it.exId] = Math.max(prevBest[fi.it.exId] || 0, U.num(s.kg)); }); }));
    const prs = [];
    Object.keys(ses.items).forEach((k) => { const fi = TV.findItem(f, k); if (!fi) return; let mx = 0; ses.items[k].sets.forEach((s) => { if (s.ok) mx = Math.max(mx, U.num(s.kg)); }); const pb = prevBest[fi.it.exId] || 0; if (pb && mx > pb) prs.push({ name: TV.ex(fi.it.exId).name, kg: mx, diff: mx - pb }); });
    let h = '<header class="sc-head"><a class="back" href="#/aluno/treino" aria-label="Voltar">' + U.ic('back', 20) + '</a><div class="grow"><p class="eyebrow">' + (isOpen ? 'Resumo antes de concluir' : e_(U.dayLabel(ses.date)) + ' · ' + e_(ses.startT) + '–' + e_(ses.endT)) + '</p><h1 class="d h1">Treino ' + e_(ses.label) + '</h1></div></header>';
    h += '<div class="grid3"><div class="stat"><span>Duração</span><b class="num">' + dur + ' min</b></div><div class="stat"><span>Séries</span><b class="num">' + ss.done + ' de ' + ss.total + '</b></div><div class="stat"><span>Volume</span><b class="num">' + ss.vol.toLocaleString('pt-BR') + ' kg</b></div></div>';
    prs.forEach((p) => { h += '<div class="card hl pr">' + U.ic('trend', 24) + '<span><span class="eyebrow">Novo recorde</span><br><b>' + e_(p.name) + ': ' + U.fmtNum(p.kg, p.kg % 1 ? 1 : 0) + ' kg</b> <span class="muted sm">(+' + U.fmtNum(p.diff, p.diff % 1 ? 1 : 0) + ' kg)</span></span></div>'; });
    const fiT = f && TV.findItem(f, Object.keys(ses.items)[0]);
    h += '<section class="sec"><h2 class="h2">Exercícios</h2><div class="card">' + Object.keys(ses.items).map((k) => {
      const fi = TV.findItem(f, k), rec = ses.items[k];
      const sets = rec.sets.filter((s) => s.ok).map((s) => e_(s.kg || '–') + '×' + e_(s.reps || '–')).join(', ');
      return '<div class="sumrow"><span class="ex-n sm' + (rec.done ? ' done' : '') + '">' + (rec.done ? U.ic('check', 14) : '–') + '</span><span class="grow"><b>' + e_(fi ? TV.ex(fi.it.exId).name : 'Exercício') + '</b><br><span class="muted sm num">' + (sets || 'Não feito') + '</span></span>' + (isOpen ? '<a class="linkbtn sm" href="#/aluno/exercicio/' + k + '">Corrigir</a>' : '') + '</div>';
    }).join('') + '</div></section>';
    void fiT;
    if (isOpen) {
      TV.reg(ses);
      h += '<div class="field"><label for="ses-com">Comentário para o Pedro (opcional)</label><textarea class="in" id="ses-com" data-obj="' + ses.id + '" data-key="comment" placeholder="Ex.: senti o ombro no supino inclinado">' + e_(ses.comment) + '</textarea></div>';
      h += '<button class="btn pri lg block" data-act="saveSession" data-arg="' + ses.id + '">Concluir treino</button><a class="btn block" href="#/aluno/treino">Voltar ao treino</a>';
    } else {
      if (ses.comment) h += '<div class="card"><span class="lbl">Seu comentário</span><span class="quote-txt">"' + e_(ses.comment) + '"</span></div>';
      h += '<div class="inline-note ok">' + U.ic('check', 18) + '<span>Treino registrado no dia ' + U.dm(ses.date) + '. O Pedro já recebeu.</span></div><a class="btn block" href="#/aluno/inicio">Ir para o início</a>';
    }
    return h;
  }

  /* =================== ALIMENTAÇÃO =================== */
  const MEAL_ST = { seguiu: ['Segui', 'ok'], parcial: ['Segui em parte', 'warn'], substituiu: ['Troquei algo', 'info'], outra: ['Comi outra coisa', 'info'], nao: ['Não fiz', 'err'] };
  function vAlimentacao(st) {
    const g = TV.guidePub(st.id), today = T();
    const day = UI.foodDay && UI.foodDay <= today && U.diffDays(UI.foodDay, today) < 7 ? UI.foodDay : today;
    let h = head('Alimentação', null, g ? 'Orientações gerais do Pedro · versão ' + g.version : 'Registro de refeições e água');
    h += '<div class="chips scroll" role="tablist" aria-label="Escolher o dia">' + Array.from({ length: 7 }, (_, i) => { const d = U.addDays(today, -i); return '<button class="chip' + (d === day ? ' on' : '') + '" data-act="foodDay" data-arg="' + d + '">' + (i === 0 ? 'Hoje' : i === 1 ? 'Ontem' : U.wd(d) + ' ' + U.dm(d)) + '</button>'; }).reverse().join('') + '</div>';
    if (day !== today) h += '<div class="inline-note">' + U.ic('edit', 18) + '<span>Você está corrigindo os registros de ' + U.dayLabel(day) + '.</span></div>';
    // água
    const goal = TV.waterGoal(st.id), tot = TV.waterTotal(st.id, day), entries = TV.waterDay(st.id, day);
    h += '<div class="wgrid"><div class="wcol a">';
    h += '<section class="card water"><div class="row between"><div><span class="eyebrow">Hidratação</span><div class="d big num">' + U.liters(tot) + '</div><span class="muted sm">' + (goal ? 'Meta do dia: ' + U.liters(goal) + ' · definida pelo Pedro' : 'O Pedro ainda não definiu sua meta de água') + '</span></div>' + (goal ? U.ring((tot / goal) * 100, 68, 'Meta de água') : '') + '</div>' +
      '<div class="row"><button class="btn" data-act="addWater" data-arg="250|' + day + '">' + U.ic('drop', 18) + ' +250 ml</button><button class="btn" data-act="addWater" data-arg="500|' + day + '">' + U.ic('drop', 18) + ' +500 ml</button></div>' +
      '<div class="row"><label class="sr" for="water-custom">Outro valor em ml</label><input class="in grow" id="water-custom" inputmode="numeric" placeholder="Outro valor (ml)" data-ui="waterCustom" value="' + e_(UI.waterCustom || '') + '"><button class="btn" data-act="addWaterCustom" data-arg="' + day + '">Adicionar</button></div>' +
      (entries.length ? '<div class="wentries">' + entries.map((w) => UI.waterEdit === w.id
        ? '<span class="went edit"><label class="sr" for="we-' + w.id + '">Corrigir quantidade</label><input class="in num" id="we-' + w.id + '" inputmode="numeric" data-ui="waterEditVal" value="' + e_(UI.waterEditVal != null ? UI.waterEditVal : w.ml) + '"><button class="btn sm pri" data-act="waterSave" data-arg="' + w.id + '">Salvar</button></span>'
        : '<span class="went"><button class="went-b" data-act="waterEdit" data-arg="' + w.id + '" aria-label="Corrigir ' + w.ml + ' ml das ' + w.at.slice(11) + '">' + w.ml + ' ml · ' + w.at.slice(11) + '</button><button class="went-x" data-act="waterDel" data-arg="' + w.id + '" aria-label="Apagar registro de ' + w.ml + ' ml">' + U.ic('x', 14) + '</button></span>').join('') + '</div>' : '<span class="dim xs">Nenhum registro de água neste dia.</span>') +
      '<div class="mini-chart">' + U.bars(Array.from({ length: 7 }, (_, i) => { const d = U.addDays(day, i - 6); const v = TV.waterTotal(st.id, d); return { label: U.wd(d).charAt(0).toUpperCase(), v, hl: d === day, ok: goal && v >= goal }; }), { goal, h: 110, label: 'Água nos últimos 7 dias' }) + '</div></section>';
    if (!g) return h + '</div></div>' + TV.empty('Sem orientações de alimentação', 'O Pedro ainda não publicou orientações para você. A água já pode ser registrada.');
    h += '<p class="disclaimer">' + U.ic('alert', 16) + '<span>' + e_(g.notes) + '</span></p>';
    h += '</div><div class="wcol b">';
    // refeições
    const logs = TV.mealLogsDay(st.id, day), segui = logs.filter((l) => l.status === 'seguiu').length;
    h += '<div class="row between"><h2 class="h2">Refeições</h2><span class="muted sm">' + logs.length + ' de ' + g.meals.length + ' registradas · ' + segui + ' seguidas</span></div>';
    h += g.meals.map((m) => {
      const log = TV.mealLog(st.id, day, m.id), editing = UI.mealEdit === m.id, pend = UI.mealPending && UI.mealPending.mealId === m.id ? UI.mealPending : null;
      let x = '<article class="card meal' + (log && !editing ? ' logged' : '') + '"><div class="row between"><div><span class="eyebrow">' + e_(m.time) + '</span><h3 class="h3">' + e_(m.name) + '</h3></div>' + (log && !editing ? TV.pill(MEAL_ST[log.status][1], MEAL_ST[log.status][0]) : '') + '</div>';
      x += '<p class="guid">' + e_(m.guidance) + '</p>';
      if (m.options && m.options.length) x += '<div class="sugs"><span class="dim xs">Sugestões</span>' + m.options.map((o, i) => (log && !editing && log.status === 'seguiu') ? '<button class="sug' + (log.option === i ? ' on' : '') + '" data-act="mealOpt" data-arg="' + m.id + '|' + i + '|' + day + '" aria-pressed="' + (log.option === i) + '">' + e_(o) + '</button>' : '<span class="sug static">' + e_(o) + '</span>').join('') + '</div>';
      if (log && !editing) {
        x += (log.note ? '<p class="consumed"><span class="dim xs">O que você comeu</span><br>' + e_(log.note) + '</p>' : '') + '<button class="linkbtn sm" data-act="mealEdit" data-arg="' + m.id + '">' + U.ic('edit', 14) + ' Corrigir registro</button>';
      } else if (pend) {
        TV.reg(pend);
        const q = { parcial: 'O que ficou de fora? (opcional)', substituiu: 'O que você trocou?', outra: 'O que você comeu?' }[pend.status];
        x += '<div class="field"><label for="mn-' + m.id + '">' + q + '</label><textarea class="in" id="mn-' + m.id + '" data-obj="' + pend.id + '" data-key="note" placeholder="Ex.: troquei o arroz por batata">' + e_(pend.note || '') + '</textarea></div><div class="row"><button class="btn pri" data-act="mealSave" data-arg="' + m.id + '|' + day + '">Salvar</button><button class="btn ghost" data-act="mealCancel">Cancelar</button></div>';
      } else {
        x += '<div class="meal-acts">' + ['seguiu', 'parcial', 'substituiu', 'outra', 'nao'].map((s) => '<button class="btn sm' + (s === 'seguiu' ? ' pri' : '') + '" data-act="mealSet" data-arg="' + m.id + '|' + s + '|' + day + '">' + MEAL_ST[s][0] + '</button>').join('') + '</div>' + (editing ? '<button class="linkbtn sm" data-act="mealCancel">Cancelar correção</button>' : '');
      }
      return x + '</article>';
    }).join('');
    return h + '</div></div>';
  }
  function upsertMeal(st, day, mealId, status, note) {
    const g = TV.guidePub(st.id), m = g.meals.find((x) => x.id === mealId);
    let log = TV.mealLog(st.id, day, mealId);
    if (!log) { log = { id: U.uid('ml'), studentId: st.id, date: day, mealId, mealName: m.name, guideV: g.version, status, option: null, note: '', at: TV.stamp() }; TV.S.mealLogs.push(log); }
    else { log.status = status; log.at = TV.stamp(); log.guideV = g.version; }
    log.note = status === 'seguiu' || status === 'nao' ? '' : String(note || '').trim();
    if (status !== 'seguiu') log.option = null;
    return log;
  }
  Object.assign(A, {
    foodDay(d) { UI.foodDay = d; UI.mealEdit = null; UI.mealPending = null; UI.waterEdit = null; },
    addWater(arg) {
      const [ml, d] = String(arg).split('|'); const st = cur(), day = d || T();
      TV.S.water.push({ id: U.uid('w'), studentId: st.id, date: day, ml: +ml, at: day + 'T' + U.timeNow() });
      U.toast('+' + ml + ' ml registrados', 'ok');
    },
    addWaterCustom(d) {
      const ml = Math.round(U.num(UI.waterCustom));
      if (!ml || ml < 50 || ml > 3000) { U.toast('Informe um valor entre 50 e 3000 ml.', 'err'); return; }
      UI.waterCustom = ''; A.addWater(ml + '|' + d);
    },
    waterEdit(id) { UI.waterEdit = id; const w = TV.S.water.find((x) => x.id === id); UI.waterEditVal = w ? w.ml : ''; },
    waterSave(id) {
      const w = TV.S.water.find((x) => x.id === id); const ml = Math.round(U.num(UI.waterEditVal));
      if (!ml || ml < 50 || ml > 3000) { U.toast('Informe um valor entre 50 e 3000 ml.', 'err'); return; }
      w.ml = ml; UI.waterEdit = null; UI.waterEditVal = null; U.toast('Registro de água corrigido', 'ok');
    },
    waterDel(id) { TV.S.water = TV.S.water.filter((x) => x.id !== id); U.toast('Registro de água apagado'); },
    mealSet(arg) {
      const [mealId, status, day] = arg.split('|'); const st = cur();
      if (status === 'seguiu' || status === 'nao') { upsertMeal(st, day, mealId, status, ''); UI.mealEdit = null; UI.mealPending = null; U.toast(status === 'seguiu' ? 'Refeição registrada como seguida' : 'Registrado: refeição não feita', 'ok'); return; }
      const old = TV.mealLog(st.id, day, mealId);
      UI.mealPending = { id: 'meal-pending', mealId, status, note: old && old.status === status ? old.note : '' };
    },
    mealSave(arg) {
      const [mealId, day] = arg.split('|'); const p = UI.mealPending; if (!p) return;
      if ((p.status === 'substituiu' || p.status === 'outra') && !String(p.note || '').trim()) { U.toast('Conte rapidinho o que você comeu.', 'err'); return; }
      upsertMeal(cur(), day, mealId, p.status, p.note); UI.mealPending = null; UI.mealEdit = null; U.toast('Refeição registrada', 'ok');
    },
    mealCancel() { UI.mealPending = null; UI.mealEdit = null; },
    mealEdit(id) { UI.mealEdit = id; UI.mealPending = null; },
    mealOpt(arg) { const [mealId, i, day] = arg.split('|'); const log = TV.mealLog(cur().id, day, mealId); if (log) log.option = log.option === +i ? null : +i; }
  });

  /* =================== CHECK-IN =================== */
  function vCheckin(st) {
    const today = T(), ws = U.weekStart(today), status = TV.checkinStatus(st.id, ws);
    let h = head('Check-in semanal', 'inicio', 'Semana de ' + U.dm(ws) + ' a ' + U.dm(U.addDays(ws, 6)), TV.ckPill(status));
    const cons = TV.consolidate(st.id, ws);
    const consCard = (c) => '<div class="card"><span class="lbl">Resumo da semana · montado pelo app</span><div class="grid3"><div class="stat"><span>Treinos</span><b class="num">' + c.treinos + ' de ' + c.meta + '</b></div><div class="stat"><span>Refeições</span><b class="num">' + (c.mealPct == null ? '—' : c.mealPct + '%') + '</b></div><div class="stat"><span>Água/dia</span><b class="num">' + (c.waterAvg == null ? '—' : U.liters(c.waterAvg)) + '</b></div></div></div>';
    if (status === 'aguardando') {
      h += '<div class="card"><b class="lg">O check-in abre no sábado, ' + U.dm(U.addDays(ws, 5)) + '</b><span class="muted sm">Fica disponível sábado e domingo e fecha no domingo às 23h59. Até lá, o app vai juntando seus treinos, refeições e água.</span></div>' + consCard(cons);
    } else if (status === 'pendente') {
      const d = (UI.ck = UI.ck && UI.ck.week === ws ? UI.ck : { id: 'ckdraft', week: ws, peso: '', photos: {}, dores: '', comentario: '' });
      TV.reg(d);
      const prev = TV.prevCheckin(st.id, ws);
      h += '<div class="inline-note">' + U.ic('clock', 18) + '<span>Fecha domingo, ' + U.dm(U.addDays(ws, 6)) + ', às 23h59.</span></div>';
      h += '<div class="wgrid"><div class="wcol a">';
      h += '<div class="field"><label for="ck-peso">Peso de hoje (kg) <span class="req">obrigatório</span></label><div class="row"><input class="in num grow" id="ck-peso" inputmode="decimal" placeholder="Ex.: 78,4" data-obj="ckdraft" data-key="peso" value="' + e_(d.peso) + '"><span class="muted sm">' + (prev ? 'Último: ' + e_(prev.peso) + ' kg' : 'Primeiro check-in') + '</span></div></div>';
      h += '<div class="field"><span class="lbl">Fotos de acompanhamento · só o Pedro vê</span><div class="grid3 photos">' + ['frente', 'lado', 'costas'].map((pose) => {
        const src = d.photos[pose];
        return '<div class="photo-slot"><div class="photo">' + U.photo(src, pose, 4) + '</div><span class="sm">' + { frente: 'Frente', lado: 'Lado', costas: 'Costas' }[pose] + '</span>' +
          '<label class="btn sm block" for="ckf-' + pose + '">' + U.ic('up', 16) + (src ? 'Trocar' : 'Enviar') + '<input type="file" accept="image/*" class="sr" id="ckf-' + pose + '" data-file="ckPhoto" data-arg="' + pose + '"></label>' +
          (src ? '<button class="linkbtn sm" data-act="ckPhotoDel" data-arg="' + pose + '">Remover</button>' : '<button class="linkbtn sm" data-act="ckDemoPhoto" data-arg="' + pose + '">Usar exemplo</button>') + '</div>';
      }).join('') + '</div></div>';
      h += '<div class="field"><label for="ck-dores">Dificuldades ou dores na semana</label><textarea class="in" id="ck-dores" data-obj="ckdraft" data-key="dores" placeholder="Ex.: o ombro incomodou no supino">' + e_(d.dores) + '</textarea></div>';
      h += '<div class="field"><label for="ck-com">Comentários ou perguntas para o Pedro</label><textarea class="in" id="ck-com" data-obj="ckdraft" data-key="comentario" placeholder="Ex.: posso trocar o crucifixo pelo crossover?">' + e_(d.comentario) + '</textarea></div>';
      h += '</div><div class="wcol b">' + consCard(cons) + '<button class="btn pri lg block" data-act="sendCheckin">Enviar check-in</button></div></div>';
    } else {
      const c = TV.checkinOf(st.id, ws);
      if (c) h += ckView(c);
    }
    // histórico curto
    h += '<section class="sec"><h2 class="h2">Semanas anteriores</h2>' + [1, 2, 3, 4].map((k) => { const w = U.addDays(ws, -7 * k); if (w < U.weekStart(st.since)) return ''; const s = TV.checkinStatus(st.id, w); return '<div class="item"><span class="grow"><b>Semana de ' + U.dm(w) + '</b>' + (TV.checkinOf(st.id, w) ? '<br><span class="muted sm">' + e_(TV.checkinOf(st.id, w).peso) + ' kg</span>' : '') + '</span>' + TV.ckPill(s) + '</div>'; }).join('') + '<a class="linkbtn" href="#/aluno/perfil/checkins">Ver todos os check-ins</a></section>';
    return h;
  }
  function ckView(c) {
    let h = '<div class="card"><div class="row between"><b>Enviado ' + e_(U.dayLabel(c.sentAt.slice(0, 10))) + ' às ' + e_(c.sentAt.slice(11)) + '</b>' + TV.ckPill(c.reviewedAt ? 'revisado' : 'enviado') + '</div><div class="grid3 photos">' + ['frente', 'lado', 'costas'].map((p) => '<div class="photo">' + U.photo(c.photos && c.photos[p], p, 3) + '</div>').join('') + '</div><div class="row between"><span class="muted">Peso</span><b class="num">' + e_(c.peso) + ' kg</b></div>' + (c.dores ? '<p><span class="dim xs">Dores</span><br>' + e_(c.dores) + '</p>' : '') + (c.comentario ? '<p><span class="dim xs">Comentário</span><br>' + e_(c.comentario) + '</p>' : '') + '</div>';
    if (c.reviewedAt) h += '<div class="card hl"><div class="row">' + TV.avatar(TV.PEDRO, 'sm') + '<p class="eyebrow">Feedback do Pedro</p></div><span class="quote-txt">' + e_(c.feedback || 'Check-in revisado.') + '</span></div>';
    else h += '<div class="inline-note">' + U.ic('clock', 18) + '<span>O Pedro ainda não revisou. Você recebe um aviso quando ele responder.</span></div>';
    return h;
  }
  TV.F.ckPhoto = (file, pose) => {
    U.shrinkImage(file, 420).then((url) => { UI.ck.photos[pose] = url; TV.render(); }).catch((err) => U.toast(err.message + ' Envie uma foto em JPG ou PNG.', 'err'));
  };
  Object.assign(A, {
    ckDemoPhoto(pose) { UI.ck.photos[pose] = 'demo:' + pose + ':4'; },
    ckPhotoDel(pose) { delete UI.ck.photos[pose]; },
    sendCheckin() {
      const st = cur(), d = UI.ck, ws = U.weekStart(T());
      if (!d) return;
      if (!U.num(d.peso)) { U.toast('Informe o seu peso de hoje para enviar.', 'err'); const el = document.getElementById('ck-peso'); if (el) el.focus(); return false; }
      if (TV.checkinStatus(st.id, ws) !== 'pendente') { U.toast('O check-in desta semana não está aberto.', 'err'); return; }
      if (!TV.net('enviar o check-in', 'sendCheckin')) return;
      TV.S.checkins.push({ id: U.uid('ck'), studentId: st.id, week: ws, sentAt: TV.stamp(), peso: String(d.peso).trim(), photos: Object.assign({}, d.photos), dores: String(d.dores || '').trim(), comentario: String(d.comentario || '').trim(), cons: TV.consolidate(st.id, ws), reviewedAt: null, feedback: '' });
      UI.ck = null;
      TV.log(fn(st) + ' enviou o check-in da semana', st.id, 'checkin');
      if (!TV.save()) return;
      U.toast('Check-in enviado para o Pedro', 'ok');
    }
  });

  /* =================== LOJA =================== */
  function vLoja() {
    const tab = UI.lojaTab === 'parceiros' ? 'parceiros' : 'produtos', today = T();
    let h = head('Loja TeamVechi', null, 'Produtos da marca e descontos de parceiros');
    h += '<div class="seg block" role="tablist"><button role="tab" aria-selected="' + (tab === 'produtos') + '" data-act="lojaTab" data-arg="produtos">Produtos</button><button role="tab" aria-selected="' + (tab === 'parceiros') + '" data-act="lojaTab" data-arg="parceiros">Parceiros e cupons</button></div>';
    if (tab === 'produtos') {
      const ps = TV.S.products.filter((p) => p.published);
      if (!ps.length) return h + TV.empty('Nenhum produto publicado', 'Volte mais tarde para ver a coleção.');
      h += '<div class="pgrid">' + ps.map((p) => '<a class="prod" href="#/aluno/produto/' + p.id + '"><div class="prod-art">' + (p.img ? '<img src="' + e_(p.img) + '" alt="' + e_(p.name) + '">' : U.productArt(p.art)) + (p.available ? '' : '<span class="pill err over">Esgotado</span>') + '</div><div class="prod-b"><b>' + e_(p.name) + '</b><span class="price">' + U.money(p.price) + '</span></div></a>').join('') + '</div>';
      h += '<p class="dim xs">O pedido é combinado com o Pedro pelo WhatsApp. Preços de exemplo.</p>';
    } else {
      const cs = TV.S.coupons.filter((c) => c.published);
      const act = cs.filter((c) => c.until >= today), old = cs.filter((c) => c.until < today);
      if (!cs.length) return h + TV.empty('Nenhum cupom no momento', 'Quando o Pedro publicar descontos de parceiros, eles aparecem aqui.');
      const card = (c, expired) => { const pa = TV.S.partners.find((x) => x.id === c.partnerId) || { name: 'Parceiro', desc: '' }; return '<article class="card coupon' + (expired ? ' expired' : '') + '"><div class="row"><span class="av">' + e_(U.initials(pa.name)) + '</span><div class="grow"><b>' + e_(pa.name) + '</b><br><span class="muted sm">' + e_(pa.desc) + '</span></div></div><div class="d big">' + e_(c.discount) + '</div><div class="codebox"><code>' + e_(c.code) + '</code>' + (expired ? '' : '<button class="btn sm" data-act="copyCode" data-arg="' + e_(c.code) + '">' + U.ic('copy', 16) + ' Copiar</button>') + '</div><div class="row between"><span class="' + (expired ? 'err-t' : 'muted') + ' sm">' + (expired ? 'Encerrado em ' : 'Válido até ') + U.dm(c.until) + '</span>' + (expired ? '' : '<button class="linkbtn sm" data-act="partnerLink" data-arg="' + pa.id + '">' + U.ic('link', 14) + ' Ver loja</button>') + '</div></article>'; };
      h += act.map((c) => card(c, false)).join('') || TV.empty('Nenhum cupom válido agora');
      if (old.length) h += '<h2 class="h2">Encerrados</h2>' + old.map((c) => card(c, true)).join('');
    }
    return h;
  }
  function vProduto(st, id) {
    const p = TV.S.products.find((x) => x.id === id && x.published);
    if (!p) return head('Produto', 'loja') + TV.empty('Produto indisponível', 'Ele pode ter sido retirado da loja.');
    const size = UI.size && p.sizes.includes(UI.size) ? UI.size : p.sizes.length === 1 ? p.sizes[0] : null;
    let h = head(e_(p.name), 'loja');
    h += '<div class="wgrid"><div class="wcol a"><div class="prod-hero">' + (p.img ? '<img src="' + e_(p.img) + '" alt="' + e_(p.name) + '">' : U.productArt(p.art)) + '</div>';
    h += '</div><div class="wcol b"><div class="row between"><span class="d big">' + U.money(p.price) + '</span>' + (p.available ? TV.pill('ok', 'Disponível') : TV.pill('err', 'Esgotado')) + '</div><p>' + e_(p.desc) + '</p>';
    if (p.sizes.length > 1) h += '<div class="field"><span class="lbl">Tamanho</span><div class="chips">' + p.sizes.map((s) => '<button class="chip' + (s === size ? ' on' : '') + '" data-act="pickSize" data-arg="' + s + '" aria-pressed="' + (s === size) + '">' + s + '</button>').join('') + '</div></div>';
    h += p.available ? '<button class="btn pri lg block" data-act="orderProduct" data-arg="' + p.id + '">' + U.ic('msg', 20) + ' Pedir pelo WhatsApp</button>' : '<button class="btn lg block" disabled>Esgotado no momento</button>';
    h += '<p class="dim xs">Nenhuma compra é feita pelo app nesta demonstração: o pedido só monta a mensagem para o Pedro.</p>';
    return h + '</div></div>';
  }
  TV.M.order = (d) => {
    const p = TV.S.products.find((x) => x.id === d.id), st = cur();
    const msg = 'Olá, Pedro! Aqui é o ' + fn(st) + '. Quero ' + (p.name.match(/^[AEIOU]/i) ? 'o' : 'a') + ' ' + p.name + (d.size && d.size !== 'Único' ? ', tamanho ' + d.size : '') + '. (Pedido feito pelo app TeamVechi)';
    return { title: 'Pedido pelo WhatsApp', body: '<p class="muted sm">Na versão final, este botão abre o WhatsApp do Pedro com a mensagem pronta:</p><div class="wa-msg">' + e_(msg) + '</div><p class="sm">WhatsApp do Pedro: <b class="sel">' + e_(TV.S.pedro.phone) + '</b> <span class="dim">(número de exemplo)</span></p>', foot: '<button class="btn" data-act="copyMsg" data-arg="' + e_(msg) + '">' + U.ic('copy', 16) + ' Copiar mensagem</button><button class="btn pri" data-act="sendOrder" data-arg="' + p.id + '|' + (d.size || '') + '">Enviar pedido (simulação)</button>' };
  };
  TV.M.partner = (d) => { const pa = TV.S.partners.find((x) => x.id === d.id); return { title: e_(pa.name), body: '<p>Na versão final, este botão abre a loja do parceiro:</p><p><code class="sel">' + e_(pa.link) + '</code></p><p class="dim xs">Endereço de demonstração: não leva a um site real.</p>', foot: '<button class="btn pri" data-act="closeModal">Entendi</button>' }; };
  Object.assign(A, {
    lojaTab(t) { UI.lojaTab = t; },
    pickSize(s) { UI.size = s; },
    orderProduct(id) {
      const p = TV.S.products.find((x) => x.id === id);
      const size = UI.size && p.sizes.includes(UI.size) ? UI.size : p.sizes.length === 1 ? p.sizes[0] : null;
      if (!size) { U.toast('Escolha o tamanho antes de pedir.', 'err'); return; }
      TV.openModal('order', { id, size });
    },
    copyMsg(m) { U.copy(m, 'Mensagem copiada'); return false; },
    sendOrder(arg) {
      const [id, size] = arg.split('|'); const st = cur(), p = TV.S.products.find((x) => x.id === id);
      TV.S.orders.unshift({ id: U.uid('or'), studentId: st.id, productId: id, size, at: TV.stamp() });
      TV.log(fn(st) + ' quer comprar: ' + p.name + (size && size !== 'Único' ? ' (' + size + ')' : ''), st.id, 'loja');
      UI.modal = null; U.toast('Pedido simulado enviado ao Pedro', 'ok');
    },
    copyCode(code) { U.copy(code, 'Cupom ' + code + ' copiado'); return false; },
    partnerLink(id) { TV.openModal('partner', { id }); }
  });

  /* =================== PERFIL =================== */
  function vPerfil(st, sec) {
    const map = { treinos: pTreinos, cargas: pCargas, peso: pPeso, fotos: pFotos, checkins: pCheckins, alimentacao: pAlim, plano: pPlano, dados: pDados, config: pConfig };
    if (sec && map[sec]) return map[sec](st);
    const done = TV.doneSessions(st.id), cks = TV.S.checkins.filter((c) => c.studentId === st.id).sort((a, b) => (a.week > b.week ? 1 : -1));
    const lastW = cks.length ? U.num(cks[cks.length - 1].peso) : null, firstW = st.anamnese && st.anamnese.peso ? U.num(st.anamnese.peso) : null;
    const sub = TV.subStatus(st.id);
    let h = '<div class="profile-head">' + TV.avatarEdit(st, 'xl') + '<div class="grow"><h1 class="d h1">' + e_(st.name) + '</h1><span class="muted sm">' + e_(st.anamnese.objetivo) + ' · aluno desde ' + U.dm(st.since) + '</span><br><button class="linkbtn sm" data-act="openPhoto" data-arg="' + st.id + '">' + U.ic('camera', 15) + (TV.hasPhoto(st.id) ? ' Trocar ou remover foto' : ' Adicionar foto de perfil') + '</button></div></div>';
    h += '<div class="grid3"><div class="stat"><span>Treinos</span><b class="num">' + done.length + '</b></div><div class="stat"><span>Peso atual</span><b class="num">' + (lastW ? U.fmtNum(lastW) + ' kg' : '—') + '</b></div><div class="stat"><span>Desde o início</span><b class="num">' + (lastW && firstW ? (lastW - firstW > 0 ? '+' : '') + U.fmtNum(lastW - firstW) + ' kg' : '—') + '</b></div></div>';
    const it = (k, ic, t, s, right) => '<a class="item" href="#/aluno/perfil/' + k + '"><span class="ico">' + U.ic(ic, 20) + '</span><span class="grow"><b>' + t + '</b>' + (s ? '<br><span class="muted sm">' + s + '</span>' : '') + '</span>' + (right || '') + U.ic('chev', 18) + '</a>';
    h += '<nav class="stack" aria-label="Seções do perfil">' +
      it('treinos', 'db', 'Histórico de treinos', done.length + ' treinos registrados') +
      it('cargas', 'trend', 'Evolução de cargas', 'Por exercício') +
      it('peso', 'chart', 'Evolução de peso', cks.length + ' pesagens nos check-ins') +
      it('fotos', 'image', 'Fotos de acompanhamento', 'Frente, lado e costas por semana') +
      it('checkins', 'clip', 'Check-ins semanais', 'Enviados, revisados e pendentes') +
      it('alimentacao', 'food', 'Alimentação e hidratação', 'Últimos 14 dias') +
      it('plano', 'wallet', 'Plano e mensalidade', TV.plan(st.planId).name, sub === 'atrasado' ? TV.pill('err', 'Atrasado') : sub === 'vence' ? TV.pill('warn', 'Vence logo') : TV.pill('ok', 'Em dia')) +
      it('dados', 'user', 'Meus dados', 'Cadastro e anamnese') +
      it('config', 'gear', 'Configurações', 'Notificações e conta') + '</nav>';
    return h;
  }
  function pTreinos(st) {
    const done = TV.doneSessions(st.id);
    return head('Histórico de treinos', 'perfil', done.length + ' treinos') + (done.length ? done.map((x) => { const ss = TV.sessionStats(x); return '<a class="item" href="#/aluno/resumo/' + x.id + '"><span class="okdot">' + U.ic('check', 16) + '</span><span class="grow"><b>Treino ' + e_(x.label) + '</b><br><span class="muted sm">' + e_(U.dayLabel(x.date)) + ' · ' + x.durationMin + ' min · ' + ss.done + ' séries</span>' + (x.comment ? '<br><span class="sm">"' + e_(x.comment) + '"</span>' : '') + '</span>' + U.ic('chev', 18) + '</a>'; }).join('') : TV.empty('Nenhum treino concluído ainda'));
  }
  function pCargas(st) {
    const exs = TV.exercisesDone(st.id);
    if (!exs.length) return head('Evolução de cargas', 'perfil') + TV.empty('Sem treinos registrados ainda');
    const sel = UI.cargaEx && exs.includes(UI.cargaEx) ? UI.cargaEx : exs.includes('supino-incl') ? 'supino-incl' : exs[0];
    const pts = TV.loadSeries(st.id, sel), best = TV.bestByExercise(st.id)[sel];
    return head('Evolução de cargas', 'perfil', 'Maior carga feita em cada treino') +
      '<div class="field"><label for="carga-ex">Exercício</label><select class="in" id="carga-ex" data-ui="cargaEx" data-rerender="1">' + exs.map((k) => '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + e_(TV.ex(k).name) + '</option>').join('') + '</select></div>' +
      '<div class="card">' + U.lineChart(pts, { unit: 'kg', dec: 1, label: 'Evolução de carga: ' + TV.ex(sel).name }) + (best ? '<div class="row between"><span class="muted">Recorde</span><b class="num">' + U.fmtNum(best.kg, best.kg % 1 ? 1 : 0) + ' kg × ' + e_(best.reps) + ' · ' + U.dm(best.date) + '</b></div>' : '') + '</div>';
  }
  function weightPts(st) {
    const pts = [];
    if (st.anamnese && st.anamnese.peso) pts.push({ label: U.dm(st.since), v: U.num(st.anamnese.peso), src: 'Anamnese' });
    TV.S.checkins.filter((c) => c.studentId === st.id).sort((a, b) => (a.week > b.week ? 1 : -1)).forEach((c) => pts.push({ label: U.dm(c.sentAt.slice(0, 10)), v: U.num(c.peso), src: 'Check-in' }));
    return pts;
  }
  TV.weightPts = weightPts;
  function pPeso(st) {
    const pts = weightPts(st);
    return head('Evolução de peso', 'perfil', 'Informado por você na anamnese e nos check-ins') + '<div class="card">' + U.lineChart(pts, { unit: 'kg', label: 'Evolução de peso' }) + '</div>' + pts.slice().reverse().map((p) => '<div class="item"><span class="grow"><b class="num">' + U.fmtNum(p.v) + ' kg</b><br><span class="muted sm">' + p.src + '</span></span><span class="muted sm">' + p.label + '</span></div>').join('');
  }
  function pFotos(st) {
    const cks = TV.S.checkins.filter((c) => c.studentId === st.id && c.photos && Object.keys(c.photos).length).sort((a, b) => (a.week < b.week ? 1 : -1));
    return head('Fotos de acompanhamento', 'perfil', 'Só você e o Pedro veem') + (cks.length ? cks.map((c) => '<div class="card"><b>Semana de ' + U.dm(c.week) + '</b><div class="grid3 photos">' + ['frente', 'lado', 'costas'].map((p) => '<div class="photo">' + U.photo(c.photos[p], p, 0) + '</div>').join('') + '</div></div>').join('') : TV.empty('Nenhuma foto enviada', 'As fotos entram pelo check-in semanal.'));
  }
  function pCheckins(st) {
    const ws0 = U.weekStart(T()), first = U.weekStart(st.since); const rows = [];
    for (let w = ws0; w >= first; w = U.addDays(w, -7)) rows.push(w);
    return head('Check-ins semanais', 'perfil') + rows.map((w) => { const s = TV.checkinStatus(st.id, w), c = TV.checkinOf(st.id, w); return '<div class="card"><div class="row between"><b>Semana de ' + U.dm(w) + ' a ' + U.dm(U.addDays(w, 6)) + '</b>' + TV.ckPill(s) + '</div>' + (c ? '<span class="muted sm">Peso ' + e_(c.peso) + ' kg · ' + (c.cons ? c.cons.treinos + ' de ' + c.cons.meta + ' treinos' : '') + '</span>' + (c.feedback ? '<p class="quote-txt sm">Pedro: ' + e_(c.feedback) + '</p>' : '') : s === 'pendente' ? '<a class="btn sm pri" href="#/aluno/checkin">Fazer check-in</a>' : s === 'nao_enviado' ? '<span class="muted sm">A semana fechou sem check-in.</span>' : '') + '</div>'; }).join('');
  }
  function pAlim(st) {
    const today = T(), goal = TV.waterGoal(st.id), g = TV.guidePub(st.id);
    const days = Array.from({ length: 14 }, (_, i) => U.addDays(today, i - 13));
    const meal = days.map((d) => { const s = TV.mealStats(st.id, d, d); return { label: U.date(d).getDate() + '', v: s ? s.pct : 0, hl: d === today }; });
    const water = days.map((d) => ({ label: U.date(d).getDate() + '', v: TV.waterTotal(st.id, d), hl: d === today, ok: goal && TV.waterTotal(st.id, d) >= goal }));
    const ms = TV.mealStats(st.id, days[0], today), wsx = TV.waterStats(st.id, days[0], today);
    return head('Alimentação e hidratação', 'perfil', 'Últimos 14 dias') +
      (g ? '<div class="card"><div class="row between"><b>Refeições seguidas</b><span class="num">' + ms.pct + '%</span></div>' + U.bars(meal, { max: 100, label: 'Refeições seguidas por dia (%)' }) + '<span class="muted sm">' + ms.logged + ' de ' + ms.planned + ' refeições registradas · "em parte" e "troquei" contam como meia</span></div>' : TV.empty('Sem orientações publicadas')) +
      '<div class="card"><div class="row between"><b>Água por dia</b><span class="num">média ' + U.liters(wsx.avg) + '</span></div>' + U.bars(water, { goal, label: 'Água por dia' }) + '<span class="muted sm">' + (goal ? 'Meta batida em ' + wsx.hit + ' de ' + wsx.days + ' dias · linha tracejada = meta' : 'Sem meta definida') + '</span></div>';
  }
  function pPlano(st) {
    const pl = TV.plan(st.planId), next = TV.nextPayment(st.id), sub = TV.subStatus(st.id);
    let h = head('Plano e mensalidade', 'perfil');
    h += '<div class="card hl"><span class="eyebrow">Plano contratado</span><div class="d big">' + e_(pl.name) + '</div><span class="muted">' + U.money(pl.price) + (pl.months > 1 ? ' a cada ' + pl.months + ' meses' : ' por mês') + ' · valor de exemplo</span>' +
      '<div class="row between"><span>Situação</span>' + (sub === 'atrasado' ? TV.pill('err', 'Pagamento atrasado') : sub === 'vence' ? TV.pill('warn', 'Vence em breve') : TV.pill('ok', 'Em dia')) + '</div>' +
      (next ? '<div class="row between"><span>Próximo vencimento</span><b class="num">' + U.dm(next.due) + ' · ' + U.money(next.amount) + '</b></div>' : '<div class="row between"><span>Próximo vencimento</span><span class="muted">Nenhum em aberto</span></div>') + '</div>';
    h += '<h2 class="h2">Histórico</h2>' + TV.paymentsOf(st.id).map((p) => '<div class="item"><span class="grow"><b class="num">' + U.money(p.amount) + '</b><br><span class="muted sm">Vencimento ' + U.dm(p.due) + (p.paidAt ? ' · pago em ' + U.dm(p.paidAt) + (p.method ? ' via ' + e_(p.method) : '') : '') + '</span></span>' + TV.payPill(TV.payStatus(p)) + '</div>').join('');
    h += '<p class="dim xs">Pagamentos são combinados diretamente com o Pedro. Nesta demonstração não há cobrança real.</p>';
    return h;
  }
  function pDados(st) {
    const a = st.anamnese;
    const row = (k, v) => '<div class="row between top"><span class="muted">' + k + '</span><span class="right">' + e_(v || '—') + '</span></div>';
    return head('Meus dados', 'perfil') + TV.photoCard(st, TV.hasPhoto(st.id) ? 'Aparece no seu perfil e para o Pedro, nas fichas e nos check-ins.' : '') + '<div class="card">' + row('Nome', st.name) + row('WhatsApp', st.phone) + row('E-mail', st.email) + '</div><h2 class="h2">Anamnese</h2><div class="card">' + row('Objetivo', a.objetivo) + row('Treinos por semana', a.dias) + row('Local', a.local) + row('Rotina', a.rotina) + row('Melhor horário', a.horario) + row('Tempo por treino', a.tempo) + row('Dores e limitações', [(a.dores || []).join(', '), a.doresObs].filter(Boolean).join(' · ') || 'Nenhuma') + row('Refeições por dia', a.refeicoes) + row('Restrições alimentares', a.restricoes) + row('Água por dia', a.agua) + row('Peso inicial', a.peso ? a.peso + ' kg' : '') + row('Altura', a.altura ? a.altura + ' cm' : '') + '</div>';
  }
  function pConfig(st) {
    st.prefs = st.prefs || { id: st.id + '-prefs', treino: true, agua: true, checkin: true };
    TV.reg(st.prefs);
    const sw = (k, t, s) => '<label class="switch card"><input type="checkbox" id="pref-' + k + '" data-obj="' + st.prefs.id + '" data-key="' + k + '"' + (st.prefs[k] ? ' checked' : '') + '><span class="sw"></span><span><b>' + t + '</b><br><span class="muted sm">' + s + '</span></span></label>';
    return head('Configurações', 'perfil') + sw('treino', 'Lembrete de treino', 'Aviso no horário que você costuma treinar') + sw('agua', 'Lembrete de água', 'A cada 2 horas, das 8h às 20h') + sw('checkin', 'Lembrete de check-in', 'Sábado de manhã') + '<a class="btn block" href="#/">' + U.ic('swap', 18) + ' Sair e escolher outro perfil</a><p class="dim xs">Nesta demonstração os lembretes não disparam notificações de verdade.</p>';
  }

  /* =================== CONVITE E ANAMNESE =================== */
  const STEPS = ['convite', 'cadastro', 'objetivo', 'frequencia', 'rotina', 'dores', 'alimentacao', 'fim'];
  function vNovo(st, step) {
    if (!STEPS.includes(step)) step = 'convite';
    const o = (UI.onb = UI.onb && UI.onb.sid === st.id ? UI.onb : { id: 'onb', sid: st.id, nome: st.name, phone: st.phone, email: st.email, senha: '', termos: false, objetivo: '', dias: '3', local: 'Academia', rotina: '', horario: '', tempo: '60 min', dores: [], doresObs: '', refeicoes: '4', restricoes: '', agua: '', peso: '', altura: '' });
    TV.reg(o);
    const i = STEPS.indexOf(step);
    const prog = '<div class="steps-bar" aria-label="Passo ' + i + ' de 6">' + STEPS.slice(1, 7).map((s, k) => '<i class="' + (k < i ? 'on' : '') + '"></i>').join('') + '</div>';
    const chips = (key, opts, multi) => '<div class="chips">' + opts.map((v) => { const on = multi ? o[key].includes(v) : o[key] === v; return '<button class="chip' + (on ? ' on' : '') + '" data-act="' + (multi ? 'onbToggle' : 'onbSet') + '" data-arg="' + key + '|' + e_(v) + '" aria-pressed="' + on + '">' + e_(v) + '</button>'; }).join('') + '</div>';
    const nav = (label) => '<div class="onb-nav">' + (i > 1 && step !== 'fim' ? '<a class="btn" href="#/aluno/novo/' + STEPS[i - 1] + '">Voltar</a>' : '<span></span>') + '<button class="btn pri lg" data-act="onbNext" data-arg="' + step + '">' + (label || 'Continuar') + '</button></div>';
    const fld = (key, label, ph, type, mode) => '<div class="field"><label for="onb-' + key + '">' + label + '</label><input class="in" id="onb-' + key + '" type="' + (type || 'text') + '"' + (mode ? ' inputmode="' + mode + '"' : '') + ' placeholder="' + e_(ph || '') + '" data-obj="onb" data-key="' + key + '" value="' + e_(o[key]) + '"' + (type === 'password' ? ' autocomplete="new-password"' : '') + '></div>';
    const area = (key, label, ph) => '<div class="field"><label for="onb-' + key + '">' + label + '</label><textarea class="in" id="onb-' + key + '" data-obj="onb" data-key="' + key + '" placeholder="' + e_(ph || '') + '">' + e_(o[key]) + '</textarea></div>';
    let h = '';
    if (step === 'convite') {
      return '<div class="onb-hero">' + TV.logo('xl') + '<p class="eyebrow">Convite</p><h1 class="d hero-sm">O Pedro te chamou para o TeamVechi</h1><p class="muted">Aqui você vai receber sua ficha de treino com vídeos de cada exercício, registrar suas refeições e água e fazer o check-in da semana.</p></div>' +
        '<div class="card hl"><span class="lbl">Plano combinado com o Pedro</span><b class="lg">Consultoria ' + e_(TV.plan(st.planId).name.toLowerCase()) + '</b><span class="muted sm">' + U.money(TV.plan(st.planId).price) + ' · valor de exemplo</span></div>' + '<button class="btn pri lg block" data-act="onbNext" data-arg="convite">Aceitar convite</button><a class="linkbtn center" href="#/">Voltar para a escolha de perfil</a>';
    }
    h += prog;
    if (step === 'cadastro') h += '<h1 class="d h1">Crie sua conta</h1>' + fld('nome', 'Nome completo') + fld('phone', 'WhatsApp', '(47) 9 0000-0000', 'text', 'tel') + fld('email', 'E-mail', 'voce@exemplo.com', 'email', 'email') + fld('senha', 'Senha', 'Crie uma senha', 'password') + '<label class="check"><input type="checkbox" id="onb-termos" data-obj="onb" data-key="termos"' + (o.termos ? ' checked' : '') + '><span>Li e aceito os termos de uso e a política de privacidade. Autorizo o uso dos meus dados de treino, peso e fotos para o acompanhamento.</span></label><p class="dim xs">Demonstração: nenhuma conta é criada de verdade e a senha não é guardada.</p>' + nav();
    if (step === 'objetivo') h += '<h1 class="d h1">Qual é o seu objetivo?</h1>' + chips('objetivo', ['Hipertrofia', 'Emagrecimento', 'Força', 'Condicionamento', 'Saúde e bem-estar']) + '<div class="grid2">' + fld('peso', 'Peso atual (kg)', '78,0', 'text', 'decimal') + fld('altura', 'Altura (cm)', '175', 'text', 'numeric') + '</div>' + nav();
    if (step === 'frequencia') h += '<h1 class="d h1">Frequência e local</h1><div class="field"><span class="lbl">Quantos dias por semana você pode treinar?</span>' + chips('dias', ['2', '3', '4', '5', '6']) + '</div><div class="field"><span class="lbl">Onde você treina?</span>' + chips('local', ['Academia', 'Em casa', 'Ao ar livre']) + '</div>' + nav();
    if (step === 'rotina') h += '<h1 class="d h1">Rotina e disponibilidade</h1>' + area('rotina', 'Como é a sua rotina?', 'Ex.: trabalho das 8h às 17h, sentado a maior parte do dia') + '<div class="field"><span class="lbl">Melhor horário para treinar</span>' + chips('horario', ['Manhã', 'Almoço', 'Tarde', 'Noite', 'Varia']) + '</div><div class="field"><span class="lbl">Tempo disponível por treino</span>' + chips('tempo', ['30 min', '45 min', '60 min', '75 min', '90 min']) + '</div>' + nav();
    if (step === 'dores') h += '<h1 class="d h1">Dores, lesões e limitações</h1><div class="field"><span class="lbl">Sente dor ou tem alguma lesão em:</span>' + chips('dores', ['Ombro', 'Lombar', 'Joelho', 'Punho', 'Quadril', 'Tornozelo', 'Pescoço'], true) + '</div>' + area('doresObs', 'Conte mais (opcional)', 'Ex.: dor no joelho esquerdo ao agachar fundo') + nav();
    if (step === 'alimentacao') h += '<h1 class="d h1">Alimentação</h1><p class="muted sm">Só para o Pedro conhecer a sua rotina. Não é uma avaliação nutricional.</p><div class="field"><span class="lbl">Quantas refeições você faz por dia?</span>' + chips('refeicoes', ['2', '3', '4', '5', '6']) + '</div>' + fld('restricoes', 'Restrições ou preferências alimentares', 'Ex.: vegetariano, intolerância a lactose') + '<div class="field"><span class="lbl">Quanta água você bebe por dia?</span>' + chips('agua', ['Menos de 1 L', 'Cerca de 1,5 L', 'Cerca de 2 L', 'Mais de 2,5 L']) + '</div>' + nav('Enviar para o Pedro');
    if (step === 'fim') h = '<div class="onb-hero"><span class="okdot xl">' + U.ic('check', 34) + '</span><h1 class="d hero-sm">Tudo certo, ' + e_(fn(st)) + '!</h1><p class="muted">O Pedro recebeu suas respostas e vai montar a sua ficha. Você recebe um aviso quando ela estiver pronta.</p></div><a class="btn pri lg block" href="#/aluno/inicio">Ir para o início</a>';
    return h;
  }
  Object.assign(A, {
    onbSet(arg) { const [k, v] = arg.split('|'); UI.onb[k] = v; },
    onbToggle(arg) { const [k, v] = arg.split('|'); const a = UI.onb[k]; const i = a.indexOf(v); if (i >= 0) a.splice(i, 1); else a.push(v); },
    onbNext(step) {
      const o = UI.onb, st = cur();
      if (step === 'cadastro') {
        if (!String(o.nome).trim()) { U.toast('Informe o seu nome.', 'err'); return; }
        if (!o.termos) { U.toast('Para continuar, aceite os termos e a política de privacidade.', 'err'); return; }
      }
      if (step === 'objetivo' && !o.objetivo) { U.toast('Escolha um objetivo.', 'err'); return; }
      if (step === 'alimentacao') {
        if (!TV.net('enviar a anamnese', 'onbNext', 'alimentacao')) return;
        st.name = String(o.nome).trim() || st.name; st.phone = o.phone; st.email = o.email;
        st.anamnese = { objetivo: o.objetivo, dias: o.dias, local: o.local, rotina: o.rotina, horario: o.horario, tempo: o.tempo, dores: o.dores.slice(), doresObs: o.doresObs, refeicoes: o.refeicoes, restricoes: o.restricoes, agua: o.agua, peso: o.peso, altura: o.altura, at: TV.stamp() };
        st.status = 'ativo'; st.since = TV.today();
        TV.log(fn(st) + ' respondeu a anamnese: ' + o.objetivo + ', ' + o.dias + ' dias por semana', st.id, 'aluno');
        UI.onb = null; TV.save(); TV.go('aluno/novo/fim'); return false;
      }
      TV.go('aluno/novo/' + STEPS[STEPS.indexOf(step) + 1]); return false;
    }
  });
})();
