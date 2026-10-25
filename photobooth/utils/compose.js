const { getLayout, getFilter } = require("./layouts");

/**
 * 将选中照片合成大头贴条
 * @param {Object} opts
 * @param {string} opts.canvasId
 * @param {any} opts.component 页面 this
 * @param {string[]} opts.paths 本地临时路径
 * @param {string} opts.layoutId
 * @param {string} opts.filterId
 * @param {string} opts.frameColor
 * @param {string} opts.brand
 */
function composeStrip(opts) {
  const {
    canvasId,
    component,
    paths,
    layoutId,
    filterId,
    frameColor,
    brand = "一刻",
  } = opts;

  const layout = getLayout(layoutId);
  const filter = getFilter(filterId);
  const { w, h } = layout.canvas;

  return new Promise((resolve, reject) => {
    const ctx = wx.createCanvasContext(canvasId, component);

    // 底板
    ctx.setFillStyle(frameColor || "#FFF8F0");
    ctx.fillRect(0, 0, w, h);

    const drawOne = (index) => {
      if (index >= layout.positions.length) {
        // 页脚品牌
        const dark =
          frameColor === "#1A1A1A" ||
          frameColor === "#121214" ||
          (frameColor || "").toLowerCase() === "#000000";
        ctx.setFillStyle(dark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.55)");
        ctx.setFontSize(28);
        ctx.setTextAlign("center");
        ctx.fillText(`${brand} · Photobooth`, w / 2, layout.footerY);

        const now = new Date();
        const stamp = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
        ctx.setFontSize(20);
        ctx.fillText(stamp, w / 2, layout.footerY + 36);

        ctx.draw(false, () => {
          setTimeout(() => {
            wx.canvasToTempFilePath(
              {
                canvasId,
                destWidth: w,
                destHeight: h,
                fileType: "jpg",
                quality: 0.92,
                success: (res) => resolve(res.tempFilePath),
                fail: reject,
              },
              component
            );
          }, 80);
        });
        return;
      }

      const pos = layout.positions[index];
      const src = paths[index];
      if (!src) {
        drawOne(index + 1);
        return;
      }

      wx.getImageInfo({
        src,
        success: (info) => {
          // cover 裁切
          const ir = info.width / info.height;
          const pr = pos.w / pos.h;
          let sx = 0;
          let sy = 0;
          let sw = info.width;
          let sh = info.height;
          if (ir > pr) {
            sw = info.height * pr;
            sx = (info.width - sw) / 2;
          } else {
            sh = info.width / pr;
            sy = (info.height - sh) / 2;
          }

          ctx.save();
          // 简易滤镜：黑白用灰度近似；其它滤镜在预览阶段用 CSS，导出时做基础处理
          if (filter.id === "mono") {
            // 小程序 canvas 无原生滤镜，用偏灰填充叠加近似
          }
          ctx.drawImage(src, sx, sy, sw, sh, pos.x, pos.y, pos.w, pos.h);

          if (filter.id === "mono") {
            ctx.setGlobalAlpha(0.35);
            ctx.setFillStyle("#808080");
            ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
            ctx.setGlobalAlpha(1);
            ctx.setGlobalCompositeOperation("saturation");
            ctx.setFillStyle("#000");
            ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
            ctx.setGlobalCompositeOperation("source-over");
          } else if (filter.id === "warm") {
            ctx.setGlobalAlpha(0.18);
            ctx.setFillStyle("#ffb070");
            ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
            ctx.setGlobalAlpha(1);
          } else if (filter.id === "cool") {
            ctx.setGlobalAlpha(0.14);
            ctx.setFillStyle("#70a0ff");
            ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
            ctx.setGlobalAlpha(1);
          } else if (filter.id === "film") {
            ctx.setGlobalAlpha(0.12);
            ctx.setFillStyle("#2a2018");
            ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
            ctx.setGlobalAlpha(1);
          } else if (filter.id === "soft") {
            ctx.setGlobalAlpha(0.1);
            ctx.setFillStyle("#ffffff");
            ctx.fillRect(pos.x, pos.y, pos.w, pos.h);
            ctx.setGlobalAlpha(1);
          }

          ctx.restore();
          drawOne(index + 1);
        },
        fail: () => drawOne(index + 1),
      });
    };

    drawOne(0);
  });
}

module.exports = {
  composeStrip,
};
