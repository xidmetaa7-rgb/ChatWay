/* =========================================================================
 * A. ТРАНСПОРТ (GOOGLE MAPS + AYNA MAAS), СОРТИРОВКА ЧАТОВ И ПЕРЕВОД (RU / EN)
 * ========================================================================= */
(function () {
  const oldTop = document.getElementById("bTransTopBtn");
  if (oldTop) oldTop.remove();
  const oldFab = document.getElementById("bTransHomeFab");
  if (oldFab) oldFab.remove();
  const oldTr = document.getElementById("cwTransModal");
  if (oldTr) oldTr.remove();

  function curLang() {
    if (window.L === "en" || window.lang === "en") return "en";
    return "ru";
  }

  const T_DICT = {
    ru: {
      fabBtn: "Транспорт",
      tileName: "Транспорт",
      modalTitle: "🚌 Маршруты: Google Maps & AYNA",
      myGpsBtn: "📍 Мой GPS",
      gpsSearching: "📡 Поиск GPS…",
      fromPh: "Откуда (пусто = ваш точный GPS)",
      fromGpsPh: "📍 Мой GPS (±{acc}м · рядом {hub})",
      toPh: "Куда едем? (начните вводить адрес или место…)",
      findBtn: "Найти варианты маршрута",
      searchingBtn: "Поиск в Google Maps & AYNA…",
      openGmaps: "🗺️ Google Maps (Веб)",
      openAyna: "🚌 AYNA MaaS (Баку)",
      pickRouteTitle: "Выберите маршрут (нажмите для просмотра на карте):",
      detailsTitle: "Детали маршрута ({min} мин · выход в {arr})",
      startTripBtn: "🚀 Начать поездку в Google Maps (Web)",
      recTag: "Рекомендуемый (AYNA)",
      fastTag: "Без пробок (Быстрый)",
      altTag: "Альтернативный рейс",
      busBadge: "🚌 Автобус № {b}",
      transferBadge: "🚌 № {b1} → № {b2}",
      metroBadge: "🚇 Метро + 🚌 № {b}",
      depArr: "Отправление в <b>{dep}</b> → Прибытие в <b>{arr}</b>",
      walkToTitle: "Идите пешком до {stop}",
      walkToDesc: "{m} м (~{min} мин пешком)",
      boardBusTitle: "Посадка: Автобус № {b}",
      boardBusDesc: "Ожидание ~{wait} мин · Поездка: {stops} остановок (~{min} мин)",
      transferTitle: "Пересадка на Автобус № {b}",
      transferDesc: "Узловая остановка 28 May / Gənclik",
      exitBusTitle: "Выход на остановке: {stop}",
      exitBusDesc: "Не пропустите выход! Далее пешком {m} м (~{min} мин) до «{dest}»",
      metroInTitle: "Вход в метро: {stop}",
      metroTrainTitle: "Поезд Бакметро до станции назначения",
      metroTrainDesc: "В пути под землёй ~{min} мин",
      metroOutTitle: "Выход из метро: {stop}",
      metroOutDesc: "Выход к «{dest}» (~{min} мин пешком)",
      enterDestToast: "Напишите, куда вы хотите поехать!",
      notFoundToast: "Место «{q}» не найдено",
      gpsPermToast: "Разрешите точную геопозицию для сайта в настройках браузера",
      gpsOffToast: "Включите GPS на телефоне",
      useMyGpsOpt: "📍 Использовать моё текущее местоположение (GPS)",
      trBtn: "🌐 Перевести",
      trErr: "Ошибка перевода"
    },
    en: {
      fabBtn: "Transit",
      tileName: "Transit",
      modalTitle: "🚌 Routes: Google Maps & AYNA",
      myGpsBtn: "📍 My GPS",
      gpsSearching: "📡 Locating GPS…",
      fromPh: "From (empty = your exact GPS)",
      fromGpsPh: "📍 My GPS (±{acc}m · near {hub})",
      toPh: "Where to? (start typing address or place…)",
      findBtn: "Find route options",
      searchingBtn: "Searching Google Maps & AYNA…",
      openGmaps: "🗺️ Google Maps (Web)",
      openAyna: "🚌 AYNA MaaS (Baku)",
      pickRouteTitle: "Choose a route (tap to view on map):",
      detailsTitle: "Route details ({min} min · exit at {arr})",
      startTripBtn: "🚀 Start trip in Google Maps (Web)",
      recTag: "Recommended (AYNA)",
      fastTag: "No traffic (Fastest)",
      altTag: "Alternative bus",
      busBadge: "🚌 Bus #{b}",
      transferBadge: "🚌 #{b1} → #{b2}",
      metroBadge: "🚇 Metro + 🚌 #{b}",
      depArr: "Depart at <b>{dep}</b> → Arrive at <b>{arr}</b>",
      walkToTitle: "Walk to {stop}",
      walkToDesc: "{m} m (~{min} min walk)",
      boardBusTitle: "Board: Bus #{b}",
      boardBusDesc: "Wait ~{wait} min · Ride: {stops} stops (~{min} min)",
      transferTitle: "Transfer to Bus #{b}",
      transferDesc: "Hub stop 28 May / Gənclik",
      exitBusTitle: "Exit at stop: {stop}",
      exitBusDesc: "Don't miss your stop! Walk {m} m (~{min} min) to «{dest}»",
      metroInTitle: "Enter metro: {stop}",
      metroTrainTitle: "Baku Metro train towards destination",
      metroTrainDesc: "Underground ride ~{min} min",
      metroOutTitle: "Exit metro: {stop}",
      metroOutDesc: "Exit towards «{dest}» (~{min} min walk)",
      enterDestToast: "Please type your destination!",
      notFoundToast: "Place «{q}» not found",
      gpsPermToast: "Allow precise location for this site in browser settings",
      gpsOffToast: "Turn on GPS on your phone",
      useMyGpsOpt: "📍 Use my current location (GPS)",
      trBtn: "🌐 Translate",
      trErr: "Translation error"
    }
  };

  function tr(key, vars) {
    const l = curLang();
    let str = (T_DICT[l] && T_DICT[l][key]) || T_DICT.ru[key] || key;
    if (vars) {
      Object.keys(vars).forEach(k => {
        str = str.replaceAll(`{${k}}`, vars[k]);
      });
    }
    return str;
  }

  function sortChatsNewestFirst() {
    if (!Array.isArray(window.chats)) return;
    window.chats.sort((a, b) => {
      const ta = new Date(a.last_at || a.updated_at || a.created_at || 0).getTime();
      const tb = new Date(b.last_at || b.updated_at || b.created_at || 0).getTime();
      return tb - ta;
    });
  }

  if (typeof window.drawChats === "function" && !window.drawChats._sortedPatched) {
    const origDrawChats = window.drawChats;
    window.drawChats = function () {
      sortChatsNewestFirst();
      return origDrawChats.apply(this, arguments);
    };
    window.drawChats._sortedPatched = true;
  }

  const TARGET_LANGS = [
    { code: "ru", label: "🇷🇺 Русский" },
    { code: "en", label: "🇬🇧 English" },
    { code: "az", label: "🇦🇿 Azərbaycan" },
    { code: "tr", label: "🇹🇷 Türkçe" },
    { code: "fa", label: "🇮🇷 فارسی" },
    { code: "ar", label: "🇸🇦 العربية" }
  ];
  const trCache = {};

  async function translateText(text, targetLang) {
    const key = targetLang + ":" + text;
    if (trCache[key]) return trCache[key];
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    const translated = (data[0] || []).map(part => part[0]).join("");
    trCache[key] = translated || text;
    return trCache[key];
  }

  function injectTranslateButtons() {
    const msEl = document.getElementById("ms");
    if (!msEl) return;

    msEl.querySelectorAll(".m").forEach(bubble => {
      const existingBtn = bubble.querySelector(".cw-tr-btn");
      if (existingBtn) {
        existingBtn.textContent = tr("trBtn");
        return;
      }
      if (bubble.dataset.trBound) return;
      if (bubble.querySelector("audio, img, video, a, .call-log, .geo-card, .stk-em")) return;

      const clone = bubble.cloneNode(true);
      clone.querySelectorAll("small, .who, .f, .fw, .cw-tr-btn, .cw-tr-langs, .cw-tr-res").forEach(n => n.remove());
      const rawText = clone.textContent.trim();
      if (!rawText || rawText.length < 2) return;

      bubble.dataset.trBound = "1";

      const btn = document.createElement("button");
      btn.className = "cw-tr-btn";
      btn.textContent = tr("trBtn");

      btn.onclick = (e) => {
        e.stopPropagation();
        const existingRes = bubble.querySelector(".cw-tr-res");
        const existingPicker = bubble.querySelector(".cw-tr-langs");
        if (existingRes || existingPicker) {
          if (existingRes) existingRes.remove();
          if (existingPicker) existingPicker.remove();
          return;
        }

        const picker = document.createElement("div");
        picker.className = "cw-tr-langs";

        TARGET_LANGS.forEach(item => {
          const lBtn = document.createElement("button");
          lBtn.className = "cw-tr-lang-opt";
          lBtn.textContent = item.label;
          lBtn.onclick = async (ev) => {
            ev.stopPropagation();
            picker.remove();
            btn.textContent = "⏳…";
            try {
              const translated = await translateText(rawText, item.code);
              const resBox = document.createElement("div");
              resBox.className = "cw-tr-res";
              resBox.innerHTML = `<div style="font-size:10px;opacity:.7;margin-bottom:2px">${item.label}:</div>${translated}`;
              bubble.appendChild(resBox);
            } catch (err) {
              if (typeof window.toast === "function") window.toast(tr("trErr"));
            } finally {
              btn.textContent = tr("trBtn");
            }
          };
          picker.appendChild(lBtn);
        });

        bubble.appendChild(picker);
      };

      const smallEl = bubble.querySelector("small");
      if (smallEl) bubble.insertBefore(btn, smallEl);
      else bubble.appendChild(btn);
    });
  }

  const AYNA_STOPS = [
    { nameRu: "Yeni Yasamal / м/с İnşaatçılar", nameEn: "Yeni Yasamal / Inshaatchilar Metro", lat: 40.3885, lon: 49.8024, buses: ["17", "39", "65", "77", "193", "211"], metroRu: "Зелёная ветка (M2)", metroEn: "Green Line (M2)" },
    { nameRu: "м/с 28 May / ЖД Вокзал", nameEn: "28 May Metro / Railway Station", lat: 40.3792, lon: 49.8486, buses: ["1", "2", "5", "14", "65", "88", "125", "H1"], metroRu: "Красная + Зелёная (M1/M2)", metroEn: "Red + Green Line (M1/M2)" },
    { nameRu: "Транспортный хаб Koroğlu", nameEn: "Koroglu Transport Hub", lat: 40.4208, lon: 49.9182, buses: ["1", "11", "13", "36", "140", "160", "171", "H1"], metroRu: "Красная ветка (M1)", metroEn: "Red Line (M1)" },
    { nameRu: "м/с Nəriman Nərimanov", nameEn: "Nariman Narimanov Metro", lat: 40.4028, lon: 49.8706, buses: ["2", "5", "11", "26", "67", "88"], metroRu: "Красная ветка (M1)", metroEn: "Red Line (M1)" },
    { nameRu: "м/с Neftçilər", nameEn: "Neftchilar Metro", lat: 40.4112, lon: 49.9425, buses: ["11", "15", "30", "32", "36", "40", "62"], metroRu: "Красная ветка (M1)", metroEn: "Red Line (M1)" },
    { nameRu: "м/с Elmlər Akademiyası / БГУ", nameEn: "Elmlar Akademiyasi Metro / BSU", lat: 40.3748, lon: 49.8155, buses: ["3", "5", "6", "18", "39", "53", "77"], metroRu: "Зелёная ветка (M2)", metroEn: "Green Line (M2)" },
    { nameRu: "м/с Gənclik / Gənclik Mall", nameEn: "Ganjlik Metro / Ganjlik Mall", lat: 40.4001, lon: 49.8524, buses: ["2", "3", "6", "13", "26", "67", "88"], metroRu: "Красная ветка (M1)", metroEn: "Red Line (M1)" },
    { nameRu: "м/с İçərişəhər / Торговая", nameEn: "Icherisheher Metro / Nizami St", lat: 40.3661, lon: 49.8317, buses: ["5", "6", "18", "65", "88", "125"], metroRu: "Красная ветка (M1)", metroEn: "Red Line (M1)" },
    { nameRu: "м/с Nəsimi", nameEn: "Nasimi Metro", lat: 40.4256, lon: 49.8258, buses: ["18", "26", "61", "65", "79"], metroRu: "Зелёная ветка (M2)", metroEn: "Green Line (M2)" },
    { nameRu: "Аэропорт им. Гейдара Алиева (GYD)", nameEn: "Heydar Aliyev Int. Airport (GYD)", lat: 40.4675, lon: 50.0467, buses: ["H1 (Aero Express)"], metroRu: null, metroEn: null },
    { nameRu: "28 Mall", nameEn: "28 Mall", lat: 40.3795, lon: 49.8470, buses: ["1", "5", "14", "65", "88"], metroRu: "Красная + Зелёная (M1/M2)", metroEn: "Red + Green Line (M1/M2)" },
    { nameRu: "Port Baku Mall", nameEn: "Port Baku Mall", lat: 40.3765, lon: 49.8602, buses: ["1", "2", "4", "10", "21", "46"], metroRu: null, metroEn: null },
    { nameRu: "Deniz Mall", nameEn: "Deniz Mall", lat: 40.3586, lon: 49.8364, buses: ["5", "6", "88", "125"], metroRu: "Красная ветка (M1)", metroEn: "Red Line (M1)" }
  ];

  const stopTitle = (s) => (curLang() === "en" ? s.nameEn : s.nameRu);
  const stopMetro = (s) => (curLang() === "en" ? s.metroEn : s.metroRu);

  let gpsCoords = null, gpsAcc = null, gpsWatchId = null;
  let pickedFromObj = null, pickedToObj = null, currentRouteVariants = [];

  function calcDistanceKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  function findNearestStop(lat, lon) {
    let best = AYNA_STOPS[0], minD = Infinity;
    AYNA_STOPS.forEach(h => {
      const d = calcDistanceKm(lat, lon, h.lat, h.lon);
      if (d < minD) { minD = d; best = h; }
    });
    return { stop: best, distKm: minD };
  }

  async function fetchLiveSuggestions(query) {
    const q = query.trim().toLowerCase();
    const results = [];
    const isEn = curLang() === "en";

    AYNA_STOPS.forEach(s => {
      if (!q || s.nameRu.toLowerCase().includes(q) || s.nameEn.toLowerCase().includes(q)) {
        results.push({
          title: stopTitle(s),
          sub: (isEn ? "Baku · Buses: " : "Баку · Автобусы: ") + s.buses.join(", "),
          lat: s.lat,
          lon: s.lon
        });
      }
    });

    if (q.length >= 2) {
      try {
        const langParam = isEn ? "en" : "ru";
        const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=az&accept-language=${langParam}&q=${encodeURIComponent(query + ", Baku")}`;
        const res = await fetch(url);
        const data = await res.json();
        (data || []).forEach(item => {
          const parts = item.display_name.split(",");
          const title = parts.slice(0, 2).join(", ").trim();
          const sub = parts.slice(2, 4).join(", ").trim();
          if (!results.some(r => r.title.toLowerCase() === title.toLowerCase())) {
            results.push({ title, sub: sub || "Baku, Azerbaijan", lat: parseFloat(item.lat), lon: parseFloat(item.lon) });
          }
        });
      } catch (e) {}
    }
    return results.slice(0, 6);
  }

  async function geocodePlace(query) {
    const clean = query.trim();
    const localHit = AYNA_STOPS.find(h =>
      h.nameRu.toLowerCase().includes(clean.toLowerCase()) ||
      h.nameEn.toLowerCase().includes(clean.toLowerCase())
    );
    if (localHit) return { name: stopTitle(localHit), lat: localHit.lat, lon: localHit.lon };

    const langParam = curLang() === "en" ? "en" : "ru";
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=az&accept-language=${langParam}&q=${encodeURIComponent(clean + ", Baku")}`;
    const res = await fetch(url);
    const arr = await res.json();
    if (arr && arr.length) {
      return {
        name: arr[0].display_name.split(",").slice(0, 2).join(", ").trim(),
        lat: parseFloat(arr[0].lat),
        lon: parseFloat(arr[0].lon)
      };
    }
    return null;
  }

  function renderRouteOnMap(variant) {
    const mapBox = document.getElementById("trMapBox");
    if (!mapBox || !variant) return;
    const saddr = `${variant.start.lat},${variant.start.lon}`;
    const daddr = `${variant.end.lat},${variant.end.lon}`;
    const hl = curLang();
    const gmapsEmbedUrl = `https://maps.google.com/maps?saddr=${encodeURIComponent(saddr)}&daddr=${encodeURIComponent(daddr)}&dirflg=r&hl=${hl}&output=embed`;
    mapBox.innerHTML = `<iframe style="width:100%;height:100%;border:0" loading="lazy" src="${gmapsEmbedUrl}"></iframe>`;
  }

  function renderRouteTimeline(variant) {
    const detBox = document.getElementById("trTimelineBox");
    if (!detBox || !variant) return;
    const gmapsNavWebUrl = `https://www.google.com/maps/dir/?api=1&origin=${variant.start.lat},${variant.start.lon}&destination=${variant.end.lat},${variant.end.lon}&travelmode=transit&dir_action=navigate`;

    detBox.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
        <b style="font-size:14.5px;color:#0f172a">${tr("detailsTitle", { min: variant.totalMin, arr: variant.arriveStr })}</b>
        <span style="font-size:12px;font-weight:700;color:#1a73e8">${variant.fare}</span>
      </div>
      <div class="gm-timeline">
        ${variant.steps.map(st => `
          <div class="gm-step ${st.type === "exit" ? "exit" : ""} ${st.type === "walk" ? "walk" : ""}">
            <div style="font-size:11.5px;font-weight:700;color:#64748b">${st.time}</div>
            <div style="font-weight:700;font-size:13.5px;color:#0f172a;margin-top:1px">${st.title}</div>
            <div style="font-size:12.5px;color:#475569;margin-top:2px">${st.desc}</div>
          </div>
        `).join("")}
      </div>
      <a class="tr-start-nav-btn" href="${gmapsNavWebUrl}" target="_blank" rel="noopener noreferrer">
        ${tr("startTripBtn")}
      </a>
    `;
  }

  const trModal = document.createElement("div");
  trModal.id = "cwTransModal";
  trModal.innerHTML = `
    <div class="tr-head">
      <button class="ic" id="bTrClose">←</button>
      <b id="trModalTitle" style="font-size:16.5px;color:#0f172a"></b>
      <span class="pill-badge tr-badge">MAAS</span>
      <div style="flex:1"></div>
      <button class="txt" id="bTrGps" style="font-size:13px;font-weight:700"></button>
    </div>
    <div class="tr-body">
      <div class="tr-card">
        <div style="display:flex;flex-direction:column;gap:8px">
          <div class="tr-inp-wrap">
            <input class="tr-inp" id="trFromInp" autocomplete="off">
            <div class="tr-suggest-list" id="trFromSuggest"></div>
          </div>
          <div class="tr-inp-wrap">
            <input class="tr-inp" id="trToInp" autocomplete="off">
            <div class="tr-suggest-list" id="trToSuggest"></div>
          </div>
          <button class="tr-go" id="bTrCalc"></button>
        </div>
        <div class="tr-ext-row" id="trExternalLinks" style="display:none">
          <a class="tr-ext-btn tr-ext-gmaps" id="lnkGoogleMaps" target="_blank" rel="noopener"></a>
          <a class="tr-ext-btn tr-ext-ayna" id="lnkAynaMaas" href="https://ayna.gov.az/" target="_blank" rel="noopener"></a>
        </div>
      </div>

      <div class="tr-map-box" id="trMapBox">
        <iframe style="width:100%;height:100%;border:0" src="https://maps.google.com/maps?q=40.3885,49.8024&z=14&output=embed"></iframe>
      </div>

      <div class="tr-card" id="trVariantsCard" style="display:none">
        <div id="trVariantsTitle" style="font-weight:700;font-size:14px;color:#0f172a"></div>
        <div id="trVariantsList"></div>
      </div>

      <div class="tr-card" id="trTimelineBox" style="display:none"></div>
    </div>
  `;
  document.body.appendChild(trModal);

  function applyTransitLanguage() {
    document.getElementById("trModalTitle").textContent = tr("modalTitle");
    document.getElementById("bTrGps").textContent = gpsAcc !== null ? `📍 GPS ±${gpsAcc}m` : tr("myGpsBtn");
    document.getElementById("trFromInp").placeholder = tr("fromPh");
    document.getElementById("trToInp").placeholder = tr("toPh");
    document.getElementById("bTrCalc").textContent = tr("findBtn");
    document.getElementById("lnkGoogleMaps").textContent = tr("openGmaps");
    document.getElementById("lnkAynaMaas").textContent = tr("openAyna");
    document.getElementById("trVariantsTitle").textContent = tr("pickRouteTitle");
    const fabSpan = document.querySelector("#bTransHomeFab span:last-child");
    if (fabSpan) fabSpan.textContent = tr("fabBtn");
    const tileName = document.querySelector("#aTransTile .app-name");
    if (tileName) tileName.textContent = tr("tileName");
  }
  applyTransitLanguage();

  function bindLiveAutocomplete(inputEl, listEl, isFromField) {
    let debounceT = null;

    async function showList() {
      const q = inputEl.value;
      const items = await fetchLiveSuggestions(q);
      let html = "";

      if (isFromField) {
        html += `<button type="button" class="tr-suggest-item" data-gps="1"><b style="color:#1a73e8">${tr("useMyGpsOpt")}</b></button>`;
      }

      html += items.map((it, idx) => `
        <button type="button" class="tr-suggest-item" data-sidx="${idx}">
          <b>${it.title}</b>
          <span style="font-size:11.5px;color:#64748b">${it.sub}</span>
        </button>
      `).join("");

      listEl.innerHTML = html;
      listEl.style.display = html ? "block" : "none";

      const gpsBtn = listEl.querySelector('[data-gps="1"]');
      if (gpsBtn) {
        gpsBtn.onclick = () => {
          inputEl.value = "";
          pickedFromObj = null;
          listEl.style.display = "none";
          startAccurateGps(false);
        };
      }

      listEl.querySelectorAll("[data-sidx]").forEach(btn => {
        btn.onclick = () => {
          const chosen = items[+btn.dataset.sidx];
          inputEl.value = chosen.title;
          if (isFromField) pickedFromObj = { name: chosen.title, lat: chosen.lat, lon: chosen.lon };
          else pickedToObj = { name: chosen.title, lat: chosen.lat, lon: chosen.lon };
          listEl.style.display = "none";
          if (!isFromField) buildGoogleAynaRoutes();
        };
      });
    }

    inputEl.addEventListener("focus", showList);
    inputEl.addEventListener("input", () => {
      if (isFromField) pickedFromObj = null;
      else pickedToObj = null;
      clearTimeout(debounceT);
      debounceT = setTimeout(showList, 250);
    });
  }

  bindLiveAutocomplete(document.getElementById("trFromInp"), document.getElementById("trFromSuggest"), true);
  bindLiveAutocomplete(document.getElementById("trToInp"), document.getElementById("trToSuggest"), false);

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".tr-inp-wrap")) {
      document.getElementById("trFromSuggest").style.display = "none";
      document.getElementById("trToSuggest").style.display = "none";
    }
  });

  document.getElementById("bTrClose").onclick = () => {
    trModal.style.display = "none";
    if (gpsWatchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(gpsWatchId);
      gpsWatchId = null;
    }
  };

  async function buildGoogleAynaRoutes() {
    const fromTxt = document.getElementById("trFromInp").value.trim();
    const toTxt = document.getElementById("trToInp").value.trim();
    const calcBtn = document.getElementById("bTrCalc");
    const varCard = document.getElementById("trVariantsCard");
    const varList = document.getElementById("trVariantsList");
    const extRow = document.getElementById("trExternalLinks");
    const isEn = curLang() === "en";

    if (!toTxt) {
      if (typeof window.toast === "function") window.toast(tr("enterDestToast"));
      return;
    }

    calcBtn.disabled = true;
    calcBtn.textContent = tr("searchingBtn");

    try {
      let startPoint = null;
      if (!fromTxt) {
        if (gpsCoords) {
          startPoint = {
            name: isEn ? `My Location (GPS ±${gpsAcc || 15}m)` : `Моё местоположение (GPS ±${gpsAcc || 15}м)`,
            lat: gpsCoords.lat,
            lon: gpsCoords.lon
          };
        } else {
          startPoint = { name: stopTitle(AYNA_STOPS[0]), lat: AYNA_STOPS[0].lat, lon: AYNA_STOPS[0].lon };
        }
      } else if (pickedFromObj && pickedFromObj.name === fromTxt) {
        startPoint = pickedFromObj;
      } else {
        startPoint = await geocodePlace(fromTxt);
        if (!startPoint) {
          if (typeof window.toast === "function") window.toast(tr("notFoundToast", { q: fromTxt }));
          return;
        }
      }

      let endPoint = null;
      if (pickedToObj && pickedToObj.name === toTxt) {
        endPoint = pickedToObj;
      } else {
        endPoint = await geocodePlace(toTxt);
        if (!endPoint) {
          if (typeof window.toast === "function") window.toast(tr("notFoundToast", { q: toTxt }));
          return;
        }
      }

      extRow.style.display = "flex";
      document.getElementById("lnkGoogleMaps").href =
        `https://www.google.com/maps/dir/?api=1&origin=${startPoint.lat},${startPoint.lon}&destination=${endPoint.lat},${endPoint.lon}&travelmode=transit`;

      const nearStart = findNearestStop(startPoint.lat, startPoint.lon);
      const nearEnd = findNearestStop(endPoint.lat, endPoint.lon);

      const straightKm = calcDistanceKm(startPoint.lat, startPoint.lon, endPoint.lat, endPoint.lon);
      const roadKm = Math.max(1.2, straightKm * 1.32);
      const baseBusMin = Math.round((roadKm / 21) * 60 + 5);
      const walkToStopMin = Math.max(2, Math.round((nearStart.distKm / 4.8) * 60));
      const walkFromStopMin = Math.max(2, Math.round((nearEnd.distKm / 4.8) * 60));
      const stopsCount = Math.max(3, Math.round(roadKm * 1.8));

      const directBuses = nearStart.stop.buses.filter(b => nearEnd.stop.buses.includes(b));
      const bus1 = directBuses[0] || nearStart.stop.buses[0];
      const bus2 = directBuses[1] || nearEnd.stop.buses[0];

      const now = new Date();
      const fmtTime = (addMin) => new Date(now.getTime() + addMin * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const variants = [];
      const wait1 = (now.getMinutes() % 5) + 2;
      const total1 = walkToStopMin + wait1 + baseBusMin + walkFromStopMin;

      variants.push({
        badge: directBuses.length ? tr("busBadge", { b: bus1 }) : tr("transferBadge", { b1: bus1, b2: bus2 }),
        tag: tr("recTag"),
        totalMin: total1,
        departStr: fmtTime(walkToStopMin + wait1),
        arriveStr: fmtTime(total1),
        fare: "0.50 ₼ (BakıKart)",
        start: startPoint,
        end: endPoint,
        steps: [
          { type: "walk", time: fmtTime(0), title: tr("walkToTitle", { stop: stopTitle(nearStart.stop) }), desc: tr("walkToDesc", { m: Math.round(nearStart.distKm * 1000), min: walkToStopMin }) },
          { type: "board", time: fmtTime(walkToStopMin + wait1), title: tr("boardBusTitle", { b: bus1 }), desc: tr("boardBusDesc", { wait: wait1, stops: stopsCount, min: baseBusMin }) },
          ...(directBuses.length ? [] : [{ type: "board", time: fmtTime(walkToStopMin + wait1 + Math.round(baseBusMin * 0.5)), title: tr("transferTitle", { b: bus2 }), desc: tr("transferDesc") }]),
          { type: "exit", time: fmtTime(total1 - walkFromStopMin), title: tr("exitBusTitle", { stop: stopTitle(nearEnd.stop) }), desc: tr("exitBusDesc", { m: Math.round(nearEnd.distKm * 1000), min: walkFromStopMin, dest: endPoint.name }) }
        ]
      });

      if (stopMetro(nearStart.stop) && stopMetro(nearEnd.stop)) {
        const metroMin = Math.max(8, Math.round(roadKm * 2.1));
        const total2 = walkToStopMin + 3 + metroMin + walkFromStopMin;
        variants.push({
          badge: tr("metroBadge", { b: nearEnd.stop.buses[0] }),
          tag: tr("fastTag"),
          totalMin: total2,
          departStr: fmtTime(walkToStopMin + 3),
          arriveStr: fmtTime(total2),
          fare: "0.50 ₼ (BakıKart)",
          start: startPoint,
          end: endPoint,
          steps: [
            { type: "walk", time: fmtTime(0), title: tr("metroInTitle", { stop: stopTitle(nearStart.stop) }), desc: `${stopMetro(nearStart.stop)} · ~${walkToStopMin} min` },
            { type: "board", time: fmtTime(walkToStopMin + 3), title: tr("metroTrainTitle"), desc: tr("metroTrainDesc", { min: metroMin }) },
            { type: "exit", time: fmtTime(total2 - walkFromStopMin), title: tr("metroOutTitle", { stop: stopTitle(nearEnd.stop) }), desc: tr("metroOutDesc", { dest: endPoint.name, min: walkFromStopMin }) }
          ]
        });
      }

      const altBus = nearStart.stop.buses[1] || nearStart.stop.buses[0];
      const total3 = total1 + 6;
      variants.push({
        badge: tr("busBadge", { b: altBus }),
        tag: tr("altTag"),
        totalMin: total3,
        departStr: fmtTime(walkToStopMin + wait1 + 4),
        arriveStr: fmtTime(total3),
        fare: "0.50 ₼ (BakıKart)",
        start: startPoint,
        end: endPoint,
        steps: [
          { type: "walk", time: fmtTime(0), title: tr("walkToTitle", { stop: stopTitle(nearStart.stop) }), desc: tr("walkToDesc", { m: Math.round(nearStart.distKm * 1000), min: walkToStopMin }) },
          { type: "board", time: fmtTime(walkToStopMin + wait1 + 4), title: tr("boardBusTitle", { b: altBus }), desc: tr("boardBusDesc", { wait: wait1 + 4, stops: stopsCount + 2, min: baseBusMin + 2 }) },
          { type: "exit", time: fmtTime(total3 - walkFromStopMin), title: tr("exitBusTitle", { stop: stopTitle(nearEnd.stop) }), desc: tr("exitBusDesc", { m: Math.round(nearEnd.distKm * 1000), min: walkFromStopMin, dest: endPoint.name }) }
        ]
      });

      currentRouteVariants = variants;
      varCard.style.display = "block";
      document.getElementById("trTimelineBox").style.display = "block";

      function selectVariant(idx) {
        varList.querySelectorAll(".tr-opt-card").forEach((c, i) => {
          c.classList.toggle("selected", i === idx);
        });
        renderRouteOnMap(currentRouteVariants[idx]);
        renderRouteTimeline(currentRouteVariants[idx]);
      }

      varList.innerHTML = variants.map((v, i) => `
        <div class="tr-opt-card ${i === 0 ? "selected" : ""}" data-vidx="${i}">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <span class="${v.badge.includes("🚇") ? "tr-pill-metro" : "tr-pill-bus"}">${v.badge}</span>
              <span style="font-size:11.5px;color:#64748b;margin-left:6px;font-weight:600">${v.tag}</span>
            </div>
            <b style="font-size:16px;color:#0f172a">${v.totalMin} ${isEn ? "min" : "мин"}</b>
          </div>
          <div style="font-size:12.5px;color:#475569;margin-top:6px;display:flex;justify-content:space-between">
            <span>${tr("depArr", { dep: v.departStr, arr: v.arriveStr })}</span>
            <span>${v.fare}</span>
          </div>
        </div>
      `).join("");

      varList.querySelectorAll("[data-vidx]").forEach(el => {
        el.onclick = () => selectVariant(+el.dataset.vidx);
      });

      selectVariant(0);
    } finally {
      calcBtn.disabled = false;
      calcBtn.textContent = tr("findBtn");
    }
  }

  function startAccurateGps(silent) {
    const bGps = document.getElementById("bTrGps");
    const fromInp = document.getElementById("trFromInp");
    if (!navigator.geolocation) {
      if (!silent && typeof window.toast === "function") window.toast("GPS not supported");
      return;
    }
    if (bGps) bGps.textContent = tr("gpsSearching");
    if (gpsWatchId !== null) navigator.geolocation.clearWatch(gpsWatchId);

    gpsWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        gpsCoords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        gpsAcc = Math.round(pos.coords.accuracy || 0);
        if (bGps) bGps.textContent = `📍 GPS ±${gpsAcc}m`;

        const near = findNearestStop(gpsCoords.lat, gpsCoords.lon);
        if (fromInp && !fromInp.value) {
          fromInp.placeholder = tr("fromGpsPh", { acc: gpsAcc, hub: stopTitle(near.stop) });
        }

        if (!document.getElementById("trToInp").value.trim()) {
          const hl = curLang();
          document.getElementById("trMapBox").innerHTML =
            `<iframe style="width:100%;height:100%;border:0" src="https://maps.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lon}&z=16&hl=${hl}&output=embed"></iframe>`;
        }
      },
      (err) => {
        if (bGps) bGps.textContent = tr("myGpsBtn");
        if (!silent && typeof window.toast === "function") {
          window.toast(err.code === 1 ? tr("gpsPermToast") : tr("gpsOffToast"));
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  document.getElementById("bTrGps").onclick = () => {
    document.getElementById("trFromInp").value = "";
    pickedFromObj = null;
    startAccurateGps(false);
  };
  document.getElementById("bTrCalc").onclick = buildGoogleAynaRoutes;
  document.getElementById("trToInp").onkeydown = (e) => {
    if (e.key === "Enter") {
      document.getElementById("trToSuggest").style.display = "none";
      buildGoogleAynaRoutes();
    }
  };

  window.openTransportHub = function () {
    applyTransitLanguage();
    trModal.style.display = "flex";
    startAccurateGps(true);
  };

  function mountHomeTransportIcons() {
    const topBar = document.querySelector(".side .top") || document.querySelector(".top");
    if (topBar && !document.getElementById("bTransTopBtn")) {
      const bTr = document.createElement("button");
      bTr.type = "button";
      bTr.className = "ic";
      bTr.id = "bTransTopBtn";
      bTr.title = "Transit (Google Maps & AYNA)";
      bTr.textContent = "🚌";
      bTr.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.openTransportHub();
      };
      const lsw = document.getElementById("lsw");
      if (lsw && lsw.parentNode === topBar) topBar.insertBefore(bTr, lsw);
      else topBar.appendChild(bTr);
    }

    if (!document.getElementById("bTransHomeFab")) {
      const fabTr = document.createElement("button");
      fabTr.type = "button";
      fabTr.id = "bTransHomeFab";
      fabTr.innerHTML = `<span>🚌</span><span>${tr("fabBtn")}</span>`;
      fabTr.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.openTransportHub();
      };
      document.body.appendChild(fabTr);
    }

    const fab = document.getElementById("bTransHomeFab");
    const authEl = document.getElementById("auth");
    const appEl = document.getElementById("app");
    if (fab) {
      const authVisible = authEl && authEl.style.display !== "none" && !authEl.hidden;
      const inMobileChat = (appEl && appEl.classList.contains("in-chat") && window.innerWidth < 768) ||
        (document.body.classList.contains("chat") && window.innerWidth < 768);
      fab.style.setProperty("display", (authVisible || inMobileChat) ? "none" : "flex", "important");
    }
  }

  mountHomeTransportIcons();
  setInterval(mountHomeTransportIcons, 500);

  if (typeof window.setLang === "function" && !window.setLang._trPatched) {
    const origSetLang = window.setLang;
    window.setLang = function () {
      const r = origSetLang.apply(this, arguments);
      applyTransitLanguage();
      injectTranslateButtons();
      if (document.getElementById("trToInp").value.trim()) buildGoogleAynaRoutes();
      return r;
    };
    window.setLang._trPatched = true;
  }

  const bApps = document.getElementById("bApps");
  if (bApps && !bApps._trPatched) {
    bApps._trPatched = true;
    const origClick = bApps.onclick;
    bApps.onclick = function (e) {
      if (origClick) origClick.call(this, e);
      setTimeout(() => {
        const grid = document.querySelector("#dlg .apps-grid");
        if (!grid || document.getElementById("aTransTile")) return;
        const tile = document.createElement("button");
        tile.className = "app-tile";
        tile.id = "aTransTile";
        tile.innerHTML = `<div class="app-ico">🚌</div><div class="app-name">${tr("tileName")}</div><span class="app-tag tr-badge">AYNA</span>`;
        tile.onclick = () => {
          const dlgEl = document.getElementById("dlg");
          if (dlgEl && dlgEl.open) dlgEl.close();
          window.openTransportHub();
        };
        const addBtn = document.getElementById("aAdd");
        if (addBtn) grid.insertBefore(tile, addBtn);
        else grid.appendChild(tile);
      }, 30);
    };
  }

  if (typeof window.draw === "function" && !window.draw._trPatched) {
    const origDraw = window.draw;
    window.draw = function () {
      const r = origDraw.apply(this, arguments);
      injectTranslateButtons();
      return r;
    };
    window.draw._trPatched = true;
  }
  injectTranslateButtons();
})();

/* =========================================================================
 * B. ПОИСК МУЗЫКИ (ITUNES + AUDIUS) С ПЕРЕВОДОМ RU / EN
 * ========================================================================= */
(function () {
  if (window._cwItunesSearchPatched) return;
  window._cwItunesSearchPatched = true;

  const isEn = () => (window.L || window.lang || "ru") === "en";
  const mTxt = (ru, en) => (isEn() ? en : ru);

  async function searchItunesTracks(query) {
    const q = encodeURIComponent((query || "").trim());
    if (!q) return [];
    try {
      const res = await fetch(`https://itunes.apple.com/search?term=${q}&media=music&entity=song&limit=15`);
      if (!res.ok) return [];
      const data = await res.json();
      const list = Array.isArray(data.results) ? data.results : [];
      return list
        .filter((item) => item.previewUrl)
        .map((item) => ({
          id: "itn-" + item.trackId,
          title: item.trackName || "Untitled",
          artist: item.artistName || "Artist",
          album: item.collectionName || "",
          url: item.previewUrl,
          artwork: item.artworkUrl100 || item.artworkUrl60 || "",
          sourceTag: "iTunes",
          isLive: false
        }));
    } catch (_) {
      return [];
    }
  }

  async function searchAudiusFallback(query) {
    const q = encodeURIComponent((query || "lofi").trim());
    const hosts = [
      "https://discoveryprovider.audius.co",
      "https://discovery-au-02.audius.co"
    ];
    for (const h of hosts) {
      try {
        const res = await fetch(`${h}/v1/tracks/search?query=${q}&app_name=ChatWay`);
        if (!res.ok) continue;
        const json = await res.json();
        const list = Array.isArray(json.data) ? json.data : [];
        return list.slice(0, 12).map((item) => ({
          id: "aud-" + item.id,
          title: item.title || "Untitled",
          artist: (item.user && (item.user.name || item.user.handle)) || "Audius Artist",
          album: "",
          url: `${h}/v1/tracks/${item.id}/stream?app_name=ChatWay`,
          artwork: (item.artwork && (item.artwork["150x150"] || item.artwork["480x480"])) || "",
          sourceTag: "Audius",
          isLive: false
        }));
      } catch (_) {}
    }
    return [];
  }

  function patchMusicSearch() {
    const inp = document.getElementById("musSearchInp");
    const btn = document.getElementById("bMusSearch");
    const listBox = document.getElementById("musSearchList");
    if (!inp || !btn || !listBox || btn._cwItunesHooked) return;
    btn._cwItunesHooked = true;

    inp.placeholder = mTxt("Введите известную песню, артиста или трек…", "Enter a song, artist or track…");

    const runCombinedSearch = async () => {
      const query = inp.value.trim();
      if (!query) return;
      const oldText = btn.textContent;
      btn.disabled = true;
      btn.textContent = "⏳";
      listBox.innerHTML = `<div class="mus-sub" style="padding:12px;text-align:center">${mTxt(`Ищем «${query}» в iTunes и Audius…`, `Searching «${query}» on iTunes & Audius…`)}</div>`;

      try {
        const [itunesHits, audiusHits] = await Promise.all([
          searchItunesTracks(query),
          searchAudiusFallback(query)
        ]);
        const combined = [...itunesHits, ...audiusHits];

        if (!combined.length) {
          listBox.innerHTML = `<div class="mus-sub" style="padding:12px;text-align:center">${mTxt("Ничего не найдено. Попробуйте другой запрос.", "Nothing found. Try another query.")}</div>`;
          return;
        }

        listBox.innerHTML = "";
        combined.forEach((trackItem) => {
          const row = document.createElement("div");
          row.className = "mus-track";
          row.innerHTML = `
            <div class="mus-cover">${
              trackItem.artwork
                ? `<img src="${trackItem.artwork}" style="width:100%;height:100%;border-radius:11px;object-fit:cover" alt="">`
                : "🎵"
            }</div>
            <div class="mus-meta">
              <div class="mus-title">${trackItem.title}</div>
              <div class="mus-sub">${trackItem.artist}${trackItem.album ? " · " + trackItem.album : ""} · <b>${trackItem.sourceTag}</b></div>
            </div>
            <div class="mus-acts">
              <button class="mus-mini-btn act-play" title="${mTxt("Воспроизвести", "Play")}">▶</button>
              <button class="mus-mini-btn act-pin" title="${mTxt("В профиль", "Pin to profile")}">📌</button>
              <button class="mus-mini-btn act-send" title="${mTxt("В чат", "Send to chat")}">📤</button>
            </div>
          `;

          row.querySelector(".act-play").onclick = () => {
            if (typeof window.playTrack === "function") {
              window.playTrack(trackItem);
            } else if (window._cwBgAudio) {
              window._cwBgAudio.src = trackItem.url;
              window._cwBgAudio.play().catch(() => {});
            }
          };

          row.querySelector(".act-pin").onclick = () => {
            localStorage.setItem("cw_profile_music_track", JSON.stringify(trackItem));
            if (typeof window.toast === "function") {
              window.toast(mTxt(`⭐ В профиле: ${trackItem.title}`, `⭐ Pinned to profile: ${trackItem.title}`));
            }
          };

          row.querySelector(".act-send").onclick = async () => {
            if (window.cur && typeof window.put === "function") {
              await window.put({ kind: "t", body: `🎵 ${trackItem.title} — ${trackItem.artist}\n🔗 ${trackItem.url}` });
              if (typeof window.toast === "function") {
                window.toast(mTxt("🎵 Трек отправлен в чат!", "🎵 Track sent to chat!"));
              }
            } else if (typeof window.toast === "function") {
              window.toast(mTxt("Сначала откройте чат!", "Open a chat first!"));
            }
          };

          listBox.appendChild(row);
        });
      } finally {
        btn.disabled = false;
        btn.textContent = oldText || mTxt("Найти", "Search");
      }
    };

    btn.onclick = runCombinedSearch;
    inp.onkeydown = (e) => {
      if (e.key === "Enter") runCombinedSearch();
    };
  }

  const obs = new MutationObserver(() => patchMusicSearch());
  obs.observe(document.body, { childList: true, subtree: true });
  patchMusicSearch();
})();

/* =========================================================================
 * C. ЖУРНАЛ И АНИМАЦИЯ ЗАВЕРШЕНИЯ ЗВОНКОВ (RU / EN)
 * ========================================================================= */
(function () {
  if (window._cwCallModLoaded) return;
  window._cwCallModLoaded = true;

  const isRu = () => (window.L || window.lang || "ru") !== "en";
  const cTxt = (ru, en) => (isRu() ? ru : en);

  let modCallerId = null;
  let modConnected = false;
  let modLastPeer = null;
  let modLastVid = true;
  let modLastSec = 0;

  if (typeof window.startCallTimer === "function") {
    const origStartTimer = window.startCallTimer;
    window.startCallTimer = function () {
      modConnected = true;
      return origStartTimer.apply(this, arguments);
    };
  }

  if (typeof window.showCallUi === "function") {
    const origShowCallUi = window.showCallUi;
    window.showCallUi = function (peerId, withVideo, st) {
      modLastPeer = peerId;
      modLastVid = withVideo;
      if (!modCallerId && typeof window.uid !== "undefined") modCallerId = window.uid;
      return origShowCallUi.apply(this, arguments);
    };
  }

  if (typeof window.sig === "function") {
    const origSig = window.sig;
    window.sig = async function (s) {
      if (s && s.kind === "offer" && typeof window.uid !== "undefined" && s.to === window.uid) {
        modCallerId = s.from;
        modLastPeer = s.from;
        modLastVid = s.data && s.data.video !== false;
        modConnected = false;
      }
      return origSig.apply(this, arguments);
    };
  }

  setInterval(() => {
    if (window.callTimer && window.callSec > 0) {
      modLastSec = window.callSec;
    }
  }, 400);

  function playEndTone() {
    try {
      const ctx = typeof window.getAudioCtx === "function"
        ? window.getAudioCtx()
        : new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;
      [523.25, 392.0, 329.63].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(f, now + i * 0.11);
        g.gain.setValueAtTime(0.001, now + i * 0.11);
        g.gain.exponentialRampToValueAtTime(0.14, now + i * 0.11 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.11 + 0.28);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(now + i * 0.11);
        o.stop(now + i * 0.11 + 0.3);
      });
    } catch (e) {}
  }

  async function saveCallLog(peerId, vid, dur, callerId, missed) {
    if (!peerId || !Array.isArray(window.chats) || typeof window.put !== "function") return;
    const dm = window.chats.find(c => !c.is_group && (c.user_a === peerId || c.user_b === peerId));
    if (!dm) return;
    const payload = JSON.stringify({
      vid: !!vid,
      dur: dur || 0,
      caller: callerId || window.uid,
      missed: !!missed
    });
    await window.put({ kind: "t", body: "📞CALL:" + payload }, dm.id);
  }

  if (typeof window.hang === "function") {
    const origHang = window.hang;
    window.hang = function () {
      const cEl = document.getElementById("call");
      const wasOpen = cEl && cEl.style.display === "flex";
      const dur = modConnected ? Math.max(window.callSec || 0, modLastSec) : 0;
      const wasConn = modConnected;

      const res = origHang.apply(this, arguments);

      if (wasOpen) {
        playEndTone();
        cEl.style.display = "flex";
        cEl.classList.remove("mini");

        const bn = document.createElement("div");
        bn.className = "call-end-banner";
        const mins = Math.floor(dur / 60), secs = dur % 60;
        const durStr = wasConn
          ? (mins > 0 ? cTxt(`${mins} мин ${secs} сек`, `${mins}m ${secs}s`) : cTxt(`${secs} сек`, `${secs}s`))
          : cTxt("Вызов завершён", "Call ended");

        bn.innerHTML = `<div class="call-end-ico">📵</div><b style="font-size:20px">${cTxt("Звонок завершён", "Call ended")}</b><span style="color:#ccc;font-size:14px">${durStr}</span>`;
        cEl.appendChild(bn);

        setTimeout(() => cEl.classList.add("ending"), 450);
        setTimeout(() => {
          cEl.style.display = "none";
          cEl.classList.remove("ending");
          bn.remove();
        }, 900);
      }

      modConnected = false;
      modLastSec = 0;
      modCallerId = null;
      return res;
    };
  }

  const bEnd = document.getElementById("bEnd");
  if (bEnd) {
    const prevClick = bEnd.onclick;
    bEnd.onclick = function (e) {
      const pId = window.callPeerId || modLastPeer;
      const vid = window.callIsVideo !== undefined ? window.callIsVideo : modLastVid;
      const dur = modConnected ? Math.max(window.callSec || 0, modLastSec) : 0;
      const caller = modCallerId || window.uid;
      const missed = !modConnected;

      if (pId) saveCallLog(pId, vid, dur, caller, missed);
      if (prevClick) return prevClick.call(this, e);
    };
  }

  if (typeof window.draw === "function") {
    const origDraw = window.draw;
    window.draw = function (first) {
      const r = origDraw.apply(this, arguments);
      const msEl = document.getElementById("ms");
      if (!msEl) return r;

      msEl.querySelectorAll(".m").forEach(bubble => {
        if (bubble.dataset.callParsed) return;
        const rawText = bubble.textContent || "";
        const idx = rawText.indexOf("📞CALL:");
        if (idx === -1) return;

        const jsonMatch = rawText.slice(idx + 7).match(/^\{.*?\}/);
        if (!jsonMatch) return;

        try {
          const info = JSON.parse(jsonMatch[0]);
          const callerName = typeof window.pname === "function" ? window.pname(info.caller) : cTxt("Пользователь", "User");
          const callType = info.vid ? cTxt("Видеозвонок", "Video call") : cTxt("Аудиозвонок", "Audio call");

          let durText = "";
          if (info.missed || !info.dur) {
            durText = cTxt("Пропущенный / отменён", "Missed / cancelled");
          } else {
            const mins = Math.floor(info.dur / 60), secs = info.dur % 60;
            durText = mins > 0
              ? cTxt(`${mins} мин ${secs} сек`, `${mins}m ${secs}s`)
              : cTxt(`${secs} сек`, `${secs}s`);
          }

          const smallEl = bubble.querySelector("small");
          const timeStr = smallEl ? smallEl.textContent.trim() : "";

          bubble.dataset.callParsed = "1";
          bubble.className = `m call-log ${info.missed || !info.dur ? "missed" : ""}`;
          bubble.innerHTML = `<div class="cl-ico">${info.vid ? "🎥" : "📞"}</div><div><b>${callType} · ${callerName}</b><div class="sub">${durText}</div><small>${timeStr}</small></div>`;
        } catch (e) {}
      });
      return r;
    };
  }
})();

