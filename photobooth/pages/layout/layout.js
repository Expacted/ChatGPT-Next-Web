const { LAYOUTS, FILTERS } = require("../../utils/layouts");

Page({
  data: {
    layouts: LAYOUTS,
    filters: FILTERS,
    selected: "strip4",
    filterId: "none",
  },

  onPick(e) {
    this.setData({ selected: e.currentTarget.dataset.id });
  },

  onFilter(e) {
    this.setData({ filterId: e.currentTarget.dataset.id });
  },

  onNext() {
    const app = getApp();
    app.globalData.session.layoutId = this.data.selected;
    app.globalData.session.filterId = this.data.filterId;
    app.globalData.session.shots = [];
    app.globalData.session.selected = [];
    wx.navigateTo({ url: "/pages/shoot/shoot" });
  },
});
