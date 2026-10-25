const { getLayout } = require("../../utils/layouts");

Page({
  data: {
    shots: [],
    selected: [],
    shotItems: [],
    selectedCount: 0,
    need: 4,
  },

  onShow() {
    const app = getApp();
    const layout = getLayout(app.globalData.session.layoutId);
    const shots = app.globalData.session.shots || [];
    const selected =
      app.globalData.session.selected && app.globalData.session.selected.length
        ? app.globalData.session.selected.slice(0, layout.slots)
        : shots.slice(0, layout.slots);
    this.setData({ shots, selected, need: layout.slots });
    this.refreshItems(shots, selected);
  },

  refreshItems(shots, selected) {
    const shotItems = shots.map((path) => {
      const idx = selected.indexOf(path);
      return {
        path,
        on: idx >= 0,
        order: idx >= 0 ? idx + 1 : 0,
      };
    });
    this.setData({
      shotItems,
      selectedCount: selected.length,
    });
  },

  onToggle(e) {
    const path = e.currentTarget.dataset.path;
    let selected = this.data.selected.slice();
    const idx = selected.indexOf(path);
    if (idx >= 0) {
      selected.splice(idx, 1);
    } else if (selected.length < this.data.need) {
      selected.push(path);
    } else {
      wx.showToast({ title: `最多选 ${this.data.need} 张`, icon: "none" });
      return;
    }
    this.setData({ selected });
    this.refreshItems(this.data.shots, selected);
  },

  onNext() {
    if (this.data.selected.length !== this.data.need) return;
    getApp().globalData.session.selected = this.data.selected;
    wx.navigateTo({ url: "/pages/decorate/decorate" });
  },

  onReshoot() {
    wx.navigateBack({ delta: 1 });
  },
});
