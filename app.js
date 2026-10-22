// ================= Tiện ích =================
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const shuffle = (arr) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const fmtTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
const fmtNum = (n) => n.toLocaleString("vi-VN");
const baseLetter = (ch) => ch.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/Đ/g, "D").replace(/đ/g, "d").toUpperCase();
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

const TILE_COLORS = ["#ff5fa2", "#19c3c9", "#ffb703", "#4cc96a", "#9b6bff", "#ff8a3d", "#3d8bff", "#ff5f6d"];
const LEVEL_ORDER = ["de", "trungbinh", "kho", "sieukho"];
const QUESTIONS_PER_ROUND = 10;
const HINTS_PER_ROUND = 3;

const ICON = {
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" fill="currentColor"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M19 12H5m6-7-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14m-6-7 7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.5L12 17.2 6.1 20.4l1.3-6.5L2.5 9.3l6.6-.8z" fill="#ffd23f" stroke="#e8a400" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  crown: '<svg viewBox="0 0 64 48"><path d="M6 16l14 12 12-22 12 22 14-12-6 28H12z" fill="#ffd23f" stroke="#d99400" stroke-width="2.5" stroke-linejoin="round"/><rect x="12" y="40" width="40" height="6" rx="2" fill="#f5b400"/><circle cx="6" cy="14" r="4" fill="#ffd23f"/><circle cx="32" cy="5" r="4" fill="#ffd23f"/><circle cx="58" cy="14" r="4" fill="#ffd23f"/><path d="M27 22l5 11 5-11" fill="none" stroke="#8b1d6b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" fill="none" stroke="#ffd23f" stroke-width="2.4"/><path d="M12 9v4l2.5 2M9 2.5h6" fill="none" stroke="#ffd23f" stroke-width="2.4" stroke-linecap="round"/></svg>',
  erase: '<svg viewBox="0 0 24 24"><path d="M9 5h11a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H9l-6-7z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/><path d="M12 9l5 6m0-6l-5 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  bulb: '<svg viewBox="0 0 24 24"><path d="M9 18h6m-5 3h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="#ffd23f" stroke="#e8a400" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  exit: '<svg viewBox="0 0 24 24"><path d="M10 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h5M15 8l-4 4 4 4m-4-4h10" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M3 5c3-1.5 6-1.5 9 .5 3-2 6-2 9-.5v14c-3-1.5-6-1.5-9 .5-3-2-6-2-9-.5z" fill="#7ea8ff" stroke="#3c2a8a" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 5.5v14" stroke="#3c2a8a" stroke-width="1.6"/></svg>',
  musicOn: '<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.8" fill="currentColor"/><circle cx="17.5" cy="16" r="2.8" fill="currentColor"/></svg>',
  musicOff: '<svg viewBox="0 0 24 24"><path d="M9 18V5l11-2v13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="6.5" cy="18" r="2.8" fill="currentColor"/><circle cx="17.5" cy="16" r="2.8" fill="currentColor"/><path d="M3 3l18 18" stroke="#ff6b6b" stroke-width="2.6" stroke-linecap="round"/></svg>',
  sfxOn: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  sfxOff: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M17 9l5 6m0-6l-5 6" stroke="#ff6b6b" stroke-width="2.4" stroke-linecap="round"/></svg>',
};

function tilesHTML(text, offset = 0) {
  let i = offset;
  return `<div class="word-tiles">${Array.from(text).map((ch) => ch === " "
    ? '<span class="space"></span>'
    : `<span class="ltile" style="--c:${TILE_COLORS[i % TILE_COLORS.length]};--i:${i++}">${ch}</span>`).join("")}</div>`;
}

// ================= Âm thanh, tên người chơi, toast =================
let playerName = store.get("vtv_name", "");

function updateUserChip() {
  const name = playerName || "nguoichoi";
  $("#btn-user .uname").textContent = name;
  $("#btn-user .avatar").textContent = name.charAt(0).toUpperCase();
}
function updateSoundButtons() {
  $("#btn-music").innerHTML = Sound.musicOn ? ICON.musicOn : ICON.musicOff;
  $("#btn-music").classList.toggle("off", !Sound.musicOn);
  $("#btn-sfx").innerHTML = Sound.sfxOn ? ICON.sfxOn : ICON.sfxOff;
  $("#btn-sfx").classList.toggle("off", !Sound.sfxOn);
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

let nameResolve = null;
function askName() {
  const modal = $("#modal"), input = $("#name-input");
  modal.hidden = false;
  input.value = playerName;
  setTimeout(() => input.focus(), 50);
  return new Promise((res) => { nameResolve = res; });
}
function closeName(saved) {
  $("#modal").hidden = true;
  if (nameResolve) { nameResolve(saved); nameResolve = null; }
}
$("#name-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const v = $("#name-input").value.trim().slice(0, 16);
  if (!v) return;
  playerName = v; store.set("vtv_name", v); updateUserChip();
  Sound.play("correct");
  closeName(true);
});
$("#name-cancel").addEventListener("click", () => closeName(false));
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeName(false); });

$("#btn-user").addEventListener("click", askName);
$("#btn-music").addEventListener("click", () => { Sound.toggleMusic(); updateSoundButtons(); });
$("#btn-sfx").addEventListener("click", () => { Sound.toggleSfx(); updateSoundButtons(); Sound.play("click"); });

// Trình duyệt chỉ cho phát âm thanh sau thao tác đầu tiên của người dùng
addEventListener("pointerdown", () => Sound.init(), { once: true });
addEventListener("keydown", () => Sound.init(), { once: true });
document.addEventListener("click", (e) => {
  if (e.target.closest(".btn, .back-btn, .nav-links a, .feature, .tabs button")) Sound.play("click");
});
document.addEventListener("pointerover", (e) => {
  const b = e.target.closest(".btn, .feature, .level-card, .tile");
  if (b && !b.contains(e.relatedTarget)) Sound.play("hover");
});

