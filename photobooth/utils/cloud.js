const config = require("./config");

let inited = false;

function ensureCloud() {
  if (inited) return !!wx.cloud;
  if (!wx.cloud) return false;
  try {
    if (config.cloudEnvId) {
      wx.cloud.init({ env: config.cloudEnvId, traceUser: true });
    } else {
      wx.cloud.init({ traceUser: true });
    }
    inited = true;
    return true;
  } catch (e) {
    console.warn("cloud init failed", e);
    return false;
  }
}

function cloudAvailable() {
  return ensureCloud();
}

module.exports = {
  ensureCloud,
  cloudAvailable,
  config,
};
