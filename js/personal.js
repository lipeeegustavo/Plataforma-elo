/* TeamVechi demo — plataforma do Pedro (personal). Sidebar no computador, barra inferior + "Mais" no celular. */
(function () {
  const TV = window.TV;
  const U = TV.U;
  const UI = TV.UI;
  const A = TV.A;
  const e_ = U.esc;
  const T = () => TV.today();
  const fnm = (s) => U.firstName(s.name);
  const active = () => TV.S.students.filter((s) => s.status === 'ativo');
  const NAV = [['inicio', 'Início', 'home'], ['alunos', 'Alunos', 'users'], ['treinos', 'Treinos', 'db'], ['biblioteca', 'Biblioteca', 'lib'], ['alimentacao', 'Alimentação', 'food'], ['checkins', 'Check-ins', 'clip'], ['financeiro', 'Financeiro', 'wallet'], ['loja', 'Loja', 'store']];
  const MOBILE = ['inicio', 'alunos', 'treinos', 'checkins'];
  const ph = (title, sub, right, back) => '<div class="ph">' + (back ? '<a class="back" href="#/pedro/' + back + '" aria-label="Voltar">' + U.ic('back', 20) + '</a>' : '') + '<div class="grow"><h1 class="d h1">' + title + '</h1>' + (sub ? '<p class="muted">' + sub + '</p>' : '') + '</div>' + (right ? '<div class="ph-acts">' + right + '</div>' : '') + '</div>';
  const pendingCk = () => TV.S.checkins.filter((c) => !c.reviewedAt);
  const form = (o) => { UI.form = Object.assign({ id: 'form' }, o || {}); return UI.form; };

  /* ---------- casca ---------- */
  TV.V.pedro = function (p) {
    const page = p[0] || 'inicio';
    const map = { inicio: dash, alunos: alunos, treinos: treinos, biblioteca: biblioteca, alimentacao: alimentacao, checkins: checkins, financeiro: financeiro, loja: loja, perfil: perfilPedro };
    if (UI.form) TV.reg(UI.form);
    const content = UI.loading ? TV.skel(5) : (map[page] || dash)(p[1], p[2]);
    const nCk = pendingCk().length;
    const badge = (k) => (k === 'checkins' && nCk ? '<span class="badge">' + nCk + '</span>' : '');
    const side = '<aside class="pd-side"><div class="pd-brand">' + TV.logo() + '<div><b class="d">TeamVechi</b><br><span class="muted xs">Plataforma do personal</span></div></div><nav class="pd-nav" aria-label="Menu da plataforma">' +
      NAV.map((n) => '<a href="#/pedro/' + n[0] + '"' + (page === n[0] ? ' aria-current="page"' : '') + '>' + U.ic(n[2], 20) + '<span>' + n[1] + '</span>' + badge(n[0]) + '</a>').join('') + '</nav>' +
      '<div class="pd-foot"><a class="row pd-me" href="#/pedro/perfil"' + (page === 'perfil' ? ' aria-current="page"' : '') + '>' + TV.avatar(TV.PEDRO) + '<div><b>Pedro</b><br><span class="muted xs">Meu perfil</span></div></a><a class="btn sm ghost block" href="#/aluno/inicio" data-act="as" data-arg="s-lucas">' + U.ic('swap', 16) + ' Ver o app do aluno</a></div></aside>';
    const top = '<header class="pd-top">' + TV.logo() + '<b class="d">TeamVechi</b><span class="grow"></span><a class="icon-btn" href="#/pedro/checkins" aria-label="Check-ins para revisar">' + U.ic('bell', 20) + (nCk ? '<span class="dotb"></span>' : '') + '</a><a class="pd-me-top" href="#/pedro/perfil" aria-label="Meu perfil">' + TV.avatar(TV.PEDRO, 'sm') + '</a></header>';
    const more = !MOBILE.includes(page);
    const tab = '<nav class="pd-tab" aria-label="Menu da plataforma">' + NAV.filter((n) => MOBILE.includes(n[0])).map((n) => '<a href="#/pedro/' + n[0] + '"' + (page === n[0] ? ' aria-current="page"' : '') + '>' + U.ic(n[2], 22) + '<span>' + n[1] + '</span>' + badge(n[0]) + '</a>').join('') + '<button data-act="sheet" aria-expanded="' + !!UI.sheet + '"' + (more ? ' class="on"' : '') + '>' + U.ic('more', 22) + '<span>Mais</span></button></nav>';
    const sheet = UI.sheet ? '<div class="sheet-back" data-act="sheet"></div><div class="sheet" role="dialog" aria-label="Mais opções"><div class="sheet-grip"></div>' + NAV.filter((n) => !MOBILE.includes(n[0])).map((n) => '<a href="#/pedro/' + n[0] + '">' + U.ic(n[2], 22) + '<span>' + n[1] + '</span>' + U.ic('chev', 18) + '</a>').join('') + '<a href="#/pedro/perfil">' + U.ic('user', 22) + '<span>Meu perfil</span>' + U.ic('chev', 18) + '</a><a href="#/aluno/inicio" data-act="as" data-arg="s-lucas">' + U.ic('swap', 22) + '<span>Ver o app do aluno</span>' + U.ic('chev', 18) + '</a></div>' : '';
    return '<div class="pd">' + side + '<div class="pd-body">' + top + '<main class="pd-main">' + TV.netBanner() + content + '</main></div>' + tab + sheet + '</div>';
  };
  A.sheet = () => { UI.sheet = !UI.sheet; };

  /* =================== MEU PERFIL =================== */
  function perfilPedro() {
    let h = ph('Meu perfil', 'Seus dados na plataforma e no app dos alunos');
    h += '<div class="grid2c">' + TV.photoCard(TV.PEDRO, TV.hasPhoto('pedro') ? 'Aparece na plataforma e no app dos alunos, nos avisos e nos feedbacks.' : 'Sem foto: mostramos a inicial P. Ela aparece nos avisos e feedbacks do app dos alunos.') +
      '<section class="card"><h2 class="h3">Dados</h2><div class="row between"><span class="muted">Nome</span><b>Pedro</b></div><div class="row between"><span class="muted">Marca</span><b>TeamVechi</b></div><div class="row between"><span class="muted">WhatsApp</span><b class="num">' + e_(TV.S.pedro.phone) + '</b></div><span class="dim xs">Dados de demonstração.</span></section></div>';
    h += '<section class="card"><h2 class="h3">Onde a sua foto aparece</h2><ul class="how sm"><li>Menu da plataforma, no computador e no celular.</li><li>Avisos para os alunos, no início do app.</li><li>Feedback dos check-ins, no app do aluno.</li></ul></section>';
    return h;
  }

  /* ---------- status do aluno ---------- */
  function stuState(s) {
    if (s.status === 'convidado') return ['line', 'Convite enviado'];
    if (s.status === 'pausado') return ['line', 'Pausado'];
    if (!TV.pub(s.id)) return ['brand', 'Montar ficha'];
    if (TV.S.checkins.some((c) => c.studentId === s.id && !c.reviewedAt)) return ['brand', 'Revisar check-in'];
    if (TV.subStatus(s.id) === 'atrasado') return ['err', 'Pagamento atrasado'];
    const d = TV.daysSinceTrain(s.id);
    if (d != null && d >= 5) return ['warn', 'Sem treinar há ' + d + ' dias'];
    return ['ok', 'Em dia'];
  }
  const stuPill = (s) => { const x = stuState(s); return TV.pill(x[0], x[1]); };

  /* =================== INÍCIO =================== */
  function dash() {
    const today = T(), ws = U.weekStart(today), act = active();
    const semTreino = act.filter((s) => { const d = TV.daysSinceTrain(s.id); return TV.pub(s.id) && (d == null || d >= 4); });
    const pays = TV.S.payments.filter((p) => p.status !== 'pago' && TV.stu(p.studentId) && TV.stu(p.studentId).status !== 'pausado');
    const late = pays.filter((p) => TV.payStatus(p) === 'atrasado'), soon = pays.filter((p) => TV.payStatus(p) === 'pendente' && U.diffDays(today, p.due) <= 7);
    let h = ph('Olá, Pedro', U.longDate(today), '<button class="btn pri" data-act="openInvite">' + U.ic('plus', 18) + ' Convidar aluno</button><a class="btn" href="#/pedro/treinos">Montar ficha</a>');
    const k = (n, label, href, hot, sub, ico) => '<a class="kpi' + (hot ? ' hot' : '') + '" href="#/pedro/' + href + '"><span class="kpi-top"><b class="num">' + n + '</b><span class="kpi-ic">' + U.ic(ico, 20) + '</span></span><span>' + label + '</span>' + (sub ? '<span class="xs">' + sub + '</span>' : '') + (hot ? '<span class="kpi-go">Ver agora ' + U.ic('fwd', 14) + '</span>' : '') + '</a>';
    h += '<div class="kpis">' + k(act.length, 'Alunos ativos', 'alunos', false, TV.S.students.filter((s) => s.status === 'convidado').length + ' convite(s) pendente(s)', 'users') + k(pendingCk().length, 'Check-ins para revisar', 'checkins', pendingCk().length > 0, 'Enviados no fim de semana', 'clip') + k(semTreino.length, 'Sem treinar há 4+ dias', 'alunos', semTreino.length > 0, 'Vale mandar uma mensagem', 'alert') + k(late.length + soon.length, 'Mensalidades a acompanhar', 'financeiro', late.length > 0, late.length + ' atrasada(s) · ' + soon.length + ' vence(m) em 7 dias', 'wallet') + '</div>';
    h += '<div class="cols"><div class="col-main">';
    // adesão
    let sumD = 0, sumM = 0;
    const rows = act.filter((s) => TV.pub(s.id)).map((s) => { const d = TV.weekSessions(s.id, ws).length, m = TV.plannedPerWeek(s.id); sumD += Math.min(d, m); sumM += m; return { s, d, m }; }).sort((a, b) => a.d / a.m - b.d / b.m);
    h += '<section class="card"><div class="row between"><h2 class="h3">Adesão aos treinos nesta semana</h2><b class="num">' + (sumM ? Math.round((sumD / sumM) * 100) : 0) + '%</b></div><span class="muted sm">Treinos feitos até ' + U.wdLong(today) + ' em relação à meta semanal de cada aluno.</span>' +
      rows.map((r) => '<a class="adh" href="#/pedro/alunos/' + r.s.id + '"><span class="adh-n">' + e_(fnm(r.s)) + '</span><span class="bar grow"><i style="width:' + Math.min(100, Math.round((r.d / r.m) * 100)) + '%"></i></span><span class="num sm">' + r.d + '/' + r.m + '</span></a>').join('') + '</section>';
    // feedbacks
    const fbs = TV.S.sessions.filter((x) => x.status === 'concluida' && x.comment && U.diffDays(x.date, today) <= 7).sort((a, b) => ((b.date + b.endT) > (a.date + a.endT) ? 1 : -1)).slice(0, 5);
    h += '<section class="sec"><h2 class="h2">Feedbacks recentes dos treinos</h2>' + (fbs.length ? fbs.map((x) => { const s = TV.stu(x.studentId); return '<a class="item" href="#/pedro/alunos/' + s.id + '/treino">' + TV.avatar(s) + '<span class="grow"><b>' + e_(fnm(s)) + ' · Treino ' + e_(x.label.split(' · ')[0]) + '</b><br><span class="sm">"' + e_(x.comment) + '"</span></span><span class="muted xs">' + U.relDay(x.date, today) + '</span></a>'; }).join('') : TV.empty('Nenhum comentário nos últimos 7 dias')) + '</section>';
    // atividade
    h += '<section class="sec"><h2 class="h2">Atividade</h2>' + TV.S.events.slice(0, 8).map((ev) => { const s = TV.stu(ev.sid); return '<a class="item" href="' + (s ? '#/pedro/alunos/' + s.id : '#/pedro/inicio') + '">' + (s ? TV.avatar(s) : '<span class="av">·</span>') + '<span class="grow">' + e_(ev.text) + '</span><span class="muted xs">' + U.relDay(ev.at.slice(0, 10), today) + ' · ' + ev.at.slice(11) + '</span></a>'; }).join('') + '</section>';
    h += '</div><div class="col-side">';
    // alertas
    const al = [];
    late.forEach((p) => { const s = TV.stu(p.studentId); al.push(['err', 'Mensalidade de ' + fnm(s) + ' atrasada desde ' + U.dm(p.due), 'financeiro']); });
    soon.forEach((p) => { const s = TV.stu(p.studentId); al.push(['warn', 'Mensalidade de ' + fnm(s) + ' vence ' + U.relDay(p.due, today), 'financeiro']); });
    TV.S.checkins.filter((c) => c.dores && U.diffDays(c.week, ws) <= 14).forEach((c) => { const s = TV.stu(c.studentId); al.push(['warn', fnm(s) + ' relatou dor: "' + c.dores + '"', 'checkins/' + c.id]); });
    act.filter((s) => !TV.pub(s.id)).forEach((s) => al.push(['brand', fnm(s) + ' respondeu a anamnese e está sem ficha', 'alunos/' + s.id + '/treino']));
    semTreino.filter((s) => { const d = TV.daysSinceTrain(s.id); return d == null || d >= 5; }).forEach((s) => al.push(['warn', fnm(s) + ' não treina há ' + TV.daysSinceTrain(s.id) + ' dias', 'alunos/' + s.id]));
    h += '<section class="card"><h2 class="h3">Alertas</h2>' + (al.length ? al.map((a) => '<a class="alert-row" href="#/pedro/' + a[2] + '"><span class="adot ' + a[0] + '"></span><span class="grow sm">' + e_(a[1]) + '</span>' + U.ic('chev', 16) + '</a>').join('') : '<span class="muted sm">Nenhum alerta agora.</span>') + '</section>';
    // aviso
    const f = (UI.noticeForm = UI.noticeForm || { id: 'noticeForm', text: '' });
    TV.reg(f);
    h += '<section class="card"><h2 class="h3">Aviso para os alunos</h2><span class="muted sm">Aparece no início do app de todos os alunos.</span><label class="sr" for="notice-t">Texto do aviso</label><textarea class="in" id="notice-t" data-obj="noticeForm" data-key="text" placeholder="Ex.: feriado na segunda, academia abre só de manhã">' + e_(f.text) + '</textarea><button class="btn pri" data-act="postNotice">Publicar aviso</button>' +
      TV.S.notices.slice().sort((a, b) => (a.at < b.at ? 1 : -1)).map((n) => '<div class="notice-row"><span class="grow sm">' + e_(n.text) + '<br><span class="dim xs">' + U.dayLabel(n.at.slice(0, 10)) + '</span></span><button class="icon-btn" data-act="delNotice" data-arg="' + n.id + '" aria-label="Retirar aviso">' + U.ic('trash', 18) + '</button></div>').join('') + '</section>';
    h += '</div></div>';
    return h;
  }
  Object.assign(A, {
    postNotice() {
      const t = String((UI.noticeForm && UI.noticeForm.text) || '').trim();
      if (!t) { U.toast('Escreva o aviso antes de publicar.', 'err'); return; }
      if (!TV.net('publicar o aviso', 'postNotice')) return;
      TV.S.notices.push({ id: U.uid('nt'), text: t, at: TV.stamp() }); UI.noticeForm.text = '';
      TV.log('Você publicou um aviso para os alunos', '', 'aviso'); U.toast('Aviso publicado no app dos alunos', 'ok');
    },
    delNotice(id) { TV.S.notices = TV.S.notices.filter((n) => n.id !== id); U.toast('Aviso retirado'); }
  });

  /* =================== ALUNOS =================== */
  function alunos(id, tab) {
    if (id) return alunoDetail(id, tab || 'visao');
    const q = String(UI.q || '').toLowerCase().trim(), flt = UI.stuFilter || 'todos';
    const fs = [['todos', 'Todos'], ['ativo', 'Ativos'], ['convidado', 'Convidados'], ['pausado', 'Pausados'], ['atencao', 'Precisam de atenção']];
    let list = TV.S.students.slice().sort((a, b) => a.name.localeCompare(b.name));
    if (q) list = list.filter((s) => s.name.toLowerCase().includes(q) || (s.phone || '').includes(q));
    if (flt === 'atencao') list = list.filter((s) => ['brand', 'err', 'warn'].includes(stuState(s)[0]) && s.status === 'ativo');
    else if (flt !== 'todos') list = list.filter((s) => s.status === flt);
    let h = ph('Alunos', TV.S.students.length + ' alunos cadastrados', '<button class="btn pri" data-act="openInvite">' + U.ic('plus', 18) + ' Convidar aluno</button>');
    h += '<div class="toolbar"><label class="sr" for="q">Buscar aluno</label><input class="in search" id="q" type="search" placeholder="Buscar por nome ou telefone" data-ui="q" data-live="1" value="' + e_(UI.q || '') + '"><div class="chips">' + fs.map((f) => '<button class="chip' + (flt === f[0] ? ' on' : '') + '" data-act="stuFilter" data-arg="' + f[0] + '">' + f[1] + '</button>').join('') + '</div></div>';
    if (!list.length) return h + TV.empty('Nenhum aluno encontrado', 'Tente outro nome ou outro filtro.');
    h += '<div class="cards">' + list.map((s) => { const d = TV.daysSinceTrain(s.id); return '<a class="stu-card" href="#/pedro/alunos/' + s.id + '"><div class="row">' + TV.avatar(s) + '<div class="grow"><b>' + e_(s.name) + '</b><br><span class="muted sm">' + e_(s.anamnese ? s.anamnese.objetivo + ' · ' + s.anamnese.dias + 'x/semana' : 'Aguardando anamnese') + '</span></div></div><div class="row between">' + stuPill(s) + '<span class="muted xs">' + (d == null ? (s.status === 'convidado' ? 'Convidado ' + U.relDay((s.invitedAt || s.since).slice(0, 10), T()) : 'Sem treinos') : 'Treinou ' + U.relDay(TV.lastTrain(s.id), T())) + '</span></div><div class="row between xs muted"><span>' + e_(TV.plan(s.planId).name) + '</span><span>' + ({ em_dia: 'Mensalidade em dia', vence: 'Mensalidade vence logo', atrasado: 'Mensalidade atrasada' }[TV.subStatus(s.id)]) + '</span></div></a>'; }).join('') + '</div>';
    return h;
  }
  A.stuFilter = (f) => { UI.stuFilter = f; };

  function alunoDetail(id, tab) {
    const s = TV.stu(id);
    if (!s) return ph('Aluno não encontrado', '', '', 'alunos') + TV.empty('Esse aluno não existe mais.');
    const tabs = [['visao', 'Visão geral'], ['anamnese', 'Anamnese'], ['treino', 'Treino'], ['alimentacao', 'Alimentação'], ['checkins', 'Check-ins'], ['evolucao', 'Evolução'], ['financeiro', 'Financeiro']];
    let h = '<div class="ph"><a class="back" href="#/pedro/alunos" aria-label="Voltar para alunos">' + U.ic('back', 20) + '</a>' + TV.avatar(s, 'lg') + '<div class="grow"><h1 class="d h1">' + e_(s.name) + '</h1><p class="muted sm">' + e_(s.phone) + ' · ' + e_(s.email) + '</p></div><div class="ph-acts">' + stuPill(s) + '<button class="btn sm" data-act="msgStudent" data-arg="' + s.id + '">' + U.ic('msg', 16) + ' Mensagem</button>' + (s.status === 'ativo' ? '<button class="btn sm ghost" data-act="pauseStudent" data-arg="' + s.id + '">Pausar</button>' : s.status === 'pausado' ? '<button class="btn sm" data-act="pauseStudent" data-arg="' + s.id + '">Reativar</button>' : '') + '</div></div>';
    h += '<div class="tabs scroll" role="tablist">' + tabs.map((t) => '<a role="tab" aria-selected="' + (t[0] === tab) + '" href="#/pedro/alunos/' + s.id + '/' + t[0] + '">' + t[1] + '</a>').join('') + '</div>';
    const fns = { visao: aVisao, anamnese: aAnamnese, treino: aTreino, alimentacao: aAlim, checkins: aCheckins, evolucao: aEvolucao, financeiro: aFinanceiro };
    return h + (fns[tab] || aVisao)(s);
  }
  function aVisao(s) {
    const today = T(), ws = U.weekStart(today), f = TV.pub(s.id), next = TV.nextPayment(s.id), w = TV.weightPts(s);
    if (s.status === 'convidado') return '<div class="card"><b>Convite enviado ' + U.relDay((s.invitedAt || s.since).slice(0, 10), today) + '</b><span class="muted sm">Assim que o aluno aceitar e responder a anamnese, você recebe um aviso para montar a ficha.</span><div class="row"><button class="btn" data-act="copyInvite" data-arg="' + s.id + '">' + U.ic('copy', 16) + ' Copiar link do convite</button><button class="btn" data-act="openAs" data-arg="' + s.id + '">Abrir o convite como ' + e_(fnm(s)) + '</button></div></div>';
    let h = '<div class="kpis sm"><div class="kpi"><b class="num">' + TV.weekSessions(s.id, ws).length + '/' + TV.plannedPerWeek(s.id) + '</b><span>Treinos nesta semana</span></div><div class="kpi"><b class="num">' + (TV.lastTrain(s.id) ? U.relDay(TV.lastTrain(s.id), today) : '—') + '</b><span>Último treino</span></div><div class="kpi"><b class="num">' + (w.length ? U.fmtNum(w[w.length - 1].v) + ' kg' : '—') + '</b><span>Peso informado</span></div><div class="kpi"><b class="num">' + (next ? U.dm(next.due) : '—') + '</b><span>' + (next ? 'Mensalidade · ' + { pago: 'paga', pendente: 'pendente', atrasado: 'atrasada' }[TV.payStatus(next)] : 'Sem cobrança aberta') + '</span></div></div>';
    h += '<div class="cols"><div class="col-main">';
    h += '<section class="card"><div class="row between"><h2 class="h3">Ficha de treino</h2>' + (f ? fichaPill(TV.fichaOf(s.id)) : '') + '</div>' + (f ? '<span>' + e_(f.published.name) + ' · semana ' + TV.weekNum(f) + ' de ' + f.published.weeks + '</span><div class="row"><a class="btn sm" href="#/pedro/treinos/' + f.id + '">Editar ficha</a><a class="btn sm ghost" href="#/pedro/alunos/' + s.id + '/treino">Ver treinos feitos</a></div>' : '<span class="muted sm">Ainda sem ficha publicada.</span><button class="btn sm pri" data-act="newFichaFor" data-arg="' + s.id + '">Montar ficha</button>') + '</section>';
    const last = TV.doneSessions(s.id).slice(0, 3);
    h += '<section class="sec"><h2 class="h2">Últimos treinos</h2>' + (last.length ? last.map((x) => sessionCard(s, x)).join('') : TV.empty('Nenhum treino concluído')) + '</section>';
    h += '</div><div class="col-side"><section class="card"><h2 class="h3">Check-in da semana</h2>' + TV.ckPill(TV.checkinStatus(s.id, ws)) + '<span class="muted sm">Semana passada: ' + TV.CK_LABEL[TV.checkinStatus(s.id, U.addDays(ws, -7))] + '</span><a class="linkbtn sm" href="#/pedro/alunos/' + s.id + '/checkins">Ver check-ins</a></section>';
    if (s.anamnese && (s.anamnese.doresObs || (s.anamnese.dores || []).length)) h += '<section class="card"><h2 class="h3">Atenção na anamnese</h2><span class="sm">' + e_([(s.anamnese.dores || []).join(', '), s.anamnese.doresObs].filter(Boolean).join(' · ')) + '</span></section>';
    const ms = TV.mealStats(s.id, U.addDays(today, -6), today), wsx = TV.waterStats(s.id, U.addDays(today, -6), today);
    h += '<section class="card"><h2 class="h3">Alimentação · 7 dias</h2>' + (ms ? '<div class="row between"><span class="muted">Refeições seguidas</span><b class="num">' + ms.pct + '%</b></div><div class="row between"><span class="muted">Água por dia</span><b class="num">' + U.liters(wsx.avg) + ' / ' + U.liters(wsx.goal) + '</b></div>' : '<span class="muted sm">Sem orientações publicadas.</span>') + '<a class="linkbtn sm" href="#/pedro/alimentacao/' + s.id + '">Abrir alimentação</a></section></div></div>';
    return h;
  }
  function sessionCard(s, x) {
    const f = TV.fichaOf(s.id), ss = TV.sessionStats(x);
    return '<details class="card sess"><summary><span class="grow"><b>Treino ' + e_(x.label) + '</b><br><span class="muted sm">' + e_(U.dayLabel(x.date)) + ' · ' + x.durationMin + ' min · ' + ss.done + ' de ' + ss.total + ' séries · ' + ss.vol.toLocaleString('pt-BR') + ' kg</span>' + (x.comment ? '<br><span class="sm">"' + e_(x.comment) + '"</span>' : '') + '</span>' + U.ic('down', 18) + '</summary><div class="sesslog">' +
      Object.keys(x.items).map((k) => { const fi = TV.findItem(f, k); const r = x.items[k]; return '<div class="row between top"><span>' + (r.done ? '' : '<span class="pill warn xs-pill">Não concluído</span> ') + e_(fi ? TV.ex(fi.it.exId).name : 'Exercício') + '</span><span class="num muted sm right">' + (r.sets.filter((z) => z.ok).map((z) => e_(z.kg || '–') + '×' + e_(z.reps || '–') + (z.rir !== '' && z.rir != null ? ' @' + e_(z.rir) : '')).join(', ') || '—') + '</span></div>'; }).join('') + '</div></details>';
  }
  function aAnamnese(s) {
    const a = s.anamnese;
    if (!a) return TV.empty('Anamnese ainda não respondida', 'O aluno responde ao aceitar o convite.');
    const row = (k, v) => '<div class="row between top"><span class="muted">' + k + '</span><span class="right">' + e_(v || '—') + '</span></div>';
    return '<div class="grid2c"><section class="card"><h2 class="h3">Objetivo e rotina</h2>' + row('Objetivo', a.objetivo) + row('Treinos por semana', a.dias) + row('Local', a.local) + row('Rotina', a.rotina) + row('Melhor horário', a.horario) + row('Tempo por treino', a.tempo) + row('Peso inicial', a.peso ? a.peso + ' kg' : '') + row('Altura', a.altura ? a.altura + ' cm' : '') + '</section><section class="card"><h2 class="h3">Dores e alimentação</h2>' + row('Dores e lesões', (a.dores || []).join(', ') || 'Nenhuma') + row('Detalhes', a.doresObs) + row('Refeições por dia', a.refeicoes) + row('Restrições', a.restricoes) + row('Água por dia', a.agua) + '<span class="dim xs">Respondida em ' + (a.at ? U.dayLabel(a.at.slice(0, 10)) : '—') + '</span></section></div>';
  }
  function aTreino(s) {
    const fi = TV.fichaOf(s.id), done = TV.doneSessions(s.id);
    let h = '<section class="card"><div class="row between"><h2 class="h3">Ficha</h2>' + (fi ? fichaPill(fi) : '') + '</div>' + (fi ? '<span>' + e_(fi.draft.name) + ' · ' + fi.draft.treinos.length + ' treinos · válida por ' + fi.draft.weeks + ' semanas</span><div class="row"><a class="btn sm pri" href="#/pedro/treinos/' + fi.id + '">Editar ficha</a><button class="btn sm" data-act="openDuplicate" data-arg="' + fi.id + '">Duplicar</button></div>' : (s.anamnese ? '<button class="btn sm pri" data-act="newFichaFor" data-arg="' + s.id + '">Montar ficha</button>' : '<span class="muted sm">Aguardando a anamnese.</span>')) + '</section>';
    h += '<h2 class="h2">Treinos registrados (' + done.length + ')</h2>' + (done.length ? done.map((x) => sessionCard(s, x)).join('') : TV.empty('Nenhum treino concluído'));
    const open = TV.openSession(s.id);
    if (open) h += '<div class="inline-note">' + U.ic('clock', 18) + '<span>Treino ' + e_(open.label) + ' em andamento hoje (' + TV.sessionStats(open).done + ' séries registradas).</span></div>';
    return h;
  }
  function aAlim(s) { return mealTrack(s, true); }
  function aCheckins(s) {
    const ws0 = U.weekStart(T()), first = U.weekStart(s.since); const rows = [];
    for (let w = ws0; w >= first && rows.length < 10; w = U.addDays(w, -7)) rows.push(w);
    return rows.map((w) => { const st = TV.checkinStatus(s.id, w), c = TV.checkinOf(s.id, w); return '<' + (c ? 'a href="#/pedro/checkins/' + c.id + '"' : 'div') + ' class="item"><span class="grow"><b>Semana de ' + U.dm(w) + ' a ' + U.dm(U.addDays(w, 6)) + '</b>' + (c ? '<br><span class="muted sm">' + e_(c.peso) + ' kg' + (c.dores ? ' · relatou dor' : '') + '</span>' : '') + '</span>' + TV.ckPill(st) + (c ? U.ic('chev', 18) : '') + '</' + (c ? 'a' : 'div') + '>'; }).join('');
  }
  function aEvolucao(s) {
    const exs = TV.exercisesDone(s.id);
    const sel = UI.pdCargaEx && exs.includes(UI.pdCargaEx) ? UI.pdCargaEx : exs.includes('supino-incl') ? 'supino-incl' : exs[0];
    let h = '<div class="grid2c"><section class="card"><h2 class="h3">Peso</h2>' + U.lineChart(TV.weightPts(s), { unit: 'kg', label: 'Evolução de peso' }) + '<span class="dim xs">Informado pelo aluno na anamnese e nos check-ins.</span></section>';
    h += '<section class="card"><h2 class="h3">Cargas</h2>' + (exs.length ? '<label class="sr" for="pd-carga">Exercício</label><select class="in" id="pd-carga" data-ui="pdCargaEx" data-rerender="1">' + exs.map((k) => '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + e_(TV.ex(k).name) + '</option>').join('') + '</select>' + U.lineChart(TV.loadSeries(s.id, sel), { unit: 'kg', label: 'Evolução de carga' }) + '<span class="dim xs">Maior carga registrada em cada treino.</span>' : TV.empty('Sem treinos registrados')) + '</section></div>';
    const cks = TV.S.checkins.filter((c) => c.studentId === s.id && c.photos).sort((a, b) => (a.week > b.week ? 1 : -1));
    if (cks.length >= 1) { const a = cks[0], b = cks[cks.length - 1]; h += '<section class="card"><h2 class="h3">Fotos · ' + U.dm(a.week) + (cks.length > 1 ? ' e ' + U.dm(b.week) : '') + '</h2><div class="compare">' + ['frente', 'lado', 'costas'].map((p) => '<div class="cmp"><div class="photo">' + U.photo(a.photos[p], p, 0) + '</div>' + (cks.length > 1 ? '<div class="photo">' + U.photo(b.photos[p], p, 3) + '</div>' : '') + '</div>').join('') + '</div></section>'; }
    return h;
  }
  function aFinanceiro(s) {
    TV.reg(s);
    let h = '<section class="card"><h2 class="h3">Plano</h2><div class="row"><label class="sr" for="plan-' + s.id + '">Plano</label><select class="in" id="plan-' + s.id + '" data-obj="' + s.id + '" data-key="planId" data-rerender="1">' + TV.S.plans.map((p) => '<option value="' + p.id + '"' + (p.id === s.planId ? ' selected' : '') + '>' + e_(p.name) + ' · ' + U.money(p.price) + '</option>').join('') + '</select><button class="btn" data-act="newCharge" data-arg="' + s.id + '">Gerar cobrança</button></div><span class="dim xs">Mudar o plano vale para as próximas cobranças.</span></section>';
    h += '<h2 class="h2">Cobranças</h2>' + (TV.paymentsOf(s.id).map(payRow).join('') || TV.empty('Nenhuma cobrança'));
    return h;
  }
  Object.assign(A, {
    msgStudent(id) { const s = TV.stu(id); U.toast('Na versão final, abre o WhatsApp de ' + fnm(s) + ': ' + s.phone); return false; },
    pauseStudent(id) { const s = TV.stu(id); s.status = s.status === 'pausado' ? 'ativo' : 'pausado'; TV.log((s.status === 'pausado' ? 'Você pausou ' : 'Você reativou ') + fnm(s), s.id, 'aluno'); U.toast(fnm(s) + (s.status === 'pausado' ? ' pausado' : ' reativado'), 'ok'); },
    openAs(id) { TV.S.ui.as = id; TV.save(); TV.go(TV.stu(id).anamnese ? 'aluno/inicio' : 'aluno/novo/convite'); return false; },
    copyInvite(id) { U.copy('teamvechi.app/convite/' + id.slice(-6).toUpperCase(), 'Link do convite copiado'); return false; },
    openInvite() { form({ kind: 'invite', nome: '', phone: '', planId: 'mensal' }); TV.openModal('invite'); },
    sendInvite() {
      const f = UI.form; const nome = String(f.nome || '').trim();
      if (nome.split(/\s+/).length < 1 || !nome) { U.toast('Informe o nome do aluno.', 'err'); return; }
      if (!TV.net('enviar o convite', 'sendInvite')) return;
      const s = { id: U.uid('s'), name: nome, phone: String(f.phone || '').trim() || '(47) 90000-0000', email: '', status: 'convidado', planId: f.planId, since: T(), anamnese: null, invitedAt: TV.stamp() };
      TV.S.students.push(s);
      TV.S.payments.push({ id: U.uid('pay'), studentId: s.id, planId: f.planId, amount: TV.plan(f.planId).price, due: U.addDays(T(), 1), status: 'aberto', paidAt: null, method: null });
      TV.log('Convite enviado para ' + fnm(s), s.id, 'aluno');
      TV.openModal('inviteDone', { id: s.id });
    }
  });
  TV.M.invite = () => {
    const f = UI.form; TV.reg(f);
    return { title: 'Convidar aluno', body: '<div class="field"><label for="inv-n">Nome do aluno</label><input class="in" id="inv-n" data-obj="form" data-key="nome" data-autofocus placeholder="Ex.: Marina Prado" value="' + e_(f.nome) + '"></div><div class="field"><label for="inv-p">WhatsApp</label><input class="in" id="inv-p" inputmode="tel" data-obj="form" data-key="phone" placeholder="(47) 9 0000-0000" value="' + e_(f.phone) + '"></div><div class="field"><label for="inv-pl">Plano</label><select class="in" id="inv-pl" data-obj="form" data-key="planId">' + TV.S.plans.map((p) => '<option value="' + p.id + '"' + (p.id === f.planId ? ' selected' : '') + '>' + e_(p.name) + ' · ' + U.money(p.price) + '</option>').join('') + '</select></div><p class="dim xs">O aluno recebe um link para criar a conta e responder a anamnese.</p>', foot: '<button class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn pri" data-act="sendInvite">Gerar convite</button>' };
  };
  TV.M.inviteDone = (d) => {
    const s = TV.stu(d.id); const link = 'teamvechi.app/convite/' + s.id.slice(-6).toUpperCase();
    return { title: 'Convite criado', body: '<p>Mande este link para ' + e_(fnm(s)) + ' pelo WhatsApp:</p><div class="codebox"><code class="sel">' + e_(link) + '</code><button class="btn sm" data-act="copyInvite" data-arg="' + s.id + '">' + U.ic('copy', 16) + ' Copiar</button></div><p class="dim xs">Link de demonstração. Para ver o que o aluno recebe, abra o convite como ele.</p>', foot: '<button class="btn" data-act="closeModal">Fechar</button><button class="btn pri" data-act="openAs" data-arg="' + s.id + '">Abrir o convite como ' + e_(fnm(s)) + '</button>' };
  };

  /* =================== TREINOS =================== */
  const fichaPill = (f) => (!f ? '' : !f.published ? TV.pill('line', 'Rascunho') : TV.isDirty(f) ? TV.pill('warn', 'Alterações não publicadas') : TV.pill('ok', 'Publicada · v' + f.version));
  function treinos(id) {
    if (id) return builder(id);
    const sem = TV.S.students.filter((s) => s.anamnese && s.status !== 'convidado' && !TV.fichaOf(s.id));
    let h = ph('Treinos', 'Cada aluno tem uma ficha com os treinos dos dias (A, B, C…) válida por algumas semanas.', '<button class="btn pri" data-act="openNewFicha"' + (sem.length ? '' : ' disabled title="Todos os alunos já têm ficha"') + '>' + U.ic('plus', 18) + ' Nova ficha</button>');
    if (sem.length) h += '<div class="inline-note warn">' + U.ic('alert', 18) + '<span class="grow">' + sem.map((s) => e_(fnm(s))).join(', ') + (sem.length > 1 ? ' estão' : ' está') + ' sem ficha.</span><button class="btn sm" data-act="openNewFicha">Montar agora</button></div>';
    h += '<div class="table-wrap"><table class="tbl"><thead><tr><th>Aluno</th><th>Ficha</th><th>Treinos</th><th>Semana</th><th>Situação</th><th><span class="sr">Abrir</span></th></tr></thead><tbody>' + TV.S.fichas.map((f) => { const s = TV.stu(f.studentId); if (!s) return ''; return '<tr><td><span class="row nowrap">' + TV.avatar(s, 'sm') + e_(s.name) + '</span></td><td>' + e_(f.draft.name) + '</td><td>' + f.draft.treinos.map((t) => t.letter).join(' · ') + '</td><td class="num">' + (f.published ? TV.weekNum(f) + ' de ' + f.published.weeks : '—') + '</td><td>' + fichaPill(f) + '</td><td><a class="btn sm" href="#/pedro/treinos/' + f.id + '">Abrir</a></td></tr>'; }).join('') + '</tbody></table></div>';
    return h;
  }
  function blankFicha(sid, template) {
    const s = TV.stu(sid);
    const tr = template ? cloneTreinos(TV.fichaOf('s-lucas') ? TV.fichaOf('s-lucas').draft.treinos : []) : [{ id: U.uid('t'), letter: 'A', name: '', items: [] }];
    const f = { id: U.uid('f'), studentId: sid, status: 'rascunho', version: 0, draft: { name: 'Ficha 1 — ' + (s.anamnese ? s.anamnese.objetivo : 'Treino'), weeks: 6, start: U.addDays(U.weekStart(T()), 7), treinos: tr }, published: null, history: [] };
    TV.S.fichas.push(f);
    return f;
  }
  function cloneTreinos(trs) {
    return U.clone(trs).map((t) => { t.id = U.uid('t'); t.items.forEach((it) => { it.id = U.uid('it'); it.sets.forEach((s) => { s.id = U.uid('set'); }); }); return t; });
  }
  function builder(id) {
    const f = TV.S.fichas.find((x) => x.id === id);
    if (!f) return ph('Ficha não encontrada', '', '', 'treinos') + TV.empty('Essa ficha não existe mais.');
    const s = TV.stu(f.studentId), d = f.draft;
    const did = f.id + '-d'; TV.R.set(did, d);
    let ti = UI.bT != null && d.treinos[UI.bT] ? +UI.bT : 0;
    const t = d.treinos[ti];
    let h = '<div class="ph"><a class="back" href="#/pedro/treinos" aria-label="Voltar para treinos">' + U.ic('back', 20) + '</a><div class="grow"><p class="eyebrow">Ficha de ' + e_(s.name) + '</p><h1 class="d h1">' + e_(d.name || 'Ficha sem nome') + '</h1></div><div class="ph-acts">' + fichaPill(f) + '<button class="btn" data-act="openPreview" data-arg="' + f.id + '">' + U.ic('eye', 18) + ' Ver como aluno</button><button class="btn" data-act="openDuplicate" data-arg="' + f.id + '">' + U.ic('copy', 18) + ' Duplicar</button></div></div>';
    h += '<section class="card"><div class="form-row"><div class="field grow2"><label for="f-name">Nome da ficha</label><input class="in" id="f-name" data-obj="' + did + '" data-key="name" data-rerender="1" value="' + e_(d.name) + '"></div><div class="field"><label for="f-weeks">Válida por</label><select class="in" id="f-weeks" data-obj="' + did + '" data-key="weeks" data-type="num" data-rerender="1">' + [4, 5, 6, 8, 10, 12].map((w) => '<option value="' + w + '"' + (+d.weeks === w ? ' selected' : '') + '>' + w + ' semanas</option>').join('') + '</select></div><div class="field"><label for="f-start">Começa em</label><input class="in" type="date" id="f-start" data-obj="' + did + '" data-key="start" data-rerender="1" value="' + e_(d.start) + '"></div></div></section>';
    h += '<div class="tabs" role="tablist">' + d.treinos.map((x, i) => '<button role="tab" aria-selected="' + (i === ti) + '" data-act="bTab" data-arg="' + i + '">Treino ' + e_(x.letter) + (x.name ? ' · ' + e_(x.name) : '') + '</button>').join('') + (d.treinos.length < 6 ? '<button class="add" data-act="addTreino">' + U.ic('plus', 16) + ' Treino</button>' : '') + '</div>';
    if (!t) return h + TV.empty('Nenhum treino', 'Adicione o primeiro treino da ficha.', '<button class="btn pri" data-act="addTreino">Adicionar treino</button>');
    TV.reg(t);
    h += '<div class="cols"><div class="col-main">';
    h += '<div class="form-row"><div class="field grow2"><label for="t-name">Nome do Treino ' + e_(t.letter) + '</label><input class="in" id="t-name" data-obj="' + t.id + '" data-key="name" data-rerender="1" placeholder="Ex.: Peito e tríceps" value="' + e_(t.name) + '"></div>' + (d.treinos.length > 1 ? '<button class="btn ghost danger-t" data-act="rmTreino" data-arg="' + ti + '">' + U.ic('trash', 16) + ' Remover Treino ' + e_(t.letter) + '</button>' : '') + '</div>';
    const groups = [...new Set(TV.S.lib.map((x) => x.group))];
    h += t.items.map((it, ii) => {
      TV.reg(it); it.prog = it.prog || { mode: 'manual', rule: '' }; TV.R.set(it.id + '-p', it.prog);
      const ex = TV.ex(it.exId);
      const vst = TV.blobs[ex.id] || (ex.video && ex.video.kind === 'upload') ? TV.pill('ok', 'Vídeo enviado') : ex.video ? TV.pill('ok', 'Vídeo de demonstração') : '<a class="pill warn" href="#/pedro/biblioteca">Sem vídeo · enviar</a>';
      return '<article class="card ex-card"><div class="row"><span class="ex-n">' + (ii + 1) + '</span><div class="field grow"><label class="sr" for="ex-' + it.id + '">Exercício</label><select class="in" id="ex-' + it.id + '" data-obj="' + it.id + '" data-key="exId" data-rerender="1">' + groups.map((g) => '<optgroup label="' + e_(g) + '">' + TV.S.lib.filter((x) => x.group === g).map((x) => '<option value="' + x.id + '"' + (x.id === it.exId ? ' selected' : '') + '>' + e_(x.name) + '</option>').join('') + '</optgroup>').join('') + '</select></div>' + vst +
        '<div class="ex-tools"><button class="icon-btn" data-act="mvItem" data-arg="' + ii + '|-1" aria-label="Mover para cima"' + (ii === 0 ? ' disabled' : '') + '>' + U.ic('back', 18, 'rot90') + '</button><button class="icon-btn" data-act="mvItem" data-arg="' + ii + '|1" aria-label="Mover para baixo"' + (ii === t.items.length - 1 ? ' disabled' : '') + '>' + U.ic('chev', 18, 'rot90') + '</button><button class="icon-btn" data-act="rmItem" data-arg="' + ii + '" aria-label="Remover exercício">' + U.ic('trash', 18) + '</button></div></div>' +
        '<div class="sets">' + it.sets.map((st, si) => { TV.reg(st); const q = (k, l, p) => '<div class="field"><label for="' + k + '-' + st.id + '">' + l + '</label><input class="in num" id="' + k + '-' + st.id + '" data-obj="' + st.id + '" data-key="' + k + '" data-rerender="1" placeholder="' + p + '" value="' + e_(st[k]) + '"></div>'; return '<div class="setrow"><div class="field tsel"><label for="ty-' + st.id + '">Série ' + (si + 1) + '</label><select class="in" id="ty-' + st.id + '" data-obj="' + st.id + '" data-key="type" data-rerender="1">' + Object.keys(TV.TYPE).map((k) => '<option value="' + k + '"' + (k === st.type ? ' selected' : '') + '>' + TV.TYPE[k] + '</option>').join('') + '</select></div><div class="nums">' + q('reps', 'Reps', '8–10') + q('kg', 'Carga kg', '—') + q('rir', 'RIR', '2') + q('rest', 'Desc. (s)', '90') + '</div><button class="icon-btn" data-act="rmSet" data-arg="' + ii + '|' + si + '" aria-label="Remover série ' + (si + 1) + '"' + (it.sets.length < 2 ? ' disabled' : '') + '>' + U.ic('x', 16) + '</button></div>'; }).join('') + '<button class="btn sm" data-act="addSet" data-arg="' + ii + '">' + U.ic('plus', 16) + ' Série</button></div>' +
        '<div class="form-row"><div class="field"><label for="pm-' + it.id + '">Progressão</label><select class="in" id="pm-' + it.id + '" data-obj="' + it.id + '-p" data-key="mode" data-rerender="1">' + Object.keys(TV.PROG).map((k) => '<option value="' + k + '"' + (k === it.prog.mode ? ' selected' : '') + '>' + TV.PROG[k] + '</option>').join('') + '</select></div><div class="field grow2"><label for="pr-' + it.id + '">Regra que o aluno vê</label><input class="in" id="pr-' + it.id + '" data-obj="' + it.id + '-p" data-key="rule" data-rerender="1" placeholder="Ex.: fez 8 reps no top set? suba 2 kg" value="' + e_(it.prog.rule) + '"></div></div>' +
        '<div class="field"><label for="nt-' + it.id + '">Observação para o aluno</label><input class="in" id="nt-' + it.id + '" data-obj="' + it.id + '" data-key="note" data-rerender="1" placeholder="Ex.: desça em 3 segundos" value="' + e_(it.note) + '"></div></article>';
    }).join('');
    h += '<button class="btn block dashed" data-act="addItem">' + U.ic('plus', 18) + ' Adicionar exercício</button>';
    const preview = '<section class="card"><span class="lbl">Como o aluno vê o Treino ' + e_(t.letter) + '</span>' + (t.items.length ? t.items.map((it) => '<div class="pv-ex"><b>' + e_(TV.ex(it.exId).name) + '</b>' + TV.prescLines(it.sets) + (it.prog && it.prog.rule ? '<span class="prog sm">' + U.ic('trend', 14) + e_(it.prog.rule) + '</span>' : '') + '</div>').join('') : '<span class="muted sm">Adicione exercícios para ver a prévia.</span>') + '</section>';
    h += '</div><div class="col-side">';
    // publicação
    const pf = (UI.pubForm = UI.pubForm && UI.pubForm.fid === f.id ? UI.pubForm : { id: 'pubForm', fid: f.id, note: '' });
    TV.reg(pf);
    const dirty = !f.published || TV.isDirty(f);
    h += '<section class="card"><h2 class="h3">Publicar</h2>' + (f.published ? '<span class="muted sm">Versão ' + f.version + ' publicada ' + U.relDay(f.published.at.slice(0, 10), T()) + '. ' + (dirty ? 'Há alterações que o aluno ainda não vê.' : 'O aluno vê exatamente esta ficha.') + '</span>' : '<span class="muted sm">Ainda não publicada: ' + e_(fnm(s)) + ' não vê esta ficha.</span>') +
      '<div class="field"><label for="pub-note">O que mudou? (opcional)</label><input class="in" id="pub-note" data-obj="pubForm" data-key="note" placeholder="Ex.: subi a carga do supino" value="' + e_(pf.note) + '"></div>' +
      '<button class="btn pri block" data-act="publishFicha" data-arg="' + f.id + '"' + (dirty && d.treinos.some((x) => x.items.length) ? '' : ' disabled') + '>' + (f.published ? 'Publicar versão ' + (f.version + 1) : 'Publicar para ' + e_(fnm(s))) + '</button>' + (TV.isDirty(f) ? '<button class="linkbtn sm" data-act="discardDraft" data-arg="' + f.id + '">Descartar alterações</button>' : '') +
      '<p class="dim xs">O histórico de treinos do aluno não muda quando a ficha é atualizada.</p>' +
      (f.history.length ? '<div class="versions"><span class="lbl">Versões</span>' + f.history.slice().reverse().map((v) => '<div class="row between top"><span class="sm"><b>v' + v.version + '</b> · ' + e_(v.note) + '</span><span class="dim xs">' + U.dm(v.at.slice(0, 10)) + '</span></div>').join('') + '</div>' : '') + '</section>' + preview + '</div></div>';
    return h;
  }
  const curF = () => TV.S.fichas.find((x) => x.id === location.hash.split('/')[3]);
  const curT = () => { const f = curF(); return f.draft.treinos[UI.bT != null && f.draft.treinos[UI.bT] ? +UI.bT : 0]; };
  Object.assign(A, {
    openNewFicha() { const sem = TV.S.students.filter((s) => s.anamnese && s.status !== 'convidado' && !TV.fichaOf(s.id)); if (!sem.length) return; form({ kind: 'newFicha', sid: sem[0].id, tpl: 'modelo' }); TV.openModal('newFicha'); },
    newFichaFor(sid) { form({ kind: 'newFicha', sid, tpl: 'modelo' }); TV.openModal('newFicha'); },
    createFicha() { const f = UI.form; const fi = blankFicha(f.sid, f.tpl === 'modelo'); UI.modal = null; UI.bT = 0; TV.log('Você começou a ficha de ' + fnm(TV.stu(f.sid)), f.sid, 'treino'); TV.save(); TV.go('pedro/treinos/' + fi.id); return false; },
    bTab(i) { UI.bT = +i; },
    addTreino() { const f = curF(); const L = 'ABCDEF'.charAt(f.draft.treinos.length); f.draft.treinos.push({ id: U.uid('t'), letter: L, name: '', items: [] }); UI.bT = f.draft.treinos.length - 1; },
    rmTreino(i) { const f = curF(); f.draft.treinos.splice(+i, 1); f.draft.treinos.forEach((t, k) => { t.letter = 'ABCDEF'.charAt(k); }); UI.bT = 0; U.toast('Treino removido do rascunho'); },
    addItem() { const t = curT(); t.items.push({ id: U.uid('it'), exId: TV.S.lib[0].id, sets: [0, 1, 2].map(() => ({ id: U.uid('set'), type: 'valida', reps: '10–12', kg: '', rir: '2', rest: '60' })), note: '', prog: { mode: 'dupla', rule: 'Fez o topo da faixa em todas as séries? Suba a carga na próxima.' } }); },
    rmItem(i) { curT().items.splice(+i, 1); },
    mvItem(arg) { const [i, d] = arg.split('|').map(Number); const a = curT().items; const j = i + d; if (j < 0 || j >= a.length) return; const x = a[i]; a[i] = a[j]; a[j] = x; },
    addSet(i) { const it = curT().items[+i]; const l = it.sets[it.sets.length - 1]; it.sets.push(Object.assign({}, l, { id: U.uid('set') })); },
    rmSet(arg) { const [i, k] = arg.split('|').map(Number); const it = curT().items[i]; if (it.sets.length > 1) it.sets.splice(k, 1); },
    publishFicha(id) {
      const f = TV.S.fichas.find((x) => x.id === id), s = TV.stu(f.studentId);
      if (!f.draft.treinos.some((t) => t.items.length)) { U.toast('Adicione pelo menos um exercício.', 'err'); return; }
      if (f.draft.treinos.some((t) => !t.items.length)) { U.toast('Há treino sem exercícios. Adicione exercícios ou remova o treino.', 'err'); return; }
      if (!TV.net('publicar a ficha', 'publishFicha', id)) return;
      const first = !f.published;
      f.version = (f.version || 0) + 1; f.status = 'publicada';
      const clean = U.clone(f.draft); delete clean.id;
      f.published = Object.assign({ version: f.version, at: TV.stamp() }, clean);
      f.draft = U.clone(clean);
      f.history.push({ version: f.version, at: TV.stamp(), note: String((UI.pubForm && UI.pubForm.note) || '').trim() || (first ? 'Primeira ficha publicada' : 'Ficha atualizada') });
      if (UI.pubForm) UI.pubForm.note = '';
      TV.log(first ? 'Você publicou a ficha de ' + fnm(s) : 'Você publicou a versão ' + f.version + ' da ficha de ' + fnm(s), s.id, 'treino');
      U.toast(first ? 'Ficha publicada. ' + fnm(s) + ' já pode treinar.' : 'Versão ' + f.version + ' publicada para ' + fnm(s), 'ok');
    },
    discardDraft(id) { const f = TV.S.fichas.find((x) => x.id === id); f.draft = { name: f.published.name, weeks: f.published.weeks, start: f.published.start, treinos: U.clone(f.published.treinos) }; U.toast('Alterações descartadas'); },
    openPreview(id) { UI.pvT = 0; TV.openModal('preview', { id }); },
    pvTab(i) { UI.pvT = +i; },
    openDuplicate(id) { const f = TV.S.fichas.find((x) => x.id === id); const others = TV.S.students.filter((s) => s.id !== f.studentId && s.anamnese && s.status !== 'convidado'); form({ kind: 'dup', fid: id, to: others[0] ? others[0].id : f.studentId }); TV.openModal('duplicate', { id }); },
    doDuplicate() {
      const fm = UI.form, src = TV.S.fichas.find((x) => x.id === fm.fid), to = TV.stu(fm.to);
      let f = TV.fichaOf(to.id);
      const tr = cloneTreinos(src.draft.treinos);
      if (f) { f.draft.treinos = tr; f.draft.name = src.draft.name.replace(/ — .*/, '') + ' — ' + (to.anamnese ? to.anamnese.objetivo : 'Treino'); }
      else { f = { id: U.uid('f'), studentId: to.id, status: 'rascunho', version: 0, draft: { name: src.draft.name, weeks: src.draft.weeks, start: U.addDays(U.weekStart(T()), 7), treinos: tr }, published: null, history: [] }; TV.S.fichas.push(f); }
      UI.modal = null; UI.bT = 0; TV.log('Você duplicou a ficha de ' + fnm(TV.stu(src.studentId)) + ' para ' + fnm(to), to.id, 'treino');
      U.toast('Ficha duplicada como rascunho para ' + fnm(to) + '. Revise as cargas e publique.', 'ok'); TV.save(); TV.go('pedro/treinos/' + f.id); return false;
    }
  });
  TV.M.newFicha = () => {
    const f = UI.form; TV.reg(f);
    const sem = TV.S.students.filter((s) => s.anamnese && s.status !== 'convidado' && !TV.fichaOf(s.id));
    return { title: 'Nova ficha', body: '<div class="field"><label for="nf-s">Aluno</label><select class="in" id="nf-s" data-obj="form" data-key="sid">' + sem.map((s) => '<option value="' + s.id + '"' + (s.id === f.sid ? ' selected' : '') + '>' + e_(s.name) + '</option>').join('') + '</select></div><div class="field"><span class="lbl">Começar de</span><div class="chips"><button class="chip' + (f.tpl === 'modelo' ? ' on' : '') + '" data-act="formSet" data-arg="tpl|modelo">Modelo ABC (hipertrofia)</button><button class="chip' + (f.tpl === 'branco' ? ' on' : '') + '" data-act="formSet" data-arg="tpl|branco">Em branco</button></div></div><p class="dim xs">A ficha nasce como rascunho. O aluno só vê depois de publicada.</p>', foot: '<button class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn pri" data-act="createFicha">Criar ficha</button>' };
  };
  A.formSet = (arg) => { const [k, v] = arg.split('|'); UI.form[k] = v; };
  TV.M.duplicate = (d) => {
    const src = TV.S.fichas.find((x) => x.id === d.id), f = UI.form; TV.reg(f);
    const opts = TV.S.students.filter((s) => s.anamnese && s.status !== 'convidado' && s.id !== src.studentId);
    const has = TV.fichaOf(f.to);
    return { title: 'Duplicar ficha', body: '<p class="sm">Copia os treinos de <b>' + e_(src.draft.name) + '</b> como rascunho para outro aluno.</p><div class="field"><label for="dup-to">Para</label><select class="in" id="dup-to" data-obj="form" data-key="to" data-rerender="1">' + opts.map((s) => '<option value="' + s.id + '"' + (s.id === f.to ? ' selected' : '') + '>' + e_(s.name) + '</option>').join('') + '</select></div>' + (has ? '<div class="inline-note warn">' + U.ic('alert', 18) + '<span>' + e_(fnm(TV.stu(f.to))) + ' já tem ficha. Os treinos do rascunho serão substituídos; a versão publicada continua até você publicar.</span></div>' : ''), foot: '<button class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn pri" data-act="doDuplicate">Duplicar</button>' };
  };
  TV.M.preview = (d) => {
    const f = TV.S.fichas.find((x) => x.id === d.id), s = TV.stu(f.studentId), tr = f.draft.treinos;
    const i = UI.pvT != null && tr[UI.pvT] ? UI.pvT : 0, t = tr[i];
    return { title: 'Como ' + e_(fnm(s)) + ' vai ver', wide: true, body: '<div class="pv-phone"><div class="pv-screen"><p class="eyebrow">' + e_(f.draft.name) + '</p><div class="chips">' + tr.map((x, k) => '<button class="chip' + (k === i ? ' on' : '') + '" data-act="pvTab" data-arg="' + k + '">Treino ' + e_(x.letter) + '</button>').join('') + '</div>' + (t ? '<div class="d big">Treino ' + e_(t.letter) + ' · ' + e_(t.name || 'sem nome') + '</div>' + t.items.map((it, k) => '<div class="card"><div class="row"><span class="ex-n">' + (k + 1) + '</span><b>' + e_(TV.ex(it.exId).name) + '</b></div>' + TV.prescLines(it.sets) + (it.note ? '<p class="note">' + e_(it.note) + '</p>' : '') + (it.prog && it.prog.rule ? '<p class="prog">' + U.ic('trend', 14) + '<span>' + e_(it.prog.rule) + '</span></p>' : '') + '</div>').join('') : '') + '</div></div><p class="dim xs center">Prévia do rascunho atual' + (TV.isDirty(f) || !f.published ? ' (ainda não publicado)' : '') + '.</p>', foot: '<button class="btn pri" data-act="closeModal">Fechar</button>' };
  };

  /* =================== BIBLIOTECA =================== */
  function biblioteca() {
    const q = String(UI.libQ || '').toLowerCase().trim(), g = UI.libG || 'Todos';
    const groups = ['Todos', ...new Set(TV.S.lib.map((x) => x.group))];
    let list = TV.S.lib.filter((x) => (g === 'Todos' || x.group === g) && (!q || x.name.toLowerCase().includes(q)));
    const withV = TV.S.lib.filter((x) => x.video).length;
    const uses = (exId) => TV.S.fichas.filter((f) => f.draft.treinos.some((t) => t.items.some((it) => it.exId === exId))).length;
    let h = ph('Biblioteca de exercícios', withV + ' de ' + TV.S.lib.length + ' exercícios com vídeo · cada vídeo vale para todas as fichas', '<button class="btn pri" data-act="openExercise">' + U.ic('plus', 18) + ' Novo exercício</button>');
    h += '<div class="toolbar"><label class="sr" for="libq">Buscar exercício</label><input class="in search" id="libq" type="search" placeholder="Buscar exercício" data-ui="libQ" data-live="1" value="' + e_(UI.libQ || '') + '"><div class="chips scroll">' + groups.map((x) => '<button class="chip' + (x === g ? ' on' : '') + '" data-act="libG" data-arg="' + e_(x) + '">' + e_(x) + '</button>').join('') + '</div></div>';
    if (!list.length) return h + TV.empty('Nenhum exercício encontrado');
    h += '<div class="lib">' + list.map((x) => {
      const up = UI.uploading && UI.uploading.id === x.id, err = UI.libErr && UI.libErr.id === x.id;
      const vlabel = TV.blobs[x.id] || (x.video && x.video.kind === 'upload') ? 'Vídeo enviado' + (x.video.name ? ': ' + x.video.name : '') : x.video ? 'Vídeo de demonstração' : 'Sem vídeo';
      return '<article class="lib-row"><div class="thumb">' + (TV.blobs[x.id] ? '<video src="' + TV.blobs[x.id] + '" muted playsinline preload="metadata"></video>' : x.video ? U.playIc(24) : U.ic('video', 24)) + '</div><div class="grow"><b>' + e_(x.name) + '</b><br><span class="muted sm">' + e_(x.group) + ' · ' + e_(x.equipment || '—') + ' · em ' + uses(x.id) + ' ficha(s)</span><br>' + TV.pill(x.video ? 'ok' : 'warn', vlabel) +
        (up ? '<div class="upbar" role="progressbar" aria-valuenow="' + Math.round(UI.uploading.pct) + '" aria-valuemin="0" aria-valuemax="100" aria-label="Enviando vídeo"><i id="up-bar" style="width:' + UI.uploading.pct + '%"></i></div><span class="muted xs">Enviando ' + e_(UI.uploading.name) + '…</span>' : '') +
        (err ? '<div class="inline-note err">' + U.ic('alert', 16) + '<span>' + e_(UI.libErr.msg) + '</span></div>' : '') + '</div>' +
        '<div class="lib-acts"><label class="btn sm' + (x.video ? '' : ' pri') + '" for="vf-' + x.id + '">' + U.ic('up', 16) + (x.video ? 'Trocar vídeo' : 'Enviar vídeo') + '<input type="file" accept="video/*" class="sr" id="vf-' + x.id + '" data-file="exVideo" data-arg="' + x.id + '"></label>' + (x.video ? '<button class="btn sm ghost" data-act="rmVideo" data-arg="' + x.id + '">Remover vídeo</button>' : '<button class="btn sm ghost" data-act="demoVideo" data-arg="' + x.id + '">Usar demonstração</button>') + '<button class="icon-btn" data-act="openExercise" data-arg="' + x.id + '" aria-label="Editar ' + e_(x.name) + '">' + U.ic('edit', 18) + '</button></div></article>';
    }).join('') + '</div>';
    h += '<p class="dim xs">Na demonstração, o vídeo enviado toca normalmente até você recarregar a página; o nome do arquivo fica salvo.</p>';
    return h;
  }
  TV.F.exVideo = (file, id) => {
    UI.libErr = null;
    if (!/^video\//.test(file.type)) { UI.libErr = { id, msg: 'Esse arquivo não é um vídeo. Envie um MP4 ou MOV.' }; TV.render(); return; }
    if (!TV.online()) { UI.libErr = { id, msg: 'Sem conexão: o vídeo não foi enviado. Tente de novo quando a internet voltar.' }; TV.render(); return; }
    UI.uploading = { id, pct: 0, name: file.name };
    TV.render();
    const t0 = Date.now();
    const iv = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - t0) / 1400) * 100);
      if (UI.uploading) UI.uploading.pct = pct;
      const b = document.getElementById('up-bar'); if (b) b.style.width = pct + '%';
      if (pct >= 100) {
        clearInterval(iv);
        const x = TV.ex(id);
        TV.blobs[id] = URL.createObjectURL(file);
        x.video = { kind: 'upload', name: file.name, size: file.size };
        UI.uploading = null;
        TV.log('Você enviou o vídeo de ' + x.name, '', 'video');
        TV.save(); TV.render(); U.toast('Vídeo de "' + x.name + '" enviado', 'ok');
      }
    }, 120);
  };
  Object.assign(A, {
    libG(g) { UI.libG = g; },
    rmVideo(id) { const x = TV.ex(id); x.video = null; delete TV.blobs[id]; U.toast('Vídeo removido de ' + x.name); },
    demoVideo(id) { const x = TV.ex(id); x.video = { kind: 'demo', dur: '0:40' }; U.toast('Vídeo de demonstração vinculado'); },
    openExercise(id) { const x = id ? TV.ex(id) : null; form({ kind: 'ex', exId: id || '', name: x ? x.name : '', group: x ? x.group : '', equipment: x ? x.equipment : '' }); TV.openModal('exercise'); },
    saveExercise() {
      const f = UI.form; const name = String(f.name || '').trim(), group = String(f.group || '').trim();
      if (!name || !group) { U.toast('Informe o nome e o grupo muscular.', 'err'); return; }
      if (f.exId) { const x = TV.ex(f.exId); x.name = name; x.group = group; x.equipment = String(f.equipment || '').trim(); U.toast('Exercício atualizado', 'ok'); }
      else { TV.S.lib.push({ id: U.uid('ex'), name, group, equipment: String(f.equipment || '').trim(), video: null }); U.toast('Exercício adicionado à biblioteca', 'ok'); }
      UI.modal = null;
    }
  });
  TV.M.exercise = () => {
    const f = UI.form; TV.reg(f);
    const groups = [...new Set(TV.S.lib.map((x) => x.group))];
    return { title: f.exId ? 'Editar exercício' : 'Novo exercício', body: '<div class="field"><label for="ex-n">Nome</label><input class="in" id="ex-n" data-obj="form" data-key="name" data-autofocus placeholder="Ex.: Elevação frontal" value="' + e_(f.name) + '"></div><div class="field"><label for="ex-g">Grupo muscular ou categoria</label><input class="in" id="ex-g" list="groups-dl" data-obj="form" data-key="group" placeholder="Ex.: Ombros" value="' + e_(f.group) + '"><datalist id="groups-dl">' + groups.map((g) => '<option value="' + e_(g) + '">').join('') + '</datalist><span class="dim xs">Escolha um grupo existente ou digite um novo.</span></div><div class="field"><label for="ex-e">Equipamento</label><input class="in" id="ex-e" data-obj="form" data-key="equipment" placeholder="Ex.: Halteres" value="' + e_(f.equipment) + '"></div>', foot: '<button class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn pri" data-act="saveExercise">Salvar</button>' };
  };

  /* =================== ALIMENTAÇÃO =================== */
  const MEAL_IC = { seguiu: ['ok', '✓', 'Seguiu'], parcial: ['warn', '½', 'Em parte'], substituiu: ['info', '⇄', 'Trocou'], outra: ['info', '≠', 'Outra refeição'], nao: ['err', '×', 'Não fez'] };
  function alimentacao(sid, tab) {
    if (sid) return alimDetail(sid, tab || 'orientacoes');
    const today = T(), from = U.addDays(today, -6);
    let h = ph('Alimentação e hidratação', 'Orientações gerais e acompanhamento do que os alunos registram');
    h += '<div class="inline-note">' + U.ic('alert', 18) + '<span>Use como orientações gerais. Cardápio individual com quantidades e calorias é atribuição de nutricionista.</span></div>';
    h += '<div class="table-wrap"><table class="tbl"><thead><tr><th>Aluno</th><th>Orientações</th><th>Refeições seguidas · 7 dias</th><th>Água por dia</th><th><span class="sr">Abrir</span></th></tr></thead><tbody>' + active().map((s) => {
      const g = TV.guideOf(s.id), gp = TV.guidePub(s.id), ms = TV.mealStats(s.id, from, today), wsx = TV.waterStats(s.id, from, today);
      return '<tr><td><span class="row nowrap">' + TV.avatar(s, 'sm') + e_(s.name) + '</span></td><td>' + (!g ? TV.pill('line', 'Sem orientações') : !gp ? TV.pill('line', 'Rascunho') : TV.guideDirty(g) ? TV.pill('warn', 'Alterações não publicadas') : TV.pill('ok', 'Publicada · v' + gp.version)) + '</td><td class="num">' + (ms ? ms.pct + '% · ' + ms.logged + '/' + ms.planned + ' registradas' : '—') + '</td><td class="num">' + (wsx && wsx.goal ? U.liters(wsx.avg) + ' de ' + U.liters(wsx.goal) : wsx && wsx.avg ? U.liters(wsx.avg) + ' · sem meta' : '—') + '</td><td><a class="btn sm" href="#/pedro/alimentacao/' + s.id + '">Abrir</a></td></tr>';
    }).join('') + '</tbody></table></div>';
    return h;
  }
  function alimDetail(sid, tab) {
    const s = TV.stu(sid);
    if (!s) return ph('Aluno não encontrado', '', '', 'alimentacao');
    let h = '<div class="ph"><a class="back" href="#/pedro/alimentacao" aria-label="Voltar">' + U.ic('back', 20) + '</a>' + TV.avatar(s, 'lg') + '<div class="grow"><p class="eyebrow">Alimentação e hidratação</p><h1 class="d h1">' + e_(s.name) + '</h1></div></div>';
    h += '<div class="tabs" role="tablist"><a role="tab" aria-selected="' + (tab === 'orientacoes') + '" href="#/pedro/alimentacao/' + sid + '/orientacoes">Orientações</a><a role="tab" aria-selected="' + (tab === 'acompanhamento') + '" href="#/pedro/alimentacao/' + sid + '/acompanhamento">Acompanhamento</a></div>';
    return h + (tab === 'acompanhamento' ? mealTrack(s, false) : guideEditor(s));
  }
  function guideEditor(s) {
    const g = TV.guideOf(s.id);
    if (!g) return TV.empty('Sem orientações para ' + fnm(s), 'Crie a partir de um modelo com 5 refeições e ajuste para a rotina do aluno.', '<button class="btn pri" data-act="createGuide" data-arg="' + s.id + '">Criar orientações</button>');
    const d = g.draft, did = g.id + '-d'; TV.R.set(did, d);
    const gp = TV.guidePub(s.id), dirty = TV.guideDirty(g);
    let h = '<div class="inline-note">' + U.ic('alert', 18) + '<span>Orientações gerais, sem quantidades nem calorias. Para um plano individual, indique um(a) nutricionista.</span></div>';
    h += '<div class="cols"><div class="col-main">';
    h += '<section class="card"><div class="form-row"><div class="field"><label for="wg">Meta de água por dia (ml)</label><input class="in num" id="wg" inputmode="numeric" data-obj="' + did + '" data-key="waterGoal" data-type="num" data-rerender="1" value="' + e_(d.waterGoal) + '"></div><div class="field grow2"><label for="gn">Observação que o aluno vê</label><input class="in" id="gn" data-obj="' + did + '" data-key="notes" data-rerender="1" value="' + e_(d.notes) + '"></div></div><span class="dim xs">A meta é definida por você; o app não calcula meta automaticamente.</span></section>';
    h += d.meals.map((m, i) => {
      TV.reg(m);
      return '<article class="card"><div class="form-row"><div class="field"><label for="mt-' + m.id + '">Horário</label><input class="in num" id="mt-' + m.id + '" type="time" data-obj="' + m.id + '" data-key="time" data-rerender="1" value="' + e_(m.time) + '"></div><div class="field grow2"><label for="mn-' + m.id + '">Refeição</label><input class="in" id="mn-' + m.id + '" data-obj="' + m.id + '" data-key="name" data-rerender="1" value="' + e_(m.name) + '"></div><button class="icon-btn" data-act="rmMeal" data-arg="' + i + '" aria-label="Remover ' + e_(m.name) + '">' + U.ic('trash', 18) + '</button></div>' +
        '<div class="field"><label for="mg-' + m.id + '">Orientação</label><textarea class="in" id="mg-' + m.id + '" data-obj="' + m.id + '" data-key="guidance" data-rerender="1">' + e_(m.guidance) + '</textarea></div>' +
        '<div class="field"><span class="lbl">Sugestões e alternativas</span>' + m.options.map((o, k) => { const oid = m.id + '-o' + k; TV.R.set(oid, { id: oid, get v() { return o; }, set v(val) { m.options[k] = val; } }); return '<div class="row"><label class="sr" for="' + oid + '">Sugestão ' + (k + 1) + '</label><input class="in grow" id="' + oid + '" data-obj="' + oid + '" data-key="v" data-rerender="1" value="' + e_(o) + '"><button class="icon-btn" data-act="rmOpt" data-arg="' + i + '|' + k + '" aria-label="Remover sugestão">' + U.ic('x', 16) + '</button></div>'; }).join('') + '<button class="btn sm" data-act="addOpt" data-arg="' + i + '">' + U.ic('plus', 16) + ' Sugestão</button></div></article>';
    }).join('');
    h += '<button class="btn block dashed" data-act="addMeal">' + U.ic('plus', 18) + ' Adicionar refeição</button></div>';
    h += '<div class="col-side"><section class="card sticky"><h2 class="h3">Publicar</h2><span class="muted sm">' + (gp ? 'Versão ' + gp.version + ' publicada ' + U.relDay(gp.at.slice(0, 10), T()) + '. ' + (dirty ? 'Há alterações que o aluno ainda não vê.' : 'O aluno vê exatamente estas orientações.') : 'Ainda não publicada.') + '</span><button class="btn" data-act="openGuidePreview" data-arg="' + s.id + '">' + U.ic('eye', 18) + ' Ver como aluno</button><button class="btn pri" data-act="publishGuide" data-arg="' + s.id + '"' + (dirty && d.meals.length ? '' : ' disabled') + '>' + (gp ? 'Publicar versão ' + (gp.version + 1) : 'Publicar para ' + e_(fnm(s))) + '</button><p class="dim xs">Registros antigos do aluno continuam ligados à versão que estava valendo no dia.</p>' + (g.versions.length ? '<div class="versions"><span class="lbl">Versões</span>' + g.versions.slice().reverse().map((v) => '<div class="row between"><span class="sm">v' + v.version + ' · ' + v.meals.length + ' refeições · água ' + U.liters(v.waterGoal) + '</span><span class="dim xs">' + U.dm(v.at.slice(0, 10)) + '</span></div>').join('') + '</div>' : '') + '</section></div></div>';
    return h;
  }
  function mealTrack(s, compact) {
    const today = T(), gp = TV.guidePub(s.id), goal = TV.waterGoal(s.id);
    const days = Array.from({ length: 7 }, (_, i) => U.addDays(today, i - 6));
    const ms = TV.mealStats(s.id, days[0], today), wsx = TV.waterStats(s.id, days[0], today);
    let h = '';
    if (!gp) h += '<div class="inline-note">' + U.ic('alert', 18) + '<span class="grow">' + e_(fnm(s)) + ' ainda não tem orientações publicadas. A água pode ser registrada mesmo assim.</span><a class="btn sm" href="#/pedro/alimentacao/' + s.id + '/orientacoes">Criar orientações</a></div>';
    h += '<div class="kpis sm"><div class="kpi"><b class="num">' + (ms ? ms.pct + '%' : '—') + '</b><span>Refeições seguidas</span></div><div class="kpi"><b class="num">' + (ms ? ms.logged + '/' + ms.planned : '—') + '</b><span>Refeições registradas</span></div><div class="kpi"><b class="num">' + U.liters(wsx.avg) + '</b><span>Água por dia' + (goal ? ' · meta ' + U.liters(goal) : '') + '</span></div><div class="kpi"><b class="num">' + (goal ? wsx.hit + '/7' : '—') + '</b><span>Dias com a meta de água</span></div></div>';
    if (gp) {
      h += '<section class="card"><h2 class="h3">Refeições · últimos 7 dias</h2><div class="table-wrap"><table class="tbl matrix"><thead><tr><th>Refeição</th>' + days.map((d) => '<th class="c">' + U.wd(d) + '<br><span class="dim xs">' + U.dm(d) + '</span></th>').join('') + '</tr></thead><tbody>' + gp.meals.map((m) => '<tr><td><b class="sm">' + e_(m.name) + '</b><br><span class="dim xs">' + e_(m.time) + '</span></td>' + days.map((d) => { const l = TV.mealLog(s.id, d, m.id); if (!l) return '<td class="c"><span class="mcell none" title="Sem registro">·</span></td>'; const x = MEAL_IC[l.status]; return '<td class="c"><span class="mcell ' + x[0] + '" title="' + e_(x[2] + (l.note ? ': ' + l.note : '')) + '">' + x[1] + '<span class="sr">' + e_(x[2]) + '</span></span></td>'; }).join('') + '</tr>').join('') + '</tbody></table></div><div class="legend">' + Object.keys(MEAL_IC).map((k) => '<span><span class="mcell ' + MEAL_IC[k][0] + '">' + MEAL_IC[k][1] + '</span> ' + MEAL_IC[k][2] + '</span>').join('') + '<span><span class="mcell none">·</span> Sem registro</span></div></section>';
      const notes = TV.S.mealLogs.filter((l) => l.studentId === s.id && l.date >= days[0] && l.note).sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, compact ? 4 : 10);
      h += '<section class="card"><h2 class="h3">O que o aluno informou</h2>' + (notes.length ? notes.map((l) => '<div class="row between top"><span class="sm"><b>' + e_(l.mealName) + '</b> · ' + MEAL_IC[l.status][2] + '<br>' + e_(l.note) + '</span><span class="dim xs nowrap">' + U.dayLabel(l.date) + '</span></div>').join('') : '<span class="muted sm">Nenhuma troca ou observação nos últimos 7 dias.</span>') + '</section>';
    }
    h += '<section class="card"><h2 class="h3">Água por dia</h2>' + U.bars(days.map((d) => ({ label: U.wd(d), v: TV.waterTotal(s.id, d), hl: d === today, ok: goal && TV.waterTotal(s.id, d) >= goal, top: TV.waterTotal(s.id, d) ? U.liters(TV.waterTotal(s.id, d)) : '' })), { goal, h: 150, label: 'Água por dia nos últimos 7 dias' }) + '<span class="dim xs">' + (goal ? 'Linha tracejada: meta de ' + U.liters(goal) + '.' : 'Sem meta de água definida.') + '</span></section>';
    if (compact) h += '<a class="btn" href="#/pedro/alimentacao/' + s.id + '/orientacoes">Editar orientações</a>';
    return h;
  }
  const curG = () => TV.guideOf(location.hash.split('/')[3]);
  Object.assign(A, {
    createGuide(sid) {
      const base = TV.guideOf('s-lucas');
      const meals = base ? U.clone(base.draft.meals).map((m) => Object.assign(m, { id: U.uid('m') })) : [];
      TV.S.guides.push({ id: U.uid('g'), studentId: sid, draft: { meals, waterGoal: 2500, notes: 'Orientações gerais. Para um plano alimentar individual, com quantidades, procure um(a) nutricionista.' }, versions: [] });
      U.toast('Rascunho criado a partir do modelo. Ajuste e publique.', 'ok');
    },
    addMeal() { curG().draft.meals.push({ id: U.uid('m'), name: 'Nova refeição', time: '15:00', guidance: '', options: [] }); },
    rmMeal(i) { curG().draft.meals.splice(+i, 1); },
    addOpt(i) { curG().draft.meals[+i].options.push(''); },
    rmOpt(arg) { const [i, k] = arg.split('|').map(Number); curG().draft.meals[i].options.splice(k, 1); },
    publishGuide(sid) {
      const g = TV.guideOf(sid), s = TV.stu(sid);
      if (!g.draft.meals.length) { U.toast('Adicione pelo menos uma refeição.', 'err'); return; }
      if (g.draft.meals.some((m) => !String(m.name).trim())) { U.toast('Toda refeição precisa de um nome.', 'err'); return; }
      if (!TV.net('publicar as orientações', 'publishGuide', sid)) return;
      const clean = U.clone(g.draft); delete clean.id; clean.meals.forEach((m) => { m.options = m.options.map((o) => String(o).trim()).filter(Boolean); });
      g.draft = U.clone(clean);
      const v = (g.versions.length ? g.versions[g.versions.length - 1].version : 0) + 1;
      g.versions.push(Object.assign({ version: v, at: TV.stamp() }, U.clone(clean)));
      TV.log('Você publicou a versão ' + v + ' das orientações de alimentação de ' + fnm(s), sid, 'alimentacao');
      U.toast('Orientações publicadas para ' + fnm(s), 'ok');
    },
    openGuidePreview(sid) { TV.openModal('guidePreview', { sid }); }
  });
  TV.M.guidePreview = (d) => {
    const g = TV.guideOf(d.sid), s = TV.stu(d.sid), dr = g.draft;
    return { title: 'Como ' + e_(fnm(s)) + ' vai ver', wide: true, body: '<div class="pv-phone"><div class="pv-screen"><p class="eyebrow">Orientações gerais do Pedro</p><div class="card"><span class="eyebrow">Hidratação</span><div class="d big">0 L</div><span class="muted sm">Meta do dia: ' + U.liters(dr.waterGoal || 0) + '</span></div>' + dr.meals.map((m) => '<div class="card"><span class="eyebrow">' + e_(m.time) + '</span><h3 class="h3">' + e_(m.name) + '</h3><p class="guid">' + e_(m.guidance) + '</p>' + (m.options.filter(Boolean).length ? '<div class="sugs">' + m.options.filter(Boolean).map((o) => '<span class="sug static">' + e_(o) + '</span>').join('') + '</div>' : '') + '<div class="meal-acts"><span class="btn sm pri">Segui</span><span class="btn sm">Em parte</span><span class="btn sm">Troquei</span></div></div>').join('') + '<p class="disclaimer sm">' + e_(dr.notes) + '</p></div></div>', foot: '<button class="btn pri" data-act="closeModal">Fechar</button>' };
  };

  /* =================== CHECK-INS =================== */
  function checkins(id) {
    if (id) return ckDetail(id);
    const tab = UI.ckTab || 'revisar', ws = U.weekStart(T());
    const ckRow = (c) => { const s = TV.stu(c.studentId); return '<a class="item" href="#/pedro/checkins/' + c.id + '">' + TV.avatar(s) + '<span class="grow"><b>' + e_(s.name) + '</b><br><span class="muted sm">Semana de ' + U.dm(c.week) + ' · ' + e_(c.peso) + ' kg' + (c.dores ? ' · <span class="warn-t">relatou dor</span>' : '') + '</span></span>' + TV.ckPill(c.reviewedAt ? 'revisado' : 'enviado') + U.ic('chev', 18) + '</a>'; };
    const rev = TV.S.checkins.filter((c) => !c.reviewedAt).sort((a, b) => (a.sentAt > b.sentAt ? 1 : -1));
    const done = TV.S.checkins.filter((c) => c.reviewedAt).sort((a, b) => (a.reviewedAt < b.reviewedAt ? 1 : -1));
    const missing = [];
    active().forEach((s) => { for (let k = 1; k <= 4; k++) { const w = U.addDays(ws, -7 * k); if (w < U.weekStart(s.since)) break; if (TV.checkinStatus(s.id, w) === 'nao_enviado') missing.push({ s, w }); } });
    const thisWeek = active().map((s) => ({ s, st: TV.checkinStatus(s.id, ws) }));
    const tabs = [['revisar', 'Para revisar', rev.length], ['semana', 'Esta semana', null], ['revisados', 'Revisados', null], ['nao', 'Não enviados', missing.length]];
    let h = ph('Check-ins semanais', 'Abrem no sábado e fecham no domingo às 23h59. O app junta treinos, refeições e água da semana.');
    h += '<div class="tabs" role="tablist">' + tabs.map((t) => '<button role="tab" aria-selected="' + (tab === t[0]) + '" data-act="ckTab" data-arg="' + t[0] + '">' + t[1] + (t[2] ? ' <span class="badge">' + t[2] + '</span>' : '') + '</button>').join('') + '</div>';
    if (tab === 'revisar') h += rev.length ? rev.map(ckRow).join('') : TV.empty('Tudo revisado', 'Nenhum check-in esperando por você.');
    if (tab === 'revisados') h += done.length ? done.map(ckRow).join('') : TV.empty('Nenhum check-in revisado ainda');
    if (tab === 'nao') h += missing.length ? missing.map((m) => '<a class="item" href="#/pedro/alunos/' + m.s.id + '/checkins">' + TV.avatar(m.s) + '<span class="grow"><b>' + e_(m.s.name) + '</b><br><span class="muted sm">Semana de ' + U.dm(m.w) + ' a ' + U.dm(U.addDays(m.w, 6)) + '</span></span>' + TV.ckPill('nao_enviado') + '</a>').join('') : TV.empty('Nenhuma semana sem check-in');
    if (tab === 'semana') h += '<p class="muted sm">Semana de ' + U.dm(ws) + ' a ' + U.dm(U.addDays(ws, 6)) + '.</p>' + thisWeek.map((r) => { const c = TV.checkinOf(r.s.id, ws); return '<' + (c ? 'a href="#/pedro/checkins/' + c.id + '"' : 'div') + ' class="item">' + TV.avatar(r.s) + '<span class="grow"><b>' + e_(r.s.name) + '</b></span>' + TV.ckPill(r.st) + '</' + (c ? 'a' : 'div') + '>'; }).join('');
    return h;
  }
  function ckDetail(id) {
    const c = TV.S.checkins.find((x) => x.id === id);
    if (!c) return ph('Check-in não encontrado', '', '', 'checkins');
    const s = TV.stu(c.studentId), prev = TV.prevCheckin(s.id, c.week), cons = c.cons || {};
    TV.reg(c); if (c.draft == null) c.draft = c.feedback || '';
    const delta = prev ? U.num(c.peso) - U.num(prev.peso) : null;
    let h = '<div class="ph"><a class="back" href="#/pedro/checkins" aria-label="Voltar para check-ins">' + U.ic('back', 20) + '</a>' + TV.avatar(s, 'lg') + '<div class="grow"><p class="eyebrow">Check-in · semana de ' + U.dm(c.week) + ' a ' + U.dm(U.addDays(c.week, 6)) + '</p><h1 class="d h1">' + e_(s.name) + '</h1><p class="muted sm">Enviado ' + e_(U.dayLabel(c.sentAt.slice(0, 10))) + ' às ' + e_(c.sentAt.slice(11)) + '</p></div><div class="ph-acts">' + TV.ckPill(c.reviewedAt ? 'revisado' : 'enviado') + '</div></div>';
    h += '<div class="kpis sm"><div class="kpi"><b class="num">' + e_(c.peso) + ' kg</b><span>' + (delta == null ? 'Primeiro check-in' : (delta > 0 ? '+' : '') + U.fmtNum(delta) + ' kg desde ' + U.dm(prev.week)) + '</span></div><div class="kpi"><b class="num">' + (cons.treinos != null ? cons.treinos + '/' + cons.meta : '—') + '</b><span>Treinos na semana</span></div><div class="kpi"><b class="num">' + (cons.mealPct == null ? '—' : cons.mealPct + '%') + '</b><span>Refeições seguidas</span></div><div class="kpi"><b class="num">' + (cons.waterAvg == null ? '—' : U.liters(cons.waterAvg)) + '</b><span>Água por dia' + (cons.waterGoal ? ' · meta ' + U.liters(cons.waterGoal) : '') + '</span></div></div>';
    h += '<div class="cols"><div class="col-main"><section class="card"><h2 class="h3">Fotos' + (prev ? ' · ' + U.dm(prev.week) + ' × ' + U.dm(c.week) : '') + '</h2><div class="compare">' + ['frente', 'lado', 'costas'].map((p) => '<div class="cmp">' + (prev && prev.photos ? '<figure><div class="photo">' + U.photo(prev.photos[p], p, 0) + '</div><figcaption class="dim xs">Antes</figcaption></figure>' : '') + '<figure><div class="photo">' + U.photo(c.photos && c.photos[p], p, 3) + '</div><figcaption class="dim xs">' + { frente: 'Frente', lado: 'Lado', costas: 'Costas' }[p] + '</figcaption></figure></div>').join('') + '</div></section>';
    if (c.dores) h += '<section class="card hl-warn"><h2 class="h3">' + U.ic('alert', 18) + ' Dores ou dificuldades</h2><p>' + e_(c.dores) + '</p></section>';
    if (c.comentario) h += '<section class="card"><h2 class="h3">Comentário do aluno</h2><p class="quote-txt">"' + e_(c.comentario) + '"</p></section>';
    h += '</div><div class="col-side"><section class="card sticky"><h2 class="h3">Feedback para ' + e_(fnm(s)) + '</h2>' + (c.reviewedAt ? '<span class="muted sm">Revisado ' + U.relDay(c.reviewedAt.slice(0, 10), T()) + '. O aluno já vê este feedback.</span>' : '<span class="muted sm">O aluno vê o feedback no início do app.</span>') +
      '<label class="sr" for="fb-' + c.id + '">Feedback</label><textarea class="in" id="fb-' + c.id + '" rows="5" data-obj="' + c.id + '" data-key="draft" placeholder="Ex.: ótima semana! Pode trocar o crucifixo pelo crossover.">' + e_(c.draft) + '</textarea>' +
      '<button class="btn pri block" data-act="reviewCk" data-arg="' + c.id + '">' + (c.reviewedAt ? 'Atualizar feedback' : 'Enviar feedback e marcar como revisado') + '</button>' + (TV.fichaOf(s.id) ? '<a class="btn block" href="#/pedro/treinos/' + TV.fichaOf(s.id).id + '">' + U.ic('db', 18) + ' Ajustar a ficha</a>' : '') + '<a class="linkbtn sm" href="#/pedro/alunos/' + s.id + '/evolucao">Ver evolução completa</a></section></div></div>';
    return h;
  }
  Object.assign(A, {
    ckTab(t) { UI.ckTab = t; },
    reviewCk(id) {
      const c = TV.S.checkins.find((x) => x.id === id), s = TV.stu(c.studentId);
      if (!String(c.draft || '').trim()) { U.toast('Escreva um feedback curto para o aluno.', 'err'); return; }
      if (!TV.net('enviar o feedback', 'reviewCk', id)) return;
      const again = !!c.reviewedAt;
      c.feedback = String(c.draft).trim(); c.reviewedAt = TV.stamp(); delete c.draft;
      TV.log((again ? 'Você atualizou o feedback do check-in de ' : 'Você revisou o check-in de ') + fnm(s), s.id, 'checkin');
      U.toast('Feedback enviado para ' + fnm(s), 'ok');
    }
  });

  /* =================== FINANCEIRO =================== */
  function payRow(p) {
    const s = TV.stu(p.studentId), st = TV.payStatus(p), pl = TV.plan(p.planId);
    return '<div class="pay-row">' + TV.avatar(s, 'sm') + '<span class="grow"><b>' + e_(s ? s.name : '—') + '</b><br><span class="muted sm">' + e_(pl.name) + ' · vence ' + U.dm(p.due) + (p.paidAt ? ' · pago ' + U.dm(p.paidAt) + ' via ' + e_(p.method) : '') + '</span></span><b class="num">' + U.money(p.amount) + '</b>' + TV.payPill(st) + (st === 'pago' ? '<button class="btn sm ghost" data-act="undoPay" data-arg="' + p.id + '">Desfazer</button>' : '<button class="btn sm pri" data-act="openPay" data-arg="' + p.id + '">Registrar pagamento</button>') + '</div>';
  }
  function financeiro() {
    const today = T(), ym = today.slice(0, 7), flt = UI.payFilter || 'todos';
    const pays = TV.S.payments.filter((p) => TV.stu(p.studentId));
    const recebido = pays.filter((p) => p.status === 'pago' && p.paidAt && p.paidAt.slice(0, 7) === ym).reduce((a, p) => a + p.amount, 0);
    const late = pays.filter((p) => TV.payStatus(p) === 'atrasado');
    const soon = pays.filter((p) => TV.payStatus(p) === 'pendente' && U.diffDays(today, p.due) <= 7);
    const prev = pays.filter((p) => TV.payStatus(p) === 'pendente' && p.due.slice(0, 7) === ym).reduce((a, p) => a + p.amount, 0);
    let h = ph('Financeiro', 'Planos, vencimentos e pagamentos. Valores de exemplo, sem cobrança real.');
    h += '<div class="kpis"><div class="kpi"><b class="num">' + U.money(recebido) + '</b><span>Recebido neste mês</span></div><div class="kpi"><b class="num">' + U.money(prev) + '</b><span>A receber neste mês</span></div><div class="kpi' + (late.length ? ' hot' : '') + '"><b class="num">' + U.money(late.reduce((a, p) => a + p.amount, 0)) + '</b><span>Em atraso · ' + late.length + ' cobrança(s)</span></div><div class="kpi"><b class="num">' + soon.length + '</b><span>Vencem nos próximos 7 dias</span></div></div>';
    const fs = [['todos', 'Todas'], ['pendente', 'Pendentes'], ['atrasado', 'Atrasadas'], ['pago', 'Pagas']];
    let list = pays.slice().sort((a, b) => { const o = { atrasado: 0, pendente: 1, pago: 2 }; const d = o[TV.payStatus(a)] - o[TV.payStatus(b)]; return d || (a.due > b.due ? (TV.payStatus(a) === 'pago' ? -1 : 1) : TV.payStatus(a) === 'pago' ? 1 : -1); });
    if (flt !== 'todos') list = list.filter((p) => TV.payStatus(p) === flt);
    h += '<div class="cols"><div class="col-main"><div class="chips">' + fs.map((f) => '<button class="chip' + (flt === f[0] ? ' on' : '') + '" data-act="payFilter" data-arg="' + f[0] + '">' + f[1] + '</button>').join('') + '</div>' + (list.length ? list.map(payRow).join('') : TV.empty('Nenhuma cobrança neste filtro')) + '</div>';
    h += '<div class="col-side"><section class="card"><h2 class="h3">Planos</h2>' + TV.S.plans.map((p) => { TV.reg(p); return '<div class="field"><label for="pp-' + p.id + '">' + e_(p.name) + (p.months > 1 ? ' · a cada ' + p.months + ' meses' : ' · por mês') + '</label><div class="row"><span class="muted">R$</span><input class="in num grow" id="pp-' + p.id + '" inputmode="decimal" data-obj="' + p.id + '" data-key="price" data-type="num" data-rerender="1" value="' + e_(String(p.price).replace('.', ',')) + '"></div></div>'; }).join('') + '<span class="dim xs">O novo valor vale para as próximas cobranças.</span></section></div></div>';
    return h;
  }
  Object.assign(A, {
    payFilter(f) { UI.payFilter = f; },
    openPay(id) { form({ kind: 'pay', pid: id, method: 'PIX' }); TV.openModal('pay', { id }); },
    confirmPay() {
      const f = UI.form, p = TV.S.payments.find((x) => x.id === f.pid), s = TV.stu(p.studentId);
      if (!TV.net('registrar o pagamento', 'confirmPay')) return;
      p.status = 'pago'; p.paidAt = T(); p.method = f.method;
      if (!TV.S.payments.some((x) => x.studentId === p.studentId && x.status !== 'pago')) {
        const pl = TV.plan(s.planId);
        TV.S.payments.push({ id: U.uid('pay'), studentId: s.id, planId: pl.id, amount: pl.price, due: U.addMonths(p.due, pl.months), status: 'aberto', paidAt: null, method: null });
      }
      TV.log('Pagamento de ' + fnm(s) + ' registrado (' + U.money(p.amount) + ')', s.id, 'financeiro');
      UI.modal = null; U.toast('Pagamento registrado. A próxima cobrança foi gerada.', 'ok');
    },
    undoPay(id) {
      const p = TV.S.payments.find((x) => x.id === id);
      const gen = TV.S.payments.find((x) => x.studentId === p.studentId && x.status !== 'pago' && x.due > p.due);
      if (gen) TV.S.payments = TV.S.payments.filter((x) => x.id !== gen.id);
      p.status = 'aberto'; p.paidAt = null; p.method = null; U.toast('Pagamento desfeito');
    },
    newCharge(sid) {
      const s = TV.stu(sid), pl = TV.plan(s.planId);
      if (TV.S.payments.some((x) => x.studentId === sid && x.status !== 'pago')) { U.toast(fnm(s) + ' já tem uma cobrança em aberto.', 'err'); return; }
      const last = TV.paymentsOf(sid)[0];
      TV.S.payments.push({ id: U.uid('pay'), studentId: sid, planId: pl.id, amount: pl.price, due: last ? U.addMonths(last.due, pl.months) : U.addDays(T(), 3), status: 'aberto', paidAt: null, method: null });
      U.toast('Cobrança gerada para ' + fnm(s), 'ok');
    }
  });
  TV.M.pay = () => {
    const f = UI.form, p = TV.S.payments.find((x) => x.id === f.pid), s = TV.stu(p.studentId); TV.reg(f);
    return { title: 'Registrar pagamento', body: '<p><b>' + e_(s.name) + '</b> · ' + e_(TV.plan(p.planId).name) + ' · ' + U.money(p.amount) + ' · vencimento ' + U.dm(p.due) + '</p><div class="field"><span class="lbl">Forma de pagamento</span><div class="chips">' + ['PIX', 'Cartão', 'Dinheiro', 'Transferência'].map((m) => '<button class="chip' + (f.method === m ? ' on' : '') + '" data-act="formSet" data-arg="method|' + m + '">' + m + '</button>').join('') + '</div></div><p class="dim xs">Registro manual: nenhum valor é cobrado de verdade.</p>', foot: '<button class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn pri" data-act="confirmPay">Confirmar pagamento</button>' };
  };

  /* =================== LOJA =================== */
  function loja(tab) {
    tab = ['produtos', 'parceiros', 'cupons', 'pedidos'].includes(tab) ? tab : 'produtos';
    const today = T();
    let h = ph('Loja e parceiros', 'O que estiver publicado aparece na loja do app dos alunos.', tab === 'produtos' ? '<button class="btn pri" data-act="newProduct">' + U.ic('plus', 18) + ' Novo produto</button>' : tab === 'parceiros' ? '<button class="btn pri" data-act="openPartner">' + U.ic('plus', 18) + ' Novo parceiro</button>' : tab === 'cupons' ? '<button class="btn pri" data-act="openCoupon">' + U.ic('plus', 18) + ' Novo cupom</button>' : '');
    h += '<div class="tabs" role="tablist">' + [['produtos', 'Produtos'], ['parceiros', 'Parceiros'], ['cupons', 'Cupons'], ['pedidos', 'Pedidos']].map((t) => '<a role="tab" aria-selected="' + (tab === t[0]) + '" href="#/pedro/loja/' + t[0] + '">' + t[1] + (t[0] === 'pedidos' && TV.S.orders.length ? ' <span class="badge">' + TV.S.orders.length + '</span>' : '') + '</a>').join('') + '</div>';
    if (tab === 'produtos') {
      h += '<div class="pgrid wide">' + TV.S.products.map((p) => { TV.reg(p); return '<article class="prod admin"><div class="prod-art">' + (p.img ? '<img src="' + e_(p.img) + '" alt="' + e_(p.name) + '">' : U.productArt(p.art)) + '</div><div class="prod-b"><b>' + e_(p.name) + '</b><span class="price">' + U.money(p.price) + '</span><label class="switch sm"><input type="checkbox" id="pa-' + p.id + '" data-obj="' + p.id + '" data-key="available" data-rerender="1"' + (p.available ? ' checked' : '') + '><span class="sw"></span><span>Disponível</span></label><label class="switch sm"><input type="checkbox" id="pb-' + p.id + '" data-obj="' + p.id + '" data-key="published" data-rerender="1"' + (p.published ? ' checked' : '') + '><span class="sw"></span><span>Publicado na loja</span></label><button class="btn sm" data-act="openProduct" data-arg="' + p.id + '">' + U.ic('edit', 16) + ' Editar</button></div></article>'; }).join('') + '</div>';
    }
    if (tab === 'parceiros') h += TV.S.partners.map((pa) => '<div class="item"><span class="av">' + e_(U.initials(pa.name)) + '</span><span class="grow"><b>' + e_(pa.name) + '</b><br><span class="muted sm">' + e_(pa.desc) + ' · ' + TV.S.coupons.filter((c) => c.partnerId === pa.id).length + ' cupom(ns)</span></span><button class="btn sm" data-act="openPartner" data-arg="' + pa.id + '">' + U.ic('edit', 16) + ' Editar</button></div>').join('') || TV.empty('Nenhum parceiro cadastrado');
    if (tab === 'cupons') h += TV.S.coupons.map((c) => { const pa = TV.S.partners.find((x) => x.id === c.partnerId) || { name: '—' }; const exp = c.until < today; return '<div class="item"><span class="av">' + e_(U.initials(pa.name)) + '</span><span class="grow"><b>' + e_(c.discount) + '</b><br><span class="muted sm">' + e_(pa.name) + ' · código <code>' + e_(c.code) + '</code> · ' + (exp ? 'encerrado em ' : 'válido até ') + U.dm(c.until) + '</span></span>' + (exp ? TV.pill('line', 'Expirado') : c.published ? TV.pill('ok', 'Publicado') : TV.pill('line', 'Retirado')) + (exp ? '' : '<button class="btn sm' + (c.published ? ' ghost' : ' pri') + '" data-act="toggleCoupon" data-arg="' + c.id + '">' + (c.published ? 'Retirar' : 'Publicar') + '</button>') + '<button class="icon-btn" data-act="openCoupon" data-arg="' + c.id + '" aria-label="Editar cupom">' + U.ic('edit', 18) + '</button></div>'; }).join('') || TV.empty('Nenhum cupom');
    if (tab === 'pedidos') h += TV.S.orders.length ? TV.S.orders.map((o) => { const s = TV.stu(o.studentId), p = TV.S.products.find((x) => x.id === o.productId); return '<div class="item">' + TV.avatar(s) + '<span class="grow"><b>' + e_(s ? s.name : '—') + '</b><br><span class="muted sm">' + e_(p ? p.name : 'Produto') + (o.size && o.size !== 'Único' ? ' · tamanho ' + e_(o.size) : '') + '</span></span><span class="muted xs">' + U.dayLabel(o.at.slice(0, 10)) + ' · ' + o.at.slice(11) + '</span></div>'; }).join('') + '<p class="dim xs">Pedidos simulados feitos pelo botão "Pedir pelo WhatsApp" do app.</p>' : TV.empty('Nenhum pedido ainda');
    return h;
  }
  Object.assign(A, {
    newProduct() { const p = { id: U.uid('p'), name: 'Novo produto', price: 49.9, desc: '', sizes: ['Único'], art: 'camiseta', img: null, available: true, published: false }; TV.S.products.push(p); A.openProduct(p.id); },
    openProduct(id) { const p = TV.S.products.find((x) => x.id === id); form({ kind: 'prod', pid: id, name: p.name, price: String(p.price).replace('.', ','), desc: p.desc, sizes: p.sizes.join(', '), img: p.img }); TV.openModal('product'); },
    saveProduct() {
      const f = UI.form, p = TV.S.products.find((x) => x.id === f.pid);
      if (!String(f.name).trim() || !U.num(f.price)) { U.toast('Informe o nome e um preço válido.', 'err'); return; }
      p.name = String(f.name).trim(); p.price = U.num(f.price); p.desc = String(f.desc || '').trim(); p.sizes = String(f.sizes || 'Único').split(',').map((x) => x.trim()).filter(Boolean); if (!p.sizes.length) p.sizes = ['Único']; p.img = f.img || null;
      UI.modal = null; U.toast('Produto salvo' + (p.published ? '' : '. Ligue "Publicado na loja" para os alunos verem.'), 'ok');
    },
    rmProdImg() { UI.form.img = null; },
    openPartner(id) { const pa = id ? TV.S.partners.find((x) => x.id === id) : null; form({ kind: 'partner', paid: id || '', name: pa ? pa.name : '', desc: pa ? pa.desc : '', link: pa ? pa.link : '' }); TV.openModal('partnerEdit'); },
    savePartner() {
      const f = UI.form; if (!String(f.name).trim()) { U.toast('Informe o nome do parceiro.', 'err'); return; }
      if (f.paid) { const pa = TV.S.partners.find((x) => x.id === f.paid); Object.assign(pa, { name: f.name.trim(), desc: f.desc, link: f.link }); }
      else TV.S.partners.push({ id: U.uid('pa'), name: f.name.trim(), desc: f.desc, link: f.link || 'loja-parceira.exemplo' });
      UI.modal = null; U.toast('Parceiro salvo', 'ok');
    },
    openCoupon(id) {
      if (!TV.S.partners.length) { U.toast('Cadastre um parceiro antes de criar cupons.', 'err'); return; }
      const c = id ? TV.S.coupons.find((x) => x.id === id) : null;
      form({ kind: 'coupon', cid: id || '', partnerId: c ? c.partnerId : TV.S.partners[0].id, code: c ? c.code : '', discount: c ? c.discount : '', until: c ? c.until : U.addDays(T(), 30), publish: c ? c.published : true });
      TV.openModal('coupon');
    },
    saveCoupon() {
      const f = UI.form; const code = String(f.code || '').trim().toUpperCase().replace(/\s+/g, '');
      if (!code || !String(f.discount).trim()) { U.toast('Informe o código e o desconto.', 'err'); return; }
      if (!f.until || f.until < T()) { U.toast('A validade precisa ser hoje ou depois.', 'err'); return; }
      if (TV.S.coupons.some((c) => c.code === code && c.id !== f.cid)) { U.toast('Já existe um cupom com esse código.', 'err'); return; }
      if (!TV.net('salvar o cupom', 'saveCoupon')) return;
      if (f.cid) Object.assign(TV.S.coupons.find((x) => x.id === f.cid), { partnerId: f.partnerId, code, discount: String(f.discount).trim(), until: f.until, published: !!f.publish });
      else TV.S.coupons.unshift({ id: U.uid('cp'), partnerId: f.partnerId, code, discount: String(f.discount).trim(), until: f.until, published: !!f.publish });
      if (f.publish) TV.log('Você publicou o cupom ' + code, '', 'loja');
      UI.modal = null; U.toast(f.publish ? 'Cupom publicado na loja dos alunos' : 'Cupom salvo sem publicar', 'ok');
    },
    toggleCoupon(id) { const c = TV.S.coupons.find((x) => x.id === id); c.published = !c.published; U.toast(c.published ? 'Cupom ' + c.code + ' publicado' : 'Cupom ' + c.code + ' retirado da loja'); }
  });
  TV.F.prodImg = (file) => { U.shrinkImage(file, 520).then((url) => { UI.form.img = url; TV.render(); }).catch((e) => U.toast(e.message, 'err')); };
  TV.M.product = () => {
    const f = UI.form, p = TV.S.products.find((x) => x.id === f.pid); TV.reg(f);
    return { title: 'Editar produto', body: '<div class="prod-edit"><div class="prod-art">' + (f.img ? '<img src="' + e_(f.img) + '" alt="Foto do produto">' : U.productArt(p.art)) + '</div><div class="stack"><label class="btn sm" for="pimg">' + U.ic('image', 16) + ' Enviar foto<input type="file" accept="image/*" class="sr" id="pimg" data-file="prodImg"></label>' + (f.img ? '<button class="linkbtn sm" data-act="rmProdImg">Usar ilustração</button>' : '<span class="dim xs">Sem foto: usamos a ilustração.</span>') + '</div></div><div class="field"><label for="pn">Nome</label><input class="in" id="pn" data-obj="form" data-key="name" value="' + e_(f.name) + '"></div><div class="form-row"><div class="field"><label for="pp">Preço (R$)</label><input class="in num" id="pp" inputmode="decimal" data-obj="form" data-key="price" value="' + e_(f.price) + '"></div><div class="field grow2"><label for="ps">Tamanhos (separe por vírgula)</label><input class="in" id="ps" data-obj="form" data-key="sizes" value="' + e_(f.sizes) + '"></div></div><div class="field"><label for="pd">Descrição</label><textarea class="in" id="pd" data-obj="form" data-key="desc">' + e_(f.desc) + '</textarea></div>', foot: '<button class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn pri" data-act="saveProduct">Salvar produto</button>' };
  };
  TV.M.partnerEdit = () => {
    const f = UI.form; TV.reg(f);
    return { title: f.paid ? 'Editar parceiro' : 'Novo parceiro', body: '<div class="field"><label for="pa-n">Nome</label><input class="in" id="pa-n" data-obj="form" data-key="name" data-autofocus value="' + e_(f.name) + '"></div><div class="field"><label for="pa-d">Descrição</label><input class="in" id="pa-d" data-obj="form" data-key="desc" placeholder="Ex.: suplementos e alimentação saudável" value="' + e_(f.desc) + '"></div><div class="field"><label for="pa-l">Link da loja</label><input class="in" id="pa-l" data-obj="form" data-key="link" placeholder="site do parceiro" value="' + e_(f.link) + '"></div>', foot: '<button class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn pri" data-act="savePartner">Salvar</button>' };
  };
  TV.M.coupon = () => {
    const f = UI.form; TV.reg(f);
    return { title: f.cid ? 'Editar cupom' : 'Novo cupom', body: '<div class="field"><label for="cp-p">Parceiro</label><select class="in" id="cp-p" data-obj="form" data-key="partnerId">' + TV.S.partners.map((p) => '<option value="' + p.id + '"' + (p.id === f.partnerId ? ' selected' : '') + '>' + e_(p.name) + '</option>').join('') + '</select></div><div class="form-row"><div class="field"><label for="cp-c">Código</label><input class="in" id="cp-c" data-obj="form" data-key="code" data-autofocus placeholder="Ex.: VECHI20" value="' + e_(f.code) + '"></div><div class="field"><label for="cp-u">Válido até</label><input class="in" type="date" id="cp-u" data-obj="form" data-key="until" value="' + e_(f.until) + '"></div></div><div class="field"><label for="cp-d">Desconto</label><input class="in" id="cp-d" data-obj="form" data-key="discount" placeholder="Ex.: 20% em whey protein" value="' + e_(f.discount) + '"></div><label class="switch"><input type="checkbox" id="cp-pub" data-obj="form" data-key="publish"' + (f.publish ? ' checked' : '') + '><span class="sw"></span><span>Publicar agora na loja dos alunos</span></label>', foot: '<button class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn pri" data-act="saveCoupon">Salvar cupom</button>' };
  };
})();
