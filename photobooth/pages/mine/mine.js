const { buildShare } = require("../../utils/share");

Page({
  onOrders() {
    wx.navigateTo({ url: "/pages/book/list" });
  },
  onPromo() {
    wx.navigateTo({ url: "/pages/promo/promo" });
  },
  onShoot() {
    getApp().resetSession();
    wx.navigateTo({ url: "/pages/layout/layout" });
  },
  onPrice() {
    wx.navigateTo({ url: "/pages/price/price" });
  },
  onShareAppMessage() {
    return buildShare({ title: "一刻 · PHOTO BOOTH" });
  },
});
