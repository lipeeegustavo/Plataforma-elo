/* TeamVechi demo — estado compartilhado entre o app do aluno e a plataforma do Pedro.
   Tudo fica salvo no navegador (localStorage). Os dois lados leem e escrevem no mesmo estado. */
(function () {
  const TV = window.TV;
  const U = TV.U;
  const KEY = 'teamvechi-demo-v1';

  TV.blobs = {}; // vídeos enviados nesta sessão (não sobrevivem ao recarregar)

  TV.load = function () {
    let s = null;
    try { const raw = localStorage.getItem(KEY); if (raw) s = JSON.parse(raw); } catch (e) { s = null; }
    if (!s || s.v !== 1) s = TV.seed();
    TV.S = s;
  };
  let saveT = null;
  TV.saveSoon = function () { clearTimeout(saveT); saveT = setTimeout(TV.save, 250); };
  TV.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(TV.S)); TV.storageOk = true; return true; }
    catch (e) { TV.storageOk = false; U.toast('Não foi possível salvar no navegador. O armazenamento pode estar cheio ou bloqueado.', 'err'); return false; }
  };
  TV.reset = function () { TV.S = TV.seed(); TV.blobs = {}; TV.save(); };

  /* ---------- relógio simulado ---------- */
  TV.today = () => TV.S.clock.date;
  TV.stamp = () => TV.today() + 'T' + U.timeNow();
  TV.setDate = (iso) => { TV.S.clock.date = iso; TV.save(); };

  TV.log = function (text, sid, kind) {
    TV.S.events.unshift({ id: U.uid('ev'), at: TV.stamp(), text, sid: sid || '', kind: kind || 'info' });
    if (TV.S.events.length > 150) TV.S.events.length = 150;
  };

  /* ---------- seletores: alunos e treino ---------- */
  TV.stu = (id) => TV.S.students.find((s) => s.id === id) || null;
  TV.ex = (id) => TV.S.lib.find((e) => e.id === id) || { id, name: 'Exercício removido', group: '', equipment: '', video: null };
  TV.plan = (id) => TV.S.plans.find((p) => p.id === id) || TV.S.plans[0];
  TV.fichaOf = (sid) => TV.S.fichas.find((f) => f.studentId === sid) || null;
  TV.pub = (sid) => { const f = TV.fichaOf(sid); return f && f.published ? f : null; };
  TV.isDirty = (f) => !!(f && f.published) && JSON.stringify(f.draft) !== JSON.stringify({ name: f.published.name, weeks: f.published.weeks, start: f.published.start, treinos: f.published.treinos });
  TV.sessionsOf = (sid) => TV.S.sessions.filter((x) => x.studentId === sid);
  TV.doneSessions = (sid) => TV.sessionsOf(sid).filter((x) => x.status === 'concluida').sort((a, b) => ((b.date + b.endT) > (a.date + a.endT) ? 1 : -1));
  TV.openSession = (sid) => TV.sessionsOf(sid).find((x) => x.status === 'andamento') || null;
  TV.lastTrain = (sid) => { const d = TV.doneSessions(sid)[0]; return d ? d.date : null; };
  TV.daysSinceTrain = (sid) => { const l = TV.lastTrain(sid); return l == null ? null : U.diffDays(l, TV.today()); };
  TV.weekNum = (f) => { const p = f.published; return Math.max(1, Math.min(p.weeks, Math.floor(U.diffDays(p.start, TV.today()) / 7) + 1)); };
  TV.findItem = (f, itemId) => {
    if (!f) return null;
    for (const src of [f.published && f.published.treinos, f.draft.treinos]) {
      if (!src) continue;
      for (const t of src) { const it = t.items.find((i) => i.id === itemId); if (it) return { t, it }; }
    }
    return null;
  };
  TV.nextTreinoIdx = (sid) => {
    const f = TV.pub(sid); if (!f) return 0;
    const ts = f.published.treinos;
    const last = TV.doneSessions(sid).find((x) => ts.some((t) => t.id === x.treinoId));
    if (!last) return 0;
    return (ts.findIndex((t) => t.id === last.treinoId) + 1) % ts.length;
  };
  TV.plannedPerWeek = (sid) => { const s = TV.stu(sid); return s && s.anamnese ? parseInt(s.anamnese.dias, 10) || 3 : 3; };
  TV.weekSessions = (sid, ws) => TV.doneSessions(sid).filter((x) => x.date >= ws && x.date <= U.addDays(ws, 6));
  TV.sessionStats = (ses) => {
    let total = 0, done = 0, vol = 0, exDone = 0, exTotal = 0;
    Object.keys(ses.items).forEach((k) => {
      const it = ses.items[k]; exTotal++; if (it.done) exDone++;
      it.sets.forEach((s) => { total++; if (s.ok) { done++; vol += U.num(s.kg) * U.num(s.reps); } });
    });
    return { total, done, vol: Math.round(vol), exDone, exTotal };
  };
  TV.prevSet = (sid, itemId, i, excludeId) => {
    const s = TV.doneSessions(sid).find((x) => x.id !== excludeId && x.items[itemId] && x.items[itemId].sets[i] && x.items[itemId].sets[i].ok);
    if (!s) return null;
    return s.items[itemId].sets[i];
  };
  TV.bestByExercise = (sid) => {
    const f = TV.fichaOf(sid); const best = {};
    TV.doneSessions(sid).slice().reverse().forEach((x) => {
      Object.keys(x.items).forEach((itemId) => {
        const fi = TV.findItem(f, itemId); if (!fi) return;
        x.items[itemId].sets.forEach((s) => {
          if (!s.ok) return; const kg = U.num(s.kg); if (!kg) return;
          const b = best[fi.it.exId];
          if (!b || kg > b.kg) best[fi.it.exId] = { kg, reps: s.reps, date: x.date };
        });
      });
    });
    return best;
  };
  TV.loadSeries = (sid, exId) => {
    const f = TV.fichaOf(sid); const pts = [];
    TV.doneSessions(sid).slice().reverse().forEach((x) => {
      let mx = 0;
      Object.keys(x.items).forEach((itemId) => { const fi = TV.findItem(f, itemId); if (!fi || fi.it.exId !== exId) return; x.items[itemId].sets.forEach((s) => { if (s.ok) mx = Math.max(mx, U.num(s.kg)); }); });
      if (mx) pts.push({ label: U.dm(x.date), v: mx });
    });
    return pts;
  };
  TV.exercisesDone = (sid) => {
    const f = TV.fichaOf(sid); const ids = {};
    TV.doneSessions(sid).forEach((x) => Object.keys(x.items).forEach((itemId) => { const fi = TV.findItem(f, itemId); if (fi) ids[fi.it.exId] = true; }));
    return Object.keys(ids);
  };

  /* ---------- alimentação e água ---------- */
  TV.guideOf = (sid) => TV.S.guides.find((g) => g.studentId === sid) || null;
  TV.guidePub = (sid) => { const g = TV.guideOf(sid); return g && g.versions.length ? g.versions[g.versions.length - 1] : null; };
  TV.guideDirty = (g) => !!g && (!g.versions.length || JSON.stringify(g.draft) !== JSON.stringify({ meals: g.versions[g.versions.length - 1].meals, waterGoal: g.versions[g.versions.length - 1].waterGoal, notes: g.versions[g.versions.length - 1].notes }));
  TV.mealLog = (sid, date, mealId) => TV.S.mealLogs.find((l) => l.studentId === sid && l.date === date && l.mealId === mealId) || null;
  TV.mealLogsDay = (sid, date) => TV.S.mealLogs.filter((l) => l.studentId === sid && l.date === date);
  TV.waterDay = (sid, date) => TV.S.water.filter((w) => w.studentId === sid && w.date === date).sort((a, b) => (a.at > b.at ? 1 : -1));
  TV.waterTotal = (sid, date) => TV.waterDay(sid, date).reduce((a, w) => a + w.ml, 0);
  TV.waterGoal = (sid) => { const g = TV.guidePub(sid); return g ? g.waterGoal : 0; };
  TV.mealStats = (sid, from, to) => {
    const g = TV.guidePub(sid); if (!g || to < from) return null;
    let planned = 0, logged = 0, seguiu = 0, parcial = 0, nao = 0;
    for (let d = from; d <= to; d = U.addDays(d, 1)) {
      planned += g.meals.length;
      TV.mealLogsDay(sid, d).forEach((l) => { logged++; if (l.status === 'seguiu') seguiu++; else if (l.status === 'parcial' || l.status === 'substituiu') parcial++; else if (l.status === 'nao') nao++; });
    }
    return { planned, logged, seguiu, parcial, nao, pct: planned ? Math.round(((seguiu + 0.5 * parcial) / planned) * 100) : 0 };
  };
  TV.waterStats = (sid, from, to) => {
    const goal = TV.waterGoal(sid); if (to < from) return null;
    let days = 0, sum = 0, hit = 0;
    for (let d = from; d <= to; d = U.addDays(d, 1)) { const t = TV.waterTotal(sid, d); days++; sum += t; if (goal && t >= goal) hit++; }
    return { days, avg: days ? Math.round(sum / days) : 0, goal, hit };
  };

  /* ---------- check-in semanal (abre sábado, fecha domingo 23h59) ---------- */
  TV.checkinOf = (sid, ws) => TV.S.checkins.find((c) => c.studentId === sid && c.week === ws) || null;
  TV.checkinStatus = (sid, ws) => {
    const c = TV.checkinOf(sid, ws);
    if (c) return c.reviewedAt ? 'revisado' : 'enviado';
    const today = TV.today();
    if (today > U.addDays(ws, 6)) return 'nao_enviado';
    if (today >= U.addDays(ws, 5)) return 'pendente';
    return 'aguardando';
  };
  TV.CK_LABEL = { aguardando: 'Abre no sábado', pendente: 'Pendente', enviado: 'Enviado', nao_enviado: 'Não enviado', revisado: 'Revisado' };
  TV.consolidate = (sid, ws) => {
    const we = U.addDays(ws, 6);
    const to = TV.today() < we ? TV.today() : we;
    const meals = TV.mealStats(sid, ws, to);
    const water = TV.waterStats(sid, ws, to);
    return {
      treinos: TV.weekSessions(sid, ws).length, meta: TV.plannedPerWeek(sid),
      mealPct: meals ? meals.pct : null, mealsLogged: meals ? meals.logged : 0, mealsPlanned: meals ? meals.planned : 0,
      waterAvg: water && water.goal ? water.avg : null, waterGoal: water ? water.goal : null
    };
  };
  TV.prevCheckin = (sid, ws) => TV.S.checkins.filter((c) => c.studentId === sid && c.week < ws).sort((a, b) => (a.week < b.week ? 1 : -1))[0] || null;

  /* ---------- financeiro ---------- */
  TV.payStatus = (p) => (p.status === 'pago' ? 'pago' : p.due < TV.today() ? 'atrasado' : 'pendente');
  TV.paymentsOf = (sid) => TV.S.payments.filter((p) => p.studentId === sid).sort((a, b) => (a.due < b.due ? 1 : -1));
  TV.nextPayment = (sid) => TV.S.payments.filter((p) => p.studentId === sid && p.status !== 'pago').sort((a, b) => (a.due > b.due ? 1 : -1))[0] || null;
  TV.subStatus = (sid) => {
    const open = TV.nextPayment(sid);
    if (!open) return 'em_dia';
    const st = TV.payStatus(open);
    if (st === 'atrasado') return 'atrasado';
    return U.diffDays(TV.today(), open.due) <= 5 ? 'vence' : 'em_dia';
  };

  /* ---------- rede simulada (para demonstrar estados de erro) ---------- */
  TV.online = () => !TV.S.net.offline;
})();
