export type SkiData = {
  resortName?: string;
  trailNames?: string[];
  duration?: string;
  distanceKm?: number;
  turns?: number;
  verticalDropM?: number;
  maxSlopeDeg?: number;
  maxSpeedKmh?: number;
  metrics?: { label: string; value: string; percent: number }[];
  startTime?: string;
  endTime?: string;
  maxAltitudeM?: number;
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
