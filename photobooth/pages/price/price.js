const config = require("../../utils/config");

Page({
  data: {
    packages: config.packages,
    earlyBirdNote: config.earlyBirdNote,
    areas: config.serviceAreas,
    deposit: config.deposit,
    priceNotes: config.priceNotes || [],
    brandShort: config.brandShort || "一刻",
  },
  onBook() {
    wx.switchTab({ url: "/pages/book/book" });
  },
});
