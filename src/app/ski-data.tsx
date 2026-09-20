import * as Brownfield from "expo-brownfield";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NATIVE_DATA_KEYS, type SkiData } from "../native-data";

const metrics: [string, string, number][] = [
  ["立刃角度", "32°", 55],
  ["双板平行", "32%", 34],
  ["弯形圆润", "32%", 62],
  ["弯形闭合", "32%", 26],
  ["更早立刃", "32%", 72],
  ["G-FORCE", "0.3g", 35],
  ["重心释放", "0.3%", 48],
  ["外腿承重", "0.3%", 86],
  ["重心居中", "0.3%", 19],
  ["重心建立", "0.3%", 37],
];
const Card = ({ children }: { children: React.ReactNode }) => (
  <View style={s.card}>{children}</View>
);
const Head = ({ children }: { children: string }) => (
  <Text style={s.head}>{children}</Text>
);

export default function SkiDataPage() {
  const [data] = Brownfield.useSharedState<SkiData>(NATIVE_DATA_KEYS.skiData);
  const visibleMetrics =
    data?.metrics?.map(
      (m) => [m.label, m.value, m.percent] as [string, string, number],
    ) ?? metrics;
  return (
    <SafeAreaView style={s.page} edges={["top"]}>
      <View style={s.top}>
        <TouchableOpacity onPress={() => Brownfield.popToNative(true)}>
          <Text style={s.back}>‹</Text>
        </TouchableOpacity>
        <Text style={s.topTitle}>第2趟 搓雪</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <Text style={s.resort}>
            ⌖ {data?.resortName ?? "未木吉克普林国际滑雪场"}
          </Text>
          <Text style={s.muted}>
            🔴 {data?.trailNames?.join(" 🔴 ") ?? "云霄峰道 🔴 吉克普林道"}
          </Text>
        </Card>
        <Card>
          <View style={s.hero}>
            <Text style={s.muted}>滑行 {data?.duration ?? "03:01:28"}</Text>
            <Text style={s.big}>
              {data?.distanceKm ?? 24.6}
              <Text style={s.small}> km</Text>
            </Text>
          </View>
          <View style={s.grid}>
            {[
              [String(data?.turns ?? 3679), "转弯数", "🔵"],
              [`${data?.verticalDropM ?? 3559} m`, "落差", "🟣"],
              [`${data?.maxSlopeDeg ?? 29}°`, "最大坡度", "🟠"],
              [`${data?.maxSpeedKmh ?? 120} km/h`, "最大速度", "🟢"],
            ].map((x) => (
              <View style={s.stat} key={x[1]}>
                <Text style={s.statValue}>{x[0]}</Text>
                <Text style={s.muted}>
                  {x[2]} {x[1]}
                </Text>
              </View>
            ))}
          </View>
        </Card>
        <Card>
          <Head>换刃分析</Head>
          <View style={s.segments}>
            {["#348bed", "#8ccff8", "#80d0cc", "#a95aed"].map((c, i) => (
              <View
                key={c}
                style={{ flex: [3, 2, 1.3, 1.5][i], backgroundColor: c }}
              />
            ))}
          </View>
          <Text style={s.legend}>🔵 犁式 🔹 平行 🟢 小弯 🟣 卡宾</Text>
          <View style={s.triple}>
            {[
              ["♧", "频率", "120 TPM"],
              ["〰", "通过", "9.1 M"],
              ["◕", "半径", "17.7 M"],
            ].map((x) => (
              <View style={s.tile} key={x[1]}>
                <Text style={s.icon}>{x[0]}</Text>
                <Text style={s.muted}>{x[1]}</Text>
                <Text style={s.tileValue}>{x[2]}</Text>
              </View>
            ))}
          </View>
        </Card>
        <Card>
          <Head>滑行指标</Head>
          {visibleMetrics.map(([label, value, pct]) => (
            <View key={label} style={s.metric}>
              <View style={s.row}>
                <Text style={s.metricText}>{label}</Text>
                <Text style={s.metricText}>{value}</Text>
              </View>
              <View style={s.track}>
                <View
                  style={[
                    s.fill,
                    { width: `${Math.max(0, Math.min(100, pct))}%` },
                  ]}
                />
                <View style={s.target} />
              </View>
            </View>
          ))}
        </Card>
        <TouchableOpacity
          onPress={() =>
            Brownfield.sendMessage({ type: "openPage", page: "AiAnalysis" })
          }
        >
          <Card>
            <Head>AI分析 ›</Head>
            <Text style={[s.muted, { marginTop: 24 }]}>立刃角度</Text>
          </Card>
        </TouchableOpacity>
        <Card>
          <Head>3D回放</Head>
          <View style={s.replay}>
            <Text style={{ fontSize: 80 }}>⛷️</Text>
            <Text style={s.play}>▶</Text>
          </View>
        </Card>
        <Card>
          <Head>专业数据分析 立刃角度⌄</Head>
          <Text style={s.legend}>🔵 立刃角度 🟠 角速度 🔴 转弯结束</Text>
          <View style={s.chart}>
            {[30, 55, 38, 72, 44, 63, 34, 58, 76, 48, 62].map((h, i) => (
              <View key={i} style={[s.bar, { height: h }]} />
            ))}
          </View>
          <Text style={s.axis}>16:15 16:20 16:25 16:30 16:35</Text>
        </Card>
        <Card>
          <View style={s.row}>
            {[
              ["开始时间", data?.startTime ?? "3:15 下午"],
              ["结束时间", data?.endTime ?? "3:25 下午"],
              ["最高海拔", `${data?.maxAltitudeM ?? 3559} m`],
            ].map((x) => (
              <View key={x[0]}>
                <Text style={s.muted}>{x[0]}</Text>
                <Text style={s.metricText}>{x[1]}</Text>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#e9f3fc" },
  top: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  topTitle: { color: "#293e58", fontWeight: "800", fontSize: 16 },
  back: { color: "#293e58", fontSize: 30 },
  content: { padding: 16, paddingBottom: 36, gap: 14 },
  card: { backgroundColor: "#fff", borderRadius: 22, padding: 18 },
  head: { fontSize: 16, fontWeight: "800", color: "#293e58" },
  resort: {
    fontSize: 15,
    fontWeight: "700",
    color: "#293e58",
    marginBottom: 10,
  },
  muted: { fontSize: 11, fontWeight: "600", color: "#99adbe" },
  hero: {
    backgroundColor: "#f7f8fa",
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
  },
  big: { fontSize: 40, fontWeight: "800", color: "#243a54" },
  small: { fontSize: 11 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  stat: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#f7f8fa",
    borderRadius: 14,
    padding: 11,
  },
  statValue: {
    fontSize: 17,
    fontWeight: "800",
    color: "#293e58",
    marginBottom: 5,
  },
  segments: {
    height: 10,
    flexDirection: "row",
    gap: 2,
    overflow: "hidden",
    borderRadius: 8,
    marginTop: 17,
  },
  legend: { color: "#8298ad", fontSize: 11, marginTop: 12, marginBottom: 14 },
  triple: { flexDirection: "row", gap: 10 },
  tile: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#f7f8fa",
  },
  icon: { fontSize: 23, color: "#3973ba" },
  tileValue: { fontWeight: "800", color: "#293e58", marginTop: 4 },
  metric: { marginTop: 19 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  metricText: { fontSize: 13, fontWeight: "700", color: "#425b75" },
  track: {
    height: 10,
    backgroundColor: "#dae7f0",
    borderRadius: 7,
    marginTop: 9,
    overflow: "hidden",
  },
  fill: { height: 10, backgroundColor: "#2860a8", borderRadius: 7 },
  target: {
    position: "absolute",
    left: "70%",
    width: 30,
    height: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderRadius: 5,
    borderColor: "#243a54",
  },
  replay: { height: 180, alignItems: "center", justifyContent: "center" },
  play: { position: "absolute", color: "#fff", fontSize: 22 },
  chart: {
    height: 105,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#e4edf3",
  },
  bar: { width: 4, borderRadius: 3, backgroundColor: "#4191ea" },
  axis: { textAlign: "center", color: "#98adbe", fontSize: 10, marginTop: 8 },
});