/* =========================================================================
 * D. LIVE СИНХРОНИЗАЦИЯ С БАЗОЙ И ВОССТАНОВЛЕНИЕ ПОСЛЕ ПАУЗЫ
 * ========================================================================= */
(() => {
  if (window._cwLiveEngine) return;
  window._cwLiveEngine = true;

  let pgChannel = null;

  function initLiveDB() {
    if (typeof window.SB === "undefined" || typeof window.uid === "undefined" || !window.uid) return;
    if (pgChannel) return;

    pgChannel = window.SB.channel("cw_live_db_" + window.uid)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        const m = payload.new;
        if (!m) return;
        if (typeof window.cur !== "undefined" && m.chat_id === window.cur && Array.isArray(window.msgs)) {
          if (!window.msgs.some(x => x.id === m.id)) {
            window.msgs.push(m);
            if (typeof window.draw === "function") window.draw();
            const ms = document.getElementById("ms");
            if (ms) ms.scrollTop = ms.scrollHeight;
          }
        }
        if (typeof window.loadChats === "function") window.loadChats();
      })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "messages" }, payload => {
        const old = payload.old;
        if (!old || !Array.isArray(window.msgs)) return;
        const idx = window.msgs.findIndex(x => x.id === old.id);
        if (idx !== -1) {
          window.msgs.splice(idx, 1);
          if (typeof window.draw === "function") window.draw();
        }
        if (typeof window.loadChats === "function") window.loadChats();
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages" }, payload => {
        const upd = payload.new;
        if (!upd || !Array.isArray(window.msgs)) return;
        const idx = window.msgs.findIndex(x => x.id === upd.id);
        if (idx !== -1) {
          window.msgs[idx] = { ...window.msgs[idx], ...upd };
          if (typeof window.draw === "function") window.draw();
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_members" }, () => {
        if (typeof window.loadChats === "function") window.loadChats();
      })
      .subscribe(status => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          window.SB.removeChannel(pgChannel);
          pgChannel = null;
          setTimeout(initLiveDB, 2000);
        }
      });
  }

  async function syncOnResume() {
    if (typeof window.loadChats === "function") await window.loadChats();
    if (typeof window.cur !== "undefined" && window.cur && typeof window.SB !== "undefined") {
      const { data } = await window.SB.from("messages")
        .select("*")
        .eq("chat_id", window.cur)
        .order("created_at", { ascending: true })
        .limit(100);
      if (data && Array.isArray(window.msgs) && data.length !== window.msgs.length) {
        window.msgs.length = 0;
        window.msgs.push(...data);
        if (typeof window.draw === "function") window.draw();
      }
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) syncOnResume();
  });
  window.addEventListener("online", syncOnResume);

  setInterval(initLiveDB, 1000);
})();

