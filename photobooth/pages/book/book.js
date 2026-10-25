const config = require("../../utils/config");
const {
  createBooking,
  requestRemindAuth,
} = require("../../utils/booking");
const { getFromInvite, buildShare } = require("../../utils/share");

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

Page({
  data: {
    activityTypes: config.activityTypes,
    durations: config.durations,
    cities: config.cities,
    activityType: "婚礼活动",
    duration: 2,
    date: "",
    minDate: "",
    city: "",
    cityIndex: 0,
    name: "",
    phone: "",
    note: "",
    remind: true,
    leadMinutes: config.bookingLeadMinutes || 60,
    submitting: false,
  },

  onLoad() {
    const date = todayStr();
    this.setData({ minDate: date });
  },

  onType(e) {
    this.setData({ activityType: e.currentTarget.dataset.type });
  },
  onDuration(e) {
    this.setData({ duration: Number(e.currentTarget.dataset.hours) });
  },
  onDate(e) {
    this.setData({ date: e.detail.value });
  },
  onCity(e) {
    const cityIndex = Number(e.detail.value);
    this.setData({ cityIndex, city: config.cities[cityIndex] });
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
  toggleRemind() {
    this.setData({ remind: !this.data.remind });
  },

  async onSubmit() {
    if (this.data.submitting) return;
    const { activityType, duration, date, city, name, phone, note, remind } = this.data;
    if (!activityType) {
      wx.showToast({ title: "请选择活动类型", icon: "none" });
      return;
    }
    if (!duration) {
      wx.showToast({ title: "请选择意向时长", icon: "none" });
      return;
    }
    if (!date) {
      wx.showToast({ title: "请选择活动日期", icon: "none" });
      return;
    }
    if (!city) {
      wx.showToast({ title: "请选择活动城市", icon: "none" });
      return;
    }
    if (!name) {
      wx.showToast({ title: "请填写联系人", icon: "none" });
      return;
    }

    this.setData({ submitting: true });
    let remindAccepted = false;
    if (remind) {
      const auth = await requestRemindAuth();
      remindAccepted = !!auth.accepted;
      if (!remindAccepted && auth.reason !== "no_tmpl") {
        wx.showToast({ title: "未开通提醒，仍可提交", icon: "none" });
      }
    }

    try {
      const pack = config.durations.find((d) => d.hours === duration) || {};
      const res = await createBooking({
        name,
        phone,
        date,
        time: `${duration}小时`,
        people: 1,
        note,
        activityType,
        duration,
        city,
        packageLabel: pack.label || `${duration}小时`,
        remind,
        remindAccepted,
        inviteCode: getFromInvite() || getApp().globalData.inviteCode || "",
      });
      wx.navigateTo({
        url: `/pages/book/success?id=${res.booking.id}&via=${res.via}&remind=${remind ? 1 : 0}&ok=${remindAccepted ? 1 : 0}`,
      });
      this.setData({ submitting: false });
    } catch (e) {
      console.error(e);
      wx.showToast({ title: "提交失败，请重试", icon: "none" });
      this.setData({ submitting: false });
    }
  },

  onShareAppMessage() {
    return buildShare({ title: "一刻 PHOTO BOOTH · 预约活动档期" });
  },
});
