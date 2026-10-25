const { getInviteCode, buildShare } = require("../../utils/share");

Page({
  data: {
    inviteCode: "",
    openCount: 0,
  },

  onShow() {
    const inviteCode = getInviteCode();
    let openCount = 0;
    try {
      const map = wx.getStorageSync("yike_invite_opens") || {};
      openCount = map[inviteCode] || 0;
    } catch (e) {}
    this.setData({ inviteCode, openCount });
  },

  onCopy() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => wx.showToast({ title: "已复制", icon: "success" }),
    });
  },

  onBook() {
    wx.navigateTo({ url: "/pages/book/book" });
  },

  onShareAppMessage() {
    return buildShare({
      inviteCode: this.data.inviteCode,
      title: `用我的邀请码 ${this.data.inviteCode}，一起来一刻拍大头贴`,
    });
  },

  onShareTimeline() {
    return {
      title: `一刻 Photobooth · 邀请码 ${this.data.inviteCode}`,
      query: `from=timeline&code=${this.data.inviteCode}`,
    };
  },
});