/* =========================================================================
 * E. ИСТОРИИ 24Ч, АРХИВ, ГАЛОЧКИ, VIEW ONCE, ПОИСК И ГРУППОВОЙ ЗВОНОК (RU / EN)
 * ========================================================================= */
(() => {
  if (window._waPackTimer) clearInterval(window._waPackTimer);

  const isEn = () => (window.L || window.lang || "ru") === "en";
  const wTxt = (ru, en) => (isEn() ? en : ru);
  const wToast = (msg) => { if (typeof window.toast === "function") window.toast(msg); };
  const wDlg = (html) => (typeof window.dlg === "function" ? window.dlg(html) : null);

  localStorage.removeItem("cw_wa_hidden");
  localStorage.removeItem("cw_wa_pin");

  let stories = JSON.parse(localStorage.getItem("cw_wa_stories") || "[]");
  let seenStories = new Set(JSON.parse(localStorage.getItem("cw_wa_seen_st") || "[]"));
  let readMsgs = new Set(JSON.parse(localStorage.getItem("cw_wa_read") || "[]"));
  let openedVo = new Set(JSON.parse(localStorage.getItem("cw_wa_vo") || "[]"));
  let archivedChats = new Set(JSON.parse(localStorage.getItem("cw_wa_arch") || "[]"));
  let showArchivedView = false;
  let viewOnceArmed = false;
  let isCallOnHold = false;
  let searchMatches = [];
  let searchIdx = 0;

  function cleanOldStories() {
    const dayAgo = Date.now() - 24 * 3600 * 1000;
    const fresh = stories.filter(s => s.ts > dayAgo);
    if (fresh.length !== stories.length) {
      stories = fresh;
      localStorage.setItem("cw_wa_stories", JSON.stringify(stories));
    }
  }

  function renderStoriesBar() {
    cleanOldStories();
    const side = document.querySelector(".side");
    const list = document.getElementById("chats");
    if (!side || !list || typeof window.uid === "undefined" || !window.uid) return;

    let bar = document.getElementById("cwStoriesBar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "cwStoriesBar";
      bar.className = "cw-stories";
      side.insertBefore(bar, list);
    }

    const mySt = stories.filter(s => s.uid === window.uid);
    const others = stories.filter(s => s.uid !== window.uid);
    const byUser = {};
    others.forEach(s => { (byUser[s.uid] = byUser[s.uid] || []).push(s); });

    let html = `
      <div class="cw-st-item" id="cwAddStoryBtn">
        <div class="cw-st-ring ${mySt.length ? "" : "seen"}">
          <div class="cw-st-inner">${mySt.length && mySt[mySt.length - 1].img ? `<img src="${mySt[mySt.length - 1].img}">` : "➕"}</div>
        </div>
        <div class="cw-st-name">${wTxt("Мой статус", "My status")}</div>
      </div>
    `;

    Object.entries(byUser).forEach(([uId, listSt]) => {
      const last = listSt[listSt.length - 1];
      const allSeen = listSt.every(x => seenStories.has(x.id));
      html += `
        <div class="cw-st-item" data-view-st="${uId}">
          <div class="cw-st-ring ${allSeen ? "seen" : ""}">
            <div class="cw-st-inner">${last.img ? `<img src="${last.img}">` : (last.name || "?").slice(0, 1).toUpperCase()}</div>
          </div>
          <div class="cw-st-name">${last.name || wTxt("Друг", "Friend")}</div>
        </div>
      `;
    });

    if (bar.dataset.lastHtml !== html) {
      bar.dataset.lastHtml = html;
      bar.innerHTML = html;
      document.getElementById("cwAddStoryBtn").onclick = () => {
        if (mySt.length && confirm(wTxt("Посмотреть свой статус? (Нажмите «Отмена», чтобы добавить новый)", "View your status? (Press Cancel to add a new one)"))) {
          openStoryViewer(mySt);
        } else {
          openCreateStory();
        }
      };
      bar.querySelectorAll("[data-view-st]").forEach(el => {
        el.onclick = () => openStoryViewer(byUser[el.dataset.viewSt] || []);
      });
    }
  }

  function openCreateStory() {
    const d = wDlg(`
      <h3 style="margin:0 0 8px">🟢 ${wTxt("Новый статус (на 24 часа)", "New status (24 hours)")}</h3>
      <textarea class="f" id="stTxt" rows="3" placeholder="${wTxt("Напишите текст статуса…", "Write status text…")}"></textarea>
      <input type="file" id="stFile" accept="image/*" class="f">
      <div class="acts">
        <button class="txt" id="no">${wTxt("Отмена", "Cancel")}</button>
        <button class="btn" id="stPub">${wTxt("Опубликовать", "Publish")}</button>
      </div>
    `);
    if (!d) return;
    document.getElementById("stPub").onclick = async () => {
      const txt = document.getElementById("stTxt").value.trim();
      const f = document.getElementById("stFile").files[0];
      if (!txt && !f) return wToast(wTxt("Добавьте текст или фото", "Add text or a photo"));
      let imgUrl = "";
      if (f && typeof window.upload === "function" && typeof window.small === "function") {
        wToast(wTxt("Загрузка статуса…", "Uploading status…"));
        imgUrl = await window.upload(await window.small(f, 900, 0.8), "story.jpg");
      }
      const st = {
        id: "st_" + Date.now(),
        uid: window.uid,
        name: (window.prof && window.prof.name) || wTxt("Я", "Me"),
        text: txt,
        img: imgUrl,
        ts: Date.now()
      };
      stories.push(st);
      localStorage.setItem("cw_wa_stories", JSON.stringify(stories));
      if (window._rtCh) {
        window._rtCh.send({ type: "broadcast", event: "wa_story", payload: st });
      }
      d.close();
      renderStoriesBar();
      wToast(wTxt("✅ Статус опубликован на 24 часа", "✅ Status published for 24 hours"));
    };
  }

  function openStoryViewer(listSt) {
    if (!listSt.length) return;
    let i = 0;
    const show = () => {
      const s = listSt[i];
      if (!s) return;
      seenStories.add(s.id);
      localStorage.setItem("cw_wa_seen_st", JSON.stringify([...seenStories]));
      renderStoriesBar();
      const d = wDlg(`
        <div style="text-align:center">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <b>${s.name}</b>
            <span class="sub">${new Date(s.ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          ${s.img ? `<img src="${s.img}" style="max-width:100%;max-height:55vh;border-radius:16px;margin-bottom:8px">` : ""}
          ${s.text ? `<div style="padding:14px;border-radius:16px;background:var(--pc);color:var(--opc);font-size:17px;font-weight:500">${s.text}</div>` : ""}
          <div class="acts" style="justify-content:space-between">
            <button class="txt" id="no">${wTxt("Закрыть", "Close")}</button>
            ${i + 1 < listSt.length ? `<button class="btn" id="stNext">${wTxt("Далее →", "Next →")}</button>` : ""}
          </div>
        </div>
      `);
      if (!d) return;
      const nxt = document.getElementById("stNext");
      if (nxt) nxt.onclick = () => { d.close(); i++; show(); };
    };
    show();
  }

  function applyChatArchive() {
    const list = document.getElementById("chats");
    if (!list) return;

    let archBtn = document.getElementById("cwArchBanner");
    if (archivedChats.size > 0) {
      if (!archBtn) {
        archBtn = document.createElement("div");
        archBtn.id = "cwArchBanner";
        archBtn.className = "cw-arch-bar";
        list.insertBefore(archBtn, list.firstChild);
        archBtn.onclick = () => {
          showArchivedView = !showArchivedView;
          applyChatArchive();
        };
      }
      const archHtml = showArchivedView
        ? `<span>${wTxt("← Назад ко всем чатам", "← Back to all chats")}</span><span>📦 (${archivedChats.size})</span>`
        : `<span>${wTxt("📦 В архиве", "📦 Archived")}</span><span>${archivedChats.size}</span>`;
      if (archBtn.innerHTML !== archHtml) archBtn.innerHTML = archHtml;
    } else if (archBtn) {
      archBtn.remove();
      showArchivedView = false;
    }

    list.querySelectorAll(".row").forEach(row => {
      const cid = row.dataset.id;
      const isArch = archivedChats.has(cid);
      const hide = showArchivedView ? !isArch : isArch;
      row.classList.toggle("cw-chat-hidden-force", hide);
    });
  }

  function attachChatObserver() {
    const list = document.getElementById("chats");
    if (!list || list.dataset.waObs) return;
    list.dataset.waObs = "1";
    const obs = new MutationObserver(() => applyChatArchive());
    obs.observe(list, { childList: true });
  }

  if (typeof window.openChatThreeDots === "function" && !window.openChatThreeDots._waArchHooked) {
    const origThreeDots = window.openChatThreeDots;
    window.openChatThreeDots = function () {
      origThreeDots.apply(this, arguments);
      const d = document.getElementById("dlg");
      if (!d || typeof window.cur === "undefined" || !window.cur) return;
      const acts = d.querySelector(".acts");
      if (!acts) return;

      const isArch = archivedChats.has(window.cur);
      const btnArch = document.createElement("button");
      btnArch.className = "row";
      btnArch.innerHTML = `<div style="font-size:22px">📦</div><div><b>${isArch ? wTxt("Убрать из архива", "Unarchive chat") : wTxt("В архив чатов", "Archive chat")}</b><div class="sub">${wTxt("Переместить переписку в верхнюю папку", "Move chat to top archive folder")}</div></div>`;
      btnArch.onclick = () => {
        if (isArch) archivedChats.delete(window.cur);
        else archivedChats.add(window.cur);
        localStorage.setItem("cw_wa_arch", JSON.stringify([...archivedChats]));
        d.close();
        applyChatArchive();
        wToast(isArch ? wTxt("Чат возвращён из архива", "Chat unarchived") : wTxt("📦 Чат перемещён в архив", "📦 Chat archived"));
      };

      d.insertBefore(btnArch, acts);
    };
    window.openChatThreeDots._waArchHooked = true;
  }

  function enhanceChatMessages() {
    const ms = document.getElementById("ms");
    if (!ms || !Array.isArray(window.msgs) || typeof window.uid === "undefined") return;

    if (window.cur && !document.hidden && window._rtCh) {
      const unreadIncoming = window.msgs.filter(m => m.sender !== window.uid && !m._readSent);
      if (unreadIncoming.length) {
        const ids = unreadIncoming.map(m => { m._readSent = true; return m.id; });
        window._rtCh.send({ type: "broadcast", event: "wa_read", payload: { chat: window.cur, ids } });
      }
    }

    ms.querySelectorAll(".m").forEach((el, idx) => {
      const m = window.msgs[idx];
      if (!m) return;

      if (m.sender === window.uid) {
        const sm = el.querySelector("small");
        if (sm && !sm.querySelector(".cw-ticks")) {
          const isRead = readMsgs.has(m.id);
          const sp = document.createElement("span");
          sp.className = "cw-ticks" + (isRead ? " read" : "");
          sp.textContent = isRead ? "✓✓" : "✓";
          sm.appendChild(sp);
        } else if (sm && readMsgs.has(m.id)) {
          const sp = sm.querySelector(".cw-ticks");
          if (sp && !sp.classList.contains("read")) {
            sp.classList.add("read");
            sp.textContent = "✓✓";
          }
        }
      }

      if (m.kind === "img" && m.name && m.name.startsWith("viewonce_") && !el.dataset.voDone) {
        el.dataset.voDone = "1";
        const img = el.querySelector("img");
        const isOpened = openedVo.has(m.id);
        const btn = document.createElement("button");
        btn.className = "cw-vo-btn" + (isOpened ? " opened" : "");
        btn.innerHTML = isOpened
          ? wTxt("⭕ Фото просмотрено", "⭕ Photo viewed")
          : wTxt("1️⃣ Фото (однократный просмотр)", "1️⃣ View-once photo");
        if (!isOpened) {
          btn.onclick = () => {
            openedVo.add(m.id);
            localStorage.setItem("cw_wa_vo", JSON.stringify([...openedVo]));
            const d = wDlg(`
              <div style="text-align:center">
                <div class="sub" style="margin-bottom:8px">${wTxt("1️⃣ Фото исчезнет сразу после закрытия", "1️⃣ Photo disappears right after closing")}</div>
                <img src="${m.url}" style="max-width:100%;max-height:72vh;border-radius:14px">
                <div class="acts"><button class="btn" id="no">${wTxt("Закрыть и удалить", "Close & hide")}</button></div>
              </div>
            `);
            if (d) d.onclose = () => enhanceChatMessages();
          };
        }
        if (img) img.replaceWith(btn);
      }
    });
  }

  if (typeof window.sendFile === "function" && !window.sendFile._waVo) {
    const origSendFile = window.sendFile;
    window.sendFile = async function (f) {
      if (viewOnceArmed && f && f.type && f.type.startsWith("image/")) {
        viewOnceArmed = false;
        const btnVo = document.getElementById("cwVoToggle");
        if (btnVo) btnVo.style.background = "";
        const renamed = new File([f], "viewonce_" + f.name, { type: f.type });
        return origSendFile.call(this, renamed);
      }
      return origSendFile.call(this, f);
    };
    window.sendFile._waVo = true;
  }

  if (typeof window.msgMenu === "function" && !window.msgMenu._waHooked) {
    const prevMsgMenu = window.msgMenu;
    window.msgMenu = function (id) {
      prevMsgMenu.apply(this, arguments);
      const d = document.getElementById("dlg");
      const m = (Array.isArray(window.msgs) ? window.msgs : []).find(x => x.id === id);
      if (!d || !m) return;
      const acts = d.querySelector(".acts");
      if (!acts) return;

      const delMe = document.createElement("button");
      delMe.className = "row";
      delMe.innerHTML = `<div>🗑️ <b style="color:var(--err)">${wTxt("Удалить у себя", "Delete for me")}</b></div>`;
      delMe.onclick = () => {
        const i = window.msgs.findIndex(x => x.id === id);
        if (i !== -1) { window.msgs.splice(i, 1); if (typeof window.draw === "function") window.draw(); }
        d.close();
        wToast(wTxt("Удалено у вас", "Deleted for you"));
      };
      d.insertBefore(delMe, acts);

      if (m.sender === window.uid && typeof window.SB !== "undefined") {
        const delAll = document.createElement("button");
        delAll.className = "row";
        delAll.innerHTML = `<div>🚫 <b style="color:var(--err)">${wTxt("Удалить у всех", "Delete for everyone")}</b></div>`;
        delAll.onclick = async () => {
          d.close();
          await window.SB.from("messages").delete().eq("id", id);
          const i = window.msgs.findIndex(x => x.id === id);
          if (i !== -1) { window.msgs.splice(i, 1); if (typeof window.draw === "function") window.draw(); }
          wToast(wTxt("Удалено у всех", "Deleted for everyone"));
        };
        d.insertBefore(delAll, acts);
      }
    };
    window.msgMenu._waHooked = true;
  }

  function ensureChatHeaderTools() {
    if (typeof window.cur === "undefined" || !window.cur) return;
    const top = document.querySelector("#main .top");
    const dots = document.getElementById("bChatDots");
    if (!top || !dots) return;

    if (!document.getElementById("cwSearchBtn")) {
      const sBtn = document.createElement("button");
      sBtn.id = "cwSearchBtn";
      sBtn.className = "ic";
      sBtn.title = wTxt("Поиск по сообщениям", "Search messages");
      sBtn.textContent = "🔍";
      sBtn.onclick = toggleChatSearch;
      top.insertBefore(sBtn, dots);
    }

    const c = typeof window.byId === "function" ? window.byId(window.cur) : null;
    const bVid = document.getElementById("bVid");
    if (c && c.is_group && bVid) {
      bVid.style.display = "grid";
      bVid.title = wTxt("Групповой видеозвонок", "Group video call");
      bVid.onclick = () => startGroupVideoCall(c);
    }

    const bar = document.querySelector("#bar .bar");
    const att = document.getElementById("bAtt");
    if (bar && att && !document.getElementById("cwVoToggle")) {
      const voBtn = document.createElement("button");
      voBtn.id = "cwVoToggle";
      voBtn.className = "ic";
      voBtn.title = wTxt("Следующее фото — однократный просмотр", "Next photo — view once");
      voBtn.textContent = "1️⃣";
      voBtn.onclick = () => {
        viewOnceArmed = !viewOnceArmed;
        voBtn.style.background = viewOnceArmed ? "var(--pc)" : "";
        wToast(viewOnceArmed
          ? wTxt("1️⃣ Выберите фото для однократного просмотра", "1️⃣ Pick a photo for view-once")
          : wTxt("Однократный просмотр отменён", "View-once cancelled"));
      };
      bar.insertBefore(voBtn, att.nextSibling);
    }
  }

  function toggleChatSearch() {
    let sb = document.getElementById("cwSearchBar");
    if (sb) { sb.remove(); return; }
    const top = document.querySelector("#main .top");
    if (!top) return;
    sb = document.createElement("div");
    sb.id = "cwSearchBar";
    sb.className = "cw-search-bar";
    sb.innerHTML = `
      <input id="cwSearchInp" placeholder="${wTxt("Поиск по сообщениям…", "Search messages…")}">
      <span id="cwSearchCnt" class="sub">0</span>
      <button class="ic" id="cwSearchPrev">↑</button>
      <button class="ic" id="cwSearchNext">↓</button>
      <button class="ic" id="cwSearchClose">✕</button>
    `;
    top.insertAdjacentElement("afterend", sb);

    const inp = document.getElementById("cwSearchInp");
    const cnt = document.getElementById("cwSearchCnt");
    const jump = dir => {
      if (!searchMatches.length) return;
      searchIdx = (searchIdx + dir + searchMatches.length) % searchMatches.length;
      cnt.textContent = `${searchIdx + 1}/${searchMatches.length}`;
      const el = searchMatches[searchIdx];
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.style.outline = "2px solid var(--p)";
      setTimeout(() => { el.style.outline = ""; }, 1200);
    };

    inp.oninput = () => {
      const q = inp.value.trim().toLowerCase();
      searchMatches = [];
      searchIdx = 0;
      if (q) {
        document.querySelectorAll("#ms .m").forEach(el => {
          if (el.textContent.toLowerCase().includes(q)) searchMatches.push(el);
        });
      }
      cnt.textContent = searchMatches.length ? `1/${searchMatches.length}` : "0";
      if (searchMatches.length) jump(0);
    };
    document.getElementById("cwSearchPrev").onclick = () => jump(-1);
    document.getElementById("cwSearchNext").onclick = () => jump(1);
    document.getElementById("cwSearchClose").onclick = () => sb.remove();
    inp.focus();
  }

  function startGroupVideoCall(groupChat) {
    const room = "ChatWay_Group_" + groupChat.id.replace(/[^a-zA-Z0-9]/g, "");
    const displayName = (window.prof && window.prof.name) || "User";
    const url = `https://meet.jit.si/${room}#config.prejoinPageEnabled=false&userInfo.displayName="${encodeURIComponent(displayName)}"`;
    if (typeof window.put === "function") {
      window.put({ kind: "t", body: `📹 ${wTxt("Присоединяйтесь к групповому видеозвонку", "Join group video call")}: https://meet.jit.si/${room}` });
    }
    const modal = document.createElement("div");
    modal.id = "cwGrpCallModal";
    modal.innerHTML = `
      <div class="yt-bar">
        <button class="ic" id="cwCloseGrpCall">←</button>
        <b style="flex:1">📹 ${wTxt("Групповой звонок", "Group call")}: ${groupChat.title || wTxt("Группа", "Group")}</b>
      </div>
      <iframe src="${url}" allow="camera; microphone; fullscreen; display-capture" style="flex:1;width:100%;border:0"></iframe>
    `;
    document.body.appendChild(modal);
    document.getElementById("cwCloseGrpCall").onclick = () => modal.remove();
  }

  function ensureCallHoldButton() {
    const ctrls = document.querySelector("#call .call-ctrls");
    const endBtn = document.getElementById("bEnd");
    if (!ctrls || !endBtn || document.getElementById("cwHoldBtn")) return;

    const holdBtn = document.createElement("button");
    holdBtn.id = "cwHoldBtn";
    holdBtn.className = "call-btn";
    holdBtn.title = wTxt("Удержание звонка (Hold)", "Call hold");
    holdBtn.textContent = "⏸️";
    holdBtn.onclick = () => {
      if (typeof window.stream === "undefined" || !window.stream) return;
      isCallOnHold = !isCallOnHold;
      window.stream.getTracks().forEach(tr => { tr.enabled = !isCallOnHold; });
      holdBtn.classList.toggle("on", isCallOnHold);
      const stEl = document.getElementById("callTopState");
      if (stEl) stEl.textContent = isCallOnHold ? wTxt("⏸️ На удержании", "⏸️ On hold") : wTxt("Разговор", "Connected");
      wToast(isCallOnHold ? wTxt("⏸️ Звонок поставлен на удержание", "⏸️ Call placed on hold") : wTxt("▶️ Звонок снят с удержания", "▶️ Call resumed"));
    };
    ctrls.insertBefore(holdBtn, endBtn);
  }

  window._waPackTimer = setInterval(() => {
    if (window._rtCh && !window._rtCh._waSub) {
      window._rtCh._waSub = true;
      window._rtCh
        .on("broadcast", { event: "wa_story" }, ({ payload }) => {
          if (!payload || stories.some(x => x.id === payload.id)) return;
          stories.push(payload);
          localStorage.setItem("cw_wa_stories", JSON.stringify(stories));
          renderStoriesBar();
        })
        .on("broadcast", { event: "wa_read" }, ({ payload }) => {
          if (!payload || !Array.isArray(payload.ids)) return;
          payload.ids.forEach(id => readMsgs.add(id));
          localStorage.setItem("cw_wa_read", JSON.stringify([...readMsgs]));
          enhanceChatMessages();
        });
    }
    attachChatObserver();
    renderStoriesBar();
    applyChatArchive();
    ensureChatHeaderTools();
    enhanceChatMessages();
    ensureCallHoldButton();
  }, 450);
})();

