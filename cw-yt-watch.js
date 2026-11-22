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
      border: 1.5px solid #ffb703;
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
    #cwYtHelper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      background: radial-gradient(circle at top, rgba(255, 183, 3, 0.14), rgba(255, 23, 68, 0.08) 45%, var(--s, #141218) 85%);
      text-align: center;
    }
    .cw-yt-box {
      max-width: 460px;
      width: 100%;
      padding: 20px;
      border-radius: 24px;
      background: var(--sc, #211f26);
      border: 1px solid var(--ol, #49454f);
      box-shadow: 0 14px 36px rgba(0, 0, 0, 0.35);
    }
    .cw-yt-note {
      padding: 7px 12px;
      font-size: 12px;
      background: linear-gradient(90deg, rgba(255, 183, 3, 0.2), rgba(255, 23, 68, 0.18));
      color: var(--t2, #cac4d0);
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
      <input id="cwYtInput" type="text" placeholder="Вставьте ссылку / ID видео или введите запрос…" autocomplete="off">
      <button class="btn" id="cwYtGoBtn" style="padding:8px 16px">Открыть</button>
    </div>
    <div class="cw-yt-body">
      <iframe id="cwYtFrame"
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-popups-to-escape-sandbox"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowfullscreen></iframe>
      <div id="cwYtHelper"></div>
      <div class="cw-yt-note">
        🛡️ YouTube блокирует показ своего сайта внутри рамки в Firefox, поэтому ссылки и ID открываются в плеере <b>youtube-nocookie</b>, а поиск открывается в отдельной вкладке.
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

  function showHelper(query) {
    const frame = document.getElementById("cwYtFrame");
    const helper = document.getElementById("cwYtHelper");
    frame.style.display = "none";
    frame.src = "";
    helper.style.display = "flex";

    const q = (query || "").trim();
    const searchUrl = q
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
      : "https://www.youtube.com/";

    helper.innerHTML = `
      <div class="cw-yt-box">
        <div style="font-size:38px;margin-bottom:8px">☀️🎬</div>
        <h3 style="margin:0 0 8px">${q ? `Поиск: «${q.replace(/</g, "&lt;")}»` : "Совместный просмотр YouTube"}</h3>
        <p style="margin:0 0 14px;font-size:13px;line-height:1.45;color:var(--t2,#cac4d0)">
          Вставьте ссылку или ID ролика в строку сверху для запуска плеера, либо откройте поиск YouTube в новой вкладке и скопируйте ссылку на видео.
        </p>
        <a class="btn" href="${searchUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;text-decoration:none;padding:10px 20px">
          ↗ Открыть ${q ? "результаты" : "YouTube"}
        </a>
      </div>
    `;
  }

  function loadYouTubeTarget(rawQuery, videoIdFromPeer) {
    const inp = document.getElementById("cwYtInput");
    const vid = videoIdFromPeer || extractYouTubeId(rawQuery);
    if (vid) {
      curYtId = vid;
      curYtQuery = rawQuery || vid;
      if (inp) inp.value = curYtQuery;
      const frame = document.getElementById("cwYtFrame");
      const helper = document.getElementById("cwYtHelper");
      helper.style.display = "none";
      frame.style.display = "block";
      frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(vid)}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3`;
      return { videoId: vid, query: curYtQuery };
    }
    curYtId = "";
    curYtQuery = (rawQuery || "").trim();
    if (inp && curYtQuery) inp.value = curYtQuery;
    showHelper(curYtQuery);
    return { videoId: "", query: curYtQuery };
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

  setInterval(() => {
    const callBox = document.getElementById("call");
    const activeCall = Boolean(callBox && callBox.style.display !== "none" && callBox.style.display !== "");
    callFloatBtn.style.display = activeCall ? "inline-flex" : "none";
  }, 500);

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
