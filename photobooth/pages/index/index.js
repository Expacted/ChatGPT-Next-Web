/** 兼容旧入口：跳到新首页 Tab */
Page({
  onShow() {
    wx.switchTab({ url: "/pages/home/home" });
  },
});