// ================= Cảnh nền =================
function buildScene() {
  const stars = $(".stars");
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("span");
    const big = i < 10;
    if (big) s.className = "big";
    s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * (big ? 45 : 65)}%;--d:${2 + Math.random() * 4}s;--delay:${-Math.random() * 5}s`;
    stars.appendChild(s);
  }
  const letters = ["Ă", "Ê", "Ơ", "Ư", "Đ", "Â", "Ô", "Ế"];
  const spots = [[4, 30], [92, 24], [8, 62], [88, 58], [50, 12], [22, 14], [76, 40], [60, 70]];
  const floaters = $(".floaters");
  letters.forEach((ch, i) => {
    const s = document.createElement("span");
    s.textContent = ch;
    s.style.cssText = `left:${spots[i][0]}%;top:${spots[i][1]}%;--c:${TILE_COLORS[i]};--d:${10 + Math.random() * 8}s;--delay:${-Math.random() * 10}s;--r:${(Math.random() * 30 - 15).toFixed(0)}deg`;
    floaters.appendChild(s);
  });
  $(".nav-logo").innerHTML = tilesHTML("VUA") + tilesHTML("TIẾNG VIỆT", 3);
  // hiệu ứng thị sai nhẹ theo chuột
  if (!reduceMotion) {
    addEventListener("pointermove", (e) => {
      const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
      floaters.style.transform = `translate(${x * -24}px, ${y * -16}px)`;
      stars.style.transform = `translate(${x * -8}px, ${y * -6}px)`;
    });
  }
}

// ================= Điều hướng =================
const routes = { "": renderHome, "cap-do": renderLevels, "choi": renderPlay, "bang-xep-hang": renderBoard, "gioi-thieu": renderAbout };
let currentRoute = null;

function go(path) { location.hash = "#/" + path; }

function router() {
  const path = location.hash.replace(/^#\/?/, "").split("?")[0];
  const route = routes[path] ? path : "";
  if (route !== "choi") stopTimer();
  $$(".nav-links a").forEach((a) => a.classList.toggle("active", a.dataset.route === (route === "choi" ? "cap-do" : route)));
  const view = $("#view");
  const old = view.firstElementChild;
  const render = () => {
    view.innerHTML = "";
    routes[route]();
    scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };
  if (old && currentRoute !== null && !reduceMotion) {
    old.classList.add("leaving");
    Sound.play("whoosh");
    setTimeout(render, 200);
  } else render();
  currentRoute = route;
}
addEventListener("hashchange", router);

function mount(html) {
  const view = $("#view");
  view.innerHTML = html;
  return view.firstElementChild;
}

// ================= Trang chủ =================
function renderHome() {
  const features = [
    { t: "Kiến thức phong phú", d: "Hơn 450 câu hỏi với 5 dạng: xếp chữ, điền chữ, điền từ, xếp câu, chính tả", to: "cap-do",
      ico: '<svg viewBox="0 0 48 48" class="ico"><path d="M4 10c6-3 13-3 20 1 7-4 14-4 20-1v28c-6-3-13-3-20 1-7-4-14-4-20-1z" fill="#2ec4b6" stroke="#0e7c74" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 11v28" stroke="#0e7c74" stroke-width="2.5"/><path d="M9 17c3-1 7-1 10 1M9 23c3-1 7-1 10 1M29 18c3-2 7-2 10-1M29 24c3-2 7-2 10-1" stroke="#d6fff9" stroke-width="2" stroke-linecap="round"/></svg>' },
    { t: "Vừa học vừa chơi", d: "Giúp bạn mở rộng vốn từ và hiểu biết ngôn ngữ", to: "cap-do",
      ico: '<svg viewBox="0 0 48 48" class="ico"><path d="M24 8c-4-4-12-3-13 3-5 1-7 7-4 11-3 4-1 10 4 11 1 6 9 7 13 3z" fill="#5b9dff" stroke="#2a5fc4" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 8c4-4 12-3 13 3 5 1 7 7 4 11 3 4 1 10-4 11-1 6-9 7-13 3z" fill="#7cb3ff" stroke="#2a5fc4" stroke-width="2.5" stroke-linejoin="round"/><path d="M24 8v28M15 17c3 0 5 2 5 5M33 17c-3 0-5 2-5 5M15 28c2-2 5-2 7 0M33 28c-2-2-5-2-7 0" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/></svg>' },
    { t: "Bảng xếp hạng", d: "Ghi danh và so tài cùng bạn bè chơi trên máy này", to: "bang-xep-hang",
      ico: '<svg viewBox="0 0 48 48" class="ico"><rect x="6" y="26" width="9" height="16" rx="2.5" fill="#ffb703"/><rect x="19.5" y="16" width="9" height="26" rx="2.5" fill="#ffc93c"/><rect x="33" y="6" width="9" height="36" rx="2.5" fill="#ffd95e"/></svg>' },
    { t: "Thử thách mọi cấp độ", d: "Từ dễ đến siêu khó, phù hợp mọi lứa tuổi", to: "cap-do",
      ico: '<svg viewBox="0 0 48 48" class="ico"><circle cx="24" cy="15" r="7" fill="#c39bff"/><circle cx="10" cy="19" r="5" fill="#a879ff"/><circle cx="38" cy="19" r="5" fill="#a879ff"/><path d="M12 40c0-8 5-14 12-14s12 6 12 14z" fill="#c39bff"/><path d="M1 38c0-6 4-10 9-10 3 0 5 1 6 3-3 2-4 4-5 7zM47 38c0-6-4-10-9-10-3 0-5 1-6 3 3 2 4 4 5 7z" fill="#a879ff"/></svg>' },
  ];
  const page = mount(`
    <section class="page home">
      <div class="hero">
        <div class="bubble b-left">Tiếng Việt<br/>thật tuyệt! <span class="heart">♥</span></div>
        <div class="bubble b-right">Chơi chữ<br/>Khám phá<br/>Yêu tiếng Việt<br/>cùng nhau! <span class="heart">♥</span></div>
        <div class="hero-mascot"><img src="assets/mascot-home.png" alt="Linh vật Vua Tiếng Việt đang đọc sách" /></div>
        <img class="hero-tower" src="assets/ho-guom.png" alt="Tháp Rùa, Hồ Gươm" />
        <div class="title-block">
          <span class="crown">${ICON.crown}</span>
          <div class="row1">${tilesHTML("VUA")}</div>
          <div class="row2">${tilesHTML("TIẾNG VIỆT", 3)}</div>
        </div>
        <p class="tagline">Tôn vinh sự giàu đẹp của tiếng Việt</p>
        <button class="btn btn-yellow btn-big btn-shine" data-go="cap-do">${ICON.play} Chơi ngay</button>
      </div>
      <div class="features stagger">
        ${features.map((f, i) => `
          <a class="feature" href="#/${f.to}" style="--i:${i + 6}">
            ${f.ico}<h3>${f.t}</h3><p>${f.d}</p>
            <span class="go">${ICON.arrow}</span>
          </a>`).join("")}
      </div>
    </section>`);
  $("[data-go]", page).addEventListener("click", () => go("cap-do"));
}

// ================= Chọn cấp độ =================
function renderLevels() {
  const page = mount(`
    <section class="page">
      <div class="page-head">
        <div><button class="back-btn" data-back>${ICON.back} Quay lại</button></div>
        <h1>Chọn cấp độ</h1><div></div>
      </div>
      <div class="modes stagger" role="radiogroup" aria-label="Dạng câu hỏi">
        ${MODES.map((m, i) => `
          <button class="mode ${m.key === gameMode ? "active" : ""}" data-mode="${m.key}" role="radio" aria-checked="${m.key === gameMode}" style="--i:${i}">
            <span class="mi">${m.icon}</span><span class="mt"><b>${m.name}</b><small>${esc(m.desc)}</small></span>
          </button>`).join("")}
      </div>
      <div class="levels-grid stagger">
        ${LEVEL_ORDER.map((key, i) => {
          const L = LEVELS[key];
          const stars = key === "sieukho"
            ? `<span style="--i:0;width:40px;display:block">${ICON.crown}</span>`
            : Array.from({ length: L.stars }, (_, k) => ICON.star.replace("<svg", `<svg style="--i:${k}"`)).join("");
          return `
          <div class="level-card ${key}" data-level="${key}" style="--i:${i}" tabindex="0" role="button" aria-label="Chơi cấp độ ${L.name}">
            <div class="level-stars">${stars}</div>
            <h2>${L.name}</h2>
            <p>${L.desc}</p>
            <div class="level-meta"><span>+${L.points} điểm/câu</span><span>${fmtTime(L.time)}/câu</span></div>
            <img class="mascot" src="${L.mascot}" alt="" />
            <button class="btn" tabindex="-1">Bắt đầu</button>
          </div>`;
        }).join("")}
      </div>
    </section>`);
  $("[data-back]", page).addEventListener("click", () => go(""));
  $$(".mode", page).forEach((b) => b.addEventListener("click", () => {
    gameMode = b.dataset.mode; store.set("vtv_mode", gameMode);
    $$(".mode", page).forEach((x) => { x.classList.toggle("active", x === b); x.setAttribute("aria-checked", x === b); });
    Sound.play("place", MODES.findIndex((m) => m.key === gameMode));
  }));
  $$(".level-card", page).forEach((card) => {
    const start = () => startGame(card.dataset.level);
    card.addEventListener("click", start);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); start(); } });
  });
}

// ================= Trò chơi =================
let game = null;
let timerId = null;

// Dạng câu hỏi: scramble (Sắp xếp chữ cái) và 4 dạng trong questions-more.js
const MODES = [
  { key: "mix", name: "Tổng hợp", desc: "Đủ cả 5 dạng", icon: "🎲" },
  { key: "scramble", name: "Sắp xếp chữ cái", desc: "H Ò N G A → ?", icon: "🔤" },
  { key: "letters", name: "Điền chữ cái", desc: "Từ _ưa đến nay", icon: "✏️" },
  { key: "word", name: "Điền từ", desc: "… hay như rồng", icon: "📜" },
  { key: "order", name: "Sắp xếp từ", desc: "vành / Trăng / cứ", icon: "🧩" },
  { key: "spell", name: "Chính tả", desc: "xúm xít hay súm sít?", icon: "✅" },
];
const KIND_INSTR = {
  scramble: "Sắp xếp các chữ cái sau để tạo thành một từ/cụm từ có nghĩa:",
  letters: "Chữ cái nào còn thiếu trong câu sau?",
  word: "Điền từ còn thiếu vào chỗ trống:",
  order: "Sắp xếp các từ sau thành câu hoàn chỉnh:",
  spell: "Cách viết nào đúng chính tả?",
};
const DECOYS = { de: 2, trungbinh: 3, kho: 4, sieukho: 4 }; // chữ cái gây nhiễu cho dạng Điền chữ cái
const DECOY_LETTERS = Array.from("BCDĐGHKLMNPQRSTVXAIOU");
let gameMode = store.get("vtv_mode", "mix");
if (!MODES.some((m) => m.key === gameMode)) gameMode = "mix";

const upper = (s) => s.normalize("NFC").toLocaleUpperCase("vi");
const lines = (html) => html.split(" / ").join("<br/>");

function questionPool(levelKey, kind) {
  const list = kind === "scramble" ? LEVELS[levelKey].questions : MORE_QUESTIONS[levelKey][kind];
  return list.map((q) => ({ ...q, kind }));
}
function pickQuestions(levelKey, mode) {
  if (mode !== "mix") return shuffle(questionPool(levelKey, mode)).slice(0, QUESTIONS_PER_ROUND);
  const kinds = MODES.slice(1).map((m) => m.key);
  const per = Math.ceil(QUESTIONS_PER_ROUND / kinds.length);
  return shuffle(kinds.flatMap((k) => shuffle(questionPool(levelKey, k)).slice(0, per))).slice(0, QUESTIONS_PER_ROUND);
}

// Chuẩn hóa mọi dạng câu hỏi về: target (các mảnh cần xếp đúng thứ tự), label (đáp án hiển thị)
function parseQuestion(q, level) {
  switch (q.kind) {
    case "scramble": {
      const a = upper(q.a);
      return { target: Array.from(a.replace(/ /g, "")), words: a.split(" ").map((w) => Array.from(w).length), label: a, short: a, tag: q.type, clue: q.clue };
    }
    case "word": {
      const a = upper(/\[([^\]]+)\]/.exec(q.t)[1]);
      return { target: Array.from(a.replace(/ /g, "")), words: a.split(" ").map((w) => Array.from(w).length), label: a, short: a, tag: q.src };
    }
    case "letters": {
      const blanks = [...q.t.normalize("NFC").matchAll(/\{(.)\}/gu)].map((x) => x[1]);
      const target = blanks.map(upper);
      const plain = q.t.replace(/[{}]/g, "").replace(/ \/ /g, " ");
      return {
        target, label: target.join(", "), tag: q.src,
        decoys: shuffle(DECOY_LETTERS.filter((c) => !target.includes(c))).slice(0, DECOYS[level]),
        lower: blanks.map((b) => b !== upper(b)),
        short: plain.length > 46 ? plain.slice(0, 44) + "…" : plain,
      };
    }
    case "order": {
      return { target: q.t.normalize("NFC").replace(/[.,;:!?“”"]/g, "").split(/\s+/), label: q.t, short: q.t, tag: q.src };
    }
    case "spell":
      return { target: [q.ok], options: shuffle([q.ok, q.bad]), label: q.ok, short: q.ok, tag: "Chính tả" };
  }
}

async function startGame(levelKey) {
  if (!playerName) {
    const ok = await askName();
    if (!ok && !playerName) { playerName = "nguoichoi"; updateUserChip(); }
  }
  game = {
    level: levelKey, mode: gameMode,
    qs: pickQuestions(levelKey, gameMode),
    idx: 0, score: 0, correct: 0, hintsLeft: HINTS_PER_ROUND,
    phase: "play", history: [], saved: false,
  };
  setupQuestion();
  if (location.hash === "#/choi") router(); else go("choi");
}

function setupQuestion() {
  const q = game.qs[game.idx];
  const p = parseQuestion(q, game.level);
  const pieces = [...p.target, ...(p.decoys || [])];
  let order = shuffle(pieces.map((_, i) => i));
  const n = p.target.length;
  for (let tries = 0; tries < 10 && n > 1 && order.slice(0, n).every((v, i) => pieces[v] === p.target[i]); tries++) order = shuffle(order);
  Object.assign(game, {
    q, kind: q.kind, target: p.target, label: p.label, short: p.short, tag: p.tag, clue: p.clue || "",
    words: p.words || null, lower: p.lower || [], options: p.options || null,
    tiles: order.map((i) => ({ ch: pieces[i], used: false })),
    slots: q.kind === "spell" ? [] : p.target.map(() => ({ tile: null, locked: false })),
    timeLeft: LEVELS[game.level].time, qHints: 0, phase: "play", animateIn: true,
  });
}

function stopTimer() { clearInterval(timerId); timerId = null; }
function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    if (!game || game.phase !== "play") return stopTimer();
    game.timeLeft--;
    updateTimer();
    if (game.timeLeft <= 10 && game.timeLeft > 0) Sound.play("tick");
    if (game.timeLeft <= 0) { stopTimer(); Sound.play("timeout"); finishQuestion(false, "timeout"); }
  }, 1000);
}
function updateTimer() {
  const el = $(".pill.timer");
  if (!el) return;
  $("b", el).textContent = fmtTime(Math.max(0, game.timeLeft));
  el.classList.toggle("low", game.timeLeft <= 10);
}

function renderPlay() {
  if (!game) return go("cap-do");
  if (game.phase === "result") return renderResult();
  if (game.phase === "done") return renderSummary();
  const L = LEVELS[game.level];
  const isSpell = game.kind === "spell";
  const cheers = ["Bạn làm được mà! ✨", "Cố lên nào! 💪", "Bình tĩnh suy nghĩ nhé!", "Tiếng Việt hay lắm đó!"];
  const page = mount(`
    <section class="page play">
      <div class="hud">
        <span class="lv-badge ${game.level} level-tag">${L.name}</span>
        <span class="pill">Câu <b>${game.idx + 1}/${game.qs.length}</b></span>
        <span class="pill score">${ICON.star} Điểm: <b>${fmtNum(game.score)}</b></span>
        <span class="pill timer">${ICON.clock} <b>${fmtTime(game.timeLeft)}</b></span>
        <button class="back-btn exit">${ICON.exit} Thoát</button>
      </div>
      <div class="progress"><i style="--p:${(game.idx / game.qs.length) * 100}%"></i></div>
      <div class="stage">
        <div class="board kind-${game.kind}">
          <img class="qblock" src="assets/question-block.png" alt="" />
          <div class="board-inner">
            <p class="instr">${KIND_INSTR[game.kind]}</p>
            <div class="clue"><span class="tag">${esc(game.tag)}</span>${game.clue ? `<span>${esc(game.clue)}</span>` : ""}</div>
            <div class="passage"></div>
            <div class="tiles"></div>
            <div class="slots"></div>
            ${isSpell ? "" : `
            <div class="actions">
              <button class="btn btn-blue" data-act="clear">${ICON.erase} Xóa</button>
              <button class="btn btn-blue" data-act="hint">${ICON.bulb} Gợi ý <span class="badge">${game.hintsLeft}</span></button>
              <button class="btn btn-green" data-act="check">${ICON.check} Xác nhận</button>
            </div>
            <button class="skip" data-act="skip">Bỏ qua câu này</button>`}
          </div>
          <img class="books" src="assets/books.png" alt="" />
        </div>
        <div class="bubble">${cheers[game.idx % cheers.length]}</div>
        <div class="play-mascot"><img src="assets/mascot-game.png" alt="" /></div>
        <div class="note side-note">Suy nghĩ tí thôi, đáp án đang chờ bạn đó! <span style="color:var(--pink)">♥</span></div>
      </div>
    </section>`);

  const passage = $(".passage", page), tilesEl = $(".tiles", page), slotsEl = $(".slots", page);
  game.slotEls = [];
  const makeSlot = (cls = "") => {
    const s = document.createElement("span");
    const idx = game.slotEls.length;
    s.className = "slot " + cls;
    s.style.setProperty("--i", idx);
    s.addEventListener("click", () => removeFromSlot(idx));
    game.slotEls.push(s);
    return s;
  };
  const appendText = (el, text) => text.split(" / ").forEach((part, i) => {
    if (i) el.appendChild(document.createElement("br"));
    el.appendChild(document.createTextNode(part));
  });

  if (isSpell) {
    passage.innerHTML = `<div class="spell-q">“${esc(game.options[0])}” hay “${esc(game.options[1])}”?</div>
      <div class="choices">${game.options.map((o, i) => `<button class="choice" data-v="${esc(o)}" style="--i:${i}"><span class="key">${i + 1}</span>${esc(o)}</button>`).join("")}</div>`;
    $$(".choice", passage).forEach((b) => b.addEventListener("click", () => chooseSpelling(b)));
  } else if (game.kind === "letters") {
    // các ô trống nằm ngay trong đoạn văn
    game.q.t.normalize("NFC").split(/\{(.)\}/u).forEach((part, i) => {
      if (i % 2) passage.appendChild(makeSlot("inline")); else appendText(passage, part);
    });
  } else if (game.kind === "word") {
    const [before, after] = game.q.t.split(/\[[^\]]+\]/);
    appendText(passage, before);
    passage.insertAdjacentHTML("beforeend", '<span class="blank">…</span>');
    appendText(passage, after);
  } else {
    passage.remove();
  }

  if (!isSpell) {
    game.tileEls = game.tiles.map((t, i) => {
      const b = document.createElement("button");
      b.className = "tile" + (game.kind === "order" ? " wtile" : "") + (game.animateIn ? " pop" : "") + (t.used ? " used" : "");
      b.style.setProperty("--i", i);
      b.textContent = t.ch;
      b.setAttribute("aria-label", game.kind === "order" ? `Từ ${t.ch}` : `Chữ ${t.ch}`);
      b.addEventListener("click", () => placeTile(i));
      tilesEl.appendChild(b);
      return b;
    });
  } else tilesEl.remove();

  if (game.words) { // ô đáp án nhóm theo từng tiếng
    game.words.forEach((len) => {
      const w = document.createElement("div");
      w.className = "word";
      for (let j = 0; j < len; j++) w.appendChild(makeSlot());
      slotsEl.appendChild(w);
    });
  } else if (game.kind === "order") {
    game.target.forEach(() => slotsEl.appendChild(makeSlot("wslot")));
  } else slotsEl.remove();

  game.animateIn = false;
  refreshSlots();
  fitBoard();

  $(".exit", page).addEventListener("click", () => {
    if (confirm("Thoát lượt chơi? Điểm của lượt này sẽ không được lưu.")) { stopTimer(); game = null; go("cap-do"); }
  });
  $$("[data-act]", page).forEach((b) => b.addEventListener("click", () => ({
    clear: clearSlots, hint: useHint, check: checkAnswer,
    skip: () => { if (confirm("Bỏ qua câu này? Bạn sẽ không được điểm.")) { stopTimer(); Sound.play("wrong"); finishQuestion(false, "skip"); } },
  })[b.dataset.act]()));
  startTimer();
}

// Cỡ ô chữ theo chiều rộng bảng: cụm ngắn nằm trên 1 dòng, câu dài chia 2 dòng
function fitBoard() {
  const board = $(".board"), inner = $(".board-inner");
  if (!board || !game?.target || game.kind === "spell") return;
  const cs = getComputedStyle(inner);
  const W = inner.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  let t;
  if (game.kind === "order") t = W < 500 ? 40 : 50;
  else if (game.kind === "letters") t = Math.max(36, Math.min(56, Math.floor(W / (game.tiles.length * 1.25))));
  else {
    const n = game.target.length;
    const rows = n > 16 ? 2 : 1;
    const perLine = Math.ceil(n / rows) + (rows > 1 ? 2 : 0);
    const wordGaps = Math.ceil((game.words.length - 1) / rows);
    t = Math.max(28, Math.min(64, Math.floor(W / (perLine * 1.17 + wordGaps * 0.55))));
  }
  board.style.setProperty("--t", t + "px");
  board.style.setProperty("--gap", Math.round(t * 0.17) + "px");
}
addEventListener("resize", fitBoard);

function refreshSlots() {
  const firstEmpty = game.slots.findIndex((s) => s.tile === null);
  game.slots.forEach((s, i) => {
    const el = game.slotEls[i];
    const ch = s.tile === null ? "" : game.tiles[s.tile].ch;
    el.textContent = game.lower[i] ? ch.toLocaleLowerCase("vi") : ch;
    el.classList.toggle("filled", s.tile !== null);
    el.classList.toggle("locked", s.locked);
    el.classList.toggle("next", i === firstEmpty);
  });
}

// hiệu ứng "bay" của chữ cái giữa hàng chữ và ô đáp án (FLIP)
function fly(fromEl, toEl) {
  if (reduceMotion) return;
  const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
  toEl.animate([
    { transform: `translate(${a.left - b.left}px, ${a.top - b.top}px) scale(${a.width / b.width}) rotate(-8deg)`, zIndex: 5 },
    { transform: "translate(0,0) scale(1.15) rotate(3deg)", offset: 0.75 },
    { transform: "none" },
  ], { duration: 380, easing: "cubic-bezier(.2,.8,.25,1)" });
}

function placeTile(ti, slotIdx = null, lock = false) {
  if (game.phase !== "play" || game.tiles[ti].used) return;
  const si = slotIdx ?? game.slots.findIndex((s) => s.tile === null);
  if (si < 0) return;
  game.tiles[ti].used = true;
  game.slots[si] = { tile: ti, locked: lock };
  game.tileEls[ti].classList.add("used");
  refreshSlots();
  fly(game.tileEls[ti], game.slotEls[si]);
  Sound.play("place", si);
}

function removeFromSlot(si, silent = false) {
  const s = game.slots[si];
  if (game.phase !== "play" || s.tile === null || s.locked) return;
  const ti = s.tile;
  game.slots[si] = { tile: null, locked: false };
  game.tiles[ti].used = false;
  const tileEl = game.tileEls[ti];
  tileEl.classList.remove("used");
  if (!reduceMotion) {
    const a = game.slotEls[si].getBoundingClientRect(), b = tileEl.getBoundingClientRect();
    tileEl.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)`, opacity: 1 }, { transform: "none", opacity: 1 }],
      { duration: 320, easing: "cubic-bezier(.2,.8,.25,1)" });
  }
  refreshSlots();
  if (!silent) Sound.play("remove");
}

