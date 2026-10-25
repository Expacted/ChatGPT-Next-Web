const {
  createBooking,
  requestRemindAuth,
  config,
} = require("../../utils/booking");
const { getFromInvite, buildShare } = require("../../utils/share");

function todayStr() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

Page({
  data: {
    name: "",
    phone: "",
    date: "",
    minDate: "",
    time: "",
    people: 2,
    note: "",
    remind: true,
    slots: config.defaultSlots,
    leadMinutes: config.bookingLeadMinutes || 60,
    submitting: false,
  },

  onLoad() {
    const date = todayStr();
    this.setData({
      date,
      minDate: date,
      time: config.defaultSlots[2] || "14:00",
    });
  },

  onName(e) {
    this.setData({ name: e.detail.value.trim() });
  },
  onPhone(e) {
    this.setData({ phone: e.detail.value.trim() });
  },
  onNote(e) {
    this.setData({ note: e.detail.value.trim() });
  },
  onDate(e) {
    this.setData({ date: e.detail.value });
  },
  onTime(e) {
    this.setData({ time: e.currentTarget.dataset.time });
  },
  incPeople() {
    this.setData({ people: Math.min(12, this.data.people + 1) });
  },
  decPeople() {
    this.setData({ people: Math.max(1, this.data.people - 1) });
  },
  toggleRemind() {
    this.setData({ remind: !this.data.remind });
  },

  async onSubmit() {
    if (this.data.submitting) return;
    const { name, date, time, phone, people, note, remind } = this.data;
    if (!name) {
      wx.showToast({ title: "请填写昵称", icon: "none" });
      return;
    }
    if (!date || !time) {
      wx.showToast({ title: "请选择档期", icon: "none" });
      return;
    }

    this.setData({ submitting: true });
    let remindAccepted = false;
    if (remind) {
      const auth = await requestRemindAuth();
      remindAccepted = !!auth.accepted;
      if (auth.reason === "no_tmpl") {
        // 未配置模板 ID：先跑通，本地标记为「待开通」
        remindAccepted = false;
      } else if (!remindAccepted) {
        wx.showToast({ title: "未开通提醒，仍可预约", icon: "none" });
      }
    }

    try {
      const res = await createBooking({
        name,
        phone,
        date,
        time,
        people,
        note,
        remind,
        remindAccepted,
        inviteCode: getFromInvite() || getApp().globalData.inviteCode || "",
      });
      const id = res.booking.id;
      wx.redirectTo({
        url: `/pages/book/success?id=${id}&via=${res.via}&remind=${remind ? 1 : 0}&ok=${remindAccepted ? 1 : 0}`,
      });
    } catch (e) {
      console.error(e);
      wx.showToast({ title: "预约失败，请重试", icon: "none" });
      this.setData({ submitting: false });
    }
  },

  onShareAppMessage() {
    return buildShare({ title: "一刻 Photobooth · 预约一起拍" });
  },
});
