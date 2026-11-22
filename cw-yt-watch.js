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
    .cw-yt-body {
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
      display: none;
    }
    #cwYtResults {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: none;
      flex-direction: column;
      gap: 8px;
      background: var(--s, #141218);
    }
    .cw-yt-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 14px;
      border-radius: 16px;
      background: var(--sc, #211f26);
      border: 1px solid var(--ol, #49454f);
    }
    .cw-yt-card b {
      display: block;
      font-size: 14px;
      margin-bottom: 3px;
    }
    .cw-yt-card span {
      display: block;
      font-size: 12px;
      color: var(--t2, #cac4d0);
    }
    .cw-yt-note {
      padding: 7px 12px;
      font-size: 12px;
      background: linear-gradient(90deg, rgba(255, 193, 7, 0.18), rgba(255, 23, 68, 0.18));
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
      <input id="cwYtInput" type="text" placeholder="Введите запрос или вставьте ссылку / ID YouTube…" autocomplete="off">
      <button class="btn" id="cwYtGoBtn" style="padding:8px 16px">Найти</button>
    </div>
    <div class="cw-yt-body" id="cwYtWrap">
      <iframe id="cwYtFrame"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups-to-escape-sandbox"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowfullscreen></iframe>
      <div id="cwYtResults"></div>
      <div class="cw-yt-note">
        <span>🛡️ YouTube запрещает встраивать свой сайт целиком в Firefox — здесь видео открывается через плеер <b>youtube-nocookie</b>, а поиск помогает быстро найти и запустить ролик.</span>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const callFloatBtn = document.createElement("button");
  callFloatBtn.id = "cwYtCallBtn";
  callFloatBtn.type = "button";
  callFloatBtn.innerHTML = `<span>🎬</span><span>YouTube</span>`;
  document.body.appendChild(callFloatBtn);

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

  function playVideoId(videoId, label) {
    const frame = document.getElementById("cwYtFrame");
    const resBox = document.getElementById("cwYtResults");
    curYtId = videoId;
    if (label) curYtQuery = label;
    resBox.style.display = "none";
    frame.style.display = "block";
    frame.src = buildEmbedUrl(videoId);
  }

  async function searchVideos(query) {
    const frame = document.getElementById("cwYtFrame");
    const resBox = document.getElementById("cwYtResults");
    frame.style.display = "none";
    frame.src = "";
    resBox.style.display = "flex";
    resBox.innerHTML = `<div class="cw-yt-card"><div><b>Ищем «${query}»…</b><span>Подбираем варианты запуска</span></div></div>`;

    const ytSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    let items = [];

    // Пробуем получить список роликов через открытый Piped API (если доступен в сети)
    try {
      const r = await fetch(`https://pipedapi.kavin.rocks/search?q=${encodeURIComponent(query)}&filter=videos`, { signal: AbortSignal.timeout(4000) });
      if (r.ok) {
        const data = await r.json();
        if (Array.isArray(data.items)) {
          items = data.items
            .filter(x => x.url && x.url.includes("/watch?v="))
            .slice(0, 12)
            .map(x => ({
              id: x.url.split("v=")[1].split("&")[0],
              title: x.title || "Видео YouTube",
              author: x.uploaderName || "YouTube"
            }));
        }
      }
    } catch (_) {}

    if (items.length > 0) {
      resBox.innerHTML = items.map(it => `
        <div class="cw-yt-card" data-vid="${it.id}">
          <div style="min-width:0;flex:1">
            <b>${it.title.replace(/</g, "&lt;")}</b>
            <span>${it.author.replace(/</g, "&lt;")} · ID: ${it.id}</span>
          </div>
          <button class="btn cw-play-item" data-vid="${it.id}" style="padding:8px 14px;font-size:12px">▶ Смотреть</button>
        </div>
      `).join("");

      resBox.querySelectorAll(".cw-play-item").forEach(btn => {
        btn.onclick = () => {
          const vid = btn.dataset.vid;
          playVideoId(vid, query);
          syncWithCallPeer({ videoId: vid, query });
        };
      });
    } else {
      resBox.innerHTML = `
        <div class="cw-yt-card">
          <div style="min-width:0;flex:1">
            <b>Поиск по запросу «${query.replace(/</g, "&lt;")}»</b>
            <span>Firefox не даёт открыть поиск YouTube в рамке. Откройте поиск в новой вкладке, скопируйте ссылку на видео и вставьте в строку выше.</span>
          </div>
          <a class="btn" href="${ytSearchUrl}" target="_blank" rel="noopener noreferrer" style="padding:8px 14px;font-size:12px;text-decoration:none;white-space:nowrap">↗ Открыть</a>
        </div>
      `;
    }
  }

  function loadYouTubeTarget(rawQuery, videoIdFromPeer) {
    const inp = document.getElementById("cwYtInput");
    const vid = videoIdFromPeer || extractYouTubeId(rawQuery);
    if (vid) {
      curYtQuery = rawQuery || vid;
      if (inp) inp.value = curYtQuery;
      playVideoId(vid, curYtQuery);
      return { videoId: vid, query: curYtQuery };
    }
    const q = (rawQuery || "").trim();
    curYtId = "";
    curYtQuery = q;
    if (inp && q) inp.value = q;
    if (q) {
      searchVideos(q);
    } else {
      const frame = document.getElementById("cwYtFrame");
      const resBox = document.getElementById("cwYtResults");
      frame.style.display = "none";
      resBox.style.display = "flex";
      resBox.innerHTML = `
        <div class="cw-yt-card">
          <div>
            <b>Совместный просмотр YouTube</b>
            <span>Введите название видео для поиска или вставьте ссылку / ID ролика и нажмите «Найти».</span>
          </div>
        </div>
      `;
    }
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
    loadYouTubeTarget(opts.query || curYtQuery || "", opts.videoId || curYtId || "");
  }

  document.getElementById("cwYtClose").onclick = () => {
    modal.style.display = "none";
    document.getElementById("cwYtFrame").src = "";
  };

  document.getElementById("cwYtGoBtn").onclick = () => {
    const val = document.getElementById("cwYtInput").value.trim();
    const res = loadYouTubeTarget(val, "");
    if (res.videoId) syncWithCallPeer(res);
  };

  document.getElementById("cwYtInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("cwYtGoBtn").click();
    }
  });

  document.getElementById("cwYtSyncBtn").onclick = () => {
    const val = document.getElementById("cwYtInput").value.trim() || curYtQuery ||
