const { listLocal } = require("../../utils/booking");
const { buildShare } = require("../../utils/share");

Page({
  data: {
    booking: {},
    remindText: "",
  },

  onLoad(query) {
    const list = listLocal();
    const booking = list.find((b) => b.id === query.id) || list[0] || {};
    const wantRemind = query.remind === "1";
    const ok = query.ok === "1";
    let remindText = "未开启";
    if (wantRemind && ok) remindText = "已授权，活动前微信提醒";
    else if (wantRemind && !ok) remindText = "待配置模板/未授权（已记下）";
    this.setData({ booking, remindText });
  },

  onHome() {
    wx.switchTab({ url: "/pages/home/home" });
  },

  onOrders() {
    wx.navigateTo({ url: "/pages/book/list" });
  },

  onShareAppMessage() {
    const b = this.data.booking;
    return buildShare({
      title: b.date
        ? `我预约了 ${b.date} 的一刻 PHOTO BOOTH，一起？`
        : "一刻 PHOTO BOOTH · 活动预约",
    });
  },
});
