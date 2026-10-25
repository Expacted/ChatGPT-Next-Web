Page({
  onStart() {
    const app = getApp();
    app.resetSession();
    wx.navigateTo({ url: "/pages/layout/layout" });
  },
});
