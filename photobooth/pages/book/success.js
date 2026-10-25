const { listLocal } = require("../../utils/booking");
const { buildShare } = require("../../utils/share");

Page({
  data: {
    booking: {},
    remindText: "",
    viaText: "",
  },

  onLoad(query) {
    const list = listLocal();
    const booking = list.find((b) => b.id === query.id) || list[0] || {};
    const wantRemind = query.remind === "1";
    const ok = query.ok === "1";
    let remindText = "未开启";
    if (wantRemind && ok) remindText = "已授权，开拍前微信提醒";
    else if (wantRemind && !ok) remindText = "待配置模板/未授权（流程已记下）";

    this.setData({
      booking,
      remindText,
      viaText: query.via === "cloud" ? "云开发" : "本机（演示）",
    });
  },

  onHome() {
    wx.reLaunch({ url: "/pages/index/index" });
  },

  onList() {
    wx.redirectTo({ url: "/pages/book/list" });
  },

  onShareAppMessage() {
    const b = this.data.booking;
    return buildShare({
      title: b.date
        ? `我预约了 ${b.date} ${b.time} 的一刻拍摄，一起？`
        : "一刻 Photobooth · 预约一起拍",
    });
  },
});
