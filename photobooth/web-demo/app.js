const LAYOUTS = [
  {
    id: "strip4",
    name: "经典四格",
    desc: "竖条大头贴",
    slots: 4,
    canvas: { w: 600, h: 1800 },
    positions: [
      { x: 48, y: 48, w: 504, h: 378 },
      { x: 48, y: 450, w: 504, h: 378 },
      { x: 48, y: 852, w: 504, h: 378 },
      { x: 48, y: 1254, w: 504, h: 378 },
    ],
    footerY: 1680,
  },
  {
    id: "strip3",
    name: "三连拍",
    desc: "竖条三格",
    slots: 3,
    canvas: { w: 600, h: 1400 },
    positions: [
      { x: 48, y: 48, w: 504, h: 378 },
      { x: 48, y: 450, w: 504, h: 378 },
      { x: 48, y: 852, w: 504, h: 378 },
    ],
    footerY: 1280,
  },
  {
    id: "grid4",
    name: "四宫格",
    desc: "2×2 方形",
    slots: 4,
    canvas: { w: 1000, h: 1100 },
    positions: [
      { x: 40, y: 40, w: 440, h: 440 },
      { x: 520, y: 40, w: 440, h: 440 },
      { x: 40, y: 520, w: 440, h: 440 },
      { x: 520, y: 520, w: 440, h: 440 },
    ],
    footerY: 1000,
  },
  {
    id: "pair2",
    name: "双人并排",
    desc: "横版双图",
    slots: 2,
    canvas: { w: 1200, h: 700 },
    positions: [
      { x: 40, y: 40, w: 540, h: 540 },
      { x: 620, y: 40, w: 540, h: 540 },
    ],
    footerY: 620,
  },
];

const FILTERS = [
  { id: "none", name: "原片", css: "none" },
  { id: "mono", name: "黑白", css: "grayscale(1) contrast(1.05)" },
  { id: "warm", name: "暖阳", css: "sepia(0.25) saturate(1.15) brightness(1.05)" },
  { id: "cool", name: "冷调", css: "saturate(0.85) hue-rotate(15deg) brightness(1.02)" },
  { id: "film", name: "胶片", css: "contrast(1.1) saturate(0.9) brightness(1.02)" },
  { id: "soft", name: "柔光", css: "brightness(1.08) contrast(0.92) saturate(1.05)" },
];

const FRAMES = [
  { id: "cream", color: "#FFF8F0", name: "奶油" },
  { id: "white", color: "#FFFFFF", name: "纯白" },
  { id: "black", color: "#1A1A1A", name: "墨黑" },
  { id: "blush", color: "#FADADD", name: "腮红" },
  { id: "mint", color: "#D8F3DC", name: "薄荷绿" },
  { id: "sky", color: "#D6EAF8", name: "天空" },
];

const SLOTS = ["10:00", "11:00", "14:00", "15:00", "16:00", "19:00", "20:00"];
const BOOK_KEY = "yike_bookings_web";

const state = {
  layoutId: "strip4",
  filterId: "none",
  frameColor: "#FFF8F0",
  shots: [],
  selected: [],
  stream: null,
  resultUrl: "",
  bookTime: "14:00",
  people: 2,
  remind: true,
  inviteCode: "",
  fromInvite: "",
  lastBooking: null,
};

const $ = (id) => document.getElementById(id);

function show(screen) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.add("hidden"));
  $(`screen-${screen}`).classList.remove("hidden");
}

function getLayout() {
  return LAYOUTS.find((l) => l.id === state.layoutId) || LAYOUTS[0];
}

function getFilter() {
  return FILTERS.find((f) => f.id === state.filterId) || FILTERS[0];
}

function renderLayouts() {
  const grid = $("layout-grid");
  grid.innerHTML = LAYOUTS.map(
    (l) => `
    <button type="button" class="layout-card ${state.layoutId === l.id ? "active" : ""}" data-id="${l.id}">
      <div class="layout-preview ${l.id}">${"<i></i>".repeat(l.slots)}</div>
      <strong>${l.name}</strong>
      <span>${l.desc} · ${l.slots} 张</span>
    </button>`
  ).join("");
  grid.querySelectorAll(".layout-card").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.layoutId = btn.dataset.id;
      renderLayouts();
    });
  });
}

function renderFilters(containerId) {
  const row = $(containerId);
  row.innerHTML = FILTERS.map(
    (f) =>
      `<button type="button" class="chip ${state.filterId === f.id ? "active" : ""}" data-id="${f.id}">${f.name}</button>`
  ).join("");
  row.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.filterId = btn.dataset.id;
      renderFilters("filter-row");
      renderFilters("filter-row-2");
      applyLiveFilter();
      renderPreview();
    });
  });
}