/* =========================================================================
 * F. ПАПКИ, ЗАКРЕПЛЁННЫЕ СООБЩЕНИЯ, ЦИТАТЫ, РЕАКЦИИ, TTL И ВИДЕОКРУЖОЧКИ (RU / EN)
 * ========================================================================= */
(() => {
  if (window._tgPackLoaded) return;
  window._tgPackLoaded = true;

  const isEn = () => (window.L || window.lang || "ru") === "en";
  const gTxt = (ru, en) => (isEn() ? en : ru);
  const gToast = (msg) => { if (typeof window.toast === "function") window.toast(msg); };

  let activeFolder = "all";
  let replyDraft = null;
  let ttlSeconds = 0;
  let reactionsMap = JSON.parse(localStorage.getItem("cw_tg_reacts") || "{}");
  let pinsMap = JSON.parse(localStorage.getItem("cw_tg_pins") || "{}");

  function ensureFolders() {
    const side = document.querySelector(".side");
    const list = document.getElementById("chats");
    if (!side || !list) return;

    let bar = document.getElementById("cwFoldersBar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "cwFoldersBar";
      bar.className = "cw-folders";
      bar.innerHTML = `
        <button data-f="all" class="on">${gTxt("Все", "All")}</button>
        <button data-f="personal">${gTxt("Личные", "Direct")}</button>
        <button data-f="groups">${gTxt("Группы", "Groups")}</button>
        <button data-f="unread">${gTxt("Непрочитанные", "Unread")}</button>
      `;
      side.insertBefore(bar, list);
      bar.querySelectorAll("button").forEach(btn => {
        btn.onclick = () => {
          activeFolder = btn.dataset.f;
          bar.querySelectorAll("button").forEach(x => x.classList.toggle("on", x === btn));
          filterChatList();
        };
      });
    }
    filterChatList();
  }

  function filterChatList() {
    const rows = document.querySelectorAll("#chats .row");
    const chatArr = Array.isArray(window.chats) ? window.chats : [];
    rows.forEach(row => {
      const cid = row.dataset.id;
      const chatObj = chatArr.find(x => x.id === cid);
      const isGrp = chatObj ? Boolean(chatObj.is_group) : false;
      const hasUnread = Boolean(row.querySelector(".badge"));

      let show = true;
      if (activeFolder === "personal") show = !isGrp;
      if (activeFolder === "groups") show = isGrp;
      if (activeFolder === "unread") show = hasUnread;
      row.style.display = show ? "flex" : "none";
    });
  }

  function renderPinBar() {
    if (typeof window.cur === "undefined" || !window.cur) return;
    const main = document.getElementById("main");
    const top = main && main.querySelector(".top");
    const ms = document.getElementById("ms");
    if (!top || !ms) return;

    const pin = pinsMap[window.cur];
    let bar = document.getElementById("cwPinBar");
    if (!pin) {
      if (bar) bar.remove();
      return;
    }
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "cwPinBar";
      bar.className = "cw-pin-bar";
      top.insertAdjacentElement("afterend", bar);
    }
    bar.innerHTML = `
      <span>📌</span>
      <div><b style="color:var(--p)">${gTxt("Закреплённое сообщение", "Pinned message")}</b><br><span>${pin.text}</span></div>
      <button id="cwUnpin" style="padding:4px 8px;color:var(--t2)">✕</button>
    `;
    bar.onclick = e => {
      if (e.target.id === "cwUnpin") {
        delete pinsMap[window.cur];
        localStorage.setItem("cw_tg_pins", JSON.stringify(pinsMap));
        renderPinBar();
        return;
      }
      scrollToMsg(pin.id);
    };
  }

  function scrollToMsg(mid) {
    const btn = document.querySelector(`.m [data-act="${mid}"]`);
    const card = btn && btn.closest(".m");
    if (card) {
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      card.classList.remove("cw-flash");
      void card.offsetWidth;
      card.classList.add("cw-flash");
    } else {
      gToast(gTxt("Сообщение вне текущей ленты", "Message outside current view"));
    }
  }

  function enhanceMessages() {
    const ms = document.getElementById("ms");
    if (!ms || !Array.isArray(window.msgs)) return;

    ms.querySelectorAll(".m").forEach((el, idx) => {
      const m = window.msgs[idx];
      if (!m) return;

      const ttlMatch = typeof m.body === "string" && m.body.match(/^⏱(\d+)\|([\s\S]*)$/);
      if (ttlMatch) {
        const sec = Number(ttlMatch[1]);
        const realText = ttlMatch[2];
        const age = (Date.now() - new Date(m.created_at).getTime()) / 1000;
        if (age >= sec) {
          el.innerHTML = `<span style="opacity:.6;font-style:italic">🔥 ${gTxt("Сообщение самоуничтожилось", "Self-destructed message")}</span>`;
          return;
        } else if (!el.dataset.ttlDone) {
          el.dataset.ttlDone = "1";
          const left = Math.max(1, Math.ceil(sec - age));
          const sm = el.querySelector("small");
          if (sm) sm.innerHTML = `⏱ ${left}${gTxt("с", "s")} · ` + sm.innerHTML;
          setTimeout(enhanceMessages, 1000);
        }
        if (!el.dataset.bodyClean) {
          el.dataset.bodyClean = "1";
          el.childNodes.forEach(n => {
            if (n.nodeType === 3 && n.textContent.startsWith("⏱")) n.textContent = realText;
          });
        }
      }

      const repMatch = typeof m.body === "string" && m.body.match(/^↩\[([^|\]]+)\|([^|\]]+)\|([^\]]*)\]\n([\s\S]*)$/);
      if (repMatch && !el.dataset.repDone) {
        el.dataset.repDone = "1";
        const [, rid, rAuthor, rSnippet, cleanBody] = repMatch;
        el.childNodes.forEach(n => {
          if (n.nodeType === 3 && n.textContent.startsWith("↩[")) n.textContent = cleanBody;
        });
        const q = document.createElement("div");
        q.className = "cw-quote";
        q.innerHTML = `<b style="color:var(--p)">${rAuthor}</b><div style="opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rSnippet}</div>`;
        q.onclick = () => scrollToMsg(rid);
        el.insertBefore(q, el.firstChild);
      }

      if (m.kind === "vid" && m.name && m.name.startsWith("circle_")) {
        const vid = el.querySelector("video");
        if (vid) {
          vid.classList.add("cw-circle-vid");
          vid.setAttribute("loop", "");
        }
      }

      const rObj = reactionsMap[m.id];
      let rBox = el.querySelector(".cw-reacts");
      if (rObj && Object.keys(rObj).length) {
        if (!rBox) {
          rBox = document.createElement("div");
          rBox.className = "cw-reacts";
          el.appendChild(rBox);
        }
        rBox.innerHTML = Object.entries(rObj)
          .filter(([, cnt]) => cnt > 0)
          .map(([em, cnt]) => `<button class="cw-react-pill" data-tg-em="${em}">${em} <span>${cnt}</span></button>`)
          .join("");
        rBox.querySelectorAll("button").forEach(b => {
          b.onclick = e => {
            e.stopPropagation();
            toggleReaction(m.id, b.dataset.tgEm);
          };
        });
      } else if (rBox) {
        rBox.remove();
      }
    });
  }

  function toggleReaction(mid, emoji) {
    reactionsMap[mid] = reactionsMap[mid] || {};
    reactionsMap[mid][emoji] = reactionsMap[mid][emoji] ? 0 : 1;
    localStorage.setItem("cw_tg_reacts", JSON.stringify(reactionsMap));
    if (window._rtCh) {
      window._rtCh.send({ type: "broadcast", event: "tg_react", payload: { mid, emoji, val: reactionsMap[mid][emoji] } });
    }
    enhanceMessages();
  }

  const origMsgMenu = window.msgMenu;
  window.msgMenu = function (id) {
    if (typeof origMsgMenu === "function") origMsgMenu(id);
    const dlgEl = document.getElementById("dlg");
    const m = (Array.isArray(window.msgs) ? window.msgs : []).find(x => x.id === id);
    if (!dlgEl || !m) return;

    const rBar = document.createElement("div");
    rBar.className = "cw-react-bar";
    ["❤️", "👍", "🔥", "😂", "😮"].forEach(em => {
      const b = document.createElement("button");
      b.textContent = em;
      b.onclick = () => {
        toggleReaction(id, em);
        dlgEl.close();
      };
      rBar.appendChild(b);
    });
    const h3 = dlgEl.querySelector("h3");
    if (h3) h3.insertAdjacentElement("afterend", rBar);

    const acts = dlgEl.querySelector(".acts");
    if (acts) {
      const btnRep = document.createElement("button");
      btnRep.className = "row";
      btnRep.innerHTML = `<div>↩️ <b>${gTxt("Ответить (Цитата)", "Reply (Quote)")}</b></div>`;
      btnRep.onclick = () => {
        const clean = (m.body || m.name || m.kind).replace(/^↩\[[^\]]+\]\n/, "").replace(/^⏱\d+\|/, "");
        const author = typeof window.pname === "function" ? window.pname(m.sender) : gTxt("Пользователь", "User");
        replyDraft = { id: m.id, author, text: clean.slice(0, 60) };
        dlgEl.close();
        renderReplyBanner();
        const tx = document.getElementById("tx");
        if (tx) tx.focus();
      };

      const btnPin = document.createElement("button");
      btnPin.className = "row";
      btnPin.innerHTML = `<div>📌 <b>${gTxt("Закрепить вверху чата", "Pin to top of chat")}</b></div>`;
      btnPin.onclick = () => {
        const clean = (m.body || m.name || m.kind).replace(/^↩\[[^\]]+\]\n/, "").replace(/^⏱\d+\|/, "");
        pinsMap[window.cur] = { id: m.id, text: clean.slice(0, 80) };
        localStorage.setItem("cw_tg_pins", JSON.stringify(pinsMap));
        if (window._rtCh) {
          window._rtCh.send({ type: "broadcast", event: "tg_pin", payload: { chat: window.cur, pin: pinsMap[window.cur] } });
        }
        dlgEl.close();
        renderPinBar();
        gToast(gTxt("📌 Сообщение закреплено", "📌 Message pinned"));
      };

      dlgEl.insertBefore(btnRep, acts);
      dlgEl.insertBefore(btnPin, acts);
    }
  };

  function renderReplyBanner() {
    const barWrap = document.getElementById("bar");
    if (!barWrap) return;
    let box = document.getElementById("cwReplyBanner");
    if (!replyDraft) {
      if (box) box.remove();
      return;
    }
    if (!box) {
      box = document.createElement("div");
      box.id = "cwReplyBanner";
      box.className = "cw-reply-box";
      barWrap.insertBefore(box, barWrap.firstChild);
    }
    box.innerHTML = `
      <div style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
        ↩️ <b style="color:var(--p)">${replyDraft.author}</b>: ${replyDraft.text}
      </div>
      <button id="cwCancelRep" style="padding:2px 8px">✕</button>
    `;
    document.getElementById("cwCancelRep").onclick = () => {
      replyDraft = null;
      renderReplyBanner();
    };
  }

  function ensureChatExtras() {
    const bar = document.querySelector("#bar .bar");
    const tx = document.getElementById("tx");
    if (!bar || !tx || bar.dataset.tgBar) return;
    bar.dataset.tgBar = "1";

    const ttlLabel = (secVal) => {
      if (!secVal) return "⏱️";
      if (secVal === 3600) return gTxt("⏱1ч", "⏱1h");
      return `⏱${secVal}${gTxt("с", "s")}`;
    };

    const btnTtl = document.createElement("button");
    btnTtl.className = "ic";
    btnTtl.title = gTxt("Таймер самоуничтожения", "Self-destruct timer");
    btnTtl.textContent = ttlLabel(ttlSeconds);
    btnTtl.style.fontSize = "13px";
    btnTtl.onclick = () => {
      const cycle = [0, 10, 60, 3600];
      ttlSeconds = cycle[(cycle.indexOf(ttlSeconds) + 1) % cycle.length];
      btnTtl.textContent = ttlLabel(ttlSeconds);
      gToast(ttlSeconds
        ? gTxt(`⏱ Автоудаление через ${ttlSeconds === 3600 ? "1 час" : ttlSeconds + " сек."}`, `⏱ Auto-delete after ${ttlSeconds === 3600 ? "1 hour" : ttlSeconds + "s"}`)
        : gTxt("⏱ Таймер выключен", "⏱ Timer off"));
    };

    const btnCircle = document.createElement("button");
    btnCircle.className = "ic";
    btnCircle.title = gTxt("Записать видеокружочек", "Record video circle");
    btnCircle.textContent = "⭕";
    btnCircle.onclick = startVideoCircle;

    bar.insertBefore(btnTtl, tx);
    bar.insertBefore(btnCircle, tx);
  }

  async function startVideoCircle() {
    try {
      const st = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 480 } },
        audio: true
      });
      const ov = document.createElement("div");
      ov.id = "cwCircleOverlay";
      ov.innerHTML = `
        <div style="font-weight:600">⭕ ${gTxt("Запись видеосообщения…", "Recording video message…")}</div>
        <video id="cwCirclePreview" autoplay muted playsinline></video>
        <div style="display:flex;gap:14px">
          <button id="cwCircleCancel" class="btn" style="background:#444">${gTxt("Отмена", "Cancel")}</button>
          <button id="cwCircleSend" class="btn" style="background:#ff1744">➤ ${gTxt("Отправить", "Send")}</button>
        </div>
      `;
      document.body.appendChild(ov);
      document.getElementById("cwCirclePreview").srcObject = st;

      const chunks = [];
      const mr = new MediaRecorder(st);
      mr.ondataavailable = e => chunks.push(e.data);
      mr.start();

      const cleanup = () => {
        st.getTracks().forEach(t => t.stop());
        ov.remove();
      };

      document.getElementById("cwCircleCancel").onclick = () => {
        mr.onstop = null;
        mr.stop();
        cleanup();
      };

      document.getElementById("cwCircleSend").onclick = () => {
        mr.onstop = async () => {
          cleanup();
          const blob = new Blob(chunks, { type: "video/webm" });
          const file = new File([blob], `circle_${Date.now()}.webm`, { type: "video/webm" });
          if (typeof window.sendFile === "function") await window.sendFile(file);
        };
        mr.stop();
      };
    } catch (e) {
      gToast(gTxt("Нет доступа к фронтальной камере", "No access to front camera"));
    }
  }

  const origPut = window.put;
  if (typeof origPut === "function" && !origPut._tgWrapped) {
    window.put = async function (o, cid) {
      if (o && o.kind === "t" && o.body) {
        let txt = o.body;
        if (replyDraft) {
          txt = `↩[${replyDraft.id}|${replyDraft.author}|${replyDraft.text}]\n` + txt;
          replyDraft = null;
          renderReplyBanner();
        }
        if (ttlSeconds > 0) {
          txt = `⏱${ttlSeconds}|` + txt;
        }
        o = { ...o, body: txt };
      }
      return origPut.call(this, o, cid);
    };
    window.put._tgWrapped = true;
  }

  setInterval(() => {
    if (window._rtCh && !window._rtCh._tgSub) {
      window._rtCh._tgSub = true;
      window._rtCh
        .on("broadcast", { event: "tg_react" }, ({ payload }) => {
          if (!payload) return;
          reactionsMap[payload.mid] = reactionsMap[payload.mid] || {};
          reactionsMap[payload.mid][payload.emoji] = payload.val;
          localStorage.setItem("cw_tg_reacts", JSON.stringify(reactionsMap));
          enhanceMessages();
        })
        .on("broadcast", { event: "tg_pin" }, ({ payload }) => {
          if (!payload) return;
          pinsMap[payload.chat] = payload.pin;
          localStorage.setItem("cw_tg_pins", JSON.stringify(pinsMap));
          renderPinBar();
        });
    }
    ensureFolders();
    renderPinBar();
    ensureChatExtras();
    enhanceMessages();
  }, 400);
})();