function clearSlots() {
  if (!game.slots.some((s) => s.tile !== null && !s.locked)) return;
  game.slots.forEach((_, i) => removeFromSlot(i, true));
  Sound.play("clear");
}

function useHint() {
  if (game.phase !== "play") return;
  if (game.hintsLeft <= 0) { toast("Bạn đã dùng hết lượt gợi ý của lượt chơi này!"); Sound.play("wrong"); return; }
  const target = game.target;
  const si = game.slots.findIndex((s, i) => !s.locked && (s.tile === null || game.tiles[s.tile].ch !== target[i]));
  if (si < 0) { toast("Các ô đã đúng rồi, bấm Xác nhận nhé!"); return; }
  removeFromSlot(si, true);
  let ti = game.tiles.findIndex((t) => !t.used && t.ch === target[si]);
  if (ti < 0) { // chữ cần dùng đang nằm ở ô khác
    const sj = game.slots.findIndex((s) => !s.locked && s.tile !== null && game.tiles[s.tile].ch === target[si]);
    ti = game.slots[sj].tile;
    removeFromSlot(sj, true);
  }
  placeTile(ti, si, true);
  game.hintsLeft--; game.qHints++;
  const badge = $(".badge");
  badge.textContent = game.hintsLeft; badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump");
  Sound.play("hint");
}

