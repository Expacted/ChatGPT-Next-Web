const { buildShare } = require("../../utils/share");

Page({
  data: {
    resultPath: "",
    saving: false,
  },

  onShow() {
    const path = getApp().globalData.session.resultPath;
    this.setData({ resultPath: path || "" });
  },

  onSave() {
    const filePath = this.data.resultPath;
    if (!filePath) {
      wx.showToast({ title: "没有可保存的图片", icon: "none" });
      return;
    }
    this.setData({ saving: true });
    wx.saveImageToPhotosAlbum({
      filePath,
      success: () => {
        this.setData({ saving: false });
        wx.showToast({ title: "已保存", icon: "success" });
      },
      fail: () => {
        wx.authorize({
          scope: "scope.writePhotosAlbum",
          success: () => {
            wx.saveImageToPhotosAlbum({
              filePath,
              success: () => {
                this.setData({ saving: false });
                wx.showToast({ title: "已保存", icon: "success" });
              },
              fail: () => {
                this.setData({ saving: false });
                wx.showToast({ title: "保存失败", icon: "none" });
              },
            });
          },
          fail: () => {
            this.setData({ saving: false });
            wx.showModal({
              title: "需要相册权限",
              content: "请在设置中允许保存到相册",
              confirmText: "去设置",
              success: (r) => {
                if (r.confirm) wx.openSetting({});
              },
            });
          },
        });
      },
    });
  },

  onPromo() {
    wx.navigateTo({ url: "/pages/promo/promo" });
  },

  onAgain() {
    getApp().resetSession();
    wx.reLaunch({ url: "/pages/index/index" });
  },

  onShareAppMessage() {
    return buildShare({ title: "我在一刻拍了一套大头贴，你也来！" });
  },
});
