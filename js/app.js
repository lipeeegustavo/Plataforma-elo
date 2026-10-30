/* TeamVechi demo — núcleo: rotas, renderização, eventos, painel da demo, modais e componentes compartilhados */
(function () {
  const TV = window.TV;
  const U = TV.U;
  const UI = (TV.UI = { modal: null, demoOpen: false, sheet: false, loading: false, rest: null, playing: null, netRetry: null });
  TV.A = TV.A || {}; // ações (data-act)
  TV.V = TV.V || {}; // telas
  TV.M = TV.M || {}; // modais
  TV.F = TV.F || {}; // uploads (data-file)
  const R = (TV.R = new Map());
  TV.reg = (o) => { if (o && o.id) R.set(o.id, o); return o ? o.id : ''; };

  /* ---------- componentes compartilhados ---------- */
  TV.TYPE = { aquec: 'Aquecimento', valida: 'Válida', top: 'Top set', back: 'Back-off' };
  TV.TSHORT = { aquec: 'AQUEC.', valida: 'VÁLIDA', top: 'TOP SET', back: 'BACK-OFF' };
  TV.PROG = { dupla: 'Dupla progressão', carga: 'Progressão de carga', reps: 'Progressão de repetições', manual: 'Manual (o Pedro ajusta)' };
  TV.groups = (sets) => {
    const g = [];
    sets.forEach((x) => { const l = g[g.length - 1]; if (l && l.type === x.type && l.reps === x.reps && l.rir === x.rir && l.kg === x.kg && l.rest === x.rest) l.n++; else g.push(Object.assign({}, x, { n: 1 })); });
    return g;
  };
  TV.prescLines = (sets) => TV.groups(sets).map((g) => '<div class="pl"><span class="tag t-' + g.type + '">' + TV.TSHORT[g.type] + '</span><b class="num">' + g.n + ' × ' + U.esc(g.reps || '—') + '</b><span class="muted">' + (g.kg ? U.esc(g.kg) + ' kg · ' : '') + (g.rir !== '' && g.rir != null ? 'RIR ' + U.esc(g.rir) + ' · ' : '') + 'descanso ' + U.restLabel(g.rest) + '</span></div>').join('');
  TV.setSummary = (sets) => {
    const c = {}; sets.forEach((x) => { c[x.type] = (c[x.type] || 0) + 1; });
    const p = [];
    if (c.aquec) p.push(c.aquec + ' aquec.');
    if (c.top) p.push(c.top + ' top set');
    if (c.back) p.push(c.back + ' back-off');
    if (c.valida) p.push(c.valida + (c.valida > 1 ? ' séries' : ' série'));
    const reps = [...new Set(sets.filter((x) => x.type !== 'aquec').map((x) => x.reps).filter(Boolean))];
    return p.join(' + ') + (reps.length ? ' · ' + reps.join(' / ') + ' reps' : '');
  };
  TV.pill = (cls, txt) => '<span class="pill ' + cls + '">' + U.esc(txt) + '</span>';
  TV.ckPill = (st) => TV.pill({ aguardando: 'line', pendente: 'brand', enviado: 'info', nao_enviado: 'err', revisado: 'ok' }[st] || 'line', TV.CK_LABEL[st] || st);
  TV.payPill = (st) => TV.pill({ pago: 'ok', pendente: 'line', atrasado: 'err' }[st], { pago: 'Pago', pendente: 'Pendente', atrasado: 'Atrasado' }[st]);
  TV.empty = (title, text, action) => '<div class="empty"><b>' + U.esc(title) + '</b>' + (text ? '<span>' + U.esc(text) + '</span>' : '') + (action || '') + '</div>';
  TV.avatar = (s, cls) => {
    const url = s && TV.avatars && TV.avatars[s.id];
    if (url) return '<span class="av has-img ' + (cls || '') + '" aria-hidden="true"><img src="' + U.esc(url) + '" alt="" draggable="false"></span>';
    return '<span class="av ' + (cls || '') + '" aria-hidden="true">' + U.esc(U.initials(s ? s.name : '?')) + '</span>';
  };
  TV.logo = (cls) => '<span class="mark ' + (cls || '') + '" aria-hidden="true">TV</span>';
  TV.videoBox = (e) => {
    if (TV.blobs[e.id]) return '<div class="vbox"><video src="' + TV.blobs[e.id] + '" controls playsinline preload="metadata"></video></div>';
    if (e.video) {
      const playing = UI.playing && UI.playing.id === e.id;
      const label = e.video.kind === 'upload' ? 'Vídeo enviado pelo Pedro' + (e.video.name ? ' · ' + e.video.name : '') : 'Vídeo de demonstração · ' + (e.video.dur || '0:40');
      return '<div class="vbox demo' + (playing ? ' playing' : '') + '"><div class="vbox-in">' +
        (playing ? '<span class="d vb-title">' + U.esc(e.name) + '</span><span class="muted sm">Reproduzindo a demonstração…</span><div class="vbar"><i id="vplay-bar" style="width:0%"></i></div><button class="btn sm" data-act="stopDemo">Parar</button>'
          : '<button class="vplay" data-act="playDemo" data-arg="' + e.id + '" aria-label="Assistir ao vídeo de ' + U.esc(e.name) + '">' + U.playIc(30) + '</button><span class="muted sm">' + U.esc(label) + '</span>') +
        (e.video.kind === 'upload' && !TV.blobs[e.id] && !playing ? '<span class="dim xs">A prévia do arquivo não fica salva depois de recarregar a página.</span>' : '') +
        '</div></div>';
    }
    return '<div class="vbox none"><div class="vbox-in">' + U.ic('video', 28) + '<span class="muted sm">O Pedro ainda não enviou o vídeo deste exercício.</span></div></div>';
  };
  /* rede simulada: retorna false e guarda a ação para "Tentar de novo" */
  TV.net = (label, act, arg) => {
    if (TV.online()) { UI.netRetry = null; return true; }
    UI.netRetry = { label, act, arg };
    U.toast('Sem conexão: não deu para ' + label + '.', 'err');
    return false;
  };
  TV.netBanner = () => UI.netRetry ? '<div class="netbar" role="alert">' + U.ic('wifi', 18) + '<span class="grow">Sem conexão: não deu para ' + U.esc(UI.netRetry.label) + '.</span><button class="btn sm" data-act="netRetry">Tentar de novo</button></div>' : '';
  TV.skel = (rows) => '<div class="skel-wrap" aria-busy="true" aria-label="Carregando">' + Array.from({ length: rows || 4 }, (_, i) => '<div class="skel" style="height:' + (i === 0 ? 34 : 86) + 'px;width:' + (i === 0 ? '60%' : '100%') + '"></div>').join('') + '</div>';

  /* ---------- rotas ---------- */
  const parts = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  TV.go = (path) => { const t = '#/' + path; if (location.hash === t) render(); else location.hash = t; };
  let lastKey = null, lastPage = null;

  function render() {
    const p = parts();
    const area = p[0] || '';
    const key = p.join('/');
    const page = p.slice(0, 2).join('/');
    const routeChanged = key !== lastKey;
    if (page !== lastPage && lastPage !== null && area) { UI.loading = true; clearTimeout(render.lt); render.lt = setTimeout(() => { UI.loading = false; render(); }, 160); }
    lastPage = page;
    const scr = document.getElementById('scr');
    const keep = { win: window.scrollY, scr: scr ? scr.scrollTop : 0 };
    const ae = document.activeElement;
    const focusId = ae && ae.id && ae !== document.body ? ae.id : null;
    let sS = null, sE = null; try { sS = ae.selectionStart; sE = ae.selectionEnd; } catch (e) { /* sem seleção */ }
    R.clear();
    let html;
    if (area === 'aluno') html = TV.V.aluno(p.slice(1));
    else if (area === 'pedro') html = TV.V.pedro(p.slice(1));
    else html = entry();
    document.getElementById('app').innerHTML = html + (TV.present ? presentBar() : demoFab() + demoPanel()) + modalHtml();
    document.body.classList.toggle('presenting', !!TV.present);
    if (TV.present && area) ss.set('tv-last', location.hash);
    document.body.dataset.area = area || 'entry';
    if (routeChanged) { lastKey = key; window.scrollTo(0, 0); const s = document.getElementById('scr'); if (s) s.scrollTop = 0; }
    else { window.scrollTo(0, keep.win); const s = document.getElementById('scr'); if (s) s.scrollTop = keep.scr; }
    if (focusId) { const el = document.getElementById(focusId); if (el && el !== document.activeElement) { try { el.focus({ preventScroll: true }); if (sS != null && el.setSelectionRange) el.setSelectionRange(sS, sE); } catch (e) { /* ok */ } } }
    (TV.after || []).forEach((f) => { try { f(); } catch (e) { /* ok */ } });
    if (UI.modal && UI.modal.justOpened) { UI.modal.justOpened = false; const d = document.querySelector('.modal [data-autofocus], .modal .btn'); if (d) d.focus(); }
  }
  TV.render = render;

  /* ---------- tela de entrada ---------- */
  function entry() {
    const T = TV.today();
    return '<main class="entry"><div class="entry-in">' +
      '<div class="entry-brand">' + TV.logo('xl') + '<div><p class="eyebrow">Demonstração do aplicativo</p><h1 class="d hero">TeamVechi</h1></div></div>' +
      '<p class="lead">Escolha como você quer entrar. Os dois lados estão conectados: o que o Pedro publica aparece para o aluno, e o que o aluno registra chega para o Pedro.</p>' +
      '<div class="entry-cards">' +
      '<a class="entry-card" href="#/pedro/inicio" data-act="as" data-arg="pedro"><span class="ec-ico">' + U.ic('users', 28) + '</span><span class="ec-txt"><span class="eyebrow">Plataforma do personal</span><b class="d">Entrar como Pedro</b><span class="muted">Alunos, fichas, vídeos, alimentação, check-ins, financeiro e loja. Funciona no computador e no celular.</span></span>' + U.ic('fwd', 22) + '</a>' +
      '<a class="entry-card" href="#/aluno/inicio" data-act="as" data-arg="s-lucas"><span class="ec-ico">' + U.ic('db', 28) + '</span><span class="ec-txt"><span class="eyebrow">App do aluno</span><b class="d">Entrar como Lucas</b><span class="muted">Aluno de demonstração com 3 semanas de histórico: treinos, alimentação, check-ins e evolução.</span></span>' + U.ic('fwd', 22) + '</a>' +
      '</div>' +
      '<button class="linkbtn" data-act="as" data-arg="novo">' + U.ic('msg', 18) + ' Ver como um aluno novo recebe o convite e responde a anamnese</button>' +
      '<section class="entry-how"><h2 class="h3">O que dá para testar</h2><ol class="how">' +
      '<li><b>Treino:</b> o Pedro edita e publica a ficha; o Lucas treina, registra as séries e conclui; o Pedro recebe o registro.</li>' +
      '<li><b>Alimentação:</b> o Pedro publica as orientações e a meta de água; o Lucas registra refeições e água; o Pedro acompanha.</li>' +
      '<li><b>Check-in:</b> avance a data para sábado no painel <b>Demo</b>, envie peso e fotos como Lucas e revise como Pedro.</li>' +
      '<li><b>Loja:</b> o Pedro publica um cupom ou produto; o Lucas vê e usa na loja.</li>' +
      '<li><b>Assinatura:</b> o Pedro registra um pagamento; o Lucas confere no perfil.</li>' +
      '</ol><p class="muted sm">Data simulada da demonstração: <b>' + U.esc(U.longDate(T)) + '</b>. Dá para avançar os dias no botão Demo, no canto da tela.</p></section>' +
      '</div></main>';
  }

  /* ---------- painel da demonstração ---------- */
  function demoFab() {
    return '<button class="fab" data-act="demoToggle" aria-expanded="' + UI.demoOpen + '" aria-controls="demo-panel">' + U.ic('clock', 18) + '<span>Demo · ' + U.esc(U.dayLabel(TV.today())) + '</span></button>';
  }
  function demoPanel() {
    if (!UI.demoOpen) return '';
    const T = TV.today(), as = TV.S.ui.as, area = (parts()[0] || '');
    const who = (k, label, sub) => '<button class="who-btn' + ((k === 'pedro' && area === 'pedro') || (k === as && area === 'aluno') ? ' on' : '') + '" data-act="as" data-arg="' + k + '"><b>' + label + '</b><span>' + sub + '</span></button>';
    const sat = U.addDays(U.weekStart(T), 5), nextMon = U.addDays(U.weekStart(T), 7);
    return '<div class="dp-back" data-act="demoToggle"></div><aside class="demo-panel" id="demo-panel" role="dialog" aria-label="Painel da demonstração">' +
      '<div class="dp-head"><b class="d">Painel da demo</b><button class="icon-btn" data-act="demoToggle" aria-label="Fechar painel">' + U.ic('x', 20) + '</button></div>' +
      '<div class="dp-sec"><span class="lbl">Ver como</span><div class="who-grid">' + who('pedro', 'Pedro', 'Personal · plataforma') + who('s-lucas', 'Lucas', 'Aluno com histórico') + who('novo', 'Aluno novo', 'Convite e anamnese') + '</div></div>' +
      '<div class="dp-sec"><span class="lbl">Data simulada</span><div class="dp-date"><b class="d">' + U.esc(U.longDate(T)) + '</b><span class="muted sm">O check-in abre no sábado e fecha no domingo às 23h59.</span></div>' +
      '<div class="dp-btns"><button class="btn sm" data-act="dayPlus">+1 dia</button><button class="btn sm" data-act="setDay" data-arg="' + sat + '"' + (T >= sat ? ' disabled' : '') + '>Ir para sábado</button><button class="btn sm" data-act="setDay" data-arg="' + nextMon + '">Próxima segunda</button><button class="btn sm ghost" data-act="setDay" data-arg="' + TV.S.clock.start + '"' + (T === TV.S.clock.start ? ' disabled' : '') + '>Voltar à data inicial</button></div></div>' +
      '<div class="dp-sec"><label class="switch"><input type="checkbox" id="dp-offline" data-act-change="offline"' + (TV.S.net.offline ? ' checked' : '') + '><span class="sw"></span><span><b>Simular sem internet</b><br><span class="muted sm">Mostra o erro ao publicar, enviar ou concluir.</span></span></label></div>' +
      '<details class="dp-sec dp-roteiros"><summary><span class="lbl">Roteiros para apresentar</span>' + U.ic('down', 18) + '</summary><ol class="how sm">' +
      '<li><b>A · Treino:</b> Pedro › Treinos › ficha do Lucas › mude uma carga › Publicar. Lucas › Treino › Começar › registre as séries › Concluir exercício › Finalizar. Pedro › Início mostra o treino.</li>' +
      '<li><b>B · Alimentação:</b> Pedro › Alimentação › Lucas › edite uma refeição ou a meta de água › Publicar. Lucas › Alimentação › registre refeições e água. Pedro vê no acompanhamento.</li>' +
      '<li><b>C · Check-in:</b> Ir para sábado › Lucas › Início › Fazer check-in › envie. Pedro › Check-ins › revise. Lucas vê o feedback no Início.</li>' +
      '<li><b>D · Loja:</b> Pedro › Loja › Cupons › novo cupom › Publicar. Lucas › Loja › Parceiros e cupons › Copiar.</li>' +
      '<li><b>E · Assinatura:</b> Pedro › Financeiro › registre o pagamento de alguém. O aluno vê em Perfil › Plano.</li></ol></details>' +
      '<div class="dp-sec">' + (UI.confirmReset ? '<p class="sm">Isso apaga tudo o que foi feito na demonstração e volta aos dados iniciais.</p><div class="dp-btns"><button class="btn sm danger" data-act="resetDemo">Apagar e restaurar</button><button class="btn sm ghost" data-act="cancelReset">Cancelar</button></div>' : '<button class="btn sm ghost block" data-act="askReset">' + U.ic('reset', 16) + ' Restaurar dados de demonstração</button>') +
      '<p class="dim xs">Os registros ficam salvos só neste navegador.</p></div>' +
      '</aside>';
  }

  /* ---------- modo apresentação: roteiro guiado, sem o painel Demo ---------- */
  const ss = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { if (v == null) sessionStorage.removeItem(k); else sessionStorage.setItem(k, v); } catch (e) { /* ok */ } } };
  TV.present = false;
  TV.STEPS = [
    { t: 'Entrar como Pedro', h: 'O painel mostra alunos, pendências, alertas e os últimos treinos.', go: 'pedro/inicio' },
    { t: 'Abrir um aluno', h: 'Lucas: visão geral com ficha, check-in, adesão e financeiro.', go: 'pedro/alunos/s-lucas' },
    { t: 'Consultar a anamnese', h: 'Objetivo, rotina, lesões e o que ele respondeu no convite.', go: 'pedro/alunos/s-lucas/anamnese' },
    { t: 'Editar e publicar o treino', h: 'Mude uma carga ou repetição e toque em Publicar.', go: 'pedro/treinos/f-lucas' },
    { t: 'Abrir a visão do aluno', h: 'O Lucas vê o treino do dia e o que falta hoje.', as: 's-lucas', go: 'aluno/inicio' },
    { t: 'Executar e finalizar o treino', h: 'Marque o check de cada exercício ou abra um para anotar as séries. Depois, Finalizar.', go: 'aluno/treino' },
    { t: 'Registrar água e refeições', h: '+250 ml, e marque como foi cada refeição.', go: 'aluno/alimentacao' },
    { t: 'Enviar o check-in semanal', h: 'A data vai para sábado: preencha o peso, use as fotos de exemplo e envie.', sat: true, go: 'aluno/checkin' },
    { t: 'Voltar ao Pedro e ver os registros', h: 'O check-in chega para revisão; o treino aparece no Início.', go: 'pedro/checkins' },
    { t: 'Loja, cupons e assinatura', h: 'Cupons e produtos publicados pelo Pedro; pagamentos no Financeiro.', go: 'pedro/loja/cupons', more: [['Loja do aluno', 'aluno/loja', 's-lucas'], ['Financeiro', 'pedro/financeiro']] }
  ];
  function presentBar() {
    const cur = Math.min(TV.STEPS.length - 1, +(ss.get('tv-step') || 0)), open = !!UI.stepsOpen, st = TV.STEPS[cur];
    return '<aside class="pbar' + (open ? ' open' : '') + '" aria-label="Roteiro da demonstração">' +
      '<div class="pbar-head"><button class="pbar-tg" data-act="stepsToggle" aria-expanded="' + open + '" title="Ver todos os passos"><span class="pbar-n num">' + (cur + 1) + '/' + TV.STEPS.length + '</span><b>' + U.esc(st.t) + '</b>' + U.ic(open ? 'down' : 'up', 18) + '</button>' +
      '<button class="icon-btn" data-act="stepGo" data-arg="' + Math.max(0, cur - 1) + '" aria-label="Passo anterior"' + (cur === 0 ? ' disabled' : '') + '>' + U.ic('back', 18) + '</button><button class="icon-btn pri" data-act="stepGo" data-arg="' + Math.min(TV.STEPS.length - 1, cur + 1) + '" aria-label="Próximo passo"' + (cur === TV.STEPS.length - 1 ? ' disabled' : '') + '>' + U.ic('fwd', 18) + '</button></div>' +
      '<p class="pbar-hint">' + U.esc(st.h) + (st.more ? ' ' + st.more.map((m, i) => '<button class="linkbtn sm" data-act="stepMore" data-arg="' + cur + '|' + i + '">' + U.esc(m[0]) + '</button>').join(' ') : '') + '</p>' +
      (open ? '<ol class="pbar-list">' + TV.STEPS.map((x, i) => '<li><button data-act="stepGo" data-arg="' + i + '"' + (i === cur ? ' aria-current="step"' : '') + '><span class="num">' + (i + 1) + '</span>' + U.esc(x.t) + '</button></li>').join('') + '</ol>' +
        '<div class="pbar-foot"><a class="btn sm pri" href="apresentacao/index.html#demo">' + U.ic('screen', 16) + ' Voltar à apresentação</a>' + (UI.confirmReset ? '<button class="btn sm danger" data-act="resetDemo">Confirmar: apagar e restaurar</button><button class="btn sm ghost" data-act="cancelReset">Cancelar</button>' : '<button class="btn sm ghost" data-act="askReset">' + U.ic('reset', 16) + ' Reiniciar dados</button>') + '<a class="linkbtn sm" href="index.html?modo=normal#/">Sair do modo apresentação</a></div>' : '') +
      '</aside>';
  }
  TV.goStep = (i) => {
    const st = TV.STEPS[i]; if (!st) return;
    ss.set('tv-step', String(i)); UI.modal = null; UI.confirmReset = false; UI.stepsOpen = false;
    if (st.sat) { const T = TV.today(), sat = U.addDays(U.weekStart(T), 5); if (T < sat) { TV.setDate(sat); U.toast('Data simulada: ' + U.longDate(sat)); } }
    if (st.as) { TV.S.ui.as = st.as; TV.save(); }
    TV.go(st.go);
  };

  /* ---------- modais ---------- */
  function modalHtml() {
    if (!UI.modal) return '';
    const def = TV.M[UI.modal.kind];
    if (!def) return '';
    const m = def(UI.modal.data || {});
    return '<div class="modal-back" data-act="closeModal"></div><div class="modal' + (m.wide ? ' wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="modal-t"><div class="modal-head"><h2 class="d h2" id="modal-t">' + m.title + '</h2><button class="icon-btn" data-act="closeModal" aria-label="Fechar">' + U.ic('x', 20) + '</button></div><div class="modal-body">' + m.body + '</div>' + (m.foot ? '<div class="modal-foot">' + m.foot + '</div>' : '') + '</div>';
  }
  TV.openModal = (kind, data) => { UI.modal = { kind, data: data || {}, justOpened: true }; };

  /* ---------- ações gerais ---------- */
  Object.assign(TV.A, {
    as(k) {
      UI.demoOpen = false; UI.modal = null;
      if (k === 'pedro') { TV.go('pedro/inicio'); return false; }
      if (k === 'novo') {
        let s = TV.S.students.find((x) => !x.anamnese && x.status === 'convidado');
        if (!s) {
          s = { id: U.uid('s'), name: 'Marina Prado', phone: '(47) 90000-8888', email: 'marina@exemplo.com', status: 'convidado', planId: 'mensal', since: TV.today(), anamnese: null, invitedAt: TV.stamp() };
          TV.S.students.push(s);
          TV.S.payments.push({ id: U.uid('pay'), studentId: s.id, planId: 'mensal', amount: TV.plan('mensal').price, due: U.addDays(TV.today(), 1), status: 'aberto', paidAt: null, method: null });
          TV.log('Convite enviado para ' + U.firstName(s.name), s.id, 'aluno');
        }
        TV.S.ui.as = s.id; TV.save(); TV.go('aluno/novo/convite'); return false;
      }
      TV.S.ui.as = k; TV.save(); TV.go('aluno/inicio'); return false;
    },
    demoToggle() { UI.demoOpen = !UI.demoOpen; UI.confirmReset = false; },
    dayPlus() { TV.setDate(U.addDays(TV.today(), 1)); U.toast('Data simulada: ' + U.longDate(TV.today())); },
    setDay(iso) { TV.setDate(iso); U.toast('Data simulada: ' + U.longDate(iso)); },
    askReset() { UI.confirmReset = true; },
    cancelReset() { UI.confirmReset = false; },
    resetDemo() { TV.reset(); Object.keys(UI).forEach((k) => { if (!['demoOpen'].includes(k)) UI[k] = null; }); UI.demoOpen = false; const done = () => { U.toast('Dados de demonstração restaurados', 'ok'); if (TV.present) TV.goStep(0); else TV.go(''); render(); }; if (TV.clearAvatars) TV.clearAvatars().then(done, done); else done(); return false; },
    closeModal() { UI.modal = null; },
    netRetry() { const r = UI.netRetry; if (!r) return; if (!TV.online()) { U.toast('Ainda sem conexão. Desligue "Simular sem internet" no painel Demo.', 'err'); return; } UI.netRetry = null; const fn = TV.A[r.act]; if (fn) return fn(r.arg); },
    playDemo(id) { const e = TV.ex(id); const dur = e.video && e.video.dur ? parseInt(e.video.dur.split(':')[1], 10) || 40 : 40; UI.playing = { id, start: Date.now(), ms: Math.min(dur, 12) * 1000 }; },
    stopDemo() { UI.playing = null; },
    skipRest() { UI.rest = null; },
    stepsToggle() { UI.stepsOpen = !UI.stepsOpen; },
    stepGo(i) { TV.goStep(+i); return false; },
    stepMore(arg) { const [i, k] = arg.split('|').map(Number); const m = TV.STEPS[i].more[k]; if (m[2]) { TV.S.ui.as = m[2]; TV.save(); } TV.go(m[1]); return false; }
  });

  /* ---------- eventos globais ---------- */
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
    const fn = TV.A[el.dataset.act];
    if (!fn) return;
    e.preventDefault();
    const r = fn(el.dataset.arg, el, e);
    TV.saveSoon();
    if (r !== false) render();
  });
  function bind(el, isChange) {
    if (el.dataset.obj) {
      const o = R.get(el.dataset.obj);
      if (o) { let v = el.type === 'checkbox' ? el.checked : el.value; if (el.dataset.type === 'num') v = U.num(v); o[el.dataset.key] = v; TV.saveSoon(); }
    } else if (el.dataset.ui) {
      UI[el.dataset.ui] = el.type === 'checkbox' ? el.checked : el.value;
    }
    if ((isChange && el.dataset.rerender) || (!isChange && el.dataset.live)) render();
  }
  document.addEventListener('input', (e) => { if (e.target.dataset) bind(e.target, false); });
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.actChange === 'offline') { TV.S.net.offline = el.checked; TV.save(); U.toast(el.checked ? 'Modo sem internet ligado' : 'Conexão restaurada'); render(); return; }
    if (el.type === 'file') { const f = el.files && el.files[0]; const h = TV.F[el.dataset.file]; if (f && h) h(f, el.dataset.arg, el); el.value = ''; return; }
    bind(el, true);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (UI.modal) { UI.modal = null; render(); } else if (UI.demoOpen) { UI.demoOpen = false; render(); } else if (UI.sheet) { UI.sheet = false; render(); }
  });
  window.addEventListener('hashchange', () => { UI.sheet = false; UI.playing = null; render(); });

  /* timers: descanso entre séries e vídeo de demonstração */
  setInterval(() => {
    if (UI.rest) {
      const left = Math.max(0, Math.round((UI.rest.end - Date.now()) / 1000));
      const el = document.getElementById('rest-left'); if (el) el.textContent = U.mmss(left);
      if (left === 0) { UI.rest = null; const a = document.activeElement; if (!(a && a.matches && a.matches('input,textarea,select'))) render(); }
    }
    if (UI.playing) {
      const pct = Math.min(100, ((Date.now() - UI.playing.start) / UI.playing.ms) * 100);
      const b = document.getElementById('vplay-bar'); if (b) b.style.width = pct.toFixed(1) + '%';
      if (pct >= 100) { UI.playing = null; render(); }
    }
  }, 250);

  /* ---------- início ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    TV.load();
    TV.save();
    let started = false;
    const start = () => { if (started) return; started = true; render(); };
    const clear = TV.pendingClearAvatars && TV.clearAvatars ? TV.clearAvatars() : Promise.resolve();
    TV.pendingClearAvatars = false;
    if (TV.loadAvatars) { clear.then(() => TV.loadAvatars(), () => TV.loadAvatars()).then(start, start); setTimeout(start, 1500); } else start();
  });
  // ?modo=apresentacao liga o roteiro guiado (e esconde o painel Demo); ?modo=normal desliga; &reiniciar=1 volta aos dados iniciais
  (function () {
    let q; try { q = new URLSearchParams(location.search); } catch (e) { return; }
    if (q.get('modo') === 'apresentacao') { ss.set('tv-present', '1'); if (!ss.get('tv-step')) ss.set('tv-step', '0'); }
    if (q.get('modo') === 'normal') { ss.set('tv-present', null); ss.set('tv-step', null); }
    TV.present = ss.get('tv-present') === '1';
    if (q.has('passo')) ss.set('tv-step', String(Math.max(0, +q.get('passo') || 0)));
    if (q.get('continuar') === '1') { const last = ss.get('tv-last'); if (last && last.indexOf('#/') === 0 && !location.hash) { try { history.replaceState(null, '', location.pathname + last); } catch (e) { location.hash = last; } } }
    if (q.get('reiniciar') === '1') { try { localStorage.removeItem('teamvechi-demo-v1'); } catch (e) { /* ok */ } ss.set('tv-step', '0'); TV.pendingClearAvatars = true; }
    if (q.has('modo') || q.has('reiniciar') || q.has('passo') || q.has('continuar')) { try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) { /* file:// em alguns navegadores */ } }
  })();
})();