function checkAnswer() {
  if (game.phase !== "play") return;
  if (game.slots.some((s) => s.tile === null)) { toast("Hãy điền đủ các ô trước nhé!"); Sound.play("wrong"); return; }
  const guess = game.slots.map((s) => game.tiles[s.tile].ch).join("|");
  const slotsEl = $(".slots") || $(".passage"), mascot = $(".play-mascot"), bubble = $(".play .bubble");
  if (guess === game.target.join("|")) {
    stopTimer();
    game.phase = "checking";
    slotsEl.classList.add("win");
    mascot.classList.add("cheer");
    Sound.play("correct");
    setTimeout(() => finishQuestion(true), reduceMotion ? 200 : 900);
  } else {
    Sound.play("wrong");
    slotsEl.classList.remove("shake"); void slotsEl.offsetWidth; slotsEl.classList.add("shake");
    mascot.classList.remove("sad"); void mascot.offsetWidth; mascot.classList.add("sad");
    if (bubble) { bubble.textContent = ["Chưa đúng rồi, thử lại nhé!", "Gần đúng rồi đó!", "Đọc lại gợi ý xem nào!"][Math.floor(Math.random() * 3)]; bubble.classList.remove("swap"); void bubble.offsetWidth; bubble.classList.add("swap"); }
    setTimeout(() => slotsEl.classList.remove("shake"), 600);
  }
}