function applyLiveFilter() {
  const video = $("video");
  video.style.filter = getFilter().css === "none" ? "" : getFilter().css;
}

async function startCamera() {
  const hint = $("cam-hint");
  try {
    if (state.stream) {
      state.stream.getTracks().forEach((t) => t.stop());
    }
    state.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false,
    });
    $("video").srcObject = state.stream;
    hint.textContent = "";
    applyLiveFilter();
  } catch (err) {
    hint.textContent = "无法打开摄像头，将使用演示占位图完成流程。";
    console.warn(err);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runCountdown(sec) {
  const el = $("countdown");
  el.classList.remove("hidden");
  for (let n = sec; n >= 1; n--) {
    el.textContent = String(n);
    await sleep(1000);
  }
  el.classList.add("hidden");
}

function makePlaceholder(label) {
  const c = document.createElement("canvas");
  c.width = 720;
  c.height = 960;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 720, 960);
  g.addColorStop(0, "#d9cfc4");
  g.addColorStop(1, "#8f8276");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 720, 960);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(360, 380, 140, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.font = "600 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, 360, 620);
  return c.toDataURL("image/jpeg", 0.9);
}

function takeShot(index) {
  const video = $("video");
  const canvas = $("capture-canvas");
  if (state.stream && video.videoWidth) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.filter = getFilter().css === "none" ? "none" : getFilter().css;
    ctx.drawImage(video, 0, 0);
    ctx.restore();
    return canvas.toDataURL("image/jpeg", 0.92);
  }
  return makePlaceholder(`DEMO ${index + 1}`);
}

function renderThumbs() {
  const layout = getLayout();
  const wrap = $("thumbs");
  const parts = state.shots.map((src) => `<img src="${src}" alt="" />`);
  while (parts.length < layout.slots) parts.push('<div class="empty"></div>');
  wrap.innerHTML = parts.join("");
}

async function startBurst() {
  const btn = $("btn-shutter");
  btn.disabled = true;
  const layout = getLayout();
  state.shots = [];
  renderThumbs();
  for (let i = 0; i < layout.slots; i++) {
    $("shot-step").textContent = `第 ${i + 1} / ${layout.slots} 张`;
    $("shot-tip").textContent = `准备拍第 ${i + 1} 张`;
    await runCountdown(3);
    const flash = $("flash");
    flash.classList.remove("hidden");
    const shot = takeShot(i);
    state.shots.push(shot);
    renderThumbs();
    await sleep(220);
    flash.classList.add("hidden");
    if (i < layout.slots - 1) await sleep(400);
  }
  state.selected = state.shots.slice();
  btn.disabled = false;
  $("shot-tip").textContent = "拍摄完成";
  renderSelect();
  show("select");
}

function renderSelect() {
  const layout = getLayout();
  const grid = $("shot-grid");
  grid.innerHTML = state.shots
    .map((src, i) => {
      const order = state.selected.indexOf(src);
      return `<div class="shot ${order >= 0 ? "on" : ""}" data-i="${i}">
        <img src="${src}" alt="" />
        ${order >= 0 ? `<div class="badge">${order + 1}</div>` : ""}
      </div>`;
    })
    .join("");
  $("select-sub").textContent = `已选 ${state.selected.length} / ${layout.slots}`;
  $("btn-to-decorate").disabled = state.selected.length !== layout.slots;
  grid.querySelectorAll(".shot").forEach((el) => {
    el.addEventListener("click", () => {
      const src = state.shots[Number(el.dataset.i)];
      const idx = state.selected.indexOf(src);
      if (idx >= 0) state.selected.splice(idx, 1);
      else if (state.selected.length < layout.slots) state.selected.push(src);
      renderSelect();
    });
  });
}

function renderColors() {
  const wrap = $("colors");
  wrap.innerHTML = FRAMES.map(
    (f) =>
      `<button type="button" class="color ${state.frameColor === f.color ? "active" : ""}" style="background:${f.color}" data-color="${f.color}" title="${f.name}"></button>`
  ).join("");
  wrap.querySelectorAll(".color").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.frameColor = btn.dataset.color;
      renderColors();
      renderPreview();
    });
  });
}

