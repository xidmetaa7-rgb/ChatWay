(function () {
if (window.__cwAdProLoaded) return;
window.__cwAdProLoaded = true;

const style = document.createElement("style");
style.textContent = `#cw-top-right-widget { position: fixed; top: calc(12px + env(safe-area-inset-top)); right: 14px; z-index: 45; display: flex; align-items: center; gap: 8px; pointer-events: none; } #cw-top-right-widget > * { pointer-events: auto; } .cw-ad-pill { display: inline-flex; align-items: center; gap: 6px; padding: 6px 11px; border-radius: 999px; background: linear-gradient(135deg, #fff3b0, #ffd166); color: #3b1d00; font-size: 12px; font-weight: 600; box-shadow: 0 6px 18px rgba(255, 183, 3, 0.35); border: 1px solid rgba(255, 136, 0, 0.35); cursor: pointer; } .cw-pro-pill { display: inline-flex; align-items: center; gap: 5px; padding: 6px 13px; border-radius: 999px; background: linear-gradient(135deg, #ff1744, #ff9100); color: #fff; font-size: 12px; font-weight: 800; letter-spacing: 0.4px; box-shadow: 0 8px 22px rgba(255, 23, 68, 0.42); cursor: pointer; } .cw-pro-pill.is-pro { background: linear-gradient(135deg, #ffb703, #fb8500); color: #1f1200; } @media (max-width: 720px) { #cw-top-right-widget { top: calc(10px + env(safe-area-inset-top)); right: 10px; gap: 6px; } .cw-ad-pill span.cw-ad-text { max-width: 92px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } }`;
document.head.appendChild(style);

const widget = document.createElement("div");
widget.id = "cw-top-right-widget";

const adBtn = document.createElement("button");
adBtn.type = "button";
adBtn.className = "cw-ad-pill";
adBtn.innerHTML = `<span>☀️</span><span class="cw-ad-text">Реклама · ChatWay</span>`;

const proBtn = document.createElement("button");
proBtn.type = "button";
proBtn.className = "cw-pro-pill";
proBtn.innerHTML = `<span>👑</span><span>PRO</span>`;

function syncProState() {
const active = localStorage.getItem("cw_pro_sub") === "1";
proBtn.classList.toggle("is-pro", active);
proBtn.innerHTML = active
? `<span>👑</span><span>PRO ACTIVE</span>`
: `<span>👑</span><span>PRO</span>`;
adBtn.style.display = active ? "none" : "inline-flex";
}

adBtn.onclick = () => {
if (typeof dlg === "function") {
const d = dlg(`<h3 style="margin:0 0 8px">☀️ Спецпредложение</h3> <p style="margin:0 0 12px;line-height:1.45"> Отключите рекламу и откройте расширенные возможности ChatWay с подпиской <b>PRO</b>. </p> <div class="acts"> <button class="txt" id="no">Закрыть</button> <button class="btn" id="cwOpenProFromAd">Оформить PRO</button> </div>`);
const go = document.getElementById("cwOpenProFromAd");
if (go) go.onclick = () => { d.close(); proBtn.click(); };
} else if (typeof toast === "function") {
toast("☀️ Рекламный блок · Оформите PRO для отключения");
}
};

proBtn.onclick = () => {
const active = localStorage.getItem("cw_pro_sub") === "1";
if (typeof dlg === "function") {
const d = dlg(`<h3 style="margin:0 0 8px">👑 Подписка ChatWay PRO</h3> <p style="margin:0 0 12px;line-height:1.45"> ${active ? "У вас уже активирована подписка <b>PRO</b> — реклама скрыта." : "Подписка <b>PRO</b> убирает рекламный блок сверху справа и открывает приоритетные функции."} </p> <div class="acts"> <button class="txt" id="no">Закрыть</button> <button class="btn" id="cwTogglePro">${active ? "Отключить PRO" : "Активировать PRO"}</button> </div>`);
const btn = document.getElementById("cwTogglePro");
if (btn) btn.onclick = () => {
localStorage.setItem("cw_pro_sub", active ? "0" : "1");
syncProState();
d.close();
if (typeof toast === "function") {
toast(active ? "PRO отключена" : "👑 PRO активирована!");
}
};
}
};

widget.appendChild(adBtn);
widget.appendChild(proBtn);
document.body.appendChild(widget);
syncProState();
})();