function chooseSpelling(btn) {
  if (game.phase !== "play") return;
  stopTimer();
  game.phase = "checking";
  const ok = btn.dataset.v === game.q.ok;
  btn.classList.add(ok ? "right" : "wrong");
  if (!ok) $$(".choice").find((b) => b.dataset.v === game.q.ok)?.classList.add("right", "reveal");
  $(".play-mascot").classList.add(ok ? "cheer" : "sad");
  Sound.play(ok ? "correct" : "wrong");
  setTimeout(() => finishQuestion(ok, ok ? "" : "wrong"), reduceMotion ? 300 : 1200);
}

function finishQuestion(ok, reason = "") {
  const L = LEVELS[game.level];
  let points = 0, bonus = 0;
  if (ok) {
    points = Math.round(L.points * Math.max(0.25, 1 - 0.25 * game.qHints));
    if (game.timeLeft >= (L.time * 2) / 3) bonus = Math.round(L.points * 0.2);
    game.score += points + bonus;
    game.correct++;
  }
  game.last = { ok, reason, points, bonus };
  game.history.push({ a: game.short, ok });
  game.phase = "result";
  router();
}

function renderResult() {
  const { ok, reason, points, bonus } = game.last;
  const last = game.idx + 1 >= game.qs.length;
  const title = ok ? "Chính xác!" : reason === "timeout" ? "Hết giờ!" : "Tiếc quá!";
  const icon = ok
    ? '<svg class="result-icon" viewBox="0 0 100 100"><circle class="ring" cx="50" cy="50" r="44" fill="none" stroke="#2fcf6a" stroke-width="4"/><circle cx="50" cy="50" r="42" fill="#2fcf6a" stroke="#fff" stroke-width="6"/><path d="M30 52l13 13 27-29" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '<svg class="result-icon" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="#ff6b6b" stroke="#fff" stroke-width="6"/><path d="M36 36l28 28M64 36L36 64" stroke="#fff" stroke-width="10" stroke-linecap="round"/></svg>';
  const mascot = ok
    ? `<div class="result-mascot"><div class="bob"><img src="assets/mascot-cheer.png" alt="" /><div class="sign ${game.label.length > 14 ? "long" : ""}">${esc(game.label.length > 24 ? "Tuyệt vời!" : game.label)}</div></div></div>`
    : `<div class="result-mascot"><div class="bob"><img src="assets/mascot-game.png" alt="" /></div></div>`;
  const page = mount(`
    <section class="page">
      <div class="result">
        <div style="position:relative">
          <div class="bubble">${ok ? 'Tuyệt vời!<br/>Bạn thật giỏi! <span class="heart">♥</span>' : "Không sao,<br/>câu sau cố lên nhé!"}</div>
          ${mascot}
        </div>
        <div class="result-center">
          ${icon}
          <h1 class="${ok ? "" : "bad"}">${title}</h1>
          <div class="answer-line">Đáp án: <b>${esc(game.label)}</b></div>
          ${fullTextHTML() ? `<blockquote class="full-text">${fullTextHTML()}</blockquote>` : ""}
          <div class="points-pill">${ICON.star} +<span class="count">0</span> điểm</div>
          <div class="bonus">${bonus ? `Thưởng tốc độ +${bonus}` : ""}${game.qHints && ok ? `${bonus ? " · " : ""}Dùng ${game.qHints} gợi ý` : ""}</div>
          <button class="btn btn-yellow btn-big btn-shine" data-next>${last ? "Xem kết quả" : "Câu tiếp theo"} ${ICON.arrow}</button>
        </div>
        <div class="note explain-card">
          <h3>${ICON.book} Giải thích</h3>
          <p>${esc(game.q.explain)}</p>
          <span class="src">${esc(game.tag)}</span>
        </div>
      </div>
    </section>`);
  countUp($(".count", page), points + bonus, 900, 600);
  if (ok) confetti();
  const next = () => {
    document.removeEventListener("keydown", onKey);
    if (last) { game.phase = "done"; } else { game.idx++; setupQuestion(); }
    router();
  };
  const onKey = (e) => { if (e.key === "Enter" && game && game.phase === "result" && currentRoute === "choi") { e.preventDefault(); next(); } };
  $("[data-next]", page).addEventListener("click", next);
  setTimeout(() => document.addEventListener("keydown", onKey), 400);
}

