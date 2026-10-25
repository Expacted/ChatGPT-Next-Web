const config = require("../../utils/config");

Page({
  data: {
    packages: config.packages,
    earlyBirdNote: config.earlyBirdNote,
    areas: config.serviceAreas,
    deposit: config.deposit,
  },
  onBook() {
    wx.switchTab({ url: "/pages/book/book" });
  },
});
