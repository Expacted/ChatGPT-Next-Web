const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

/**
 * 定时触发（建议每 5–10 分钟）
 * 扫描 remindAt <= now 且未发送的预约，发订阅消息
 *
 * 环境变量 / 配置：
 * - TMPL_ID：订阅消息模板 ID（也可写死下方常量）
 */
const TMPL_ID = process.env.BOOKING_TMPL_ID || "";

exports.main = async () => {
  if (!TMPL_ID) {
    return { ok: false, error: "BOOKING_TMPL_ID missing" };
  }

  const nowIso = new Date().toISOString();
  const { data } = await db
    .collection("bookings")
    .where({
      remind: true,
      remindAccepted: true,
      remindSent: false,
      remindAt: _.lte(nowIso),
      status: "confirmed",
    })
    .limit(50)
    .get();

  const results = [];
  for (const item of data) {
    try {
      await cloud.openapi.subscribeMessage.send({
        touser: item._openid,
        templateId: TMPL_ID,
        page: "pages/book/list",
        data: {
          thing1: {
            value: truncate(
              item.activityType || item.note || "一刻 PHOTO BOOTH 活动",
              20
            ),
          },
          time2: {
            value: truncate(
              `${item.date} ${item.packageLabel || item.time || ""}`.trim(),
              20
            ),
          },
          thing3: {
            value: truncate(
              `你好${item.name || ""}，档期快到了，记得确认现场安排`,
              20
            ),
          },
        },
      });
      await db.collection("bookings").doc(item._id).update({
        data: { remindSent: true, remindSentAt: nowIso },
      });
      results.push({ id: item._id, ok: true });
    } catch (err) {
      console.error("send fail", item._id, err);
      results.push({ id: item._id, ok: false, err: String(err) });
    }
  }

  return { ok: true, count: results.length, results };
};

function truncate(str, n) {
  const s = String(str || "");
  return s.length > n ? s.slice(0, n) : s;
}
