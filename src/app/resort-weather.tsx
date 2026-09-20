import * as Brownfield from "expo-brownfield";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NATIVE_DATA_KEYS, type ResortWeather } from "../native-data";

const days = [
  ["周二", "🌧", "-5°"],
  ["周三", "☀️", "6°"],
  ["周四", "🌧", "5°"],
  ["周五", "❄️", "-17°"],
  ["周六", "☀️", "9°"],
  ["周日", "☀️", "15°"],
  ["周一", "🌧", "8°"],
];
const hours = ["5", "8", "11", "14", "17", "20", "23"];
const rows = [
  ["温度 °C", "29°", "29°", "29°", "29°", "29°", "29°", "29°"],
  ["体感 °C", "30°", "31°", "37°", "40°", "39°", "36°", "27°"],
  ["雨量 mm", "-", "-", "-", "-", "-", "-", "2"],
  ["风速 kt", "4", "4", "5", "4", "4", "0", "7"],
  ["阵风 kt", "9", "10", "14", "14", "13", "12", "16"],
];

export default function ResortWeatherPage() {
  const [data] = Brownfield.useSharedState<ResortWeather>(NATIVE_DATA_KEYS.resortWeather);
  const visibleDays = data?.days?.map(d => [d.weekday, d.icon, `${d.tempC}°`]) ?? days;
  const visibleHours = data?.hourly?.map(h => h.hour) ?? hours;
  const visibleIcons = data?.hourly?.map(h => h.icon) ?? ["☾", "☀", "☀", "❄", "☁", "☁", "☀"];
  const visibleRows = data?.hourly ? [
    ["温度 °C", ...data.hourly.map(h => `${h.tempC}°`)],
    ["体感 °C", ...data.hourly.map(h => `${h.feelsLikeC}°`)],
    ["雨量 mm", ...data.hourly.map(h => h.precipMm == null ? "-" : String(h.precipMm))],
    ["风速 kt", ...data.hourly.map(h => String(h.windKt))],
    ["阵风 kt", ...data.hourly.map(h => String(h.gustKt))],
  ] : rows;
  return (
    <SafeAreaView style={s.page} edges={["top"]}>
      <View style={s.map}>
        <View style={s.terrainA} />
        <View style={s.terrainB} />
        <View style={s.terrainC} />
        <Text style={[s.mapLabel, { top: "25%", left: "8%" }]}>卧龙镇</Text>
        <Text style={[s.mapLabel, { top: "39%", right: "10%" }]}>都江堰市</Text>
        <Text style={[s.mapLabel, { top: "65%", right: "5%" }]}>成都市</Text>
        <View style={s.mapTop}>
          <TouchableOpacity onPress={() => Brownfield.popToNative(true)}>
            <Text style={s.back}>‹</Text>
          </TouchableOpacity>
          <View style={s.search}>
            <Text style={s.country}>中 国⌄</Text>
            <Text style={s.divider}>│</Text>
            <Text style={{ fontSize: 22, color: "#91a7b8" }}>⌕</Text>
            <TextInput
              placeholder="搜索雪场"
              placeholderTextColor="#91a7b8"
              style={s.searchInput}
            />
          </View>
        </View>
        <View style={s.pin}>
          <Text style={s.pinIcon}>▲</Text>
          <Text style={s.pinText}>{data?.resortName ?? "成都热雪奇迹"}</Text>
        </View>
      </View>
      <View style={s.sheet}>
        <Text style={s.title}>天气趋势</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={s.forecast}>
            {visibleDays.map((d) => (
              <View style={s.day} key={d[0]}>
                <Text style={s.dayName}>{d[0]}</Text>
                <Text style={s.emoji}>{d[1]}</Text>
                <Text style={s.temp}>{d[2]}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={s.separator} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={s.tableRow}>
              <Text style={s.rowLabel}>小时 ◷</Text>
              {visibleHours.map((h, i) => (
                <Text style={s.cell} key={`${h}-${i}`}>
                  {h}
                </Text>
              ))}
            </View>
            <View style={s.tableRow}>
              <Text style={s.rowLabel}></Text>
              {visibleIcons.map((x, i) => (
                <Text
                  style={[
                    s.cell,
                    {
                      color:
                        i === 1 || i === 2 || i === 6 ? "#ed9a00" : "#8da6b5",
                    },
                  ]}
                  key={i}
                >
                  {x}
                </Text>
              ))}
            </View>
            {visibleRows.map((row, ri) => (
              <View
                style={[s.tableRow, ri === 4 && { backgroundColor: "#c6eee8" }]}
                key={row[0]}
              >
                <Text style={s.rowLabel}>{row[0]}</Text>
                {row.slice(1).map((v, i) => (
                  <Text
                    key={i}
                    style={[
                      s.cell,
                      { color: ri === 4 ? "#1f4e59" : "#30445d" },
                    ]}
                  >
                    {v}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#f4f9fc" },
  map: { flex: 1, backgroundColor: "#e5eff1", overflow: "hidden" },
  terrainA: {
    position: "absolute",
    width: "150%",
    height: "80%",
    backgroundColor: "#d5e8dd",
    transform: [{ rotate: "-28deg" }],
    left: "-46%",
    top: "6%",
    borderRadius: 90,
  },
  terrainB: {
    position: "absolute",
    width: "130%",
    height: "80%",
    backgroundColor: "#c6dfd2",
    transform: [{ rotate: "28deg" }],
    left: "-26%",
    top: "-25%",
    borderRadius: 150,
  },
  terrainC: {
    position: "absolute",
    width: "100%",
    height: "60%",
    backgroundColor: "#ecf3e7",
    transform: [{ rotate: "-32deg" }],
    right: "-48%",
    top: "27%",
    borderRadius: 100,
  },
  mapLabel: {
    position: "absolute",
    fontSize: 13,
    color: "#6a8293",
    fontWeight: "600",
  },
  mapTop: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  back: { fontSize: 38, color: "#2d405a" },
  search: {
    height: 54,
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12,
  },
  country: { fontSize: 15, color: "#2d405a", fontWeight: "700" },
  divider: { fontSize: 22, color: "#c5d3dc" },
  searchInput: { flex: 1, fontSize: 16, color: "#2d405a" },
  pin: {
    position: "absolute",
    top: "52%",
    alignSelf: "center",
    alignItems: "center",
  },
  pinIcon: {
    color: "#1680e7",
    backgroundColor: "#fff",
    borderRadius: 30,
    overflow: "hidden",
    fontSize: 30,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  pinText: {
    color: "#0873d7",
    fontSize: 20,
    fontWeight: "800",
    marginTop: 7,
    textShadowColor: "#fff",
    textShadowRadius: 3,
  },
  sheet: {
    height: "49%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingTop: 22,
  },
  title: {
    fontSize: 22,
    color: "#253a52",
    fontWeight: "700",
    marginLeft: 22,
    marginBottom: 18,
  },
  forecast: { flexDirection: "row", paddingHorizontal: 12 },
  day: {
    width: 70,
    alignItems: "center",
    borderRightWidth: 1,
    borderColor: "#eef0f3",
  },
  dayName: { color: "#91a7b8", fontSize: 15 },
  emoji: { fontSize: 23, marginVertical: 12 },
  temp: { fontSize: 18, color: "#2b405b" },
  separator: { height: 1, backgroundColor: "#e0e8f0", marginTop: 24 },
  tableRow: { flexDirection: "row", height: 38, alignItems: "center" },
  rowLabel: { width: 94, paddingLeft: 10, color: "#91a7b8", fontSize: 13 },
  cell: { width: 54, textAlign: "center", fontSize: 16, color: "#8da3b6" },
});
