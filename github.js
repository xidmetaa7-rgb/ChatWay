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
