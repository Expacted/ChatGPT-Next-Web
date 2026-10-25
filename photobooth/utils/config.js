/**
 * 上线前在微信公众平台配置后填入：
 * 1. 开通云开发，复制环境 ID
 * 2. 订阅消息 → 选用「预约提醒」类模板，复制模板 ID
 */
module.exports = {
  cloudEnvId: "", // 例如 "yike-xxxxx"
  // 订阅消息模板字段建议：thing1 活动名称 / time2 预约时间 / thing3 温馨提示
  bookingRemindTmplId: "",
  bookingLeadMinutes: 60, // 开拍前多少分钟提醒
  brand: "一刻 Photobooth",
  defaultSlots: ["10:00", "11:00", "14:00", "15:00", "16:00", "19:00", "20:00"],
};
