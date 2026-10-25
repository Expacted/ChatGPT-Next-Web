const config = require("../../utils/config");

Page({
  data: {
    brand: config.brand,
    brandShort: config.brandShort || "一刻",
    posts: config.feedPosts || [],
  },

  onImgError(e) {
    // 图片缺失时不强打断；可在控制台看到是哪张
    console.warn("feed image missing", e.currentTarget.dataset);
  },
});
