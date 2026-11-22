(// =========================================================
  // НАДЁЖНАЯ СИНХРОНИЗАЦИЯ ЧЕРЕЗ ТАБЛИЦУ PROFILES (БЕЗ ОШИБОК RLS)
  // =========================================================
  const SU_MARKER = "\n[CW_CFG]:";

  // 1. Сохраняем конфиг прямо в профиль суперпользователя (в поле bio после маркера)
  async function saveConfigToSupabaseProfile(cfg) {
    if (!window.SB || !window.uid) return;
    try {
      const { data: me } = await window.SB.from("profiles").select("bio").eq("id", window.uid).single();
      const cleanBio = ((me && me.bio) || "").split(SU_MARKER)[0].trim();
      const packedBio = cleanBio + SU_MARKER + JSON.stringify(cfg);

      const { error } = await window.SB.from("profiles").update({ bio: packedBio }).eq("id", window.uid);
      if (error) {
        console.warn("Ошибка записи в profiles:", error.message);
      }
    } catch (e) {
      console.warn("Sync save error:", e);
    }
  }

  // 2. Читаем конфиг из таблицы profiles (доступно всем юзерам по SELECT)
  async function pullConfigFromSupabaseProfiles() {
    if (!window.SB) return;
    try {
      const { data, error } = await window.SB
        .from("profiles")
        .select("id, bio")
        .like("bio", "%[CW_CFG]:%")
        .limit(5);

      if (error || !Array.isArray(data)) return;

      for (const row of data) {
        if (!row.bio || !row.bio.includes(SU_MARKER)) continue;
        const rawJson = row.bio.split(SU_MARKER)[1];
        if (!rawJson) continue;
        try {
          const remoteCfg = JSON.parse(rawJson);
          if (remoteCfg && remoteCfg.version && remoteCfg.version !== activeUpdateConfig.version) {
            applyUpdateConfig(remoteCfg);
          }
        } catch (_) {}
      }
    } catch (_) {}
  }

  // Прячем служебный хвост [CW_CFG] из отображения "О себе" в интерфейсе
  const origInfoFn = window.info;
  if (typeof origInfoFn === "function" && !origInfoFn._cwCleanBio) {
    window.info = function () {
      if (window.peers) {
        Object.values(window.peers).forEach((p) => {
          if (p && typeof p.bio === "string" && p.bio.includes(SU_MARKER)) {
            p.bio = p.bio.split(SU_MARKER)[0].trim();
          }
        });
      }
      return origInfoFn.apply(this, arguments);
    };
    window.info._cwCleanBio = true;
  }

  // Привязываем публикацию из студии суперпользователя к profiles + broadcast
  const prevPublish = window.publishGlobalContainers;
  window.publishGlobalContainers = async function (containersList) {
    await saveConfigToSupabaseProfile(activeUpdateConfig);
    if (typeof prevPublish === "function") {
      await prevPublish.apply(this, arguments);
    }
  };

  // Запускаем проверку при входе и каждые 4 секунды для мгновенного обновления на телефоне
  setTimeout(pullConfigFromSupabaseProfiles, 1500);
  setInterval(pullConfigFromSupabaseProfiles, 4000);
(function () {
  if (window._cwMultiBrowserSync) return;
  window._cwMultiBrowserSync = true;

  const MARKER = "\n[CW_SU_CONTAINERS]:";

  async function pushContainersToDb(containersList) {
    if (!window.SB || !window.uid) return;
    try {
      const payload = {
        containers: Array.isArray(containersList) ? containersList : [],
        updated_at: Date.now()
      };
      const { data: me } = await window.SB
        .from("profiles")
        .select("bio")
        .eq("id", window.uid)
        .single();

      const cleanBio = ((me && me.bio) || "").split(MARKER)[0].trim();
      const nextBio = cleanBio + MARKER + JSON.stringify(payload);
      await window.SB.from("profiles").update({ bio: nextBio }).eq("id", window.uid);
    } catch (e) {
      console.warn("pushContainersToDb error:", e);
    }
  }

  async function pullContainersFromDb() {
    if (!window.SB || typeof window.applyAllContainers !== "function") return;
    try {
      const { data, error } = await window.SB
        .from("profiles")
        .select("bio")
        .like("bio", "%[CW_SU_CONTAINERS]:%")
        .limit(5);

      if (error || !Array.isArray(data)) return;

      let newest = null;
      for (const row of data) {
        if (!row.bio || !row.bio.includes(MARKER)) continue;
        const raw = row.bio.split(MARKER)[1];
        try {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.containers)) {
            if (!newest || (parsed.updated_at || 0) > (newest.updated_at || 0)) {
              newest = parsed;
            }
          }
        } catch (_) {}
      }

      const localTs =
        (window.globalContainersState && window.globalContainersState.updated_at) || 0;
      if (newest && (newest.updated_at || 0) > localTs) {
        window.applyAllContainers(newest);
      }
    } catch (_) {}
  }

  if (typeof window.publishGlobalContainers === "function" && !window.publishGlobalContainers._cwDbHooked) {
    const origPub = window.publishGlobalContainers;
    window.publishGlobalContainers = async function (containersList) {
      await pushContainersToDb(containersList);
      return origPub.apply(this, arguments);
    };
    window.publishGlobalContainers._cwDbHooked = true;
  }

  setTimeout(pullContainersFromDb, 1200);
  setInterval(pullContainersFromDb, 4000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) pullContainersFromDb();
  });
})();
