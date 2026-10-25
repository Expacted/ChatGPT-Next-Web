const cloud = require("wx-server-sdk");

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const booking = {
    ...event,
    _openid: openid,
    remindSent: false,
    updatedAt: new Date(),
  };

  // 去掉前端临时 id 冲突；用云端 _id
  const { id, ...rest } = booking;
  const doc = {
    ...rest,
    clientId: id || "",
    createdAt: event.createdAt || new Date().toISOString(),
  };

  const addRes = await db.collection("bookings").add({ data: doc });
  return {
    ok: true,
    booking: {
      ...doc,
      id: addRes._id,
    },
  };
};
