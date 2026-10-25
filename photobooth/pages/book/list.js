const { listLocal } = require("../../utils/booking");

Page({
  data: { list: [] },

  onShow() {
    this.setData({ list: listLocal() });
  },

  onBook() {
    wx.navigateTo({ url: "/pages/book/book" });
  },
});
