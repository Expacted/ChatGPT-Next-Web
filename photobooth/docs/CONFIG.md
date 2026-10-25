# 如何自己替换内容（配置化说明）

**日常改店铺信息：优先只改一个文件**

`photobooth/utils/config.js`

改完后在微信开发者工具里保存即可预览。

---

## 1. 改文字 / 电话 / 价格 / 城市

打开 `utils/config.js`：

| 字段 | 作用 |
|------|------|
| `brand` / `brandShort` / `slogan` | 品牌名、口号 |
| `phone` | 首页拨打电话 |
| `serviceAreas` / `cities` | 服务城市展示与预约选项 |
| `homeTags` | 首页头图下的标签 |
| `activityTypes` / `durations` | 预约页选项 |
| `packages` / `earlyBirdNote` / `deposit` | 价目表 |
| `about` | 品牌介绍全文 |
| `feedPosts` | **店铺动态** |
| `homeCards` | 首页两张大卡片文案/封面 |

---

## 2. 替换店铺动态图片

1. 把图片放进：

```
photobooth/assets/feed/
  wedding-1.jpg
  wedding-2.jpg
  ...
```

2. 在 `config.js` 的 `feedPosts` 里写路径（小程序根路径以 `/` 开头）：

```js
feedPosts: [
  {
    id: 1,
    time: "2026-10-14 12:58",
    text: "婚礼现场花絮",
    images: [
      "/assets/feed/wedding-1.jpg",
      "/assets/feed/wedding-2.jpg",
    ],
  },
],
```

- 1 张图 → 大图；2 张 → 两列；3～9 张 → 九宫格风格
- 也可用 `https://` 图床链接（需在小程序后台配置 download 合法域名）
- 项目里自带 `demo-1.jpg` … `demo-9.jpg` 占位图，可直接覆盖同名文件

---

## 3. 替换首页卡片封面

1. 图片放到 `photobooth/assets/home/benefit.jpg` 等  
2. 改 `homeCards[].cover`：

```js
cover: "/assets/home/benefit.jpg",
```

留空则用渐变色块占位。

---

## 4. 还没做成配置的部分

| 内容 | 怎么改 |
|------|--------|
| Tab 图标 | `assets/tab/*.png` |
| 现场体验滤镜/版式 | `utils/layouts.js` |
| 页面布局结构 | 各 `pages/*/ *.wxml` |
| 云提醒 | `cloudEnvId`、`bookingRemindTmplId` |

---

## 5. 以后想后台可视化改动态？

现在是**本地配置文件**（零成本）。  
若要在手机/网页后台发动态，再接微信云开发数据库集合（如 `feed_posts`），前端改为 `wx.cloud.database()` 拉取即可，无需自建服务器。
