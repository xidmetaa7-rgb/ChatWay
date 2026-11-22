(function () {
  if (window.__cwNeonWaveLoaded) return;
  window.__cwNeonWaveLoaded = true;

  const PLAYER_HTML = `<!DOCTYPE html>
<html lang="ru" data-theme="neon">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="theme-color" content="#0a001a" />
  <title>NeonWave • Music</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Press+Start+2P&family=Inter:wght@400;500;600;800&family=Share+Tech+Mono&display=swap');

    :root, [data-theme="neon"] {
      --a1: 255, 0, 170;
      --a2: 0, 240, 255;
      --a3: 179, 0, 255;
      --bg-dark: #0a001a;
      --bg-panel: #12002b;
      --row-bg: rgba(18,0,43,0.7);
      --text: #ffffff;
      --glow: 0.4;
      --radius: 4px;
      --font-main: 'Orbitron', sans-serif;
      --font-logo: 'Press Start 2P', cursive;
      --grid-on: 1;
    }
    [data-theme="modern"] {
      --a1: 99, 102, 241;
      --a2: 45, 212, 191;
      --a3: 168, 85, 247;
      --bg-dark: #0b0f19;
      --bg-panel: #131a2a;
      --row-bg: rgba(19,26,42,0.8);
      --text: #f1f5f9;
      --glow: 0.14;
      --radius: 14px;
      --font-main: 'Inter', sans-serif;
      --font-logo: 'Inter', sans-serif;
      --grid-on: 0;
    }
    [data-theme="sunset"] {
      --a1: 255, 94, 58;
      --a2: 255, 205, 84;
      --a3: 255, 0, 128;
      --bg-dark: #1a0610;
      --bg-panel: #2b0b1b;
      --row-bg: rgba(43,11,27,0.75);
      --text: #fff4ea;
      --glow: 0.4;
      --radius: 10px;
      --font-main: 'Orbitron', sans-serif;
      --font-logo: 'Press Start 2P', cursive;
      --grid-on: 1;
    }
    [data-theme="matrix"] {
      --a1: 0, 255, 100;
      --a2: 150, 255, 190;
      --a3: 0, 170, 70;
      --bg-dark: #000a04;
      --bg-panel: #031409;
      --row-bg: rgba(3,20,9,0.8);
      --text: #d6ffe4;
      --glow: 0.35;
      --radius: 2px;
      --font-main: 'Share Tech Mono', monospace;
      --font-logo: 'Share Tech Mono', monospace;
      --grid-on: 1;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

    body {
      background: var(--bg-dark);
      color: var(--text);
      font-family: var(--font-main);
      min-height: 100vh;
      overflow-x: hidden;
      transition: background 0.6s, color 0.6s;
    }

    body::before {
      content: '';
      position: fixed; inset: 0;
      pointer-events: none;
      opacity: var(--grid-on);
      background-image:
        linear-gradient(rgba(var(--a1),0.09) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--a1),0.09) 1px, transparent 1px);
      background-size: 40px 40px;
      animation: gridMove 6s linear infinite;
      z-index: 0;
    }
    @keyframes gridMove { to { background-position: 0 40px, 40px 0; } }

    .orb {
      position: fixed; border-radius: 50%; filter: blur(70px);
      opacity: 0.35; pointer-events: none; z-index: 0;
    }
    .orb.o1 { width: 260px; height: 260px; background: rgb(var(--a1)); top: -60px; left: -80px; }
    .orb.o2 { width: 300px; height: 300px; background: rgb(var(--a3)); bottom: -100px; right: -90px; }
    .orb.o3 { width: 180px; height: 180px; background: rgb(var(--a2)); top: 45%; left: 55%; opacity: 0.18; }

    .splash {
      position: fixed; inset: 0; z-index: 9999;
      background: var(--bg-dark);
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 22px;
      transition: opacity 0.6s ease, visibility 0.6s;
    }
    .splash.hide { opacity: 0; visibility: hidden; pointer-events: none; }
    .splash-logo {
      font-family: var(--font-logo); font-size: clamp(20px, 7vw, 32px); letter-spacing: 4px;
      background: linear-gradient(180deg, rgb(var(--a1)), rgb(var(--a2)));
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
    }
    .splash-hint { font-size: 10px; letter-spacing: 3px; color: rgba(var(--a2),0.8); }

    .neon-player {
      max-width: 480px; margin: 0 auto; min-height: 100vh;
      display: flex; flex-direction: column; position: relative; padding-bottom: 20px; z-index: 1;
    }
    .header {
      padding: 18px 20px 12px; text-align: center;
      border-bottom: 1px solid rgba(var(--a1),0.3);
      background: linear-gradient(180deg, rgba(var(--a1),0.12), transparent);
    }
    .logo {
      font-family: var(--font-logo); font-size: 14px; letter-spacing: 2px;
      background: linear-gradient(90deg, rgb(var(--a1)), rgb(var(--a2)), rgb(var(--a1)));
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }
    .tagline { font-size: 10px; color: rgb(var(--a2)); letter-spacing: 3px; opacity: 0.8; }

    .themes { display: flex; justify-content: center; gap: 12px; margin-top: 12px; }
    .theme-dot {
      width: 22px; height: 22px; border-radius: 50%;
      border: 2px solid rgba(255,255,255,0.25); cursor: pointer; padding: 0;
    }
    .theme-dot.on { border-color: #fff; transform: scale(1.2); box-shadow: 0 0 12px rgba(255,255,255,0.7); }
    .theme-dot[data-t="neon"]   { background: linear-gradient(135deg,#ff00aa,#00f0ff); }
    .theme-dot[data-t="modern"] { background: linear-gradient(135deg,#6366f1,#2dd4bf); }
    .theme-dot[data-t="sunset"] { background: linear-gradient(135deg,#ff5e3a,#ffcd54); }
    .theme-dot[data-t="matrix"] { background: linear-gradient(135deg,#00ff64,#021409); }

    .search-wrap { padding: 16px 16px 8px; }
    .search-box {
      display: flex; gap: 8px; background: var(--bg-panel);
      border: 2px solid rgb(var(--a1)); border-radius: var(--radius); padding: 4px;
    }
    .search-box input {
      flex: 1; background: transparent; border: none; color: var(--text);
      font-family: var(--font-main); font-size: 14px; padding: 10px 12px; outline: none; min-width: 0;
    }
    .search-btn {
      background: linear-gradient(135deg, rgb(var(--a1)), rgb(var(--a3)));
      border: none; color: #fff; padding: 0 18px; font-family: var(--font-main);
      font-weight: 700; font-size: 12px; cursor: pointer; border-radius: calc(var(--radius) / 2);
    }

    .results { flex: 1; overflow-y: auto; padding: 8px 12px; max-height: 42vh; }
    .track {
      display: flex; align-items: center; gap: 12px; padding: 10px 12px; margin-bottom: 6px;
      background: var(--row-bg); border: 1px solid transparent; border-radius: var(--radius); cursor: pointer;
    }
    .track:hover, .track.active { border-color: rgb(var(--a2)); background: rgba(var(--a2),0.08); }
    .track-num { font-size: 11px; color: rgb(var(--a1)); min-width: 22px; text-align: center; }
    .track-info { flex: 1; min-width: 0; }
    .track-title { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .track-artist { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 2px; }
    .track-dur { font-size: 11px; color: rgb(var(--a2)); opacity: 0.7; }

    .player-panel {
      margin: 8px 12px 0; background: var(--bg-panel);
      border: 2px solid rgb(var(--a3)); border-radius: calc(var(--radius) + 2px); overflow: hidden;
    }
    .now-playing {
      display: flex; align-items: center; gap: 14px; padding: 14px;
      background: linear-gradient(90deg, rgba(var(--a1),0.15), transparent);
    }
    .cover {
      width: 64px; height: 64px; background: rgba(var(--a3),0.2);
      border: 2px solid rgb(var(--a1)); border-radius: var(--radius);
      display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0;
      background-size: cover; background-position: center;
    }
    .cover.playing { border-radius: 50%; }
    .np-info { flex: 1; min-width: 0; }
    .np-title { font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: rgb(var(--a2)); }
    .np-artist { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 3px; }

    .eq { display: flex; align-items: flex-end; gap: 3px; height: 24px; margin-top: 6px; }
    .eq span {
      width: 4px; height: 100%;
      background: linear-gradient(to top, rgb(var(--a1)), rgb(var(--a2)));
      animation: eq 0.8s ease-in-out infinite alternate; transform-origin: bottom;
    }
    .eq span:nth-child(2){animation-delay:.2s}
    .eq span:nth-child(3){animation-delay:.4s}
    .eq span:nth-child(4){animation-delay:.15s}
    .eq span:nth-child(5){animation-delay:.35s}
    @keyframes eq { from { transform: scaleY(0.3); } to { transform: scaleY(1); } }
    .eq.paused span { animation-play-state: paused; }

    .progress-wrap { padding: 0 14px 8px; }
    .progress-bar { height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; cursor: pointer; }
    .progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, rgb(var(--a1)), rgb(var(--a2))); }
    .time-row { display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.45); margin-top: 4px; font-family: monospace; }

    .controls { display: flex; align-items: center; justify-content: center; gap: 18px; padding: 10px 14px 16px; }
    .ctrl {
      background: transparent; border: 2px solid rgb(var(--a2)); color: rgb(var(--a2));
      width: 42px; height: 42px; border-radius: 50%; font-size: 16px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .ctrl.play { width: 56px; height: 56px; font-size: 22px; border-color: rgb(var(--a1)); color: rgb(var(--a1)); }

    #yt-player { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
    .status { text-align: center; font-size: 11px; color: rgba(255,255,255,0.4); padding: 8px; }
    .status.error { color: #ff4466; }
    .empty { text-align: center; padding: 36px 20px; color: rgba(255,255,255,0.35); font-size: 13px; }
    .spinner {
      width: 24px; height: 24px; border: 3px solid rgba(var(--a1),0.2);
      border-top-color: rgb(var(--a1)); border-radius: 50%; animation: spin 0.7s linear infinite; margin: 20px auto;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div>
  <div class="splash" id="splash">
    <div class="splash-logo">NEONWAVE</div>
    <div class="splash-hint">LOADING WAVES...</div>
  </div>

  <div class="neon-player" id="app">
    <div class="header">
      <div class="logo">NEONWAVE</div>
      <div class="tagline">80s • SYNTH • MUSIC</div>
      <div class="themes" id="themes">
        <button class="theme-dot" data-t="neon" title="Neon 80s"></button>
        <button class="theme-dot" data-t="modern" title="Modern"></button>
        <button class="theme-dot" data-t="sunset" title="Sunset"></button>
        <button class="theme-dot" data-t="matrix" title="Matrix"></button>
      </div>
    </div>

    <div class="search-wrap">
      <div class="search-box">
        <input type="text" id="searchInput" placeholder="поиск по YouTube Music..." autocomplete="off" />
        <button class="search-btn" id="searchBtn">SEARCH</button>
      </div>
    </div>

    <div class="results" id="results">
      <div class="empty">Введи название трека или артиста<br>и найди музыку без рекламы</div>
    </div>

    <div class="player-panel" id="panel">
      <div class="now-playing">
        <div class="cover" id="cover">♫</div>
        <div class="np-info">
          <div class="np-title" id="npTitle">Выбери трек</div>
          <div class="np-artist" id="npArtist">NeonWave Player</div>
          <div class="eq paused" id="eq"><span></span><span></span><span></span><span></span><span></span></div>
        </div>
      </div>
      <div class="progress-wrap">
        <div class="progress-bar" id="progressBar"><div class="progress-fill" id="progressFill"></div></div>
        <div class="time-row"><span id="curTime">0:00</span><span id="durTime">0:00</span></div>
      </div>
      <div class="controls">
        <button class="ctrl" id="prevBtn" title="Previous">⏮</button>
        <button class="ctrl play" id="playBtn" title="Play/Pause">▶</button>
        <button class="ctrl" id="nextBtn" title="Next">⏭</button>
      </div>
    </div>

    <div class="status" id="status"></div>
    <div id="yt-player"></div>
  </div>

  <script>
    (function ui() {
      const splash = document.getElementById('splash');
      const closeSplash = () => { splash.classList.add('hide'); setTimeout(() => splash.remove(), 650); };
      setTimeout(closeSplash, 1200);
      splash.addEventListener('click', closeSplash);

      const dots = document.querySelectorAll('.theme-dot');
      function applyTheme(t) {
        document.documentElement.setAttribute('data-theme', t);
        dots.forEach(d => d.classList.toggle('on', d.dataset.t === t));
        try { localStorage.setItem('nw-theme', t); } catch (e) {}
      }
      let saved = 'neon';
      try { saved = localStorage.getItem('nw-theme') || 'neon'; } catch (e) {}
      applyTheme(saved);
      dots.forEach(d => d.addEventListener('click', () => applyTheme(d.dataset.t)));
    })();

    const SEARCH_APIS = [
      { url: 'https://pipedapi.kavin.rocks/search?q=', type: 'piped' },
      { url: 'https://pipedapi.adminforge.de/search?q=', type: 'piped' },
      { url: 'https://api.piped.private.coffee/search?q=', type: 'piped' },
      { url: 'https://invidious.projectsegfau.lt/api/v1/search?q=', type: 'invidious' },
      { url: 'https://inv.nadeko.net/api/v1/search?q=', type: 'invidious' }
    ];

    let tracks = [], currentIndex = -1, isPlaying = false, ytPlayer = null, playerReady = false, pendingVideoId = null, progressTimer = null;
    const $ = id => document.getElementById(id);
    const searchInput = $('searchInput'), searchBtn = $('searchBtn'), resultsEl = $('results');
    const npTitle = $('npTitle'), npArtist = $('npArtist'), cover = $('cover'), panel = $('panel');
    const playBtn = $('playBtn'), prevBtn = $('prevBtn'), nextBtn = $('nextBtn');
    const progressFill = $('progressFill'), progressBar = $('progressBar'), curTime = $('curTime'), durTime = $('durTime');
    const status = $('status'), eq = $('eq');

    function setStatus(msg, isError = false) {
      status.textContent = msg;
      status.className = 'status' + (isError ? ' error' : '');
    }

    function loadYTApi() {
      if (window.YT && window.YT.Player) return Promise.resolve();
      return new Promise(resolve => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => { if (prev) prev(); resolve(); };
      });
    }

    async function initPlayer() {
      await loadYTApi();
      return new Promise(resolve => {
        ytPlayer = new YT.Player('yt-player', {
          height: '1', width: '1',
          playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0, iv_load_policy: 3 },
          events: {
            onReady: (event) => {
              playerReady = true;
              ytPlayer = event.target;
              if (pendingVideoId) { safePlay(pendingVideoId); pendingVideoId = null; }
              resolve();
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) {
                isPlaying = true; playBtn.textContent = '⏸'; cover.classList.add('playing'); eq.classList.remove('paused'); startProgress();
              } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
                isPlaying = false; playBtn.textContent = '▶'; cover.classList.remove('playing'); eq.classList.add('paused'); stopProgress();
                if (e.data === YT.PlayerState.ENDED) playNext();
              }
            },
            onError: () => setStatus('Ошибка воспроизведения. Попробуй другой трек.', true)
          }
        });
      });
    }

    function safePlay(videoId) {
      if (!playerReady || !ytPlayer) { pendingVideoId = videoId; return; }
      ytPlayer.loadVideoById(videoId);
      ytPlayer.playVideo();
    }

    async function searchTracks(query) {
      if (!query.trim()) return;
      resultsEl.innerHTML = '<div class="spinner"></div>';
      setStatus('Ищем музыку...');
      let data = null, usedType = null;
      for (const api of SEARCH_APIS) {
        try {
          const url = api.type === 'piped'
            ? api.url + encodeURIComponent(query + ' music') + '&filter=music_songs'
            : api.url + encodeURIComponent(query + ' music') + '&type=video';
          const res = await fetch(url, { signal: AbortSignal.timeout(5000), mode: 'cors' });
          if (res.ok) { data = await res.json(); usedType = api.type; break; }
        } catch (_) {}
      }
      if (!data) {
        resultsEl.innerHTML = '<div class="empty">Все серверы поиска временно недоступны.</div>';
        setStatus('Поиск недоступен', true);
        return;
      }
      const items = usedType === 'piped' ? (data.items || data || []) : (Array.isArray(data) ? data : (data.items || []));
      tracks = items.slice(0, 25).map(item => {
        let id = item.videoId || item.id;
        if (!id && item.url) {
          const m = item.url.match(/[?&]v=([^&]+)/) || item.url.match(/\\/watch\\/([^/?]+)/);
          id = m ? m[1] : null;
        }
        return {
          id,
          title: item.title || 'Unknown',
          artist: item.uploaderName || item.author || item.channelName || 'YouTube Music',
          duration: item.duration || item.lengthSeconds || 0,
          thumbnail: item.thumbnail || (item.thumbnails && (item.thumbnails[0]?.url || item.thumbnails[0])) || null
        };
      }).filter(t => t.id);

      renderResults();
      setStatus(tracks.length ? 'Найдено: ' + tracks.length : 'Ничего не найдено');
    }

    function escapeHtml(str) {
      return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function formatTime(sec) {
      if (!sec || isNaN(sec)) return '0:00';
      return Math.floor(sec / 60) + ':' + String(Math.floor(sec % 60)).padStart(2, '0');
    }

    function renderResults() {
      if (!tracks.length) { resultsEl.innerHTML = '<div class="empty">Ничего не найдено</div>'; return; }
      resultsEl.innerHTML = tracks.map((t, i) => \`
        <div class="track \${i === currentIndex ? 'active' : ''}" data-index="\${i}">
          <div class="track-num">\${String(i + 1).padStart(2, '0')}</div>
          <div class="track-info">
            <div class="track-title">\${escapeHtml(t.title)}</div>
            <div class="track-artist">\${escapeHtml(t.artist)}</div>
          </div>
          <div class="track-dur">\${formatTime(t.duration)}</div>
        </div>
      \`).join('');
      resultsEl.querySelectorAll('.track').forEach(el => el.addEventListener('click', () => playTrack(+el.dataset.index)));
    }

    function playTrack(index) {
      if (index < 0 || index >= tracks.length) return;
      currentIndex = index;
      const track = tracks[index];
      npTitle.textContent = track.title;
      npArtist.textContent = track.artist;
      if (track.thumbnail) { cover.style.backgroundImage = \`url(\${track.thumbnail})\`; cover.textContent = ''; }
      else { cover.style.backgroundImage = 'none'; cover.textContent = '♫'; }
      renderResults();
      safePlay(track.id);
      setStatus('Играет: ' + track.title);
    }

    function togglePlay() {
      if (!playerReady || !ytPlayer || currentIndex < 0) return;
      if (isPlaying) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
    }
    function playNext() { if (tracks.length) playTrack((currentIndex + 1) % tracks.length); }
    function playPrev() { if (tracks.length) playTrack((currentIndex - 1 + tracks.length) % tracks.length); }

    function startProgress() {
      stopProgress();
      progressTimer = setInterval(() => {
        if (!playerReady || !ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
        const cur = ytPlayer.getCurrentTime() || 0;
        const dur = ytPlayer.getDuration() || 1;
        progressFill.style.width = (cur / dur * 100) + '%';
        curTime.textContent = formatTime(cur);
        durTime.textContent = formatTime(dur);
      }, 400);
    }
    function stopProgress() { clearInterval(progressTimer); }

    progressBar.addEventListener('click', (e) => {
      if (!playerReady || !ytPlayer || typeof ytPlayer.getDuration !== 'function') return;
      const rect = progressBar.getBoundingClientRect();
      ytPlayer.seekTo(((e.clientX - rect.left) / rect.width) * ytPlayer.getDuration(), true);
    });

    searchBtn.addEventListener('click', () => searchTracks(searchInput.value));
    searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchTracks(searchInput.value); });
    playBtn.addEventListener('click', togglePlay);
    nextBtn.addEventListener('click', playNext);
    prevBtn.addEventListener('click', playPrev);

    initPlayer().then(() => setStatus('Готов к поиску')).catch(() => setStatus('Ошибка загрузки плеера', true));
  </script>
</body>
</html>`;

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
    </div>
    <iframe id="cwNeonWaveFrame" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>
  `;
  document.body.appendChild(overlay);

  function openNeonWave() {
    const frame = document.getElementById("cwNeonWaveFrame");
    if (!frame.getAttribute("srcdoc")) {
      frame.srcdoc = PLAYER_HTML;
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