// Câu hoàn chỉnh, tô sáng phần người chơi cần điền
function fullTextHTML() {
  if (game.kind === "letters") return lines(esc(game.q.t).replace(/\{(.)\}/gu, "<mark>$1</mark>"));
  if (game.kind === "word") return lines(esc(game.q.t).replace(/\[([^\]]+)\]/, "<mark>$1</mark>"));
  if (game.kind === "spell") return `<s>${esc(game.q.bad)}</s> → <mark>${esc(game.q.ok)}</mark>`;
  return "";
}

function renderSummary() {
  const L = LEVELS[game.level];
  if (!game.saved) {
    const scores = store.get("vtv_scores", []);
    scores.push({ name: playerName || "nguoichoi", score: game.score, correct: game.correct, level: game.level, mode: game.mode, t: Date.now() });
    store.set("vtv_scores", scores.slice(-500));
    game.saved = true;
  }
  const great = game.correct >= 8, ok = game.correct >= 5;
  const page = mount(`
    <section class="page summary">
      <img class="trophy" src="assets/trophy.png" alt="Cúp vàng" />
      <h1>${great ? "Xuất sắc!" : ok ? "Hoàn thành!" : "Cố gắng lên!"}</h1>
      <div class="lvl">Cấp độ <span class="lv-badge ${game.level}">${L.name}</span> · ${MODES.find((m) => m.key === game.mode).name} · Người chơi <b>${esc(playerName)}</b></div>
      <div class="stats stagger">
        <div class="stat" style="--i:0"><b class="c1">0</b><span>Tổng điểm</span></div>
        <div class="stat" style="--i:1"><b>${game.correct}/${game.qs.length}</b><span>Câu đúng</span></div>
        <div class="stat" style="--i:2"><b>${HINTS_PER_ROUND - game.hintsLeft}</b><span>Gợi ý đã dùng</span></div>
      </div>
      <div class="row">
        <button class="btn btn-yellow btn-shine" data-a="again">Chơi lại</button>
        <button class="btn btn-blue" data-a="levels">Chọn cấp độ khác</button>
        <button class="btn btn-ghost" data-a="board">Bảng xếp hạng</button>
      </div>
      <div class="review">
        ${game.history.map((h, i) => `<div><span>${i + 1}. ${esc(h.a)}</span><span class="${h.ok ? "ok" : "no"}">${h.ok ? "✓ Đúng" : "✗ Sai"}</span></div>`).join("")}
      </div>
    </section>`);
  Sound.play("fanfare");
  if (ok) setTimeout(confetti, 300);
  countUp($(".c1", page), game.score, 1400, 400);
  const lvl = game.level;
  $$("[data-a]", page).forEach((b) => b.addEventListener("click", () => {
    const a = b.dataset.a;
    game = null;
    if (a === "again") startGame(lvl); else go(a === "levels" ? "cap-do" : "bang-xep-hang");
  }));
}

