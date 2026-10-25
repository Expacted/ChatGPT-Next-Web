/**
 * ================================
 * 一刻 PHOTO BOOTH · 统一配置
 * ================================
 * 日常改文案 / 价格 / 城市 / 动态：只改本文件即可。
 * 图片放到 photobooth/assets/ 下，路径写成 "/assets/xxx.jpg"
 *
 * 微信开发者工具：修改后保存，预览会自动刷新。
 */

module.exports = {
  // ---------- 云开发（可选，做微信提醒才填） ----------
  cloudEnvId: "", // 云环境 ID
  bookingRemindTmplId: "", // 订阅消息模板 ID
  bookingLeadMinutes: 60,

  // ---------- 品牌与联系 ----------
  brand: "一刻 · PHOTO BOOTH",
  brandShort: "一刻",
  slogan: "让快乐，有迹可循",
  phone: "19900000000",
  serviceAreas: "内江 | 泸州 | 自贡",
  cities: ["内江", "泸州", "自贡", "成都", "其他"],
  // 首页活动标签
  homeTags: ["婚礼", "生日", "派对", "活动", "品牌活动"],

  // ---------- 预约表单选项 ----------
  activityTypes: [
    "商场活动",
    "生日宴",
    "婚礼活动",
    "订婚宴",
    "升学宴",
    "毕业季",
    "其他",
  ],
  durations: [
    { hours: 2, label: "2小时", tip: "人气推荐", price: 1880, early: 1680 },
    { hours: 3, label: "3小时", tip: "标准场次", price: 2380, early: 2180 },
    { hours: 4, label: "4小时", tip: "大型活动推荐", price: 2880, early: 2680 },
  ],

  // ---------- 价目表 ----------
  packages: [
    { hours: 1, price: 1280, early: 1080 },
    { hours: 2, price: 1880, early: 1680 },
    { hours: 3, price: 2380, early: 2180 },
  ],
  earlyBirdNote: "提前1个月预约可享早鸟价，直减 ¥200",
  deposit: 500,
  priceNotes: [
    "服务城市见上方；市区内出行免费，超出范围另计交通费。",
    "定金锁定档期。活动前 20 天内取消定金不退；我方原因取消双倍退还定金。",
    "套餐含：时长内不限次拍摄打印、至少 2 名现场人员、留言簿、多套模板、手持道具。",
    "设备：热升华打印机，即拍即出。",
  ],

  // ---------- 品牌介绍 ----------
  about: {
    title: "选择一刻 · PHOTO BOOTH\n您将会得到",
    tag: "中高端定制",
    headline: "让快乐，有迹可循",
    paragraphs: [
      "不做流水线敷衍，全案用心定制。从模板、道具到现场动线，按活动主题一起打磨。",
      "设备：热升华即拍即印，宾客带走实体照片与电子版回忆。",
    ],
    benefits: [
      "时长内不限次拍摄与打印",
      "双人及以上现场服务",
      "多套模板 / 手持道具 / 留言互动",
      "可预约微信提醒，档期不踩空",
    ],
  },

  // ---------- 首页内容卡片 ----------
  // cover 可换成真实图："/assets/home/benefit.jpg"
  homeCards: [
    {
      id: "about",
      cover: "",
      coverCaption: "中高端定制 · 全案用心",
      title: "选择一刻 · PHOTO BOOTH 您将会得到",
      link: "/pages/about/about",
    },
    {
      id: "price",
      cover: "",
      coverCaption: "PHOTO BOOTH 租赁套餐",
      title: "价目服务表（必看）",
      link: "/pages/price/price",
    },
  ],

  /**
   * 店铺动态
   * images: 填本地路径或临时 https 图链
   * 例：["/assets/feed/1.jpg", "/assets/feed/2.jpg"]
   * 不填图时用色块占位（演示用）
   */
  feedPosts: [
    {
      id: 1,
      time: "2026-10-14 12:58",
      text: "一刻日记分享 · 婚礼现场即拍即印，宾客带走专属四格。",
      images: ["/assets/feed/demo-1.jpg", "/assets/feed/demo-2.jpg"],
    },
    {
      id: 2,
      time: "2026-10-08 18:20",
      text: "生日宴布置花絮：道具、模板、留言簿一次备齐。",
      images: [
        "/assets/feed/demo-3.jpg",
        "/assets/feed/demo-4.jpg",
        "/assets/feed/demo-5.jpg",
        "/assets/feed/demo-6.jpg",
        "/assets/feed/demo-7.jpg",
        "/assets/feed/demo-8.jpg",
        "/assets/feed/demo-9.jpg",
        "/assets/feed/demo-1.jpg",
        "/assets/feed/demo-2.jpg",
      ],
    },
    {
      id: 3,
      time: "2026-09-28 11:05",
      text: "商场快闪回顾，感谢每一位来打卡的朋友。",
      images: [
        "/assets/feed/demo-4.jpg",
        "/assets/feed/demo-7.jpg",
        "/assets/feed/demo-3.jpg",
      ],
    },
  ],
};
