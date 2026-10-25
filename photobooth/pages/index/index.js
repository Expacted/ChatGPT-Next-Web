const { buildShare, getFromInvite } = require("../../utils/share");

Page({
  data: {
    fromInvite: "",
  },

  onShow() {
    const fromInvite = getFromInvite() || getApp().globalData.inviteCode || "";
    this.setData({ fromInvite });
  },

  onStart() {
    getApp().resetSession();
    wx.navigateTo({ url: "/pages/layout/layout" });
  },

  onBook() {
    wx.navigateTo({ url: "/pages/book/book" });
  },

  onPromo() {
    wx.navigateTo({ url: "/pages/promo/promo" });
  },

  onMyBookings() {
    wx.navigateTo({ url: "/pages/book/list" });
  },

  onShareAppMessage() {
    return buildShare({ title: "一刻 Photobooth · 一起来拍大头贴" });
  },

  onShareTimeline() {
    const share = buildShare();
    return {
      title: share.title,
      query: `from=timeline&code=${share.path.split("code=")[1] || ""}`,
    };
  },
});
