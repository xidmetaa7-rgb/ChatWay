(function () {
  if (window._cwUpdatesLoaded) return;
  window._cwUpdatesLoaded = true;

  // =========================================================
  // ЦЕНТРАЛЬНЫЙ РЕЕСТР ДАННЫХ ИЗ updates.js (УПРАВЛЯЕТСЯ SUPERUSER)
  // =========================================================
  const DEFAULT_UPDATE_CONFIG = {
    version: "2026.11.22",
    sortNewestFirst: true,
    translateLangs: [
      { code: "ru", label: "🇷🇺 Русский" },
      { code: "en", label: "🇬🇧 English" },
      { code: "az", label: "🇦🇿 Azərbaycan" },
      { code: "tr", label: "🇹🇷 Türkçe" },
      { code: "fa", label: "🇮🇷 فارسی" },
      { code: "ar", label: "🇸🇦 العربية" }
    ],
    bakuPlaces: [
      { name: "28 May Metro (28 Mall)", area: "Nəsimi", lat: 40.3798, lng: 49.8482 },
      { name: "İçərişəhər Metro (Old City)", area: "Səbail", lat: 40.3656, lng: 49.8326 },
      { name: "Koroğlu Transport Hub", area: "Nizami", lat: 40.4216, lng: 49.9197 },
      { name: "Nəriman Nərimanov Metro", area: "Nərimanov", lat: 40.4027, lng: 49.8699 },
      { name: "İnşaatçılar Metro", area: "Yasamal", lat: 40.3886, lng: 49.8054 },
      { name: "Elmlər Akademiyası Metro", area: "Yasamal", lat: 40.3756, lng: 49.8147 },
      { name: "Gənclik Metro (Gənclik Mall)", area: "Nərimanov", lat: 40.4004, lng: 49.8515 },
      { name: "Port Baku / Bulvar", area: "Səbail", lat: 40.3728, lng: 49.8551 },
      { name: "Heydər Əliyev Mərkəzi", area: "Nərimanov", lat: 40.3953, lng: 49.8673 },
      { name: "Xətai Metro", area: "Xətai", lat: 40.3849, lng: 49.8696 }
    ],
    radioStreams: [
      { id: "r_lofi", title: "☀️ Sunny Lo-Fi & Chill Radio", artist: "Radio Stream · Без регистрации", url: "https://streams.fluxfm.de/Chillhop/mp3-128/streams.fluxfm.de/" },
      { id: "r_jazz", title: "🎷 Smooth Lounge & Day Radio", artist: "Radio Stream · Без регистрации", url: "https://streams.fluxfm.de/Lounge/mp3-128/streams.fluxfm.de/" },
      { id: "r_pop", title: "⚡ Energy Hits Radio", artist: "Radio Stream · Без регистрации", url: "https://streams.fluxfm.de/boomfm/mp3-128/streams.fluxfm.de/" }
    ],
    enabledSections: {
      sortChats: true,
      translator: true,
      transport: true,
      music: true,
      miniPlayer: true
    },
    customCode: {
      html: "",
      css: "",
      js: ""
    }
  };

  function cloneDefaultConfig() {
    return JSON.parse(JSON.stringify(DEFAULT_UPDATE_CONFIG));
  }

  let activeUpdateConfig = cloneDefaultConfig();

  // --- Стили для светлых модулей транспорта/музыки, перевода и мини-плеера ---
  const style = document.createElement("style");
  style.id = "cw-updates-style";
  style.textContent = `
    .cw-tr-btn {
      background: linear-gradient(135deg, #ff9800, #ff1744) !important;
      color: #fff !important;
      box-shadow: 0 8px 22px -8px rgba(255, 112, 0, 0.65) !important;
    }
    .cw-tr-btn:hover { filter: brightness(1.06); }

    .cw-tr-body {
      background: #ffffff !important;
      color: #16181d !important;
    }
    .cw-tr-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 12px 14px;
      margin-bottom: 10px;
      color: #16181d;
    }
    .cw-tr-card b { color: #0f172a; }
    .cw-tr-card .sub { color: #475569 !important; }
    .cw-tr-inp {
      width: 100%;
      border: 1.5px solid #cbd5e1;
      border-radius: 14px;
      padding: 11px 14px;
      background: #ffffff;
      color: #0f172a;
      font: inherit;
      outline: none;
    }
    .cw-tr-inp:focus {
      border-color: #ff6d00;
      box-shadow: 0 0 0 3px rgba(255, 109, 0, 0.16);
    }
    .cw-tr-suggest {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      margin-top: 6px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
    }
    .cw-tr-suggest button {
      width: 100%;
      text-align: left;
      padding: 10px 12px;
      font-size: 13.5px;
      color: #0f172a;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cw-tr-suggest button:last-child { border-bottom: 0; }
    .cw-tr-suggest button:hover { background: #fff7ed; }

    .cw-route-opt {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 12px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: border-color .15s, background .15s;
    }
    .cw-route-opt.active {
      border-color: #ff6d00;
      background: #fff7ed;
    }
    .cw-pill-sun {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 999px;
      background: #ffedd5;
      color: #c2410c;
    }

    .cw-tr-btn-go {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      padding: 12px 16px;
      border-radius: 16px;
      background: linear-gradient(135deg, #ff9800, #ff1744);
      color: #fff;
      font-weight: 700;
      text-decoration: none;
      margin-top: 8px;
      box-shadow: 0 8px 20px -8px rgba(255, 23, 68, 0.5);
    }

    .cw-tr-btn-sec {
      padding: 8px 12px;
      border-radius: 12px;
      background: #f1f5f9;
      color: #0f172a;
      font-size: 12.5px;
      font-weight: 600;
    }
    .cw-tr-btn-sec:hover { background: #e2e8f0; }

    .cw-tr-btn-pri {
      padding: 8px 12px;
      border-radius: 12px;
      background: linear-gradient(135deg, #ffb300, #ff5722);
      color: #fff;
      font-size: 12.5px;
      font-weight: 700;
    }

    .cw-tr-box {
      margin-top: 6px;
      padding: 8px 10px;
      border-radius: 12px;
      background: color-mix(in srgb, #ffb300 14%, var(--sch));
      border-left: 3px solid #ff6d00;
      font-size: 13.5px;
      line-height: 1.35;
    }
    .cw-tr-controls {
      margin-top: 4px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }
    .cw-tr-controls select {
      border: 1px solid var(--ol);
      border-radius: 10px;
      background: var(--sc);
      color: var(--t);
      font-size: 11.5px;
      padding: 2px 6px;
      outline: none;
    }
    .cw-tr-controls button {
      font-size: 11.5px;
      font-weight: 600;
      color: #ff8f00;
      padding: 2px 7px;
      border-radius: 10px;
      background: color-mix(in srgb, #ffb300 12%, transparent);
    }

    #cwMiniPlayer {
      position: fixed;
      left: 12px;
      right: 12px;
      bottom: calc(14px + env(safe-area-inset-bottom));
      z-index: 18;
      display: none;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 20px;
      background: #ffffff;
      color: #0f172a;
      border: 1.5px solid #fed7aa;
      box-shadow: 0 14px 34px rgba(15, 23, 42, 0.16);
    }
    @media (min-width: 721px) {
      #cwMiniPlayer { left: auto; right: 20px; width: 360px; }
    }
    #cwMiniPlayer .mp-cov {
      width: 42px; height: 42px; border-radius: 12px;
      object-fit: cover; background: #fff7ed; display: grid; place-items: center; flex: none;
      font-size: 20px;
    }
    #cwMiniPlayer .mp-info { flex: 1; min-width: 0; }
    #cwMiniPlayer .mp-t { font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    #cwMiniPlayer .mp-a { font-size: 11.5px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .cw-pin-badge {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 10px; border-radius: 14px;
      background: #fff7ed; border: 1px solid #fdba74; color: #9a3412;
      font-size: 12px; font-weight: 600; margin: 6px 0;
    }
  `;
  document.head.appendChild(style);

  // =========================================================
  // УПРАВЛЕНИЕ КОНТЕЙНЕРАМИ updates.js ИЗ СТУДИИ SUPERUSER
  // =========================================================
  function applyUpdateConfig(cfg) {
    const base = cloneDefaultConfig();
    activeUpdateConfig = {
      ...base,
      ...(cfg || {}),
      enabledSections: { ...base.enabledSections, ...((cfg && cfg.enabledSections) || {}) },
      customCode: { ...base.customCode, ...((cfg && cfg.customCode) || {}) },
      translateLangs: Array.isArray(cfg && cfg.translateLangs) && cfg.translateLangs.length ? cfg.translateLangs : base.translateLangs,
      bakuPlaces: Array.isArray(cfg && cfg.bakuPlaces) && cfg.bakuPlaces.length ? cfg.bakuPlaces : base.bakuPlaces,
      radioStreams: Array.isArray(cfg && cfg.radioStreams) && cfg.radioStreams.length ? cfg.radioStreams : base.radioStreams
    };

    localStorage.setItem("cw_updates_js_config", JSON.stringify(activeUpdateConfig));

    // Применяем кастомные HTML / CSS / JS из конфига updates.js
    document.querySelectorAll(".cw-upd-css,.cw-upd-html,.cw-upd-js").forEach((el) => el.remove());

    if ((activeUpdateConfig.customCode.css || "").trim()) {
      const s = document.createElement("style");
      s.className = "cw-upd-css";
      s.textContent = activeUpdateConfig.customCode.css;
      document.head.appendChild(s);
    }

    if ((activeUpdateConfig.customCode.html || "").trim()) {
      const box = document.createElement("div");
      box.className = "cw-upd-html";
      box.innerHTML = activeUpdateConfig.customCode.html;
      document.body.appendChild(box);
    }

    if ((activeUpdateConfig.customCode.js || "").trim()) {
      try {
        const sc = document.createElement("script");
        sc.className = "cw-upd-js";
        sc.textContent = activeUpdateConfig.customCode.js;
        document.body.appendChild(sc);
      } catch (err) {
        console.warn("updates.js custom JS error:", err);
      }
    }

    // Обновляем видимость элементов updates.js
    const trFab = document.getElementById("cwTransportFab");
    if (trFab) trFab.style.display = activeUpdateConfig.enabledSections.transport ? "" : "none";

    if (!activeUpdateConfig.enabledSections.miniPlayer) {
      const mp = document.getElementById("cwMiniPlayer");
      if (mp) mp.style.display = "none";
    } else if (currentTrack) {
      renderMiniPlayer();
    }

    if (typeof window.drawChats === "function") window.drawChats();
    if (typeof window.draw === "function" && window.cur) window.draw();
  }

  function extractUpdateConfigFromContainers(state) {
    const list = (state && Array.isArray(state.containers)) ? state.containers : [];
    const master = list.find((c) => c && c.id === "c_updates_js_master");
    if (!master || !master.js) return null;
    try {
      const parsed = JSON.parse(master.js);
      if (parsed && typeof parsed === "object") return parsed;
    } catch (_) {}
    return null;
  }

  function syncContainersWithUpdateConfig(containersList, newCfg) {
    const clean = Array.isArray(containersList) ? containersList.filter((x) => x && x.id !== "c_updates_js_master") : [];
    clean.unshift({
      id: "c_updates_js_master",
      name: "⚙️ updates.js (Глобальный конфиг)",
      enabled: true,
      html: newCfg.customCode?.html || "",
      css: newCfg.customCode?.css || "",
      js: JSON.stringify(newCfg, null, 2)
    });
    return clean;
  }

  // Загружаем сохранённый конфиг при старте
  try {
    const savedLocal = JSON.parse(localStorage.getItem("cw_updates_js_config") || "null");
    if (savedLocal) applyUpdateConfig(savedLocal);
  } catch (_) {}

  // Перехватываем publishGlobalContainers и applyAllContainers из chatway.html
  function hookGlobalPluginSync() {
    if (typeof window.applyAllContainers === "function" && !window.applyAllContainers._cwUpdHooked) {
      const origApply = window.applyAllContainers;
      window.applyAllContainers = function (rawState) {
        const res = origApply.apply(this, arguments);
        const cfg = extractUpdateConfigFromContainers(rawState);
        if (cfg) applyUpdateConfig(cfg);
        return res;
      };
      window.applyAllContainers._cwUpdHooked = true;

      if (window.globalContainersState) {
        const initialCfg = extractUpdateConfigFromContainers(window.globalContainersState);
        if (initialCfg) applyUpdateConfig(initialCfg);
      }
    }

    if (typeof window.publishGlobalContainers === "function" && !window.publishGlobalContainers._cwUpdHooked) {
      const origPublish = window.publishGlobalContainers;
      window.publishGlobalContainers = async function (containersList) {
        const cfg = extractUpdateConfigFromContainers({ containers: containersList }) || activeUpdateConfig;
        const mergedList = syncContainersWithUpdateConfig(containersList, cfg);
        applyUpdateConfig(cfg);
        return origPublish.call(this, mergedList);
      };
      window.publishGlobalContainers._cwUpdHooked = true;
    }
  }

  // Расширяем студию суперпользователя вкладкой управления всеми контейнерами updates.js
  function hookSuperUserStudio() {
    if (typeof window.openSuperUserStudio !== "function" || window.openSuperUserStudio._cwUpdHooked) return;
    const origStudio = window.openSuperUserStudio;

    window.openSuperUserStudio = function () {
      origStudio.apply(this, arguments);

      setTimeout(() => {
        const dlgEl = document.getElementById("dlg");
        if (!dlgEl || !dlgEl.open || dlgEl.querySelector("#cwUpdMasterPanel")) return;

        const panel = document.createElement("div");
        panel.id = "cwUpdMasterPanel";
        panel.className = "su-card on";
        panel.style.marginTop = "12px";

        const s = activeUpdateConfig.enabledSections;
        const radioText = activeUpdateConfig.radioStreams
          .map((r) => `${r.title} | ${r.artist} | ${r.url}`)
          .join("\n");
        const placesText = activeUpdateConfig.bakuPlaces
          .map((p) => `${p.name} | ${p.area} | ${p.lat} | ${p.lng}`)
          .join("\n");

        panel.innerHTML = `
          <div style="font-weight:800;font-size:14px;margin-bottom:6px">🎛️ Управление всеми контейнерами updates.js</div>
          <div class="sub" style="white-space:normal;margin-bottom:8px">Все изменения сохраняются в глобальный конфиг и рассылаются пользователям.</div>

          <div class="mod-row" style="margin-bottom:6px">
            <div><b>🕒 Сортировка чатов</b><span>Новые сверху, старые снизу</span></div>
            <button class="sw ${activeUpdateConfig.sortNewestFirst ? "on" : ""}" id="updSwSort"></button>
          </div>
          <div class="mod-row" style="margin-bottom:6px">
            <div><b>🌐 Переводчик сообщений</b><span>Кнопки и выбор языка под сообщениями</span></div>
            <button class="sw ${s.translator ? "on" : ""}" id="updSwTr"></button>
          </div>
          <div class="mod-row" style="margin-bottom:6px">
            <div><b>🚌 Транспорт Баку</b><span>Кнопка маршрутов и Google Maps</span></div>
            <button class="sw ${s.transport ? "on" : ""}" id="updSwTransport"></button>
          </div>
          <div class="mod-row" style="margin-bottom:6px">
            <div><b>🎵 Музыка & Радио</b><span>Каталог потоков и поиск треков</span></div>
            <button class="sw ${s.music ? "on" : ""}" id="updSwMusic"></button>
          </div>
          <div class="mod-row" style="margin-bottom:8px">
            <div><b>🎶 Фоновый мини-плеер</b><span>Плавающий плеер поверх чатов</span></div>
            <button class="sw ${s.miniPlayer ? "on" : ""}" id="updSwMini"></button>
          </div>

          <div style="font-weight:700;font-size:12px;margin-top:6px">📻 Потоки Музыка & Радио (строка: Название | Подпись | URL)</div>
          <textarea class="f" id="updRadioTa" rows="3" style="font-family:monospace;font-size:12px;margin:4px 0">${radioText}</textarea>

          <div style="font-weight:700;font-size:12px;margin-top:6px">📍 Остановки Баку (строка: Название | Район | Lat | Lng)</div>
          <textarea class="f" id="updPlacesTa" rows="3" style="font-family:monospace;font-size:12px;margin:4px 0">${placesText}</textarea>

          <div class="acts" style="justify-content:space-between;margin-top:8px">
            <button class="txt" id="updResetBtn">↩ Сброс к базе updates.js</button>
            <button class="btn" id="updSavePublishBtn">💾 Применить и опубликовать всем</button>
          </div>
        `;

        const acts = dlgEl.querySelector(".acts");
        if (acts) dlgEl.insertBefore(panel, acts);
        else dlgEl.appendChild(panel);

        const draftCfg = JSON.parse(JSON.stringify(activeUpdateConfig));

        const bindSw = (id, setter) => {
          const el = panel.querySelector("#" + id);
          if (!el) return;
          el.onclick = () => {
            el.classList.toggle("on");
            setter(el.classList.contains("on"));
          };
        };

        bindSw("updSwSort", (v) => (draftCfg.sortNewestFirst = v));
        bindSw("updSwTr", (v) => (draftCfg.enabledSections.translator = v));
        bindSw("updSwTransport", (v) => (draftCfg.enabledSections.transport = v));
        bindSw("updSwMusic", (v) => (draftCfg.enabledSections.music = v));
        bindSw("updSwMini", (v) => (draftCfg.enabledSections.miniPlayer = v));

        panel.querySelector("#updResetBtn").onclick = async () => {
          const fresh = cloneDefaultConfig();
          applyUpdateConfig(fresh);
          const curContainers = (window.globalContainersState && window.globalContainersState.containers) || [];
          const merged = syncContainersWithUpdateConfig(curContainers, fresh);
          if (typeof window.publishGlobalContainers === "function") {
            await window.publishGlobalContainers(merged);
          }
          dlgEl.close();
          if (typeof window.toast === "function") window.toast("↩ Конфиг updates.js сброшен к исходному");
        };

        panel.querySelector("#updSavePublishBtn").onclick = async () => {
          const rLines = panel.querySelector("#updRadioTa").value.split("\n").map((x) => x.trim()).filter(Boolean);
          if (rLines.length) {
            draftCfg.radioStreams = rLines.map((line, idx) => {
              const [title, artist, url] = line.split("|").map((s) => (s || "").trim());
              return {
                id: "r_custom_" + idx,
                title: title || "Radio Stream",
                artist: artist || "Radio",
                url: url || ""
              };
            }).filter((x) => x.url);
          }

          const pLines = panel.querySelector("#updPlacesTa").value.split("\n").map((x) => x.trim()).filter(Boolean);
          if (pLines.length) {
            draftCfg.bakuPlaces = pLines.map((line) => {
              const [name, area, lat, lng] = line.split("|").map((s) => (s || "").trim());
              return {
                name: name || "Baku Stop",
                area: area || "Bakı",
                lat: parseFloat(lat) || 40.3798,
                lng: parseFloat(lng) || 49.8482
              };
            });
          }

          draftCfg.version = new Date().toISOString().slice(0, 19);
          applyUpdateConfig(draftCfg);

          const curContainers = (window.globalContainersState && window.globalContainersState.containers) || [];
          const merged = syncContainersWithUpdateConfig(curContainers, draftCfg);
          if (typeof window.publishGlobalContainers === "function") {
            await window.publishGlobalContainers(merged);
          }

          dlgEl.close();
          if (typeof window.toast === "function") window.toast("✅ Все контейнеры updates.js обновлены для всех!");
        };
      }, 40);
    };

    window.openSuperUserStudio._cwUpdHooked = true;
  }

  // =========================================================
  // 1. СОРТИРОВКА ЧАТОВ: СВЕЖИЕ СВЕРХУ, СТАРЫЕ СНИЗУ
  // =========================================================
  function sortChatsNewestFirst(list) {
    if (!Array.isArray(list)) return [];
    if (!activeUpdateConfig.sortNewestFirst) return list.slice();
    return list.slice().sort((a, b) => {
      const ta = Date.parse(a.last_message_at || a.updated_at || a.created_at || 0) || 0;
      const tb = Date.parse(b.last_message_at || b.updated_at || b.created_at || 0) || 0;
      if (tb !== ta) return tb - ta;
      return String(b.id || "").localeCompare(String(a.id || ""));
    });
  }

  function patchDrawChats() {
    if (typeof window.drawChats === "function" && !window.drawChats._cwSortedPatched) {
      const origDrawChats = window.drawChats;
      window.drawChats = function () {
        if (Array.isArray(window.chats)) {
          window.chats = sortChatsNewestFirst(window.chats);
        }
        return origDrawChats.apply(this, arguments);
      };
      window.drawChats._cwSortedPatched = true;
      window.drawChats();
    }
  }

  // =========================================================
  // 2. ПЕРЕВОД СООБЩЕНИЙ С ПРЕДВАРИТЕЛЬНЫМ ВЫБОРОМ ЯЗЫКА
  // =========================================================
  let selectedTrLang = localStorage.getItem("cw_tr_lang") || "ru";
  const translatedCache = new Map();

  async function translateText(text, targetLang) {
    const key = `${targetLang}::${text}`;
    if (translatedCache.has(key)) return translatedCache.get(key);

    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const out = (data && data[0] ? data[0].map((part) => part[0]).join("") : "").trim();
        if (out) {
          translatedCache.set(key, out);
          return out;
        }
      }
    } catch (_) {}

    const mUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=autodetect|${encodeURIComponent(targetLang)}`;
    const mRes = await fetch(mUrl);
    if (!mRes.ok) throw new Error("Translation failed");
    const mData = await mRes.json();
    const out = mData?.responseData?.translatedText || text;
    translatedCache.set(key, out);
    return out;
  }

  function attachTranslateButtons() {
    const ms = document.getElementById("ms");
    if (!ms || !Array.isArray(window.msgs)) return;

    ms.querySelectorAll(".cw-tr-controls,.cw-tr-box").forEach((n) => n.remove());
    if (!activeUpdateConfig.enabledSections.translator) return;

    ms.querySelectorAll(".m[data-msg-id]").forEach((el) => {
      const msgId = el.dataset.msgId;
      const m = window.msgs.find((x) => String(x.id) === String(msgId));
      if (!m || m.kind !== "t" || !m.body || m.body.startsWith("🔒ENC:")) return;

      const ctrl = document.createElement("div");
      ctrl.className = "cw-tr-controls";

      const sel = document.createElement("select");
      sel.title = "Язык перевода";
      activeUpdateConfig.translateLangs.forEach((l) => {
        const opt = document.createElement("option");
        opt.value = l.code;
        opt.textContent = l.label;
        if (l.code === selectedTrLang) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.onchange = () => {
        selectedTrLang = sel.value;
        localStorage.setItem("cw_tr_lang", selectedTrLang);
      };

      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "🌐 Перевести";

      btn.onclick = async () => {
        const target = sel.value || selectedTrLang;
        let box = el.querySelector(".cw-tr-box");
        if (!box) {
          box = document.createElement("div");
          box.className = "cw-tr-box";
          const smallEl = el.querySelector("small");
          if (smallEl) el.insertBefore(box, smallEl);
          else el.appendChild(box);
        }
        box.textContent = "⏳ Перевод…";
        try {
          const res = await translateText(m.body, target);
          box.textContent = res;
        } catch (_) {
          box.textContent = "⚠️ Не удалось перевести";
        }
      };

      ctrl.appendChild(sel);
      ctrl.appendChild(btn);
      const smallEl = el.querySelector("small");
      if (smallEl) el.insertBefore(ctrl, smallEl);
      else el.appendChild(ctrl);
    });
  }

  window.onCwMessagesDrawn = function () {
    attachTranslateButtons();
  };

  // =========================================================
  // 3. ТРАНСПОРТ БАКУ + LIVE-КАРТА (GOOGLE MAPS + AYNA MaaS)
  // =========================================================
  let gpsCoords = { lat: 40.3798, lng: 49.8482, accurate: false };

  function distKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function nearestStop(lat, lng) {
    const places = activeUpdateConfig.bakuPlaces;
    let best = places[0];
    let minD = Infinity;
    places.forEach((p) => {
      const d = distKm(lat, lng, p.lat, p.lng);
      if (d < minD) {
        minD = d;
        best = p;
      }
    });
    return { place: best, km: minD };
  }

  function buildGoogleMapsWebUrl(destQuery, travelMode = "transit") {
    const origin = `${gpsCoords.lat.toFixed(6)},${gpsCoords.lng.toFixed(6)}`;
    return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destQuery)}&travelmode=${encodeURIComponent(travelMode)}`;
  }

  function openTransportModal() {
    if (!activeUpdateConfig.enabledSections.transport) {
      if (typeof window.toast === "function") window.toast("Модуль транспорта отключён суперпользователем");
      return;
    }

    let modal = document.getElementById("cwTransportModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "cwTransportModal";
      modal.style.cssText = "position:fixed;inset:0;z-index:25;display:flex;flex-direction:column;background:#ffffff;color:#0f172a;";
      modal.innerHTML = `
        <div class="yt-bar" style="background:#fff7ed;border-bottom:1px solid #fed7aa;color:#0f172a">
          <button class="ic" id="cwTrClose" style="color:#0f172a">←</button>
          <b style="font-size:17px;flex:1">☀️ Транспорт Баку · Google Maps & AYNA MaaS</b>
          <span class="cw-pill-sun">LIVE GPS</span>
        </div>
        <div class="cw-tr-body" style="flex:1;overflow:auto;padding:14px;max-width:820px;width:100%;margin:0 auto">
          <div class="cw-tr-card">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px">
              <div>
                <div style="font-size:12px;color:#64748b">Ваша геопозиция и ближайшая остановка</div>
                <b id="cwTrLocText">Определяем спутники GPS…</b>
              </div>
              <button class="cw-tr-btn-sec" id="cwTrRefreshGps">📍 GPS</button>
            </div>
          </div>

          <div class="cw-tr-card">
            <label for="cwTrDestInp" style="display:block;font-weight:700;margin-bottom:6px">Куда едем?</label>
            <input id="cwTrDestInp" class="cw-tr-inp" type="text" placeholder="Введите остановку, метро или адрес в Баку…" autocomplete="off">
            <div id="cwTrSuggest" class="cw-tr-suggest"></div>
          </div>

          <div id="cwTrRoutesBox"></div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById("cwTrClose").onclick = () => {
        modal.style.display = "none";
      };

      const updateGps = () => {
        const locEl = document.getElementById("cwTrLocText");
        if (!navigator.geolocation) {
          const near = nearestStop(gpsCoords.lat, gpsCoords.lng);
          locEl.textContent = `${near.place.name} (~${near.km.toFixed(1)} км)`;
          return;
        }
        locEl.textContent = "🛰️ Точный поиск координат…";
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            gpsCoords = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accurate: true
            };
            const near = nearestStop(gpsCoords.lat, gpsCoords.lng);
            locEl.textContent = `📍 Рядом: ${near.place.name} (${near.km.toFixed(2)} км) · ${gpsCoords.lat.toFixed(4)}, ${gpsCoords.lng.toFixed(4)}`;
          },
          () => {
            const near = nearestStop(gpsCoords.lat, gpsCoords.lng);
            locEl.textContent = `📍 Баку (ориентир: ${near.place.name})`;
          },
          { enableHighAccuracy: true, timeout: 9000, maximumAge: 15000 }
        );
      };

      document.getElementById("cwTrRefreshGps").onclick = updateGps;
      updateGps();

      const inp = document.getElementById("cwTrDestInp");
      const sugBox = document.getElementById("cwTrSuggest");
      const routesBox = document.getElementById("cwTrRoutesBox");

      const renderRoutes = (destName, destLat, destLng) => {
        const nearStart = nearestStop(gpsCoords.lat, gpsCoords.lng);
        const dist = distKm(gpsCoords.lat, gpsCoords.lng, destLat || nearStart.place.lat, destLng || nearStart.place.lng);
        const minsBus = Math.max(8, Math.round(dist * 3.8 + 6));
        const minsMetro = Math.max(7, Math.round(dist * 2.7 + 5));

        const options = [
          {
            id: "ayna_bus",
            title: `🚌 AYNA MaaS · Автобус / Экспресс (~${minsBus} мин)`,
            steps: `Посадка: ${nearStart.place.name} → Следуйте по коридору AYNA MaaS → Высадка: ${destName}`
          },
          {
            id: "baku_metro",
            title: `🚇 Бакинское метро + пешком (~${minsMetro} мин)`,
            steps: `Дойдите до ближайшей станции у ${nearStart.place.name} → Проезд к узлу «${destName}» → Выход в город`
          },
          {
            id: "gmaps_combo",
            title: `🗺️ Google Maps комбинированный маршрут (${dist.toFixed(1)} км)`,
            steps: `Старт с текущей GPS-точки → Оптимальная пересадка в реальном времени → Прибытие в «${destName}»`
          }
        ];

        let selectedId = options[0].id;

        const paintOptions = () => {
          const activeOpt = options.find((o) => o.id === selectedId) || options[0];
          const gmUrl = buildGoogleMapsWebUrl(`${destName}, Baku`, "transit");
          routesBox.innerHTML = `
            <div class="cw-tr-card">
              <div style="font-weight:700;margin-bottom:8px">Варианты маршрута до «${destName}»</div>
              ${options
                .map(
                  (o) => `
                <div class="cw-route-opt ${o.id === selectedId ? "active" : ""}" data-rid="${o.id}">
                  <div style="font-weight:700;font-size:14px">${o.title}</div>
                  <div class="sub" style="white-space:normal;margin-top:4px">${o.steps}</div>
                </div>
              `
                )
                .join("")}
              <div style="margin-top:8px;padding:10px;border-radius:12px;background:#fff7ed;font-size:13px">
                <b>Выбранная схема:</b> ${activeOpt.steps}
              </div>
              <a class="cw-tr-btn-go" href="${gmUrl}" target="_blank" rel="noopener noreferrer">
                🚀 Начать поездку в Google Maps (Web)
              </a>
            </div>
          `;

          routesBox.querySelectorAll("[data-rid]").forEach((card) => {
            card.onclick = () => {
              selectedId = card.dataset.rid;
              paintOptions();
            };
          });
        };

        paintOptions();
      };

      const renderSuggestions = (q) => {
        const query = (q || "").trim().toLowerCase();
        const matches = activeUpdateConfig.bakuPlaces
          .filter((p) => !query || p.name.toLowerCase().includes(query) || p.area.toLowerCase().includes(query))
          .slice(0, 6);

        if (!matches.length && query) {
          sugBox.innerHTML = `<button type="button" data-custom="1"><span>📍 Искать «${q}» в Баку</span><span>→</span></button>`;
          sugBox.querySelector("[data-custom]").onclick = () => {
            sugBox.innerHTML = "";
            renderRoutes(q, gpsCoords.lat + 0.015, gpsCoords.lng + 0.015);
          };
          return;
        }

        sugBox.innerHTML = matches
          .map((p, i) => `<button type="button" data-idx="${i}"><span>📍 <b>${p.name}</b> <small style="color:#64748b">(${p.area})</small></span><span>Выбрать</span></button>`)
          .join("");

        sugBox.querySelectorAll("[data-idx]").forEach((b) => {
          b.onclick = () => {
            const p = matches[+b.dataset.idx];
            inp.value = p.name;
            sugBox.innerHTML = "";
            renderRoutes(p.name, p.lat, p.lng);
          };
        });
      };

      inp.oninput = () => renderSuggestions(inp.value);
      inp.onfocus = () => renderSuggestions(inp.value);
      renderSuggestions("");
    }
    modal.style.display = "flex";
  }

  function injectTransportFab() {
    if (!activeUpdateConfig.enabledSections.transport) return;
    if (document.getElementById("cwTransportFab")) return;
    const fab = document.createElement("button");
    fab.id = "cwTransportFab";
    fab.className = "fab cw-tr-btn";
    fab.type = "button";
    fab.textContent = "🚌 Транспорт";
    fab.style.cssText = "left:auto;right:18px;bottom:calc(84px + env(safe-area-inset-bottom));z-index:3;";
    fab.onclick = openTransportModal;
    document.body.appendChild(fab);
  }

  // =========================================================
  // 4. МУЗЫКА & РАДИО (БЕЗ РЕГИСТРАЦИИ + ФОНОВЫЙ ПЛЕЕР + ПРОФИЛЬ/ЧАТ)
  // =========================================================
  const bgAudio = new Audio();
  bgAudio.preload = "none";
  let currentTrack = JSON.parse(localStorage.getItem("cw_cur_track") || "null");
  let pinnedTrack = JSON.parse(localStorage.getItem("cw_pinned_track") || "null");
  let isPlayingMusic = false;

  function renderMiniPlayer() {
    let mp = document.getElementById("cwMiniPlayer");
    if (!currentTrack || !activeUpdateConfig.enabledSections.miniPlayer) {
      if (mp) mp.style.display = "none";
      return;
    }
    if (!mp) {
      mp = document.createElement("div");
      mp.id = "cwMiniPlayer";
      mp.innerHTML = `
        <div class="mp-cov" id="cwMpCov">🎵</div>
        <div class="mp-info">
          <div class="mp-t" id="cwMpTitle"></div>
          <div class="mp-a" id="cwMpArtist"></div>
        </div>
        <button class="ic" id="cwMpToggle" title="Play/Pause">▶️</button>
        <button class="ic" id="cwMpOpen" title="Открыть плеер">🎶</button>
        <button class="ic" id="cwMpClose" title="Скрыть">✕</button>
      `;
      document.body.appendChild(mp);

      document.getElementById("cwMpToggle").onclick = () => {
        if (isPlayingMusic) pauseTrack();
        else playTrack(currentTrack);
      };
      document.getElementById("cwMpOpen").onclick = openMusicModal;
      document.getElementById("cwMpClose").onclick = () => {
        pauseTrack();
        mp.style.display = "none";
      };
    }

    mp.style.display = "flex";
    const covEl = document.getElementById("cwMpCov");
    covEl.innerHTML = currentTrack.artwork
      ? `<img src="${currentTrack.artwork}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px">`
      : "🎵";
    document.getElementById("cwMpTitle").textContent = currentTrack.title || "Track";
    document.getElementById("cwMpArtist").textContent = currentTrack.artist || "";
    document.getElementById("cwMpToggle").textContent = isPlayingMusic ? "⏸️" : "▶️";
  }

  function pauseTrack() {
    bgAudio.pause();
    isPlayingMusic = false;
    renderMiniPlayer();
  }

  async function playTrack(track) {
    if (!track || !track.url) return;
    currentTrack = track;
    localStorage.setItem("cw_cur_track", JSON.stringify(track));
    if (bgAudio.src !== track.url) {
      bgAudio.src = track.url;
    }
    try {
      await bgAudio.play();
      isPlayingMusic = true;
    } catch (_) {
      isPlayingMusic = false;
    }
    renderMiniPlayer();
  }

  bgAudio.onplay = () => {
    isPlayingMusic = true;
    renderMiniPlayer();
  };
  bgAudio.onpause = () => {
    isPlayingMusic = false;
    renderMiniPlayer();
  };

  async function searchAudius(q) {
    const query = encodeURIComponent((q || "lofi").trim() || "lofi");
    const res = await fetch(`https://discoveryprovider.audius.co/v1/tracks/search?query=${query}&app_name=ChatWay`);
    if (!res.ok) throw new Error("Audius search failed");
    const json = await res.json();
    const list = Array.isArray(json.data) ? json.data.slice(0, 12) : [];
    return list.map((tr) => ({
      id: "aud_" + tr.id,
      title: tr.title || "Untitled",
      artist: tr.user?.name || "Audius Artist",
      artwork: tr.artwork?.["150x150"] || "",
      url: `https://discoveryprovider.audius.co/v1/tracks/${tr.id}/stream?app_name=ChatWay`
    }));
  }

  function pinTrackToProfile(track) {
    pinnedTrack = track;
    localStorage.setItem("cw_pinned_track", JSON.stringify(track));
    renderPinnedTrackInProfile();
    if (typeof window.toast === "function") {
      window.toast(`📌 Закреплено в профиле: ${track.title}`);
    }
  }

  async function sendTrackToActiveChat(track) {
    if (!window.cur || typeof window.put !== "function") {
      if (typeof window.toast === "function") window.toast("Сначала откройте чат");
      return;
    }
    await window.put({
      kind: "t",
      body: `🎵 ${track.title} — ${track.artist}\n🔗 ${track.url}`
    });
    if (typeof window.toast === "function") window.toast("Трек отправлен в чат");
  }

  function renderPinnedTrackInProfile() {
    const dlgEl = document.getElementById("dlg");
    if (!dlgEl || !dlgEl.open || !pinnedTrack) return;
    if (dlgEl.querySelector(".cw-pin-badge")) return;
    const badge = document.createElement("div");
    badge.className = "cw-pin-badge";
    badge.innerHTML = `📌 Закреплённый трек: <b>${pinnedTrack.title}</b> (${pinnedTrack.artist})`;
    const titleEl = dlgEl.querySelector("h2");
    if (titleEl && titleEl.parentNode) {
      titleEl.insertAdjacentElement("afterend", badge);
    }
  }

  function openMusicModal() {
    if (!activeUpdateConfig.enabledSections.music) {
      if (typeof window.toast === "function") window.toast("Модуль музыки отключён суперпользователем");
      return;
    }

    let modal = document.getElementById("cwMusicModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "cwMusicModal";
      modal.style.cssText = "position:fixed;inset:0;z-index:25;display:flex;flex-direction:column;background:#ffffff;color:#0f172a;";
      modal.innerHTML = `
        <div class="yt-bar" style="background:#fff7ed;border-bottom:1px solid #fed7aa;color:#0f172a">
          <button class="ic" id="cwMuClose" style="color:#0f172a">←</button>
          <b style="font-size:17px;flex:1">🎵 Музыка & Радио · Без регистрации</b>
          <span class="cw-pill-sun">FREE STREAM</span>
        </div>
        <div class="cw-tr-body" style="flex:1;overflow:auto;padding:14px;max-width:820px;width:100%;margin:0 auto">
          <div class="cw-tr-card">
            <div style="font-weight:700;margin-bottom:6px">📻 Готовые радио и Lo-Fi потоки</div>
            <div id="cwRadioList"></div>
          </div>

          <div class="cw-tr-card">
            <div style="font-weight:700;margin-bottom:6px">🔎 Поиск треков через Audius</div>
            <div style="display:flex;gap:8px">
              <input id="cwMuSearchInp" class="cw-tr-inp" type="text" placeholder="Название трека, артист или настроение…">
              <button class="cw-tr-btn-pri" id="cwMuSearchBtn" style="padding:0 16px;border-radius:14px">Найти</button>
            </div>
            <div id="cwMuResults" style="margin-top:10px"></div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById("cwMuClose").onclick = () => {
        modal.style.display = "none";
      };

      const renderTrackRows = (container, tracks) => {
        container.innerHTML = tracks
          .map(
            (tr, idx) => `
          <div class="cw-tr-card" style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:8px">
            <div style="display:flex;align-items:center;gap:10px;min-width:0;flex:1">
              ${
                tr.artwork
                  ? `<img src="${tr.artwork}" alt="" style="width:44px;height:44px;border-radius:12px;object-fit:cover;flex:none">`
                  : `<div style="width:44px;height:44px;border-radius:12px;background:#fff7ed;display:grid;place-items:center;font-size:20px;flex:none">🎵</div>`
              }
              <div style="min-width:0">
                <div style="font-weight:700;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${tr.title}</div>
                <div class="sub" style="font-size:12px">${tr.artist}</div>
              </div>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end">
              <button class="cw-tr-btn-pri" data-play="${idx}">▶️</button>
              <button class="cw-tr-btn-sec" data-pin="${idx}" title="Закрепить в профиле">📌</button>
              <button class="cw-tr-btn-sec" data-send="${idx}" title="Отправить в чат">📤</button>
            </div>
          </div>
        `
          )
          .join("");

        container.querySelectorAll("[data-play]").forEach((b) => {
          b.onclick = () => playTrack(tracks[+b.dataset.play]);
        });
        container.querySelectorAll("[data-pin]").forEach((b) => {
          b.onclick = () => pinTrackToProfile(tracks[+b.dataset.pin]);
        });
        container.querySelectorAll("[data-send]").forEach((b) => {
          b.onclick = () => sendTrackToActiveChat(tracks[+b.dataset.send]);
        });
      };

      renderTrackRows(document.getElementById("cwRadioList"), activeUpdateConfig.radioStreams);

      const doSearch = async () => {
        const q = document.getElementById("cwMuSearchInp").value.trim() || "synthwave chill";
        const resBox = document.getElementById("cwMuResults");
        resBox.innerHTML = `<div class="sub">⏳ Ищем «${q}»…</div>`;
        try {
          const tracks = await searchAudius(q);
          if (!tracks.length) {
            resBox.innerHTML = `<div class="sub">Ничего не найдено</div>`;
            return;
          }
          renderTrackRows(resBox, tracks);
        } catch (_) {
          resBox.innerHTML = `<div class="sub">⚠️ Не удалось загрузить треки Audius</div>`;
        }
      };

      document.getElementById("cwMuSearchBtn").onclick = doSearch;
      document.getElementById("cwMuSearchInp").onkeydown = (e) => {
        if (e.key === "Enter") doSearch();
      };
      doSearch();
    }
    modal.style.display = "flex";
  }

  function patchAppsHub() {
    const bApps = document.getElementById("bApps");
    if (!bApps || bApps._cwMusicPatched) return;
    bApps._cwMusicPatched = true;

    const origClick = bApps.onclick;
    bApps.onclick = function () {
      if (typeof origClick === "function") origClick.apply(this, arguments);
      setTimeout(() => {
        if (!activeUpdateConfig.enabledSections.music) return;
        const dlgEl = document.getElementById("dlg");
        const grid = dlgEl && dlgEl.querySelector(".apps-grid");
        if (!grid || grid.querySelector("#appMusicRadio")) return;

        const tile = document.createElement("button");
        tile.id = "appMusicRadio";
        tile.className = "app-tile";
        tile.type = "button";
        tile.innerHTML = `<div class="app-ico">🎵</div><div class="app-name">Музыка & Радио</div><span class="app-tag ok">FREE</span>`;
        tile.onclick = () => {
          dlgEl.close();
          openMusicModal();
        };
        grid.insertBefore(tile, grid.firstChild);
      }, 30);
    };
  }

  function patchProfileButton() {
    const bMe = document.getElementById("bMe");
    if (!bMe || bMe._cwPinPatched) return;
    bMe._cwPinPatched = true;

    const origClick = bMe.onclick;
    bMe.onclick = function () {
      if (typeof origClick === "function") origClick.apply(this, arguments);
      setTimeout(renderPinnedTrackInProfile, 50);
    };
  }

  // --- Инициализация ---
  function init() {
    hookGlobalPluginSync();
    hookSuperUserStudio();
    patchDrawChats();
    injectTransportFab();
    patchAppsHub();
    patchProfileButton();
    attachTranslateButtons();
    if (currentTrack && activeUpdateConfig.enabledSections.miniPlayer) renderMiniPlayer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  setTimeout(init, 600);
})();
