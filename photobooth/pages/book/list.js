const { listLocal } = require("../../utils/booking");

Page({
  data: { list: [] },
  onShow() {
    this.setData({ list: listLocal() });
  },
  onBook() {
    wx.switchTab({ url: "/pages/book/book" });
  },
});
