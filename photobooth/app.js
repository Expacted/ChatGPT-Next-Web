App({
  globalData: {
    brand: "一刻",
    session: {
      layoutId: "strip4",
      filterId: "none",
      frameColor: "#FFF8F0",
      accentColor: "#E85D4C",
      shots: [],
      selected: [],
      resultPath: "",
    },
  },

  resetSession() {
    this.globalData.session = {
      layoutId: "strip4",
      filterId: "none",
      frameColor: "#FFF8F0",
      accentColor: "#E85D4C",
      shots: [],
      selected: [],
      resultPath: "",
    };
  },
});
