const config = require("../../utils/config");
const { buildShare } = require("../../utils/share");

Page({
  data: {
    slogan: config.slogan,
    areas: config.serviceAreas,
    phone: config.phone,
    brand: config.brand,
    brandShort: config.brandShort || "一刻",
    tags: config.homeTags || [],
    cards: config.homeCards || [],
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
    wx.makePhoneCall({ phoneNumber: String(config.phone).replace(/\D/g, "") });
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
  onCard(e) {
    const link = e.currentTarget.dataset.link;
    if (!link) return;
    if (link.indexOf("/pages/book/") === 0) {
      wx.switchTab({ url: "/pages/book/book" });
      return;
    }
    wx.navigateTo({ url: link });
  },

  onShareAppMessage() {
    return buildShare({ title: `${config.brand} · ${config.slogan}` });
  },
});