function renderPreview() {
  const layout = getLayout();
  const box = $("preview-box");
  box.className = `preview-box ${layout.id}`;
  box.style.background = state.frameColor;
  const dark = state.frameColor === "#1A1A1A";
  box.innerHTML =
    state.selected.map((src) => `<img src="${src}" style="filter:${getFilter().css}" alt="" />`).join("") +
    `<div class="preview-brand" style="color:${dark ? "rgba(255,255,255,.7)" : "rgba(0,0,0,.5)"}">一刻 · Photobooth</div>`;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function compose() {
  const layout = getLayout();
  const canvas = $("strip-canvas");
  canvas.width = layout.canvas.w;
  canvas.height = layout.canvas.h;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = state.frameColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < layout.positions.length; i++) {
    const pos = layout.positions[i];
    const src = state.selected[i];
    if (!src) continue;
    const img = await loadImage(src);
    const ir = img.width / img.height;
    const pr = pos.w / pos.h;
    let sx = 0;
    let sy = 0;
    let sw = img.width;
    let sh = img.height;
    if (ir > pr) {
      sw = img.height * pr;
      sx = (img.width - sw) / 2;
    } else {
      sh = img.width / pr;
      sy = (img.height - sh) / 2;
    }
    ctx.save();
    ctx.filter = getFilter().css === "none" ? "none" : getFilter().css;
    ctx.drawImage(img, sx, sy, sw, sh, pos.x, pos.y, pos.w, pos.h);
    ctx.restore();
  }

  const dark = state.frameColor === "#1A1A1A";
  ctx.fillStyle = dark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.55)";
  ctx.font = "600 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("一刻 · Photobooth", canvas.width / 2, layout.footerY);
  const now = new Date();
  const stamp = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
  ctx.font = "20px sans-serif";
  ctx.fillText(stamp, canvas.width / 2, layout.footerY + 36);

  state.resultUrl = canvas.toDataURL("image/jpeg", 0.92);
  $("result-img").src = state.resultUrl;
  $("btn-download").href = state.resultUrl;
  show("result");
}

function resetAll() {
  state.shots = [];
  state.selected = [];
  state.resultUrl = "";
  state.layoutId = "strip4";
  state.filterId = "none";
  state.frameColor = "#FFF8F0";
  showHome();
}

