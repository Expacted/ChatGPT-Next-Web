const { cloudAvailable, config } = require("./cloud");

const STORAGE_KEY = "yike_bookings";

function uid() {
  return `b_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function listLocal() {
  try {
    return wx.getStorageSync(STORAGE_KEY) || [];
  } catch (e) {
    return [];
  }
}

function saveLocal(list) {
  wx.setStorageSync(STORAGE_KEY, list);
}

function addLocal(booking) {
  const list = listLocal();
  list.unshift(booking);
  saveLocal(list);
  return booking;
}

function parseSlot(dateStr, timeStr) {
  // dateStr: YYYY-MM-DD, timeStr: HH:mm
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  return new Date(y, m - 1, d, hh, mm, 0, 0);
}

function remindAtFrom(dateStr, timeStr) {
  const start = parseSlot(dateStr, timeStr);
  const lead = (config.bookingLeadMinutes || 60) * 60 * 1000;
  return new Date(start.getTime() - lead);
}

/**
 * 请求订阅消息授权（用户点一次同意，才能发提醒）
 */
function requestRemindAuth() {
  const tmplId = config.bookingRemindTmplId;
  if (!tmplId) {
    return Promise.resolve({ accepted: false, reason: "no_tmpl" });
  }
  return new Promise((resolve) => {
    wx.requestSubscribeMessage({
      tmplIds: [tmplId],
      success: (res) => {
        const accepted = res[tmplId] === "accept";
        resolve({ accepted, raw: res });
      },
      fail: (err) => resolve({ accepted: false, reason: "fail", err }),
    });
  });
}

/**
 * 创建预约：优先云函数，失败则本地存储（先跑通）
 */
async function createBooking(payload) {
  const booking = {
    id: uid(),
    name: payload.name || "",
    phone: payload.phone || "",
    date: payload.date,
    time: payload.time,
    people: payload.people || 1,
    note: payload.note || "",
    inviteCode: payload.inviteCode || "",
    remind: !!payload.remind,
    remindAccepted: !!payload.remindAccepted,
    remindAt: remindAtFrom(payload.date, payload.time).toISOString(),
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  if (cloudAvailable()) {
    try {
      const res = await wx.cloud.callFunction({
        name: "createBooking",
        data: booking,
      });
      const remote = (res.result && res.result.booking) || booking;
      addLocal(remote);
      return { ok: true, booking: remote, via: "cloud" };
    } catch (e) {
      console.warn("createBooking cloud failed, fallback local", e);
    }
  }

  addLocal(booking);
  return { ok: true, booking, via: "local" };
}

module.exports = {
  listLocal,
  createBooking,
  requestRemindAuth,
  parseSlot,
  remindAtFrom,
  config,
};
