export type SkiData = {
  resortName?: string; // 滑行雪场
  trailNames?: string[]; // 滑行雪道
  duration?: string; // 滑行时间
  distanceKm?: number; // 滑行距离
  turns?: number; // 转弯数
  verticalDropM?: number; // 落差
  maxSlopeDeg?: number; // 最大坡度
  maxSpeedKmh?: number; // 最大速度
  // 换刃分析
  bladeView?: number[];
  bladeFrequency?: number; // 换刃频率
  bladeChannel?: number; // 换刃通道
  bladeRadius?: number; // 换刃半径
  // 滑行指标
  metrics?: { label: string; value: string; percent: number, unit: string }[];
  startTime?: string; // 开始时间
  endTime?: string; // 结束时间
  maxAltitudeM?: number; // 最高海拔
};

export type ResortWeather = {
  resortName?: string;
  days?: { weekday: string; icon: string; tempC: number }[];
  hourly?: { hour: string; icon: string; tempC: number; feelsLikeC: number; precipMm: number | null; windKt: number; gustKt: number }[];
};

export type AiAnalysis = {
  question?: string;
  answer?: string;
};

export const NATIVE_DATA_KEYS = {
  skiData: 'myski.skiData',
  resortWeather: 'myski.resortWeather',
  aiAnalysis: 'myski.aiAnalysis',
} as const;
