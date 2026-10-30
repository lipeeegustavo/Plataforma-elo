/* TeamVechi demo — foto de perfil (aluno e Pedro).
   Seleciona do dispositivo, recorta em círculo (arrastar + zoom), salva otimizada (JPEG 320×320)
   no IndexedDB do navegador. Se o IndexedDB não estiver disponível, usa o localStorage. */
(function () {
  const TV = window.TV;
  const U = TV.U;
  const UI = TV.UI;
  const A = TV.A;
  const e_ = U.esc;
  const DB = 'teamvechi-demo', STORE = 'avatars', LSK = 'tv-avatar-';
  const OUT = 320;   // lado da imagem salva (px)
  const VIEW = 280;  // lado da área de recorte na tela (px)
  const MAX_MB = 15;

  TV.PEDRO = { id: 'pedro', name: 'Pedro' };
  TV.avatars = {}; // id do usuário → URL da imagem (blob: ou data:)
  TV.avatarMode = 'idb';

  /* ---------- armazenamento ---------- */
  let dbp = null;
  function db() {
    if (dbp) return dbp;
    dbp = new Promise((res, rej) => {
      try {
        if (!window.indexedDB) throw new Error('IndexedDB indisponível');
        const r = indexedDB.open(DB, 1);
        r.onupgradeneeded = () => r.result.createObjectStore(STORE);
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
        r.onblocked = () => rej(new Error('IndexedDB bloqueado'));
      } catch (err) { rej(err); }
    });
    return dbp;
  }
  function req(mode, fn) {
    return db().then((d) => new Promise((res, rej) => {
      const t = d.transaction(STORE, mode);
      const r = fn(t.objectStore(STORE));
      t.oncomplete = () => res(r ? r.result : undefined);
      t.onerror = () => rej(t.error);
      t.onabort = () => rej(t.error || new Error('Transação cancelada'));
    }));
  }
  const blobToDataURL = (b) => new Promise((res, rej) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = () => rej(fr.error); fr.readAsDataURL(b); });
  const lsKeys = () => { const ks = []; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.indexOf(LSK) === 0) ks.push(k); } } catch (e) { /* sem acesso */ } return ks; };
  const Store = {
    async all() {
      const out = {};
      try {
        const d = await db();
        await new Promise((res, rej) => {
          const c = d.transaction(STORE, 'readonly').objectStore(STORE).openCursor();
          c.onsuccess = () => { const cur = c.result; if (cur) { out[cur.key] = cur.value; cur.continue(); } else res(); };
          c.onerror = () => rej(c.error);
        });
      } catch (e) { TV.avatarMode = 'ls'; }
      lsKeys().forEach((k) => { if (!out[k.slice(LSK.length)]) out[k.slice(LSK.length)] = localStorage.getItem(k); });
      return out;
    },
    async put(id, blob) {
      if (TV.avatarMode === 'idb') {
        try { await req('readwrite', (s) => s.put(blob, id)); try { localStorage.removeItem(LSK + id); } catch (e) { /* ok */ } return URL.createObjectURL(blob); }
        catch (e) { TV.avatarMode = 'ls'; }
      }
      const url = await blobToDataURL(blob);
      localStorage.setItem(LSK + id, url); // pode lançar se o armazenamento estiver cheio
      return url;
    },
    async del(id) {
      try { await req('readwrite', (s) => s.delete(id)); } catch (e) { /* sem IndexedDB */ }
      try { localStorage.removeItem(LSK + id); } catch (e) { /* ok */ }
    },
    async clear() {
      try { await req('readwrite', (s) => s.clear()); } catch (e) { /* sem IndexedDB */ }
      lsKeys().forEach((k) => { try { localStorage.removeItem(k); } catch (e) { /* ok */ } });
    }
  };
  TV.avatarStore = Store;
  const revoke = (url) => { if (url && url.indexOf('blob:') === 0) URL.revokeObjectURL(url); };

  TV.loadAvatars = async function () {
    const all = await Store.all();
    Object.keys(TV.avatars).forEach((k) => revoke(TV.avatars[k]));
    TV.avatars = {};
    Object.keys(all).forEach((k) => { const v = all[k]; if (!v) return; TV.avatars[k] = typeof v === 'string' ? v : URL.createObjectURL(v); });
  };
  TV.clearAvatars = async function () {
    await Store.clear();
    Object.keys(TV.avatars).forEach((k) => revoke(TV.avatars[k]));
    TV.avatars = {};
  };
  TV.hasPhoto = (id) => !!TV.avatars[id];

  /* ---------- componentes ---------- */
  const userOf = (id) => (id === 'pedro' ? TV.PEDRO : TV.stu(id));
  // botão com avatar + selo de câmera, abre o editor
  TV.avatarEdit = (user, cls) => '<button class="av-edit" data-act="openPhoto" data-arg="' + user.id + '" aria-label="' + (TV.hasPhoto(user.id) ? 'Trocar ou remover a foto de perfil' : 'Adicionar foto de perfil') + '">' + TV.avatar(user, cls || 'xl') + '<span class="av-cam" aria-hidden="true">' + U.ic('camera', 15) + '</span></button>';
  TV.photoCard = (user, note) => {
    const has = TV.hasPhoto(user.id);
    return '<section class="card photo-card"><div class="row">' + TV.avatarEdit(user, 'xl') + '<div class="grow"><b>Foto de perfil</b><br><span class="muted sm">' + e_(note || (has ? 'Aparece em todas as telas do app.' : 'Sem foto: mostramos as suas iniciais.')) + '</span></div></div><div class="row"><button class="btn sm pri" data-act="openPhoto" data-arg="' + user.id + '">' + U.ic('camera', 16) + (has ? ' Trocar foto' : ' Adicionar foto') + '</button>' + (has ? '<button class="btn sm ghost" data-act="photoRemoveAsk" data-arg="' + user.id + '">' + U.ic('trash', 16) + ' Remover</button>' : '') + '</div></section>';
  };

  /* ---------- recorte ---------- */
  function geo(c) {
    const s = (VIEW / Math.min(c.nw, c.nh)) * c.zoom;
    return { s, dw: c.nw * s, dh: c.nh * s };
  }
  function clamp(c) {
    const g = geo(c);
    c.x = Math.min(0, Math.max(VIEW - g.dw, c.x));
    c.y = Math.min(0, Math.max(VIEW - g.dh, c.y));
  }
  function center(c) { const g = geo(c); c.x = (VIEW - g.dw) / 2; c.y = (VIEW - g.dh) / 2; }
  function setZoom(c, z) {
    const g0 = geo(c);
    const cx = (VIEW / 2 - c.x) / g0.s, cy = (VIEW / 2 - c.y) / g0.s; // ponto da imagem no centro
    c.zoom = Math.max(1, Math.min(4, z));
    const g1 = geo(c);
    c.x = VIEW / 2 - cx * g1.s; c.y = VIEW / 2 - cy * g1.s;
    clamp(c);
  }
  function paint() {
    const c = UI.crop; if (!c) return;
    const g = geo(c);
    const img = document.getElementById('crop-img');
    if (img) { img.style.width = g.dw + 'px'; img.style.height = g.dh + 'px'; img.style.transform = 'translate(' + c.x + 'px,' + c.y + 'px)'; }
    document.querySelectorAll('.crop-prev').forEach((el) => {
      const k = el.clientWidth / VIEW, im = el.querySelector('img');
      if (im) { im.style.width = g.dw * k + 'px'; im.style.height = g.dh * k + 'px'; im.style.transform = 'translate(' + c.x * k + 'px,' + c.y * k + 'px)'; }
    });
    const z = document.getElementById('crop-zoom'); if (z && document.activeElement !== z) z.value = c.zoom;
  }
  (TV.after = TV.after || []).push(paint);

  function startCrop(file, uid) {
    UI.photoErr = null;
    if (!file || !/^image\/(jpeg|png|webp|gif|heic|heif|avif|bmp)$/i.test(file.type || '') && !/^image\//.test(file.type || '')) { UI.photoErr = 'Esse arquivo não é uma imagem. Escolha uma foto em JPG, PNG ou WEBP.'; TV.render(); return; }
    if (file.size > MAX_MB * 1048576) { UI.photoErr = 'A foto tem mais de ' + MAX_MB + ' MB. Escolha uma imagem menor.'; TV.render(); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      if (UI.crop) revoke(UI.crop.url);
      UI.crop = { uid, url, img, nw: img.naturalWidth, nh: img.naturalHeight, zoom: 1, x: 0, y: 0 };
      center(UI.crop);
      UI.photoConfirm = false;
      TV.render();
    };
    img.onerror = () => { revoke(url); UI.photoErr = 'Não foi possível abrir essa imagem. Tente outra foto.'; TV.render(); };
    img.src = url;
  }
  TV.F.avatarFile = (file, uid) => startCrop(file, uid);

  function cropBlob(c) {
    return new Promise((res, rej) => {
      const g = geo(c);
      const cv = document.createElement('canvas'); cv.width = OUT; cv.height = OUT;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = '#1A1A18'; ctx.fillRect(0, 0, OUT, OUT); // fundo para PNG com transparência
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(c.img, -c.x / g.s, -c.y / g.s, VIEW / g.s, VIEW / g.s, 0, 0, OUT, OUT);
      cv.toBlob((b) => (b ? res(b) : rej(new Error('Falha ao gerar a imagem'))), 'image/jpeg', 0.84);
    });
  }

  /* ---------- modal ---------- */
  TV.M.photo = (d) => {
    const user = userOf(d.uid); if (!user) return { title: 'Foto de perfil', body: TV.empty('Usuário não encontrado') };
    const has = TV.hasPhoto(user.id), c = UI.crop && UI.crop.uid === user.id ? UI.crop : null;
    const err = UI.photoErr ? '<div class="inline-note err" role="alert">' + U.ic('alert', 18) + '<span>' + e_(UI.photoErr) + '</span></div>' : '';
    const fileBtn = (label, cls) => '<label class="btn ' + (cls || '') + '" for="avatar-file">' + U.ic('image', 18) + ' ' + label + '<input type="file" accept="image/*" class="sr" id="avatar-file" data-file="avatarFile" data-arg="' + user.id + '"></label>';
    if (c) {
      return {
        title: 'Ajustar foto',
        body: err + '<p class="muted sm">Arraste para posicionar e use o zoom. A área dentro do círculo é o que vai aparecer.</p>' +
          '<div class="crop-view" id="crop-view" tabindex="0" role="group" aria-label="Área de recorte. Arraste para mover; setas movem, + e − aproximam."><img id="crop-img" src="' + e_(c.url) + '" alt="Foto escolhida" draggable="false"><div class="crop-mask" aria-hidden="true"></div></div>' +
          '<div class="field"><label for="crop-zoom">Zoom</label><input type="range" id="crop-zoom" class="range" min="1" max="4" step="0.01" value="' + c.zoom + '"></div>' +
          '<div class="row"><button class="btn sm" data-act="cropCenter">' + U.ic('reset', 16) + ' Centralizar</button>' + fileBtn('Escolher outra', 'sm ghost') + '</div>' +
          '<div class="crop-previews"><span class="lbl">Pré-visualização</span><div class="row"><span class="crop-prev lg"><img src="' + e_(c.url) + '" alt="" draggable="false"></span><span class="crop-prev md"><img src="' + e_(c.url) + '" alt="" draggable="false"></span><span class="crop-prev sm"><img src="' + e_(c.url) + '" alt="" draggable="false"></span><span class="muted sm">' + e_(user.name) + '</span></div></div>',
        foot: '<button class="btn ghost" data-act="cropCancel">Cancelar</button><button class="btn pri" data-act="cropSave" data-arg="' + user.id + '"' + (UI.photoSaving ? ' disabled' : '') + '>' + (UI.photoSaving ? 'Salvando…' : 'Salvar foto') + '</button>'
      };
    }
    if (UI.photoConfirm && has) {
      return { title: 'Remover foto?', body: '<div class="photo-big">' + TV.avatar(user, 'xxl') + '</div><p class="center">A foto sai de todas as telas e as iniciais <b>' + e_(U.initials(user.name)) + '</b> voltam a aparecer.</p>', foot: '<button class="btn ghost" data-act="photoConfirmNo">Cancelar</button><button class="btn danger" data-act="photoRemove" data-arg="' + user.id + '">Remover foto</button>' };
    }
    return {
      title: 'Foto de perfil',
      body: err + '<div class="photo-big">' + TV.avatar(user, 'xxl') + '</div><p class="center muted sm">' + (has ? 'Esta é a foto que aparece para ' + (user.id === 'pedro' ? 'os seus alunos e na plataforma.' : 'você e para o Pedro.') : 'Sem foto, mostramos as iniciais ' + e_(U.initials(user.name)) + '.') + '</p><div class="stack">' + fileBtn(has ? 'Trocar foto' : 'Escolher foto do dispositivo', 'pri block') + (has ? '<button class="btn block ghost" data-act="photoRemoveAsk" data-arg="' + user.id + '">' + U.ic('trash', 18) + ' Remover foto</button>' : '') + '</div><p class="dim xs center">JPG, PNG ou WEBP de até ' + MAX_MB + ' MB. A foto é reduzida para ' + OUT + '×' + OUT + ' px e fica salva neste navegador.</p>',
      foot: '<button class="btn" data-act="closeModal">Fechar</button>'
    };
  };

  const closeBase = A.closeModal;
  function dropCrop() { if (UI.crop) revoke(UI.crop.url); UI.crop = null; UI.photoErr = null; UI.photoConfirm = false; UI.photoSaving = false; }
  Object.assign(A, {
    openPhoto(uid) { dropCrop(); TV.openModal('photo', { uid }); },
    photoRemoveAsk(uid) { dropCrop(); UI.photoConfirm = true; if (!UI.modal || UI.modal.kind !== 'photo') TV.openModal('photo', { uid }); },
    photoConfirmNo() { UI.photoConfirm = false; },
    cropCenter() { if (UI.crop) { UI.crop.zoom = 1; center(UI.crop); } },
    cropCancel() { dropCrop(); },
    closeModal() { dropCrop(); return closeBase(); },
    cropSave(uid) {
      const c = UI.crop; if (!c || UI.photoSaving) return;
      UI.photoSaving = true;
      cropBlob(c).then((blob) => Store.put(uid, blob)).then((url) => {
        revoke(TV.avatars[uid]); TV.avatars[uid] = url;
        dropCrop(); UI.modal = null;
        const u = userOf(uid);
        if (uid !== 'pedro') TV.log(U.firstName(u.name) + ' atualizou a foto de perfil', uid, 'aluno');
        TV.save(); TV.render(); U.toast('Foto de perfil salva', 'ok');
      }).catch((err) => {
        UI.photoSaving = false;
        UI.photoErr = /quota|QuotaExceeded/i.test(String(err && (err.name || err.message))) ? 'Sem espaço no navegador para salvar a foto. Remova fotos antigas ou use outro navegador.' : 'Não foi possível salvar a foto. Tente de novo.';
        TV.render();
      });
    },
    photoRemove(uid) {
      Store.del(uid).then(() => {
        revoke(TV.avatars[uid]); delete TV.avatars[uid];
        dropCrop(); UI.modal = null; TV.render(); U.toast('Foto removida. As iniciais voltaram a aparecer.');
      });
      return false;
    }
  });

  /* ---------- arrastar, zoom e teclado ---------- */
  let drag = null;
  document.addEventListener('pointerdown', (e) => {
    const v = e.target.closest && e.target.closest('#crop-view'); if (!v || !UI.crop) return;
    e.preventDefault();
    drag = { id: e.pointerId, px: e.clientX, py: e.clientY, x0: UI.crop.x, y0: UI.crop.y };
    try { v.setPointerCapture(e.pointerId); } catch (err) { /* ok */ }
    v.classList.add('dragging');
  });
  document.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id || !UI.crop) return;
    UI.crop.x = drag.x0 + (e.clientX - drag.px); UI.crop.y = drag.y0 + (e.clientY - drag.py);
    clamp(UI.crop); paint();
  });
  const endDrag = (e) => { if (!drag || (e && e.pointerId !== drag.id)) return; drag = null; const v = document.getElementById('crop-view'); if (v) v.classList.remove('dragging'); };
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);
  document.addEventListener('wheel', (e) => {
    if (!UI.crop || !(e.target.closest && e.target.closest('#crop-view'))) return;
    e.preventDefault(); setZoom(UI.crop, UI.crop.zoom - e.deltaY * 0.002); paint();
  }, { passive: false });
  document.addEventListener('input', (e) => { if (e.target.id === 'crop-zoom' && UI.crop) { setZoom(UI.crop, parseFloat(e.target.value)); paint(); } });
  document.addEventListener('keydown', (e) => {
    if (!UI.crop || document.activeElement !== document.getElementById('crop-view')) return;
    const m = { ArrowLeft: [10, 0], ArrowRight: [-10, 0], ArrowUp: [0, 10], ArrowDown: [0, -10] }[e.key];
    if (m) { e.preventDefault(); UI.crop.x += m[0]; UI.crop.y += m[1]; clamp(UI.crop); paint(); }
    else if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoom(UI.crop, UI.crop.zoom + 0.1); paint(); }
    else if (e.key === '-') { e.preventDefault(); setZoom(UI.crop, UI.crop.zoom - 0.1); paint(); }
  });
})();
