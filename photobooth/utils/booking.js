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

function parseRemindAt(dateStr, timeStr) {
  const [y, m, d] = (dateStr || "").split("-").map(Number);
  if (!y || !m || !d) return new Date();
  // 活动预约按「当天上午 10:00」提醒；若 time 是 HH:mm 则用具体时段
  let hh = 10;
  let mm = 0;
  if (timeStr && /^\d{1,2}:\d{2}$/.test(timeStr)) {
    const parts = timeStr.split(":").map(Number);
    hh = parts[0];
    mm = parts[1];
  }
  const start = new Date(y, m - 1, d, hh, mm, 0, 0);
  const lead = (config.bookingLeadMinutes || 60) * 60 * 1000;
  return new Date(start.getTime() - lead);
}

function requestRemindAuth() {
  const tmplId = config.bookingRemindTmplId;
  if (!tmplId) {
    return Promise.resolve({ accepted: false, reason: "no_tmpl" });
  }
  return new Promise((resolve) => {
    wx.requestSubscribeMessage({
      tmplIds: [tmplId],
      success: (res) => resolve({ accepted: res[tmplId] === "accept", raw: res }),
      fail: (err) => resolve({ accepted: false, reason: "fail", err }),
    });
  });
}

async function createBooking(payload) {
  const booking = {
    id: uid(),
    name: payload.name || "",
    phone: payload.phone || "",
    date: payload.date,
    time: payload.time || "",
    people: payload.people || 1,
    note: payload.note || "",
    activityType: payload.activityType || "",
    duration: payload.duration || 0,
    city: payload.city || "",
    packageLabel: payload.packageLabel || "",
    inviteCode: payload.inviteCode || "",
    remind: !!payload.remind,
    remindAccepted: !!payload.remindAccepted,
    remindAt: parseRemindAt(payload.date, payload.time).toISOString(),
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
  parseRemindAt,
  config,
};