/* =========================================================================
 * G. ТАЙМЕР ДО НОВОГО ГОДА (RU / EN)
 * ========================================================================= */
(() => {
  if (window._nyTimerId) clearInterval(window._nyTimerId);

  function mountAndTick() {
    const side = document.querySelector(".side");
    const list = document.getElementById("chats");
    if (!side || !list) return;

    const isEn = (window.L || window.lang || "ru") === "en";
    let bar = document.getElementById("ny-timer-bar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "ny-timer-bar";
      bar.innerHTML = `${isEn ? "🎄 Until New Year" : "🎄 До Нового года"}: <b id="ny-cd">...</b>`;
      side.insertBefore(bar, list);
    } else {
      const prefix = isEn ? "🎄 Until New Year" : "🎄 До Нового года";
      if (bar.firstChild && bar.firstChild.nodeType === 3) {
        bar.firstChild.nodeValue = prefix + ": ";
      }
    }

    const el = document.getElementById("ny-cd");
    if (!el) return;

    const now = new Date();
    const target = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0);
    const diff = target - now;

    if (diff <= 0) {
      el.textContent = isEn ? `Happy New Year ${now.getFullYear()}! 🎉` : `С Новым ${now.getFullYear()} Годом! 🎉`;
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = String(Math.floor((diff / 3600000) % 24)).padStart(2, "0");
    const m = String(Math.floor((diff / 60000) % 60)).padStart(2, "0");
    const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

    el.textContent = isEn ? `${d}d ${h}:${m}:${s}` : `${d}д ${h}:${m}:${s}`;
  }

  mountAndTick();
  window._nyTimerId = setInterval(mountAndTick, 1000);
})();