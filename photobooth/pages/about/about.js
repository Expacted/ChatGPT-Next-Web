const config = require("../../utils/config");

Page({
  data: {
    about: config.about || {},
  },
  onBook() {
    wx.switchTab({ url: "/pages/book/book" });
  },
  onPrice() {
    wx.navigateTo({ url: "/pages/price/price" });
  },
});
