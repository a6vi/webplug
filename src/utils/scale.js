// utils/scale.js
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 设计稿基准
const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

// 宽度缩放比
export const scale = (size) => (SCREEN_WIDTH / DESIGN_WIDTH) * size;

// 高度缩放比（用于竖直方向间距、整屏布局）
export const verticalScale = (size) => (SCREEN_HEIGHT / DESIGN_HEIGHT) * size;

// 折中缩放（字体推荐用这个，避免大屏字太大）
export const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// 字体缩放（带 factor，且限制最小值，防止小屏字太小）
export const fontScale = (size, factor = 0.5) =>
  Math.round(moderateScale(size, factor));