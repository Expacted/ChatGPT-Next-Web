const { ensureCloud } = require("./utils/cloud");
const { trackInviteOpen } = require("./utils/share");

App({
  globalData: {
    brand: "一刻",
    inviteCode: "",
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

  onLaunch(options) {
    ensureCloud();
    this.captureInvite(options && options.query);
  },

  onShow(options) {
    this.captureInvite(options && options.query);
  },

  captureInvite(query) {
    if (!query) return;
    const code = query.code || query.invite || "";
    if (code) {
      trackInviteOpen(code);
      this.globalData.inviteCode = code;
    }
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
