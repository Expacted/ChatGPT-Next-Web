function makeInviteCode() {
  try {
    const exist = wx.getStorageSync("yike_invite_code");
    if (exist) return exist;
  } catch (e) {}
  const code = `YK${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  try {
    wx.setStorageSync("yike_invite_code", code);
  } catch (e) {}
  return code;
}

function getInviteCode() {
  return makeInviteCode();
}

function trackInviteOpen(code) {
  if (!code) return;
  try {
    const key = "yike_invite_opens";
    const map = wx.getStorageSync(key) || {};
    map[code] = (map[code] || 0) + 1;
    wx.setStorageSync(key, map);
    wx.setStorageSync("yike_from_invite", code);
  } catch (e) {}
}

function getFromInvite() {
  try {
    return wx.getStorageSync("yike_from_invite") || "";
  } catch (e) {
    return "";
  }
}

/** 统一分享卡片 */
function buildShare(options = {}) {
  const code = options.inviteCode || getInviteCode();
  const path = options.path || `/pages/index/index?from=share&code=${code}`;
  return {
    title: options.title || "一刻 Photobooth · 一起来拍大头贴",
    path,
    imageUrl: options.imageUrl || "",
  };
}

module.exports = {
  makeInviteCode,
  getInviteCode,
  trackInviteOpen,
  getFromInvite,
  buildShare,
};
