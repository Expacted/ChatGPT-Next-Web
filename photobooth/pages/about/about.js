Page({
  onBook() {
    wx.switchTab({ url: "/pages/book/book" });
  },
  onPrice() {
    wx.navigateTo({ url: "/pages/price/price" });
  },
});