function getInviteCode() {
  let code = localStorage.getItem("yike_invite_code");
  if (!code) {
    code = `YK${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    localStorage.setItem("yike_invite_code", code);
  }
  state.inviteCode = code;
  return code;
}

function readInviteFromUrl() {
  const params = new URLSearchParams(location.search);
  const code = params.get("code") || params.get("invite") || "";
  if (code) {
    state.fromInvite = code;
    localStorage.setItem("yike_from_invite", code);
    const map = JSON.parse(localStorage.getItem("yike_invite_opens") || "{}");
    map[code] = (map[code] || 0) + 1;
    localStorage.setItem("yike_invite_opens", JSON.stringify(map));
  } else {
    state.fromInvite = localStorage.getItem("yike_from_invite") || "";
  }
}

function showHome() {
  const banner = $("invite-banner");
  if (state.fromInvite) {
    banner.textContent = `好友邀请码 ${state.fromInvite} · 欢迎来拍`;
    banner.classList.remove("hidden");
  } else {
    banner.classList.add("hidden");
  }
  show("home");
}

function listBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOK_KEY) || "[]");
  } catch (e) {
    return [];
  }
}

function saveBooking(booking) {
  const list = listBookings();
  list.unshift(booking);
  localStorage.setItem(BOOK_KEY, JSON.stringify(list));
}

function todayInputValue() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function openBook() {
  $("book-date").value = todayInputValue();
  $("book-date").min = todayInputValue();
  $("people-num").textContent = String(state.people);
  const row = $("book-slots");
  row.innerHTML = SLOTS.map(
    (t) =>
      `<button type="button" class="chip ${state.bookTime === t ? "active" : ""}" data-time="${t}">${t}</button>`
  ).join("");
  row.querySelectorAll(".chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.bookTime = btn.dataset.time;
      openBook();
    });
  });
  $("remind-switch").classList.toggle("on", state.remind);
  show("book");
}

async function submitBook() {
  const name = $("book-name").value.trim();
  const date = $("book-date").value;
  const note = $("book-note").value.trim();
  if (!name) {
    alert("请填写昵称");
    return;
  }
  if (!date || !state.bookTime) {
    alert("请选择档期");
    return;
  }

  let remindOk = false;
  if (state.remind && "Notification" in window) {
    const perm = await Notification.requestPermission();
    remindOk = perm === "granted";
    if (remindOk) {
      // 演示：约 3 秒后弹一次提醒（真机小程序用订阅消息 + 云函数定时）
      setTimeout(() => {
        new Notification("一刻 Photobooth 预约提醒", {
          body: `${date} ${state.bookTime} 档期快到了，记得来拍哦`,
        });
      }, 3000);
    }
  }

  const booking = {
    id: `b_${Date.now()}`,
    name,
    date,
    time: state.bookTime,
    people: state.people,
    note,
    remind: state.remind,
    remindAccepted: remindOk,
    inviteCode: state.fromInvite || "",
    createdAt: new Date().toISOString(),
  };
  saveBooking(booking);
  state.lastBooking = booking;
  $("book-success-sub").textContent = `${date} ${state.bookTime} · ${state.people} 人`;
  $("book-success-card").innerHTML = `
    <div class="row"><span>昵称</span><strong>${name}</strong></div>
    <div class="row"><span>提醒</span><strong>${
      state.remind ? (remindOk ? "已授权（演示通知）" : "未授权/不支持") : "未开启"
    }</strong></div>
    <div class="row"><span>来源</span><strong>${booking.inviteCode || "自然访问"}</strong></div>
  `;
  show("book-success");
}

function renderBookList() {
  const list = listBookings();
  const wrap = $("book-list");
  if (!list.length) {
    wrap.innerHTML = `<p class="sub">还没有预约</p>`;
  } else {
    wrap.innerHTML = list
      .map(
        (b) => `<div class="book-item">
        <div class="book-item-top"><strong>${b.date} ${b.time}</strong><span>${
          b.remind && b.remindAccepted ? "已提醒" : b.remind ? "待提醒" : "无提醒"
        }</span></div>
        <div class="sub">${b.name} · ${b.people} 人</div>
      </div>`
      )
      .join("");
  }
  show("book-list");
}

function openPromo() {
  const code = getInviteCode();
  $("promo-code").textContent = code;
  show("promo");
}

function promoLink() {
  const code = getInviteCode();
  const url = new URL(location.href);
  url.searchParams.set("code", code);
  url.searchParams.set("from", "share");
  url.hash = "";
  return url.toString();
}

function bind() {
  $("btn-start").addEventListener("click", () => {
    renderLayouts();
    renderFilters("filter-row");
    show("layout");
  });
  $("btn-to-shoot").addEventListener("click", async () => {
    $("shot-step").textContent = `第 1 / ${getLayout().slots} 张`;
    show("shoot");
    await startCamera();
    renderThumbs();
  });
  $("btn-shutter").addEventListener("click", startBurst);
  $("btn-to-decorate").addEventListener("click", () => {
    renderFilters("filter-row-2");
    renderColors();
    renderPreview();
    show("decorate");
  });
  $("btn-reshoot").addEventListener("click", async () => {
    state.shots = [];
    state.selected = [];
    show("shoot");
    await startCamera();
    renderThumbs();
  });
  $("btn-compose").addEventListener("click", compose);
  $("btn-again").addEventListener("click", resetAll);

  $("btn-book-home").addEventListener("click", openBook);
  $("btn-promo-home").addEventListener("click", openPromo);
  $("btn-my-bookings").addEventListener("click", renderBookList);
  $("btn-book-back").addEventListener("click", showHome);
  $("btn-book-submit").addEventListener("click", submitBook);
  $("btn-book-home2").addEventListener("click", showHome);
  $("btn-book-list2").addEventListener("click", renderBookList);
  $("btn-book-again").addEventListener("click", openBook);
  $("btn-list-home").addEventListener("click", showHome);
  $("btn-promo-book").addEventListener("click", openBook);
  $("btn-promo-back").addEventListener("click", showHome);
  $("btn-result-promo").addEventListener("click", openPromo);

  $("people-inc").addEventListener("click", () => {
    state.people = Math.min(12, state.people + 1);
    $("people-num").textContent = String(state.people);
  });
  $("people-dec").addEventListener("click", () => {
    state.people = Math.max(1, state.people - 1);
    $("people-num").textContent = String(state.people);
  });
  $("remind-toggle").addEventListener("click", () => {
    state.remind = !state.remind;
    $("remind-switch").classList.toggle("on", state.remind);
  });

  $("btn-copy-code").addEventListener("click", async () => {
    await navigator.clipboard.writeText(getInviteCode());
    alert("已复制邀请码");
  });
  $("btn-copy-link").addEventListener("click", async () => {
    await navigator.clipboard.writeText(promoLink());
    alert("已复制推广链接");
  });
  $("btn-share-booking").addEventListener("click", async () => {
    const b = state.lastBooking;
    const text = b
      ? `我预约了 ${b.date} ${b.time} 的一刻拍摄，一起？ ${promoLink()}`
      : promoLink();
    await navigator.clipboard.writeText(text);
    alert("分享文案已复制");
  });
}

readInviteFromUrl();
getInviteCode();
bind();
showHome();