function countUp(el, to, dur = 1000, delay = 0) {
  if (reduceMotion || to === 0) { el.textContent = fmtNum(to); return; }
  setTimeout(() => {
    const t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = fmtNum(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, delay);
}

function confetti() {
  if (reduceMotion) return;
  const box = document.createElement("div");
  box.className = "confetti";
  document.body.appendChild(box);
  const colors = ["#ffd23f", "#ff5fa2", "#19c3c9", "#4cc96a", "#9b6bff", "#ff8a3d", "#fff"];
  const cx = innerWidth / 2, cy = innerHeight * 0.35;
  for (let i = 0; i < 90; i++) {
    const p = document.createElement("i");
    p.style.background = colors[i % colors.length];
    if (i % 3 === 0) p.style.borderRadius = "50%";
    box.appendChild(p);
    const ang = Math.random() * Math.PI * 2, v = 200 + Math.random() * 380;
    const dx = Math.cos(ang) * v, dy = Math.sin(ang) * v - 220;
    p.animate([
      { transform: `translate(${cx}px, ${cy}px) rotate(0) scale(${0.6 + Math.random() * 0.6})`, opacity: 1 },
      { transform: `translate(${cx + dx * 0.7}px, ${cy + dy * 0.7}px) rotate(${Math.random() * 540}deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${cx + dx}px, ${cy + dy + 520}px) rotate(${Math.random() * 1080}deg)`, opacity: 0 },
    ], { duration: 1600 + Math.random() * 1000, easing: "cubic-bezier(.15,.6,.4,1)", fill: "forwards" });
  }
  setTimeout(() => box.remove(), 2800);
}

// Bàn phím: gõ chữ để chọn, Backspace để xóa, Enter để xác nhận; phím 1/2 cho câu chính tả
document.addEventListener("keydown", (e) => {
  if (!game || game.phase !== "play" || currentRoute !== "choi" || !$("#modal").hidden) return;
  if (game.kind === "spell") {
    const b = $$(".choice")[+e.key - 1];
    if (b) chooseSpelling(b);
    return;
  }
  if (e.key === "Enter") { e.preventDefault(); checkAnswer(); return; }
  if (e.key === "Backspace") {
    e.preventDefault();
    for (let i = game.slots.length - 1; i >= 0; i--) if (game.slots[i].tile !== null && !game.slots[i].locked) { removeFromSlot(i); break; }
    return;
  }
  if (e.key.length === 1 && /\p{L}/u.test(e.key) && game.kind !== "order") {
    const key = e.key.normalize("NFC").toUpperCase();
    let ti = game.tiles.findIndex((t) => !t.used && t.ch === key);
    if (ti < 0) ti = game.tiles.findIndex((t) => !t.used && baseLetter(t.ch) === baseLetter(key));
    if (ti >= 0) placeTile(ti);
  }
});

// ================= Bảng xếp hạng =================
function periodStart(period) {
  const d = new Date(); d.setHours(0, 0, 0, 0);
  if (period === "week") { d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getTime(); }
  if (period === "month") { d.setDate(1); return d.getTime(); }
  return 0;
}
function leaderboard(period) {
  const from = periodStart(period);
  const map = new Map();
  for (const s of store.get("vtv_scores", [])) {
    if (s.t < from) continue;
    const key = s.name.toLowerCase();
    const r = map.get(key) || { name: s.name, score: 0, correct: 0, level: "de" };
    r.score += s.score; r.correct += s.correct;
    if (LEVEL_ORDER.indexOf(s.level) > LEVEL_ORDER.indexOf(r.level)) r.level = s.level;
    map.set(key, r);
  }
  return [...map.values()].sort((a, b) => b.score - a.score).slice(0, 20);
}

let lbPeriod = "week";
function renderBoard() {
  const tabs = [["week", "Tuần này"], ["month", "Tháng này"], ["all", "Tất cả thời gian"]];
  const page = mount(`
    <section class="page board-page">
      <div class="page-head">
        <div><button class="back-btn" data-back>${ICON.back} Quay lại</button></div>
        <h1><img src="assets/trophy.png" alt="" /> Bảng xếp hạng</h1><div></div>
      </div>
      <div class="lb-wrap">
        <div class="lb-center">
          <div class="tabs">${tabs.map(([k, t]) => `<button data-p="${k}" class="${k === lbPeriod ? "active" : ""}">${t}</button>`).join("")}<span class="indicator"></span></div>
          <div class="lb-table"></div>
        </div>
        <div class="lb-side">
          <div class="bubble">Cùng nhau lan tỏa tình yêu tiếng Việt nhé! <span class="heart">♥</span></div>
          <img class="trophy" src="assets/trophy.png" alt="" />
        </div>
      </div>
    </section>`);
  $("[data-back]", page).addEventListener("click", () => go(""));
  const moveIndicator = () => {
    const act = $(".tabs .active", page), ind = $(".tabs .indicator", page);
    ind.style.left = act.offsetLeft + "px"; ind.style.width = act.offsetWidth + "px";
  };
  $$(".tabs button", page).forEach((b) => b.addEventListener("click", () => {
    lbPeriod = b.dataset.p;
    $$(".tabs button", page).forEach((x) => x.classList.toggle("active", x === b));
    moveIndicator(); fillTable();
  }));
  const fillTable = () => {
    const rows = leaderboard(lbPeriod);
    const me = (playerName || "").toLowerCase();
    $(".lb-table", page).innerHTML = rows.length ? `
      <div class="lb-row head"><span>#</span><span>Người chơi</span><span>Điểm</span><span>Số câu đúng</span><span>Cấp độ cao nhất</span></div>
      ${rows.map((r, i) => `
        <div class="lb-row ${r.name.toLowerCase() === me ? "me" : ""}" style="--i:${i}">
          <span class="rank ${i < 3 ? "r" + (i + 1) : ""}">${i + 1}</span>
          <span class="player"><span class="avatar" style="--av:${TILE_COLORS[[...r.name].reduce((h, c) => h + c.charCodeAt(0), 0) % TILE_COLORS.length]}">${esc(r.name.charAt(0).toUpperCase())}</span><span>${esc(r.name)}</span></span>
          <span><b>${fmtNum(r.score)}</b></span>
          <span>${r.correct}</span>
          <span><span class="lv-badge ${r.level}">${LEVELS[r.level].name}</span></span>
        </div>`).join("")}`
      : `<div class="lb-empty"><img src="assets/mascot-sieukho.png" alt="" /><p><b>Chưa có ai ghi danh trong thời gian này.</b><br/>Hãy chơi một lượt để trở thành người đầu tiên!</p><button class="btn btn-yellow" data-play>${ICON.play} Chơi ngay</button></div>`;
    const p = $("[data-play]", page);
    if (p) p.addEventListener("click", () => go("cap-do"));
  };
  fillTable();
  requestAnimationFrame(moveIndicator);
  addEventListener("resize", moveIndicator);
  document.fonts?.ready.then(moveIndicator);
}

// ================= Giới thiệu =================
function renderAbout() {
  mount(`
    <section class="page">
      <div class="about">
        <div class="about-art">
          <img src="assets/mascot-about.png" alt="Linh vật ngồi trên chồng sách Từ vựng, Ca dao, Thành ngữ" />
        </div>
        <div class="about-card stagger">
          <h1 style="--i:0">Giới thiệu</h1>
          <p style="--i:1"><b>Vua Tiếng Việt</b> là trò chơi sắp xếp chữ cái lấy cảm hứng từ các chương trình đố chữ trên truyền hình, nhằm lan tỏa tình yêu tiếng Việt, tôn vinh sự phong phú và giàu đẹp của ngôn ngữ dân tộc.</p>
          <div class="values" style="--i:2">
            <div class="value"><svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="16" fill="none" stroke="#ff6b4a" stroke-width="3.5"/><circle cx="20" cy="20" r="9" fill="none" stroke="#ff6b4a" stroke-width="3.5"/><circle cx="20" cy="20" r="3" fill="#ff6b4a"/></svg><h3>Mục tiêu</h3><p>Giúp người chơi hiểu hơn về tiếng Việt qua những thử thách thú vị.</p></div>
            <div class="value"><svg viewBox="0 0 40 40"><circle cx="20" cy="13" r="6" fill="#3b6cf6"/><circle cx="8" cy="16" r="4" fill="#6b93ff"/><circle cx="32" cy="16" r="4" fill="#6b93ff"/><path d="M9 34c0-7 5-12 11-12s11 5 11 12zM1 32c0-5 3-8 7-8l3 1c-2 2-3 4-4 7zM39 32c0-5-3-8-7-8l-3 1c2 2 3 4 4 7z" fill="#3b6cf6"/></svg><h3>Đối tượng</h3><p>Phù hợp với mọi lứa tuổi, từ học sinh, sinh viên đến người đi làm.</p></div>
            <div class="value"><svg viewBox="0 0 40 40"><path d="M20 35S4 25 4 14a8 8 0 0 1 16-2 8 8 0 0 1 16 2c0 11-16 21-16 21z" fill="#ff4f8b"/></svg><h3>Giá trị</h3><p>Gìn giữ, phát huy vẻ đẹp của tiếng Việt trong thời đại số.</p></div>
          </div>
          <div class="howto" style="--i:3">
            <h2>Cách chơi</h2>
            <ol>
              <li>Chọn dạng câu hỏi (hoặc <b>Tổng hợp</b> để chơi cả 5 dạng) và cấp độ. Mỗi lượt có ${QUESTIONS_PER_ROUND} câu hỏi.</li>
              <li><b>Sắp xếp chữ cái</b>, <b>Điền chữ cái</b>, <b>Điền từ</b>, <b>Sắp xếp từ</b>: bấm vào chữ/từ (hoặc gõ phím) để điền vào ô theo thứ tự; bấm vào ô đã điền để trả lại. Dạng Điền chữ cái có thêm chữ gây nhiễu.</li>
              <li><b>Chính tả</b>: chọn cách viết đúng trong hai cách — chỉ được chọn một lần!</li>
              <li>Dùng <b>Gợi ý</b> để mở một chữ đúng (${HINTS_PER_ROUND} lượt mỗi ván, mỗi lần trừ 25% điểm câu đó).</li>
              <li>Trả lời nhanh trong ⅓ thời gian đầu để nhận <b>thưởng tốc độ</b>.</li>
            </ol>
            <div class="lvls">${LEVEL_ORDER.map((k) => `<span class="lv-badge ${k}">${LEVELS[k].name} · +${LEVELS[k].points} · ${fmtTime(LEVELS[k].time)}</span>`).join("")}</div>
          </div>
        </div>
      </div>
    </section>`);
}

// ================= Khởi động =================
buildScene();
updateUserChip();
updateSoundButtons();
router();
