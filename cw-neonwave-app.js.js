(function () {
  if (window.__cwNeonWaveLoaded) return;
  window.__cwNeonWaveLoaded = true;

  const PLAYER_URL = "./neonwave-player.html";

  const style = document.createElement("style");
  style.textContent = `
    #cwNeonWaveOverlay {
      position: fixed;
      inset: 0;
      z-index: 30;
      display: none;
      flex-direction: column;
      background: #0a001a;
      color: #fff;
    }
    .cw-nw-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: calc(8px + env(safe-area-inset-top)) 12px 8px;
      background: #12002b;
      border-bottom: 1px solid rgba(255, 0, 170, 0.35);
    }
    .cw-nw-bar b {
      flex: 1;
      font-size: 14px;
      letter-spacing: 0.6px;
      color: #00f0ff;
    }
    #cwNeonWaveFrame {
      flex: 1;
      width: 100%;
      height: 100%;
      border: 0;
      background: #0a001a;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = "cwNeonWaveOverlay";
  overlay.innerHTML = `
    <div class="cw-nw-bar">
      <button type="button" class="ic" id="cwNwCloseBtn" title="Закрыть">←</button>
      <b>♫ NeonWave Music</b>
      <a class="txt" href="${PLAYER_URL}" target="_blank" rel="noopener noreferrer" style="font-size:12px;text-decoration:none;padding:6px 10px">↗ Вкладка</a>
    </div>
    <iframe id="cwNeonWaveFrame"
      allow="autoplay; encrypted-media; fullscreen"
      allowfullscreen></iframe>
  `;
  document.body.appendChild(overlay);

  function openNeonWave() {
    const frame = document.getElementById("cwNeonWaveFrame");
    if (!frame.getAttribute("src")) {
      frame.src = PLAYER_URL;
    }
    overlay.style.display = "flex";
  }

  document.getElementById("cwNwCloseBtn").onclick = () => {
    overlay.style.display = "none";
  };

  function injectNeonWaveTile() {
    const grid = document.querySelector("#dlg .apps-grid");
    if (!grid || grid.querySelector("#cwNeonWaveTile")) return;

    const tile = document.createElement("button");
    tile.type = "button";
    tile.className = "app-tile";
    tile.id = "cwNeonWaveTile";
    tile.innerHTML = `<div class="app-ico">♫</div><div class="app-name">NeonWave</div><span class="app-tag ok">MUSIC</span>`;
    tile.onclick = () => {
      const dlgEl = document.getElementById("dlg");
      if (dlgEl && dlgEl.open) dlgEl.close();
      openNeonWave();
    };
    grid.insertBefore(tile, grid.lastElementChild || null);
  }

  const bApps = document.getElementById("bApps");
  if (bApps) {
    bApps.addEventListener("click", () => {
      setTimeout(injectNeonWaveTile, 30);
      setTimeout(injectNeonWaveTile, 150);
    });
  }
})();