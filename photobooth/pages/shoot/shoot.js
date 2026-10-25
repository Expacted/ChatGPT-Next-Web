const { getLayout } = require("../../utils/layouts");

Page({
  data: {
    cameraReady: false,
    total: 4,
    currentIndex: 0,
    shots: [],
    emptySlots: [0, 1, 2, 3],
    countdown: 0,
    busy: false,
    flash: false,
    statusText: "摆好姿势，准备微笑",
    filterClass: "",
  },

  onLoad() {
    const app = getApp();
    const layout = getLayout(app.globalData.session.layoutId);
    const filterId = app.globalData.session.filterId;
    const total = layout.shootCount;
    this.setData({
      total,
      emptySlots: Array.from({ length: total }, (_, i) => i),
      filterClass: filterId === "none" ? "" : `filter-${filterId}`,
    });
    this.ensureAuth();
  },

  ensureAuth() {
    wx.getSetting({
      success: (res) => {
        if (res.authSetting["scope.camera"]) {
          this.setData({ cameraReady: true });
        } else {
          wx.authorize({
            scope: "scope.camera",
            success: () => this.setData({ cameraReady: true }),
            fail: () => this.setData({ cameraReady: false }),
          });
        }
      },
    });
  },

  requestAuth() {
    wx.openSetting({
      success: (res) => {
        if (res.authSetting["scope.camera"]) {
          this.setData({ cameraReady: true });
        }
      },
    });
  },

  onCameraError() {
    this.setData({ cameraReady: false, statusText: "相机启动失败，请检查权限" });
  },

  async onShutter() {
    if (this.data.busy || !this.data.cameraReady) return;
    this.setData({ busy: true, shots: [], currentIndex: 0 });
    const total = this.data.total;
    const shots = [];

    for (let i = 0; i < total; i++) {
      this.setData({
        currentIndex: i,
        statusText: `准备拍第 ${i + 1} 张`,
        emptySlots: Array.from({ length: total - shots.length }, (_, k) => k),
      });
      await this.runCountdown(3);
      const path = await this.takePhoto();
      shots.push(path);
      this.setData({
        shots: shots.slice(),
        flash: true,
        emptySlots: Array.from({ length: total - shots.length }, (_, k) => k),
      });
      await this.sleep(220);
      this.setData({ flash: false });
      if (i < total - 1) await this.sleep(450);
    }

    const app = getApp();
    app.globalData.session.shots = shots;
    app.globalData.session.selected = shots.slice(0, getLayout(app.globalData.session.layoutId).slots);
    this.setData({ busy: false, statusText: "拍摄完成" });
    wx.navigateTo({ url: "/pages/select/select" });
  },

  runCountdown(sec) {
    return new Promise((resolve) => {
      let n = sec;
      this.setData({ countdown: n });
      const timer = setInterval(() => {
        n -= 1;
        if (n <= 0) {
          clearInterval(timer);
          this.setData({ countdown: 0 });
          resolve();
        } else {
          this.setData({ countdown: n });
        }
      }, 1000);
    });
  },

  takePhoto() {
    return new Promise((resolve, reject) => {
      const ctx = wx.createCameraContext();
      ctx.takePhoto({
        quality: "high",
        success: (res) => resolve(res.tempImagePath),
        fail: reject,
      });
    });
  },

  sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  },
});
