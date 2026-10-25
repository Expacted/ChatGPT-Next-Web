const CITIES = ["内江", "泸州", "自贡", "成都", "其他"];
const TYPES = ["商场活动", "生日宴", "婚礼活动", "订婚宴", "升学宴", "毕业季", "其他"];
const DURS = [
  { h: 2, tip: "人气推荐" },
  { h: 3, tip: "标准场次" },
  { h: 4, tip: "大型活动推荐" },
];
const BOOK_KEY = "yike_bookings_web_v2";

const state = {
  tab: "home",
  screen: "home",
  activityType: "婚礼活动",
  duration: 2,
  date: "",
  city: "",
  name: "",
  phone: "",
  note: "",
  remind: true,
  lastBooking: null,
};

const $ = (id) => document.getElementById(id);

function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function listBookings() {
  try {
    return JSON.parse(localStorage.getItem(BOOK_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveBooking(b) {
  const list = listBookings();
  list.unshift(b);
  localStorage.setItem(BOOK_KEY, JSON.stringify(list));
}

function setTab(tab) {
  state.tab = tab;
  document.querySelectorAll(".tab").forEach((el) => {
    el.classList.toggle("active", el.dataset.tab === tab);
  });
  if (tab === "home") renderHome();
  if (tab === "book") renderBook();
  if (tab === "feed") renderFeed();
  if (tab === "mine") renderMine();
}

function mount(html) {
  $("screens").innerHTML = html;
}

function renderHome() {
  state.screen = "home";
  mount(`
    <section>
      <div class="hero">
        <h1>让快乐，有迹可循</h1>
        <div class="tags"><span>婚礼</span><span>生日</span><span>派对</span><span>活动</span><span>品牌活动</span></div>
      </div>
      <div class="card brand-card">
        <div class="brand-row">
          <div class="logo">一刻</div>
          <div>
            <div class="brand-name">一刻 · PHOTO BOOTH</div>
            <div class="brand-area">服务城市 内江 | 泸州 | 自贡</div>
          </div>
        </div>
        <div class="contact"><span>☎ 19900000000</span><span>微信 · 小红书 · 抖音</span></div>
      </div>
      <div class="quick">
        <button data-go="about"><div class="qicon c1">介</div>品牌介绍</button>
        <button data-go="book"><div class="qicon c2">约</div>活动预约</button>
        <button data-go="shoot"><div class="qicon c3">拍</div>现场体验</button>
        <button data-go="feed"><div class="qicon c4">评</div>店铺动态</button>
      </div>
      <div class="card" style="padding:0;overflow:hidden" data-go="about">
        <div class="content-cover cover-a">中高端定制 · 全案用心</div>
        <div class="content-body"><strong>选择一刻 · PHOTO BOOTH 您将会得到</strong><span>查看详情 ></span></div>
      </div>
      <div class="card" style="padding:0;overflow:hidden" data-go="price">
        <div class="content-cover cover-b">PHOTO BOOTH 租赁套餐</div>
        <div class="content-body"><strong>价目服务表（必看）</strong><span>查看详情 ></span></div>
      </div>
    </section>
  `);
  bindNav();
}

function renderBook() {
  state.screen = "book";
  if (!state.date) state.date = "";
  mount(`
    <section>
      <div class="brand-line">一刻 · PHOTO BOOTH</div>
      <div class="head-title">告诉我们，你想记录哪一天</div>
      <div class="head-sub">填写活动信息后生成需求单，方便确认档期、模板与现场安排。</div>
      <div class="card">
        <div class="label"><span class="req">*</span>活动类型</div>
        <div class="chips" id="types"></div>
      </div>
      <div class="card">
        <div class="label"><span class="req">*</span>意向时长</div>
        <div class="durations" id="durs"></div>
      </div>
      <div class="card">
        <div class="label"><span class="req">*</span>活动日期</div>
        <input class="field" id="date" type="date" min="${today()}" value="${state.date}" />
        <div class="label" style="margin-top:12px"><span class="req">*</span>活动城市</div>
        <select class="field" id="city">
          <option value="">请选择活动城市</option>
          ${CITIES.map((c) => `<option ${state.city === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </div>
      <div class="card">
        <div class="label">联系人</div>
        <input class="field" id="name" placeholder="怎么称呼你" value="${state.name}" />
        <div class="label">手机号</div>
        <input class="field" id="phone" placeholder="方便确认档期" value="${state.phone}" />
        <div class="label">备注</div>
        <input class="field" id="note" placeholder="人数 / 场地 / 模板" value="${state.note}" />
      </div>
      <div class="card remind" id="remind">
        <div><strong>微信提醒</strong><div class="head-sub" style="margin:4px 0 0">演示：浏览器通知</div></div>
        <div class="switch ${state.remind ? "on" : ""}" id="sw"><div class="knob"></div></div>
      </div>
      <button class="cta" id="submit">提交需求单</button>
    </section>
  `);
  const types = document.getElementById("types");
  types.innerHTML = TYPES.map(
    (t) => `<button class="chip ${state.activityType === t ? "active" : ""}" data-t="${t}">${t}</button>`
  ).join("");
  types.querySelectorAll(".chip").forEach((b) =>
    b.addEventListener("click", () => {
      state.activityType = b.dataset.t;
      renderBook();
    })
  );
  const durs = document.getElementById("durs");
  durs.innerHTML = DURS.map(
    (d) => `<button class="duration ${state.duration === d.h ? "active" : ""}" data-h="${d.h}"><strong>${d.h}小时</strong><span>${d.tip}</span></button>`
  ).join("");
  durs.querySelectorAll(".duration").forEach((b) =>
    b.addEventListener("click", () => {
      state.duration = Number(b.dataset.h);
      renderBook();
    })
  );
  document.getElementById("remind").onclick = () => {
    state.remind = !state.remind;
    renderBook();
  };
  document.getElementById("submit").onclick = submitBook;
}

async function submitBook() {
  state.date = document.getElementById("date").value;
  state.city = document.getElementById("city").value;
  state.name = document.getElementById("name").value.trim();
  state.phone = document.getElementById("phone").value.trim();
  state.note = document.getElementById("note").value.trim();
  if (!state.date || !state.city || !state.name) {
    alert("请完整填写必填项");
    return;
  }
  let remindOk = false;
  if (state.remind && "Notification" in window) {
    remindOk = (await Notification.requestPermission()) === "granted";
    if (remindOk) {
      setTimeout(() => {
        new Notification("一刻 PHOTO BOOTH 预约提醒", {
          body: `${state.date} ${state.activityType} 档期快到了`,
        });
      }, 2500);
    }
  }
  const booking = {
    id: `b_${Date.now()}`,
    ...state,
    packageLabel: `${state.duration}小时`,
    remindAccepted: remindOk,
    createdAt: new Date().toISOString(),
  };
  saveBooking(booking);
  state.lastBooking = booking;
  renderBookSuccess();
}

function renderBookSuccess() {
  state.screen = "book-success";
  const b = state.lastBooking;
  mount(`
    <section>
      <div class="ok">✓</div>
      <div class="head-title">需求单已提交</div>
      <div class="head-sub">我们会尽快确认档期</div>
      <div class="card">
        <div class="row"><span>活动类型</span><strong>${b.activityType}</strong></div>
        <div class="row"><span>意向时长</span><strong>${b.packageLabel}</strong></div>
        <div class="row"><span>活动日期</span><strong>${b.date}</strong></div>
        <div class="row"><span>活动城市</span><strong>${b.city}</strong></div>
        <div class="row"><span>联系人</span><strong>${b.name}</strong></div>
        <div class="row"><span>提醒</span><strong>${b.remind ? (b.remindAccepted ? "已授权" : "未授权") : "未开启"}</strong></div>
      </div>
      <button class="cta" data-go="orders">查看我的订单</button>
      <button class="cta ghost" data-go="home">回首页</button>
    </section>
  `);
  bindNav();
}

function renderFeed() {
  state.screen = "feed";
  mount(`
    <section>
      <div class="card">
        <div class="post-head"><div class="avatar">一刻</div><div><strong>一刻 · PHOTO BOOTH</strong><div class="head-sub" style="margin:0">2026-10-14 12:58</div></div></div>
        <div class="post-text">一刻日记分享 · 婚礼现场即拍即印。</div>
        <div class="grid g2"><div class="cell"></div><div class="cell"></div></div>
      </div>
      <div class="card">
        <div class="post-head"><div class="avatar">一刻</div><div><strong>一刻 · PHOTO BOOTH</strong><div class="head-sub" style="margin:0">2026-10-08 18:20</div></div></div>
        <div class="post-text">生日宴布置花絮：道具、模板、留言簿。</div>
        <div class="grid g9">${"<div class='cell'></div>".repeat(9)}</div>
      </div>
    </section>
  `);
}

function renderMine() {
  state.screen = "mine";
  mount(`
    <section>
      <div class="card profile">
        <div class="avatar" style="width:54px;height:54px;font-size:22px">☺</div>
        <div><strong style="font-size:18px">微信用户</strong><div class="role">顾客</div></div>
      </div>
      <div class="card menu">
        <button data-go="orders"><span>我的订单</span><span>›</span></button>
        <button data-go="price"><span>价目服务表</span><span>›</span></button>
        <button data-go="about"><span>品牌介绍</span><span>›</span></button>
      </div>
    </section>
  `);
  bindNav();
}

function renderOrders() {
  state.screen = "orders";
  const list = listBookings();
  mount(`
    <section>
      <div class="head-title">我的订单</div>
      ${
        list.length
          ? list
              .map(
                (b) => `<div class="card order-item">
            <div style="display:flex;justify-content:space-between;align-items:center">
              <strong>${b.date}</strong><span class="tag">${b.remind && b.remindAccepted ? "已提醒" : "需求单"}</span>
            </div>
            <div class="head-sub">${b.activityType} · ${b.packageLabel} · ${b.city}<br/>${b.name}</div>
          </div>`
              )
              .join("")
          : `<div class="head-sub">还没有需求单</div>`
      }
      <button class="cta" data-go="book">去预约</button>
    </section>
  `);
  bindNav();
}

function renderPrice() {
  state.screen = "price";
  mount(`
    <section>
      <div class="card" style="text-align:center">
        <div class="logo" style="margin:0 auto 8px">一刻</div>
        <strong style="font-size:22px">一刻</strong>
        <div class="brand-area">photo booth</div>
      </div>
      <div class="card">
        <strong>PHOTO BOOTH 租赁套餐</strong>
        <div class="early" style="margin-top:10px">提前1个月预约可享早鸟价，直减 ¥200</div>
        <div class="pkg"><span>1 小时</span><div><span class="now">¥1080</span><span class="old">¥1280</span></div><span>早鸟价</span></div>
        <div class="pkg"><span>2 小时</span><div><span class="now">¥1680</span><span class="old">¥1880</span></div><span>早鸟价</span></div>
        <div class="pkg"><span>3 小时</span><div><span class="now">¥2180</span><span class="old">¥2380</span></div><span>早鸟价</span></div>
        <div class="pkg"><span>活动主题定制</span><div>价格面议</div><span></span></div>
      </div>
      <button class="cta" data-go="book">去预约档期</button>
      <button class="cta ghost" data-go="home">回首页</button>
    </section>
  `);
  bindNav();
}

function renderAbout() {
  state.screen = "about";
  mount(`
    <section>
      <div class="hero"><h1>选择一刻 · PHOTO BOOTH<br/>您将会得到</h1></div>
      <div class="card">
        <div class="tag" style="display:inline-block;background:rgba(168,139,214,.14);color:#7a5fb0;border-radius:999px;padding:2px 8px;font-size:11px">中高端定制</div>
        <div class="head-title" style="font-size:16px;margin-top:8px">让快乐，有迹可循</div>
        <div class="head-sub">不做流水线敷衍，全案用心定制。热升华即拍即印。</div>
      </div>
      <button class="cta" data-go="book">去活动预约</button>
      <button class="cta ghost" data-go="price">查看价目表</button>
    </section>
  `);
  bindNav();
}

function bindNav() {
  document.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", () => {
      const go = el.getAttribute("data-go");
      if (go === "home") setTab("home");
      else if (go === "book") setTab("book");
      else if (go === "feed") setTab("feed");
      else if (go === "orders") renderOrders();
      else if (go === "price") renderPrice();
      else if (go === "about") renderAbout();
      else if (go === "shoot") alert("现场体验请在微信小程序中打开相机连拍流程");
    });
  });
}

document.querySelectorAll(".tab").forEach((btn) => {
  btn.addEventListener("click", () => setTab(btn.dataset.tab));
});

setTab("home");
