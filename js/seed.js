/* TeamVechi demo — dados fictícios de demonstração.
   A data simulada começa sempre numa quinta-feira, para o check-in do fim de semana estar a dois dias. */
(function () {
  const TV = window.TV;
  const U = TV.U;

  TV.seed = function () {
    const real = U.iso(new Date());
    const T = U.addDays(real, -((U.dow(real) - 4 + 7) % 7)); // quinta-feira de referência
    const W0 = U.weekStart(T);
    const ws = (k) => U.addDays(W0, 7 * k);
    const at = (d, hm) => d + 'T' + (hm || '10:00');
    let n = 0;
    const id = (p) => p + '-' + ++n;
    const rnd = U.rng(20261019);

    /* ---------- biblioteca de exercícios ---------- */
    const L = [
      ['supino-reto', 'Supino reto com barra', 'Peito', 'Barra', 1],
      ['supino-incl', 'Supino inclinado com halteres', 'Peito', 'Halteres', 1],
      ['crucifixo', 'Crucifixo na máquina', 'Peito', 'Máquina', 1],
      ['crossover', 'Crossover na polia', 'Peito', 'Polia', 0],
      ['puxada', 'Puxada frontal', 'Costas', 'Polia', 1],
      ['remada-curvada', 'Remada curvada com barra', 'Costas', 'Barra', 1],
      ['remada-cav', 'Remada cavalinho', 'Costas', 'Máquina', 0],
      ['desenv', 'Desenvolvimento com halteres', 'Ombros', 'Halteres', 1],
      ['elev-lat', 'Elevação lateral', 'Ombros', 'Halteres', 1],
      ['rosca-direta', 'Rosca direta', 'Bíceps', 'Barra', 1],
      ['rosca-martelo', 'Rosca martelo', 'Bíceps', 'Halteres', 0],
      ['triceps-corda', 'Tríceps na polia (corda)', 'Tríceps', 'Polia', 1],
      ['triceps-frances', 'Tríceps francês com halter', 'Tríceps', 'Halteres', 0],
      ['agachamento', 'Agachamento livre', 'Pernas', 'Barra', 1],
      ['leg-press', 'Leg press 45°', 'Pernas', 'Máquina', 1],
      ['extensora', 'Cadeira extensora', 'Pernas', 'Máquina', 1],
      ['flexora', 'Mesa flexora', 'Pernas', 'Máquina', 1],
      ['stiff', 'Stiff com barra', 'Pernas', 'Barra', 0],
      ['panturrilha', 'Panturrilha em pé', 'Pernas', 'Máquina', 1],
      ['prancha', 'Prancha', 'Core', 'Peso corporal', 1]
    ];
    const lib = L.map((r) => ({ id: r[0], name: r[1], group: r[2], equipment: r[3], video: r[4] ? { kind: 'demo', dur: '0:' + (30 + Math.floor(rnd() * 25)) } : null }));

    /* ---------- fichas ---------- */
    const S_ = (type, reps, kg, rir, rest) => ({ id: id('set'), type, reps, kg: kg === '' ? '' : String(kg), rir: String(rir), rest: String(rest) });
    const I_ = (exId, sets, note, prog) => ({ id: id('it'), exId, sets, note: note || '', prog: prog || { mode: 'dupla', rule: 'Fez o topo da faixa em todas as séries? Suba a carga na próxima.' } });
    const rep = (k, f) => Array.from({ length: k }, f);
    const r5 = (v) => Math.round(v * 2) / 2;
    function treinosABC(f) {
      const k = (v) => r5(v * f);
      return [
        { id: id('t'), letter: 'A', name: 'Peito e tríceps', items: [
          I_('supino-incl', [S_('top', '6–8', k(28), 1, 180), S_('back', '8–10', k(25), 2, 120), S_('back', '8–10', k(25), 2, 120)], 'Desça em 3 s e segure 1 s embaixo.', { mode: 'dupla', rule: 'Fez 8 reps no top set com RIR 1? Suba 2 kg por halter.' }),
          I_('supino-reto', rep(3, () => S_('valida', '8–10', k(50), 2, 120))),
          I_('crucifixo', rep(3, () => S_('valida', '12', k(25), 2, 60)), '', { mode: 'reps', rule: 'Chegue a 15 reps antes de subir a carga.' }),
          I_('triceps-corda', rep(3, () => S_('valida', '10–12', k(20), 1, 90)), 'Na última série, faça drop-set: tire 30% da carga e vá até a falha.'),
          I_('triceps-frances', rep(3, () => S_('valida', '10', k(12), 2, 60)))
        ] },
        { id: id('t'), letter: 'B', name: 'Costas e bíceps', items: [
          I_('puxada', [S_('top', '6–8', k(55), 1, 180), S_('back', '8–10', k(50), 2, 120), S_('back', '8–10', k(50), 2, 120)], 'Puxe até a barra encostar no peito, sem balançar o tronco.'),
          I_('remada-curvada', rep(3, () => S_('valida', '8–10', k(40), 2, 120))),
          I_('remada-cav', rep(3, () => S_('valida', '10', k(35), 2, 90))),
          I_('rosca-direta', rep(3, () => S_('valida', '10–12', k(25), 1, 60))),
          I_('rosca-martelo', rep(3, () => S_('valida', '12', k(12), 2, 60)))
        ] },
        { id: id('t'), letter: 'C', name: 'Pernas e ombros', items: [
          I_('agachamento', [S_('aquec', '10', k(40), '', 60), S_('top', '5–6', k(80), 1, 180), S_('back', '8', k(70), 2, 150), S_('back', '8', k(70), 2, 150)], 'Desça até a coxa passar da paralela.', { mode: 'carga', rule: 'Bateu 6 reps no top set? Suba 2,5 kg.' }),
          I_('leg-press', rep(3, () => S_('valida', '12', k(160), 2, 90))),
          I_('flexora', rep(3, () => S_('valida', '12', k(35), 2, 60))),
          I_('desenv', rep(3, () => S_('valida', '10', k(16), 2, 90))),
          I_('elev-lat', rep(3, () => S_('valida', '15', k(8), 1, 60)), '', { mode: 'reps', rule: 'Chegue a 18 reps antes de subir a carga.' })
        ] }
      ];
    }
    const fichas = [];
    function mkFicha(sid, name, start, f, version, notes) {
      const tr = treinosABC(f);
      const fi = {
        id: 'f-' + sid.slice(2), studentId: sid, status: 'publicada', version,
        draft: { name, weeks: 6, start, treinos: tr },
        published: { version, at: at(start, '08:00'), name, weeks: 6, start, treinos: U.clone(tr) },
        history: (notes || ['Primeira ficha publicada']).map((t, i) => ({ version: i + 1, at: at(i === 0 ? start : ws(-1), '08:00'), note: t }))
      };
      fichas.push(fi);
      return fi;
    }

    /* ---------- alunos ---------- */
    const students = [
      { id: 's-lucas', name: 'Lucas Martins', phone: '(47) 90000-1111', email: 'lucas@exemplo.com', status: 'ativo', planId: 'trimestral', since: U.addDays(ws(-3), -5),
        anamnese: { objetivo: 'Hipertrofia', dias: '3', local: 'Academia', rotina: 'Trabalho em escritório das 8h às 17h. Treino depois do trabalho.', horario: 'Noite', tempo: '60 min', dores: ['Ombro'], doresObs: 'Incômodo leve no ombro direito no supino.', refeicoes: '4', restricoes: 'Nenhuma', agua: 'Cerca de 1,5 L por dia', peso: '80,2', altura: '178', at: at(U.addDays(ws(-3), -5), '19:20') } },
      { id: 's-ana', name: 'Ana Souza', phone: '(47) 90000-2222', email: 'ana@exemplo.com', status: 'ativo', planId: 'mensal', since: ws(-6),
        anamnese: { objetivo: 'Emagrecimento', dias: '4', local: 'Academia', rotina: 'Trabalha em home office.', horario: 'Manhã', tempo: '50 min', dores: [], doresObs: '', refeicoes: '5', restricoes: 'Intolerância a lactose', agua: 'Cerca de 2 L por dia', peso: '66,0', altura: '165', at: at(ws(-6)) } },
      { id: 's-bruno', name: 'Bruno Lima', phone: '(47) 90000-3333', email: 'bruno@exemplo.com', status: 'ativo', planId: 'mensal', since: ws(-8),
        anamnese: { objetivo: 'Hipertrofia', dias: '4', local: 'Academia', rotina: 'Turnos alternados no trabalho.', horario: 'Varia', tempo: '60 min', dores: ['Lombar'], doresObs: 'Dor lombar às vezes, depois de dirigir muito.', refeicoes: '3', restricoes: 'Nenhuma', agua: 'Menos de 1 L', peso: '86,4', altura: '182', at: at(ws(-8)) } },
      { id: 's-carla', name: 'Carla Dias', phone: '(47) 90000-4444', email: 'carla@exemplo.com', status: 'ativo', planId: 'trimestral', since: ws(-10),
        anamnese: { objetivo: 'Força', dias: '3', local: 'Academia', rotina: 'Estudante, aulas à tarde.', horario: 'Manhã', tempo: '75 min', dores: [], doresObs: '', refeicoes: '4', restricoes: 'Vegetariana', agua: 'Cerca de 2 L por dia', peso: '61,5', altura: '168', at: at(ws(-10)) } },
      { id: 's-diego', name: 'Diego Rocha', phone: '(47) 90000-5555', email: 'diego@exemplo.com', status: 'ativo', planId: 'mensal', since: ws(-5),
        anamnese: { objetivo: 'Condicionamento', dias: '3', local: 'Academia', rotina: 'Comerciante, horário flexível.', horario: 'Tarde', tempo: '45 min', dores: ['Joelho'], doresObs: 'Dor no joelho esquerdo ao agachar fundo.', refeicoes: '3', restricoes: 'Nenhuma', agua: 'Cerca de 1,5 L por dia', peso: '92,0', altura: '176', at: at(ws(-5)) } },
      { id: 's-fernanda', name: 'Fernanda Alves', phone: '(47) 90000-6666', email: 'fernanda@exemplo.com', status: 'convidado', planId: 'mensal', since: U.addDays(T, -1), anamnese: null, invitedAt: at(U.addDays(T, -1), '16:40') },
      { id: 's-gabriel', name: 'Gabriel Costa', phone: '(47) 90000-7777', email: 'gabriel@exemplo.com', status: 'pausado', planId: 'mensal', since: ws(-12),
        anamnese: { objetivo: 'Hipertrofia', dias: '3', local: 'Academia', rotina: 'Viaja muito a trabalho.', horario: 'Noite', tempo: '60 min', dores: [], doresObs: '', refeicoes: '4', restricoes: 'Nenhuma', agua: 'Cerca de 1,5 L por dia', peso: '78,0', altura: '180', at: at(ws(-12)) } }
    ];

    const fL = mkFicha('s-lucas', 'Ficha 1 — Hipertrofia', ws(-3), 1, 2, ['Primeira ficha publicada', 'Carga do supino inclinado e do agachamento ajustada']);
    const fA = mkFicha('s-ana', 'Ficha 2 — Emagrecimento', ws(-2), 0.55, 1);
    const fB = mkFicha('s-bruno', 'Ficha 2 — Hipertrofia', ws(-3), 1.1, 1);
    const fC = mkFicha('s-carla', 'Ficha 3 — Força', ws(-4), 0.7, 1);
    const fD = mkFicha('s-diego', 'Ficha 1 — Condicionamento', ws(-5), 0.9, 1);
    const fG = mkFicha('s-gabriel', 'Ficha 1 — Hipertrofia', ws(-8), 0.95, 1);

    /* ---------- sessões de treino ---------- */
    const sessions = [];
    function mkSession(fi, sid, date, ti, prog, comment, hm) {
      const t = fi.published.treinos[ti];
      const items = {};
      t.items.forEach((it) => {
        items[it.id] = { done: true, sets: it.sets.map((s) => {
          const base = U.num(s.kg);
          const inc = base >= 40 ? 2.5 : base >= 15 ? 1 : 0.5;
          const kg = base ? r5(base - inc * prog) : '';
          const top = parseInt(U.firstNum(s.reps), 10) || 10;
          return { kg: kg === '' ? '' : String(kg).replace('.', ','), reps: String(top + (rnd() < 0.45 ? 1 : 0)), rir: s.rir, ok: true };
        }) };
      });
      const dur = 46 + Math.floor(rnd() * 18);
      const st = hm || '18:40';
      const [h, m] = st.split(':').map(Number);
      const endMin = h * 60 + m + dur;
      sessions.push({ id: id('ses'), studentId: sid, fichaId: fi.id, ver: fi.version, treinoId: t.id, label: t.letter + ' · ' + t.name, date, status: 'concluida', startT: st, endT: U.pad(Math.floor(endMin / 60) % 24) + ':' + U.pad(endMin % 60), durationMin: dur, items, comment: comment || '' });
    }
    // Lucas: seg/qua/sex há 3 semanas; perdeu uma sexta; esta semana fez seg e qua
    [-3, -2, -1, 0].forEach((k) => {
      [0, 2, 4].forEach((d, i) => {
        if (k === -2 && d === 4) return;
        if (k === 0 && d >= 3) return;
        const comment = k === -1 && i === 0 ? 'O ombro incomodou um pouco no inclinado, mas fechei todas as séries.' : k === 0 && i === 1 ? 'Treino bom! A puxada rendeu bem hoje.' : '';
        mkSession(fL, 's-lucas', U.addDays(ws(k), d), i, 0 - k, comment);
      });
    });
    // outros alunos
    [[-1, 0, 0], [-1, 1, 1], [-1, 3, 2], [-1, 5, 0], [0, 0, 1], [0, 1, 2], [0, 3, 0]].forEach((r) => mkSession(fA, 's-ana', U.addDays(ws(r[0]), r[1]), r[2], 0, '', '07:10'));
    mkSession(fB, 's-bruno', U.addDays(T, -9), 0, 1, '', '20:00');
    mkSession(fB, 's-bruno', U.addDays(T, -6), 1, 0, 'Semana puxada no trabalho, vou tentar voltar logo.', '21:10');
    [[-1, 0, 0], [-1, 2, 1], [-1, 4, 2], [0, 0, 0], [0, 2, 1]].forEach((r) => mkSession(fC, 's-carla', U.addDays(ws(r[0]), r[1]), r[2], 0, r[0] === 0 && r[1] === 2 ? 'Bati recorde no agachamento!' : '', '07:30'));
    [[-1, 1, 0], [-1, 3, 1], [0, 1, 2]].forEach((r) => mkSession(fD, 's-diego', U.addDays(ws(r[0]), r[1]), r[2], 0, r[0] === 0 ? 'O joelho ficou bem com o leg press no lugar do agachamento.' : '', '15:00'));
    mkSession(fG, 's-gabriel', U.addDays(T, -21), 0, 0, '', '19:00');

    /* ---------- orientações alimentares (gerais, do Pedro) ---------- */
    const mealsBase = () => [
      { id: id('m'), name: 'Café da manhã', time: '07:00', guidance: 'Uma fonte de proteína, um carboidrato e uma fruta.', options: ['Ovos mexidos com pão integral e banana', 'Iogurte natural com aveia e mamão', 'Tapioca com queijo branco e café'] },
      { id: id('m'), name: 'Lanche da manhã', time: '10:00', guidance: 'Uma fruta com uma fonte de proteína ou gordura boa.', options: ['Maçã e castanhas', 'Iogurte natural'] },
      { id: id('m'), name: 'Almoço', time: '12:30', guidance: 'Metade do prato com salada e legumes, um quarto com proteína e um quarto com carboidrato.', options: ['Arroz, feijão, frango e salada', 'Batata, carne magra e legumes'] },
      { id: id('m'), name: 'Pré-treino', time: '17:30', guidance: 'Algo leve e fácil de digerir, cerca de 1 hora antes do treino.', options: ['Banana com aveia', 'Pão com pasta de amendoim'] },
      { id: id('m'), name: 'Jantar', time: '20:30', guidance: 'Mesma lógica do almoço, em porção um pouco menor.', options: ['Omelete com legumes', 'Peixe com arroz e salada'] }
    ];
    const NOTE = 'Orientações gerais. Para um plano alimentar individual, com quantidades, procure um(a) nutricionista.';
    const gL = mealsBase();
    const gA = mealsBase().filter((m) => m.name !== 'Pré-treino');
    const guides = [
      { id: 'g-lucas', studentId: 's-lucas', draft: { meals: U.clone(gL), waterGoal: 3000, notes: NOTE }, versions: [{ version: 1, at: at(ws(-3), '08:30'), meals: gL, waterGoal: 3000, notes: NOTE }] },
      { id: 'g-ana', studentId: 's-ana', draft: { meals: U.clone(gA), waterGoal: 2500, notes: NOTE }, versions: [{ version: 1, at: at(ws(-2), '08:30'), meals: gA, waterGoal: 2500, notes: NOTE }] }
    ];
    const mealLogs = [];
    const notesBy = { parcial: ['Comi só metade', 'Pulei a fruta', 'Sem o carboidrato'], substituiu: ['Troquei o frango por carne moída', 'Pão francês no lugar do integral', 'Mandioca no lugar do arroz'], outra: ['Almoço de aniversário no trabalho', 'Lanche na rua: misto quente e suco', 'Pizza com a família'] };
    function logMeals(sid, g, from, to, todayCount) {
      for (let d = from; d <= to; d = U.addDays(d, 1)) {
        g.meals.forEach((m, i) => {
          if (d === to && todayCount != null && i >= todayCount) return;
          const r = rnd();
          if (d !== to && r < 0.08) return; // refeição sem registro
          const x = rnd();
          const status = x < 0.62 ? 'seguiu' : x < 0.76 ? 'parcial' : x < 0.87 ? 'substituiu' : x < 0.93 ? 'outra' : 'nao';
          const pool = notesBy[status];
          mealLogs.push({ id: id('ml'), studentId: sid, date: d, mealId: m.id, mealName: m.name, guideV: 1, status, option: status === 'seguiu' ? Math.floor(rnd() * m.options.length) : null, note: pool ? pool[Math.floor(rnd() * pool.length)] : '', at: at(d, m.time) });
        });
      }
    }
    logMeals('s-lucas', guides[0].versions[0], ws(-3), T, 2);
    logMeals('s-ana', guides[1].versions[0], ws(-2), U.addDays(T, -1), null);
    const water = [];
    function logWater(sid, from, to, lo, hi, todayMl) {
      for (let d = from; d <= to; d = U.addDays(d, 1)) {
        let total = d === to && todayMl != null ? todayMl : lo + Math.round((rnd() * (hi - lo)) / 250) * 250;
        let h = 8;
        while (total > 0) { const ml = total >= 500 && rnd() < 0.7 ? 500 : 250; water.push({ id: id('w'), studentId: sid, date: d, ml, at: at(d, U.pad(h) + ':' + U.pad(Math.floor(rnd() * 59))) }); total -= ml; h = Math.min(22, h + 2); }
      }
    }
    logWater('s-lucas', ws(-3), T, 2000, 3250, 1000);
    logWater('s-ana', ws(-2), U.addDays(T, -1), 1750, 2750, null);

    /* ---------- check-ins semanais ---------- */
    const checkins = [
      { id: id('ck'), studentId: 's-lucas', week: ws(-3), sentAt: at(U.addDays(ws(-3), 6), '20:10'), peso: '79,6', photos: { frente: 'demo:frente:0', lado: 'demo:lado:0', costas: 'demo:costas:0' }, dores: 'O ombro direito incomodou no supino inclinado.', comentario: 'Primeira semana, gostei muito da ficha!', cons: { treinos: 3, meta: 3, mealPct: 71, mealsLogged: 30, mealsPlanned: 35, waterAvg: 2430, waterGoal: 3000 }, reviewedAt: at(ws(-2), '09:05'), feedback: 'Ótima primeira semana, Lucas! Mantém a descida controlada no inclinado e me avisa se o ombro piorar.' },
      { id: id('ck'), studentId: 's-lucas', week: ws(-1), sentAt: at(U.addDays(ws(-1), 6), '19:30'), peso: '78,9', photos: { frente: 'demo:frente:2', lado: 'demo:lado:2', costas: 'demo:costas:2' }, dores: '', comentario: 'Semana corrida no trabalho, mas fiz os três treinos. Posso trocar o crucifixo pelo crossover?', cons: { treinos: 3, meta: 3, mealPct: 79, mealsLogged: 33, mealsPlanned: 35, waterAvg: 2680, waterGoal: 3000 }, reviewedAt: null, feedback: '' },
      { id: id('ck'), studentId: 's-ana', week: ws(-2), sentAt: at(U.addDays(ws(-2), 5), '10:00'), peso: '65,1', photos: { frente: 'demo:frente:1', lado: 'demo:lado:1', costas: 'demo:costas:1' }, dores: '', comentario: 'Consegui manter as refeições.', cons: { treinos: 4, meta: 4, mealPct: 82, mealsLogged: 26, mealsPlanned: 28, waterAvg: 2300, waterGoal: 2500 }, reviewedAt: at(ws(-1), '08:40'), feedback: 'Excelente, Ana! Vamos manter assim.' },
      { id: id('ck'), studentId: 's-ana', week: ws(-1), sentAt: at(U.addDays(ws(-1), 6), '11:20'), peso: '64,2', photos: { frente: 'demo:frente:3', lado: 'demo:lado:3', costas: 'demo:costas:3' }, dores: '', comentario: 'Semana boa, fiz os quatro treinos.', cons: { treinos: 4, meta: 4, mealPct: 85, mealsLogged: 27, mealsPlanned: 28, waterAvg: 2410, waterGoal: 2500 }, reviewedAt: null, feedback: '' },
      { id: id('ck'), studentId: 's-carla', week: ws(-1), sentAt: at(U.addDays(ws(-1), 6), '18:00'), peso: '61,8', photos: { frente: 'demo:frente:1', lado: 'demo:lado:1', costas: 'demo:costas:1' }, dores: '', comentario: 'Agachamento subindo bem.', cons: { treinos: 3, meta: 3, mealPct: null, waterAvg: null, waterGoal: null }, reviewedAt: at(ws(0), '09:30'), feedback: 'Muito bom, Carla. Semana que vem a gente testa 2,5 kg a mais no top set.' },
      { id: id('ck'), studentId: 's-diego', week: ws(-1), sentAt: at(U.addDays(ws(-1), 5), '16:00'), peso: '91,2', photos: { frente: 'demo:frente:0', lado: 'demo:lado:0', costas: 'demo:costas:0' }, dores: 'O joelho esquerdo doeu no agachamento.', comentario: '', cons: { treinos: 2, meta: 3, mealPct: null, waterAvg: null, waterGoal: null }, reviewedAt: at(ws(0), '10:10'), feedback: 'Troquei o agachamento pelo leg press nesta semana. Me conta como o joelho reage.' }
    ];

    /* ---------- mensalidades ---------- */
    const plans = [
      { id: 'mensal', name: 'Mensal', price: 200, months: 1 },
      { id: 'trimestral', name: 'Trimestral', price: 540, months: 3 }
    ];
    const payments = [];
    const pay = (sid, planId, due, paid, method) => payments.push({ id: id('pay'), studentId: sid, planId, amount: plans.find((p) => p.id === planId).price, due, status: paid ? 'pago' : 'aberto', paidAt: paid ? due : null, method: paid ? method || 'PIX' : null });
    const dL = U.addDays(ws(-3), -5);
    pay('s-lucas', 'trimestral', dL, true, 'PIX'); pay('s-lucas', 'trimestral', U.addMonths(dL, 3), false);
    pay('s-ana', 'mensal', U.addDays(T, -40), true); pay('s-ana', 'mensal', U.addDays(T, -10), true, 'Cartão'); pay('s-ana', 'mensal', U.addDays(T, 20), false);
    pay('s-bruno', 'mensal', U.addDays(T, -35), true); pay('s-bruno', 'mensal', U.addDays(T, -5), false);
    pay('s-carla', 'trimestral', U.addDays(T, -30), true, 'Cartão'); pay('s-carla', 'trimestral', U.addDays(T, 60), false);
    pay('s-diego', 'mensal', U.addDays(T, -28), true); pay('s-diego', 'mensal', U.addDays(T, 2), false);
    pay('s-fernanda', 'mensal', U.addDays(T, 1), false);
    pay('s-gabriel', 'mensal', U.addDays(T, -50), true);

    /* ---------- loja e parceiros ---------- */
    const products = [
      { id: 'p-camiseta', name: 'Camiseta TeamVechi', price: 89.9, desc: 'Algodão com elastano e corte esportivo. Estampa TeamVechi no peito.', sizes: ['P', 'M', 'G', 'GG'], art: 'camiseta', img: null, available: true, published: true },
      { id: 'p-regata', name: 'Regata Dry TeamVechi', price: 79.9, desc: 'Tecido leve que seca rápido, ideal para treinos intensos.', sizes: ['P', 'M', 'G', 'GG'], art: 'regata', img: null, available: true, published: true },
      { id: 'p-bone', name: 'Boné TeamVechi', price: 69.9, desc: 'Aba curva, regulagem traseira e logo bordado.', sizes: ['Único'], art: 'bone', img: null, available: true, published: true },
      { id: 'p-garrafa', name: 'Garrafa térmica 1 L', price: 59.9, desc: 'Mantém a água gelada por até 12 horas.', sizes: ['Único'], art: 'garrafa', img: null, available: true, published: true },
      { id: 'p-coqueteleira', name: 'Coqueteleira TeamVechi', price: 39.9, desc: '600 ml com mola misturadora.', sizes: ['Único'], art: 'coqueteleira', img: null, available: false, published: true },
      { id: 'p-toalha', name: 'Toalha de treino', price: 34.9, desc: 'Microfibra, 40 × 80 cm.', sizes: ['Único'], art: 'toalha', img: null, available: true, published: false }
    ];
    const partners = [
      { id: 'pa-mar', name: 'Mar Aberto Suplementos', desc: 'Suplementos e alimentação saudável', link: 'loja-parceira.exemplo/mar-aberto' },
      { id: 'pa-passo', name: 'Passo Firme Calçados', desc: 'Tênis de corrida e treino', link: 'loja-parceira.exemplo/passo-firme' },
      { id: 'pa-ponto', name: 'Ponto Zero Fisioterapia', desc: 'Fisioterapia esportiva e avaliação postural', link: 'loja-parceira.exemplo/ponto-zero' }
    ];
    const coupons = [
      { id: id('cp'), partnerId: 'pa-mar', code: 'VECHI10', discount: '10% em toda a loja', until: U.addDays(T, 30), published: true },
      { id: id('cp'), partnerId: 'pa-passo', code: 'TEAMVECHI15', discount: '15% em tênis de corrida', until: U.addDays(T, 12), published: true },
      { id: id('cp'), partnerId: 'pa-ponto', code: 'AVALIA-TV', discount: 'Avaliação postural grátis', until: U.addDays(T, -3), published: true }
    ];

    const events = [
      { id: id('ev'), at: at(U.addDays(T, -1), '19:52'), text: 'Lucas concluiu o Treino B · "Treino bom! A puxada rendeu bem hoje."', sid: 's-lucas', kind: 'treino' },
      { id: id('ev'), at: at(U.addDays(T, -1), '16:40'), text: 'Convite enviado para Fernanda', sid: 's-fernanda', kind: 'aluno' },
      { id: id('ev'), at: at(U.addDays(T, -2), '14:20'), text: 'Carla quer comprar: Camiseta TeamVechi (M)', sid: 's-carla', kind: 'loja' },
      { id: id('ev'), at: at(U.addDays(ws(-1), 6), '19:30'), text: 'Lucas enviou o check-in da semana', sid: 's-lucas', kind: 'checkin' },
      { id: id('ev'), at: at(U.addDays(ws(-1), 6), '11:20'), text: 'Ana enviou o check-in da semana', sid: 's-ana', kind: 'checkin' }
    ];

    return {
      v: 1,
      clock: { date: T, start: T },
      net: { offline: false },
      pedro: { name: 'Pedro', phone: '(47) 90000-0000' },
      ui: { as: 's-lucas' },
      plans, students, lib, fichas, sessions, guides, mealLogs, water, checkins, payments,
      products, partners, coupons,
      orders: [{ id: id('or'), studentId: 's-carla', productId: 'p-camiseta', size: 'M', at: at(U.addDays(T, -2), '14:20') }],
      notices: [{ id: id('nt'), text: 'Feriado na próxima segunda: a academia abre só das 8h às 12h. Quem não conseguir ir, faz o treino no domingo.', at: at(U.addDays(T, -1), '09:15') }],
      tips: [
        { id: 'tip1', kind: 'Execução', title: 'Por que a descida lenta importa', body: 'Controlar a descida aumenta o tempo sob tensão e protege as articulações. Conte 3 segundos descendo em todos os exercícios.', dur: '1:12' },
        { id: 'tip2', kind: 'Motivação', title: 'Constância vence intensidade', body: 'Três treinos bons por semana, todas as semanas, fazem mais por você do que uma semana perfeita seguida de duas paradas.' },
        { id: 'tip3', kind: 'Recuperação', title: 'Sono também é treino', body: 'É dormindo que o músculo se recupera. Tente manter de 7 a 8 horas por noite.' }
      ],
      events
    };
  };
})();
