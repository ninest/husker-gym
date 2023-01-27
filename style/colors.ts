/* Weak heatmap */
export const WEEK_HEATMAP_COLORS = {
  SPARSE: "bg-blue-100", // 0-20% full
  NORMAL: "bg-blue-300", // 20-40
  BUSY: "bg-blue-500", // 40-60
  CROWDED: "bg-blue-700", // 60-80
  VERY_CROWDED: "bg-blue-900", // >80
};

export const getHourColorFromPercent = (percent: number) => {
  if (percent < 20) return WEEK_HEATMAP_COLORS.SPARSE;
  else if (percent < 40) return WEEK_HEATMAP_COLORS.NORMAL;
  else if (percent < 60) return WEEK_HEATMAP_COLORS.BUSY;
  else if (percent < 80) return WEEK_HEATMAP_COLORS.CROWDED;
  else if (percent >= 80) return WEEK_HEATMAP_COLORS.VERY_CROWDED;
  else return "";
};

/* Day bar chart */
// Using "text-" classes for styling rects

export const BAR_CHART_COLORS = {
  DEFAULT: "text-gray-200",
  NORMAL: "text-indigo-300", // 0-40% full
  BUSY: "text-orange-300", // 40-60% full
  CROWDED: "text-red-300", // 60-80%
  VERY_CROWDED: "text-pink-300", // 80%+
};

export const getBarColorFromPercent = (percent: number) => {
  if (percent < 40) return BAR_CHART_COLORS.NORMAL;
  else if (percent < 60) return BAR_CHART_COLORS.BUSY;
  else if (percent < 80) return BAR_CHART_COLORS.CROWDED;
  else return BAR_CHART_COLORS.VERY_CROWDED;
};

/* Text BG colors */
export const TEXT_BG_COLORS = {
  NORMAL: "bg-indigo-300", // 0-40% full
  BUSY: "bg-orange-300", // 40-60% full
  CROWDED: "bg-red-300", // 60-80%
  VERY_CROWDED: "bg-pink-300", // 80%+
};

export const getTextBgColor = (percent: number) => {
  if (percent < 40) return TEXT_BG_COLORS.NORMAL;
  else if (percent < 60) return TEXT_BG_COLORS.BUSY;
  else if (percent < 80) return TEXT_BG_COLORS.CROWDED;
  else return TEXT_BG_COLORS.VERY_CROWDED;
};