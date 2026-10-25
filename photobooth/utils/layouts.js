/** 版式定义：slots = 需要几张照片 */
const LAYOUTS = [
  {
    id: "strip4",
    name: "经典四格",
    desc: "竖条大头贴",
    slots: 4,
    shootCount: 4,
    canvas: { w: 600, h: 1800 },
    positions: [
      { x: 48, y: 48, w: 504, h: 378 },
      { x: 48, y: 450, w: 504, h: 378 },
      { x: 48, y: 852, w: 504, h: 378 },
      { x: 48, y: 1254, w: 504, h: 378 },
    ],
    footerY: 1680,
  },
  {
    id: "strip3",
    name: "三连拍",
    desc: "竖条三格",
    slots: 3,
    shootCount: 3,
    canvas: { w: 600, h: 1400 },
    positions: [
      { x: 48, y: 48, w: 504, h: 378 },
      { x: 48, y: 450, w: 504, h: 378 },
      { x: 48, y: 852, w: 504, h: 378 },
    ],
    footerY: 1280,
  },
  {
    id: "grid4",
    name: "四宫格",
    desc: "2×2 方形",
    slots: 4,
    shootCount: 4,
    canvas: { w: 1000, h: 1100 },
    positions: [
      { x: 40, y: 40, w: 440, h: 440 },
      { x: 520, y: 40, w: 440, h: 440 },
      { x: 40, y: 520, w: 440, h: 440 },
      { x: 520, y: 520, w: 440, h: 440 },
    ],
    footerY: 1000,
  },
  {
    id: "pair2",
    name: "双人并排",
    desc: "横版双图",
    slots: 2,
    shootCount: 2,
    canvas: { w: 1200, h: 700 },
    positions: [
      { x: 40, y: 40, w: 540, h: 540 },
      { x: 620, y: 40, w: 540, h: 540 },
    ],
    footerY: 620,
  },
];

const FILTERS = [
  { id: "none", name: "原片", css: "" },
  { id: "mono", name: "黑白", css: "grayscale(1) contrast(1.05)" },
  { id: "warm", name: "暖阳", css: "sepia(0.25) saturate(1.15) brightness(1.05)" },
  { id: "cool", name: "冷调", css: "saturate(0.85) hue-rotate(15deg) brightness(1.02)" },
  { id: "film", name: "胶片", css: "contrast(1.1) saturate(0.9) brightness(1.02)" },
  { id: "soft", name: "柔光", css: "brightness(1.08) contrast(0.92) saturate(1.05)" },
];

const FRAME_COLORS = [
  { id: "cream", color: "#FFF8F0", name: "奶油" },
  { id: "white", color: "#FFFFFF", name: "纯白" },
  { id: "black", color: "#1A1A1A", name: "墨黑" },
  { id: "blush", color: "#FADADD", name: "腮红" },
  { id: "mint", color: "#D8F3DC", name: "薄荷绿" },
  { id: "sky", color: "#D6EAF8", name: "天空" },
];

function getLayout(id) {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}

function getFilter(id) {
  return FILTERS.find((f) => f.id === id) || FILTERS[0];
}

module.exports = {
  LAYOUTS,
  FILTERS,
  FRAME_COLORS,
  getLayout,
  getFilter,
};
