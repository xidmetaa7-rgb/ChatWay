(function () {
  if (window.__cwYtWatchLoaded) return;
  window.__cwYtWatchLoaded = true;

  let curYtId = "";
  let curYtQuery = "";

  const style = document.createElement("style");
  style.textContent = `
    #cwYtModal {
      position: fixed;
      inset: 0;
      z-index: 26;
      display: none;
      flex-direction: column;
      background: var(--s, #141218);
      color: var(--t, #e6e0e9);
    }
    .cw-yt-top {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: calc(10px + env(safe-area-inset-top)) 12px 10px;
      background: var(--sc, #211f26);
      border-bottom: 1px solid var(--ol, #49454f);
    }
    .cw-yt-top b {
      flex: 1;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .cw-yt-search {
      display: flex;
      gap: 6px;
      padding: 8px 12px;
      background: var(--sc, #211f26);
      border-bottom: 1px solid var(--ol, #49454f);
    }
    .cw-yt-search input {
      flex: 1;
      min-width: 0;
      border: 1px solid var(--ol, #49454f);
      border-radius: 999px;
      padding: 9px 14px;
      background: var(--sch, #2b2930);
      color: var(--t, #e6e0e9);
      font: inherit;
      font-size: 14px;
      outline: 0;
    }
    .cw-yt-wrap {
      position: relative;
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      background: #000;
    }
    #cwYtFrame {
      flex: 1;
      width: 100%;
      height: 100%;
      border: 0;
      background: #000;
    }
    /* Блокировка сторонних рекламных плашек/попапов поверх контейнера */
    .cw-yt-wrap [class*="ad-"],
    .cw-yt-wrap [id*="google_ads"],
    .cw-yt-wrap .ytp-ad-overlay-container,
    .cw-yt-wrap .ytp-ad-module {
      display: none !important;
      pointer-events: none !important;
    }
    .cw-yt-note {
      padding: 6px 12px;
      font-size: 12px;
      background: linear-gradient(90deg, rgba(255, 193, 7, 0.16), rgba(255, 23, 68, 0.16));
      color: var(--t2, #cac4d0);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex-wrap: wrap;
    }
    #cwYtCallBtn {
      position: fixed;
      right: 16px;
      bottom: calc(92px + env(safe-area-inset-bottom));
      z-index: 25;
      display: none;
      align-items: center;
      gap: 6px;
      padding: 10px 15px;
      border-radius: 999px;
      background: linear-gradient(135deg, #ff1744, #ff9100);
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      box-shadow: 0 10px 24px rgba(255, 23, 68, 0.45);
      cursor: pointer;
      border: 0;
    }
  `;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.id = "cwYtModal";
  modal.innerHTML = `
    <div class="cw-yt-top">
      <button class="ic" id="cwYtClose" title="Закрыть">←</button>
      <b>☀️ YouTube с другом · AdBlock</b>
      <button class="btn" id="cwYtSyncBtn" style="padding:7px 13px;font-size:12px">🔄 Другу</button>
      <button class="txt" id="cwYtExtBtn" style="padding:6px 10px;font-size:12px">↗ YouTube</button>
    </div>
    <div class="cw-yt-search">
      <input id="cwYtInput" type="text" placeholder="Поиск на YouTube или вставьте ссылку / ID видео…" autocomplete="off">
      <button class="btn" id="cwYtGoBtn" style="padding:8px 16px">Найти</button>
    </div>
    <div class="cw-yt-wrap" id="cwYtWrap">
      <iframe id="cwYtFrame"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups-to-escape-sandbox"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowfullscreen></iframe>
      <div class="cw-yt-note">
        <span>🛡️ Встроенный AdBlock-фильтр активен. Если YouTube не даёт открыть поиск внутри рамки — нажмите <b>↗ YouTube</b> или вставьте ссылку на видео.</span>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const callFloatBtn = document.createElement("button");
  callFloatBtn.id = "cwYtCallBtn";
  callFloatBtn.type = "button";
  callFloatBtn.innerHTML = `<span>🎬</span><span>YouTube</span>`;
  document.body.appendChild(callFloatBtn);

  // Лёгкий анти-рекламный фильтр: убираем рекламные узлы/редиректы внутри контейнера
  function runAdBlockCleanup() {
    const wrap = document.getElementById("cwYtWrap");
    if (!wrap) return;
    wrap.querySelectorAll('a[href*="doubleclick"], a[href*="googlesyndication"], [id*="ad_"], [class*="sponsored"]').forEach(el => {
      el.remove();
    });
  }
  setInterval(runAdBlockCleanup, 1500);

  function extractYouTubeId(input) {
    if (!input) return "";
    const s = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
    try {
      const u = new URL(s.startsWith("http") ? s : "https://" + s);
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.replace("/", "").split("/")[0];
        if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
      }
      if (u.searchParams.get("v") && /^[a-zA-Z0-9_-]{11}$/.test(u.searchParams.get("v"))) {
        return u.searchParams.get("v");
      }
      const m = u.pathname.match(/\/(?:embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
      if (m) return m[1];
    } catch (_) {}
    return "";
  }

  function buildEmbedUrl(videoId) {
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`;
  }

  function loadYouTubeTarget(rawQuery, videoIdFromPeer) {
    const frame = document.getElementById("cwYtFrame");
    const inp = document.getElementById("cwYtInput");
    const vid = videoIdFromPeer || extractYouTubeId(rawQuery);
    if (vid) {
      curYtId = vid;
      curYtQuery = rawQuery || vid;
      if (inp) inp.value = curYtQuery;
      frame.src = buildEmbedUrl(vid);
      return { videoId: vid, query: curYtQuery };
    }
    const q = (rawQuery || "").trim();
    curYtId = "";
    curYtQuery = q;
    if (inp && q) inp.value = q;
    // Попытка загрузить результаты поиска или главную YouTube
    frame.src = q
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
      : `https://www.youtube.com/`;
    return { videoId: "", query: q };
  }

  function syncWithCallPeer(payload) {
    if (typeof callPeerId !== "undefined" && callPeerId && typeof send === "function") {
      send(callPeerId, "yt", payload);
      if (typeof toast === "function") toast("🎬 Отправлено собеседнику");
    }
  }

  function openYtModal(opts = {}) {
    modal.style.display = "flex";
    const frame = document.getElementById("cwYtFrame");
    if (opts.videoId || opts.query) {
      loadYouTubeTarget(opts.query || "", opts.videoId || "");
    } else if (!frame.getAttribute("src")) {
      loadYouTubeTarget("", "");
    }
  }

  document.getElementById("cwYtClose").onclick = () => {
    modal.style.display = "none";
    document.getElementById("cwYtFrame").src = "";
  };

  document.getElementById("cwYtGoBtn").onclick = () => {
    const val = document.getElementById("cwYtInput").value.trim();
    const res = loadYouTubeTarget(val, "");
    syncWithCallPeer(res);
  };

  document.getElementById("cwYtInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("cwYtGoBtn").click();
    }
  });

  document.getElementById("cwYtSyncBtn").onclick = () => {
    const val = document.getElementById("cwYtInput").value.trim() || curYtQuery || curYtId;
    const vid = curYtId || extractYouTubeId(val);
    syncWithCallPeer({ videoId: vid, query: val });
  };

  document.getElementById("cwYtExtBtn").onclick = () => {
    const val = document.getElementById("cwYtInput").value.trim();
    const vid = curYtId || extractYouTubeId(val);
    const url = vid
      ? `https://www.youtube.com/watch?v=${encodeURIComponent(vid)}`
      : val
        ? `https://www.youtube.com/results?search_query=${encodeURIComponent(val)}`
        : "https://www.youtube.com/";
    window.open(url, "_blank", "noopener,noreferrer");
  };

  callFloatBtn.onclick = () => {
    openYtModal({ videoId: curYtId, query: curYtQuery });
  };

  // Показываем кнопку YouTube во время активного звонка
  setInterval(() => {
    const callBox = document.getElementById("call");
    const activeCall = Boolean(callBox && callBox.style.display !== "none" && callBox.style.display !== "");
    callFloatBtn.style.display = activeCall ? "inline-flex" : "none";
  }, 500);

  // Подхватываем входящий сигнал "yt" от собеседника во время звонка
  if (typeof window.sig === "function") {
    const origSig = window.sig;
    window.sig = async function (s) {
      if (s && s.kind === "yt" && s.data) {
        openYtModal({ videoId: s.data.videoId || "", query: s.data.query || "" });
        if (typeof toast === "function") toast("🎬 Друг открыл YouTube");
        return;
      }
      return origSig.apply(this, arguments);
    };
  }

  // Также добавляем плитку в меню «Приложения и Защита» (если открывается #bApps)
  const bApps = document.getElementById("bApps");
  if (bApps) {
    bApps.addEventListener("click", () => {
      setTimeout(() => {
        const grid = document.querySelector("#dlg .apps-grid");
        if (!grid || grid.querySelector("#cwYtTile")) return;
        const tile = document.createElement("button");
        tile.type = "button";
        tile.className = "app-tile";
        tile.id = "cwYtTile";
        tile.innerHTML = `<div class="app-ico">🎬</div><div class="app-name">YouTube</div><span class="app-tag ok">CALL</span>`;
        tile.onclick = () => {
          const dlgEl = document.getElementById("dlg");
          if (dlgEl && dlgEl.open) dlgEl.close();
          openYtModal({ videoId: curYtId, query: curYtQuery });
        };
        grid.insertBefore(tile, grid.lastElementChild || null);
      }, 30);
    });
  }
})();