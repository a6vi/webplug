import AddrIcon from "@/assets/icon/addr.svg";
import BjIcon from "@/assets/icon/bj.svg";
import LcIcon from "@/assets/icon/hx-lc.svg";
import ZdpdIcon from "@/assets/icon/hx-zdpd.svg";
import ZdsdIcon from "@/assets/icon/hx-zdsd.svg";
import ZwIcon from "@/assets/icon/hx-zw.svg";
import PlIcon from "@/assets/icon/pl.svg";
import TdIcon from "@/assets/icon/td.svg";
import TyIcon from "@/assets/icon/ty.svg";
import {
  fontScale,
  moderateScale,
  scale,
  verticalScale,
} from "@/utils/scale.js";
import * as Brownfield from "expo-brownfield";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NATIVE_DATA_KEYS, type SkiData } from "../native-data";

const metrics: [string, string, number, string][] = [
  ["立刃角度", "32", 55, "°"],
  ["双板平行", "32", 34, "%"],
  ["弯形圆润", "32", 62, "%"],
  ["弯形闭合", "32", 26, "%"],
  ["更早立刃", "32", 72, "%"],
  ["G-FORCE", "0.3", 35, "g"],
  ["重心释放", "0.3", 48, "%"],
  ["外腿承重", "0.3", 86, "%"],
  ["重心居中", "0.3", 19, "%"],
  ["重心建立", "0.3", 37, "%"],
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
      (m) =>
        [m.label, m.value, m.percent, m.unit] as [
          string,
          string,
          number,
          string,
        ],
    ) ?? metrics;
  const trailNames = data?.trailNames ?? [];
  const bladeView = data?.bladeView ?? [0, 0, 0, 0];
  return (
    <SafeAreaView style={s.body} edges={["top"]}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Card>
          <View style={[s.fxfc, s.p2]}>
            <AddrIcon width={scale(12)} height={verticalScale(16)} />
            <Text style={[s.f16, s.cblack, s.fw, s.ml6]}>
              {data?.resortName ?? "无"}
            </Text>
          </View>
          <View style={s.mt12}>
            {trailNames.map((v, i) => (
              <View style={s.fxfc} key={i}>
                <View style={[s.point, s.bgred, s.m6]}></View>
                <Text style={[s.f12, s.cgray]}>{v}</Text>
              </View>
            ))}
          </View>
        </Card>
        <Card>
          <View style={[s.bggray, s.py8, s.px16, s.br16, s.mb16]}>
            <Text style={s.f12}>
              <Text style={s.cgray}>滑行 </Text>
              <Text style={s.cblack}>{data?.duration ?? "无"}</Text>
            </Text>
            <Text>
              <Text style={[s.f42, s.fw, s.cblack]}>
                {data?.distanceKm ?? 0}
              </Text>
              <Text style={[s.f12, s.cblack]}> km</Text>
            </Text>
          </View>
          <View style={s.grid}>
            <View style={[s.px12, s.py8, s.bggray, s.br14, s.w50]}>
              <Text style={[s.f16, s.fw, s.cblack, s.mb6]}>
                {data?.turns || 0}
              </Text>
              <View style={s.fxfc}>
                <ZwIcon style={s.mr4} width={12} />
                <Text style={s.cgray}>转弯数</Text>
              </View>
            </View>
            <View style={[s.px12, s.py8, s.bggray, s.br14, s.w50]}>
              <Text style={[s.f16, s.fw, s.cblack, s.mb6]}>
                {data?.verticalDropM || 0}
                <Text style={s.f10}> m</Text>
              </Text>
              <View style={s.fxfc}>
                <LcIcon style={s.mr4} width={12} />
                <Text style={s.cgray}>落差</Text>
              </View>
            </View>
            <View style={[s.px12, s.py8, s.bggray, s.br14, s.w50]}>
              <Text style={[s.f16, s.fw, s.cblack, s.mb6]}>
                {data?.maxSlopeDeg || 0}°
              </Text>
              <View style={s.fxfc}>
                <ZdpdIcon style={s.mr4} width={12} />
                <Text style={s.cgray}>最大坡度</Text>
              </View>
            </View>
            <View style={[s.px12, s.py8, s.bggray, s.br14, s.w50]}>
              <Text style={[s.f16, s.fw, s.cblack, s.mb6]}>
                {data?.maxSpeedKmh || 0}
                <Text style={s.f10}> km/h</Text>
              </Text>
              <View style={s.fxfc}>
                <ZdsdIcon style={s.mr4} width={12} />
                <Text style={s.cgray}>最大速度</Text>
              </View>
            </View>
          </View>
        </Card>
        <Card>
          <Head>换刃分析</Head>
          <View style={s.segments}>
            <View style={[{ flex: bladeView[0] || 0.01 }, s.bgblue1]}></View>
            <View style={[{ flex: bladeView[1] || 0.01 }, s.bgblue2]}></View>
            <View style={[{ flex: bladeView[2] || 0.01 }, s.bggreen]}></View>
            <View style={[{ flex: bladeView[3] || 0.01 }, s.bgpurple]}></View>
          </View>
          <View style={[s.fxfc, s.my16]}>
            <View style={s.linetag}>
              <View style={[s.point1, s.m4, s.bgblue1]}></View>
              <Text style={[s.ml6, s.f14]}>犁式</Text>
            </View>
            <View style={s.linetag}>
              <View style={[s.point1, s.m4, s.bgblue2]}></View>
              <Text style={[s.ml6, s.f14]}>平行</Text>
            </View>
            <View style={s.linetag}>
              <View style={[s.point1, s.m4, s.bggreen]}></View>
              <Text style={[s.ml6, s.f14]}>小弯</Text>
            </View>
            <View style={s.linetag}>
              <View style={[s.point1, s.m4, s.bgpurple]}></View>
              <Text style={[s.ml6, s.f14]}>卡宾</Text>
            </View>
          </View>
          <View style={s.fxcc}>
            <View style={[s.fxrows, s.br14, s.bggray, s.p16]}>
              <PlIcon />
              <Text style={[s.cgray, s.mt12]}>频率</Text>
              <Text style={[s.m4]}>
                <Text style={[s.f16, s.fw, s.cblack]}>
                  {data?.bladeFrequency || 0}
                </Text>
                <Text style={[s.f10, s.cblack]}> TPM</Text>
              </Text>
            </View>
            <View style={[s.fxrows, s.br14, s.bggray, s.p16]}>
              <TdIcon />
              <Text style={[s.cgray, s.mt12]}>通道</Text>
              <Text style={[s.m4]}>
                <Text style={[s.f16, s.fw, s.cblack]}>
                  {data?.bladeChannel || 0}
                </Text>
                <Text style={[s.f10, s.cblack]}> M</Text>
              </Text>
            </View>
            <View style={[s.fxrows, s.br14, s.bggray, s.p16]}>
              <BjIcon />
              <Text style={[s.cgray, s.mt12]}>半径</Text>
              <Text style={[s.m4]}>
                <Text style={[s.f16, s.fw, s.cblack]}>
                  {data?.bladeRadius || 0}
                </Text>
                <Text style={[s.f10, s.cblack]}> M</Text>
              </Text>
            </View>
          </View>
        </Card>
        <Card>
          <Head>滑行指标</Head>
          {visibleMetrics.map(([label, value, pct, unit]) => (
            <View key={label} style={s.mt16}>
              <View style={s.fxbc}>
                <Text style={[s.f14, s.cblack]}>{label}</Text>
                <Text>
                  <Text style={[s.f16, s.fw, s.cblack]}>{value}</Text>
                  <Text style={[s.f10, s.cblack]}>{unit}</Text>
                </Text>
              </View>
              <View style={[s.h12, s.my8]}>
                <ImageBackground source={require("./linebg.png")}>
                  <View
                    style={[
                      s.bgblue,
                      s.h12,
                      s.br14,
                      { width: `${Math.max(0, Math.min(100, pct))}%` },
                    ]}
                  />
                </ImageBackground>
                <TyIcon style={s.mark} />
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
            <Head>AI分析</Head>
            <Text style={[s.my16, s.cgray]}>立刃角度</Text>
          </Card>
        </TouchableOpacity>
        <Card>
          <Head>3D回放</Head>
          <Image
            style={s.cardimg}
            source={require("./3d.png")}
            resizeMode="contain"
          />
        </Card>
        <Card>
          <Head>专业数据分析</Head>
          <Image
            source={require("./sjfx.png")}
            style={s.cardimg}
            resizeMode="contain"
          />
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
          <View style={s.grid}></View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  // 字体
  f10: { fontSize: fontScale(10) },
  f12: { fontSize: fontScale(12), lineHeight: verticalScale(20) },
  f14: { fontSize: fontScale(14) },
  f16: { fontSize: fontScale(16), lineHeight: verticalScale(20) },
  f42: { fontSize: fontScale(42), lineHeight: verticalScale(50) },
  fw: { fontWeight: "800" },
  // 字体颜色
  cgray: { color: "#93A8B8" },
  cblack: { color: "#152A46" },
  // 间距
  my16: {
    marginVertical: verticalScale(16),
  },
  my14: {
    marginVertical: verticalScale(14),
  },
  my8: {
    marginVertical: verticalScale(8),
  },
  mx4: {
    marginInline: scale(4),
  },
  ml6: {
    marginLeft: scale(6),
  },
  m6: {
    margin: scale(6.38),
  },
  m4: {
    margin: scale(4),
  },
  mr4: {
    marginRight: scale(4),
  },
  mt12: {
    marginTop: verticalScale(12),
  },
  mt16: {
    marginTop: verticalScale(16),
  },
  mb16: {
    marginBottom: verticalScale(16),
  },
  mb6: {
    marginBottom: verticalScale(6),
  },
  p2: {
    padding: moderateScale(2),
  },
  p6: {
    padding: moderateScale(6.38),
  },
  py8: {
    paddingVertical: verticalScale(8),
  },
  p16: {
    padding: scale(16),
  },
  px16: {
    paddingInline: scale(16),
  },
  px12: {
    paddingInline: scale(12),
  },
  br16: {
    borderRadius: scale(16),
  },
  br14: {
    borderRadius: scale(14),
  },
  w50: {
    width: "48%",
  },
  w100: {
    width: "100%",
  },
  h12: {
    height: verticalScale(12),
  },
  // 背景
  bgwhite: { backgroundColor: "#FFFFFF" },
  bggray: { backgroundColor: "#F7F7F7" },
  bgblue: { backgroundColor: "#2A62AD" },
  bgblue1: { backgroundColor: "#3C84F0" },
  bgblue2: { backgroundColor: "#83D0FA" },
  bggreen: { backgroundColor: "#82D1CB" },
  bgpurple: { backgroundColor: "#B461ED" },
  bgred: { backgroundColor: "#C9453F" },
  // 布局
  fxfc: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
  },
  fxcc: {
    flexDirection: "row",
    gap: 10,
  },
  fxbc: { flexDirection: "row", justifyContent: "space-between" },
  fxrows: {
    flex: 1,
    alignItems: "center",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  body: {
    flex: 1,
    paddingHorizontal: moderateScale(16),
    backgroundColor: "#e9f3fc",
  },
  content: { paddingBottom: 36, gap: 14 },
  card: { backgroundColor: "#fff", borderRadius: 22, padding: 18 },
  point: { width: scale(7.23), height: scale(7.23), borderRadius: scale(7.23) },
  point1: { width: scale(8), height: scale(8), borderRadius: scale(8) },
  segments: {
    height: 10,
    flexDirection: "row",
    gap: 2,
    overflow: "hidden",
    borderRadius: 8,
    marginTop: 17,
  },
  mark: {
    position: "absolute",
    right: "13%",
    top: -verticalScale(4),
    height: verticalScale(18),
  },
  cardimg: {
    width: "100%",
    height: verticalScale(296),
  },
  // --old--
  top: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  topTitle: { color: "#293e58", fontWeight: "800", fontSize: 16 },
  back: { color: "#293e58", fontSize: 30 },
  head: { fontSize: 16, fontWeight: "800", color: "#293e58" },
  skiname: {
    backgroundColor: "#f7f8fa",
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  svgicon: {},
  resort: {
    fontSize: 16,
    fontWeight: "700",
    color: "#293e58",
    marginLeft: 8,
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  muted: {},
  linetxt: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
  },
  linetag: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  linepoint: {
    width: 7,
    height: 7,
    borderRadius: 7,
    overflow: "hidden",
    backgroundColor: "#C9453F",
    marginLeft: 10,
    marginRight: 10,
  },
  linebigpoint: {
    width: 8,
    height: 8,
    borderRadius: 8,
    overflow: "hidden",
    marginLeft: 10,
    marginRight: 10,
  },
  linename: {
    fontSize: 12,
    color: "#93A8B8",
  },
  hero: {
    backgroundColor: "#f7f8fa",
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
  },
  hxsvg: {
    marginRight: 4,
  },
  big: { fontSize: 40, fontWeight: "800", color: "#243a54" },
  small: { fontSize: 11 },
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
