const { FILTERS, FRAME_COLORS, getLayout, getFilter } = require("../../utils/layouts");
const { composeStrip } = require("../../utils/compose");

Page({
  data: {
    selected: [],
    frames: FRAME_COLORS,
    filters: FILTERS,
    frameColor: "#FFF8F0",
    filterId: "none",
    filterCss: "",
    brandColor: "rgba(0,0,0,0.5)",
    layoutClass: "layout-strip4",
    canvasW: 600,
    canvasH: 1800,
    composing: false,
  },

  onShow() {
    const app = getApp();
    const session = app.globalData.session;
    const layout = getLayout(session.layoutId);
    const filter = getFilter(session.filterId);
    const frameColor = session.frameColor || "#FFF8F0";
    this.setData({
      selected: session.selected || [],
      filterId: session.filterId,
      filterCss: filter.css,
      frameColor,
      brandColor: this.brandTone(frameColor),
      layoutClass: `layout-${session.layoutId}`,
      canvasW: layout.canvas.w,
      canvasH: layout.canvas.h,
    });
  },

  brandTone(color) {
    return color === "#1A1A1A" || color === "#121214"
      ? "rgba(255,255,255,0.7)"
      : "rgba(0,0,0,0.5)";
  },

  onColor(e) {
    const frameColor = e.currentTarget.dataset.color;
    getApp().globalData.session.frameColor = frameColor;
    this.setData({
      frameColor,
      brandColor: this.brandTone(frameColor),
    });
  },

  onFilter(e) {
    const filterId = e.currentTarget.dataset.id;
    getApp().globalData.session.filterId = filterId;
    const filter = getFilter(filterId);
    this.setData({ filterId, filterCss: filter.css });
  },

  async onCompose() {
    if (this.data.composing) return;
    const app = getApp();
    const session = app.globalData.session;
    if (!session.selected || !session.selected.length) {
      wx.showToast({ title: "请先选择照片", icon: "none" });
      return;
    }

    this.setData({ composing: true });
    wx.showLoading({ title: "生成中" });
    try {
      const path = await composeStrip({
        canvasId: "stripCanvas",
        component: this,
        paths: session.selected,
        layoutId: session.layoutId,
        filterId: session.filterId,
        frameColor: session.frameColor,
        brand: app.globalData.brand,
      });
      session.resultPath = path;
      wx.hideLoading();
      this.setData({ composing: false });
      wx.navigateTo({ url: "/pages/result/result" });
    } catch (err) {
      console.error(err);
      wx.hideLoading();
      this.setData({ composing: false });
      wx.showToast({ title: "生成失败，请重试", icon: "none" });
    }
  },
});
