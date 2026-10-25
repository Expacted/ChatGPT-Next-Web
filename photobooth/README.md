# 一刻 Photobooth

参考「悦时刻 photobooth」类大头贴流程的个人版小程序：**拍摄 + 预约 + 分享推广**。先跑通流程；预约支持微信订阅消息提醒（需开通云开发并配置模板）。

## 流程

```
首页
├─ 开始拍摄 → 版式/滤镜 → 倒计时连拍 → 选片 → 边框 → 保存/分享
├─ 预约档期 → 填信息 → 勾选微信提醒 → 成功页（可转发）
├─ 分享推广 → 邀请码 + 转发小程序卡片
└─ 我的预约 → 本机/云端预约列表
```

## 费用（个人最省）

| 项目 | 费用 |
|------|------|
| 注册 / 备案 | 0 |
| 拍摄（本地相机 + Canvas） | 0 |
| 预约提醒 | 云开发免费额度内通常够个人试用；上线后约 19.9 元/月起（按量） |
| 未开通云开发时 | 预约先存本机，流程仍可完整演示 |

## 微信提醒怎么开通

1. 微信开发者工具打开 `photobooth/`，开通**云开发**，创建集合 `bookings`
2. 上传并部署云函数：`createBooking`、`sendBookingReminder`（已带 5 分钟定时触发器）
3. 公众平台 → 订阅消息，选预约提醒类模板（建议字段：活动名称 / 预约时间 / 温馨提示）
4. 填写 `utils/config.js`：
   - `cloudEnvId`
   - `bookingRemindTmplId`
5. 云函数 `sendBookingReminder` 环境变量设置 `BOOKING_TMPL_ID`（与模板 ID 一致）

用户预约时会弹出订阅授权；同意后，开拍前约 60 分钟由定时云函数发送提醒。

## 目录

```
photobooth/
├── pages/          # 拍摄 / 预约 / 推广
├── utils/          # 合成、预约、分享、云初始化
├── cloudfunctions/ # createBooking / sendBookingReminder
└── web-demo/       # 浏览器演示（预约用 Notification 模拟提醒）
```

## 使用

**小程序**：开发者工具导入本目录 → 测试号即可；正式发布换你的 AppID。

**网页演示**：

```bash
cd photobooth/web-demo
python3 -m http.server 8765
```
