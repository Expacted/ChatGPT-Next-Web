const config = require("../../utils/config");
const { buildShare } = require("../../utils/share");

Page({
  data: {
    slogan: config.slogan,
    areas: config.serviceAreas,
    phone: config.phone,
    tags: ["婚礼", "生日", "派对", "活动", "品牌活动"],
  },

  onBook() {
    wx.switchTab({ url: "/pages/book/book" });
  },
  onFeed() {
    wx.switchTab({ url: "/pages/feed/feed" });
  },
  onAbout() {
    wx.navigateTo({ url: "/pages/about/about" });
  },
  onPrice() {
    wx.navigateTo({ url: "/pages/price/price" });
  },
  onShoot() {
    getApp().resetSession();
    wx.navigateTo({ url: "/pages/layout/layout" });
  },
  onCall() {
    wx.makePhoneCall({ phoneNumber: config.phone.replace(/\D/g, "") });
  },
  onShare() {
    wx.showToast({ title: "点右上角分享给好友", icon: "none" });
  },
  onCopyLink() {
    wx.setClipboardData({
      data: `${config.brand} · ${config.slogan}`,
      success: () => wx.showToast({ title: "已复制文案", icon: "success" }),
    });
  },

  onShareAppMessage() {
    return buildShare({ title: `${config.brand} · ${config.slogan}` });
  },
});
