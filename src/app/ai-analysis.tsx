import * as Brownfield from "expo-brownfield";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NATIVE_DATA_KEYS, type AiAnalysis } from "../native-data";

export default function AiAnalysisPage() {
  const [data] = Brownfield.useSharedState<AiAnalysis>(NATIVE_DATA_KEYS.aiAnalysis);
  const [question, setQuestion] = useState("怎么提高立刃角度");
  const [draft, setDraft] = useState("");
  const submit = () => {
    const value = draft.trim();
    if (!value) return;
    setQuestion(value);
    setDraft("");
    Brownfield.sendMessage({ type: "aiQuestion", question: value });
  };
  return (
    <SafeAreaView style={s.page}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.header}>
          <TouchableOpacity onPress={() => Brownfield.popToNative(true)}>
            <Text style={s.avatar}>🤖</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>Hi，我是SKI AI ~</Text>
            <Text style={s.sub}>随时为你答疑</Text>
          </View>
          <Text style={s.chevron}>›</Text>
        </View>
        <ScrollView
          contentContainerStyle={s.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={s.question}>{data?.question ?? question}</Text>
          <Text style={s.thought}>已思考（用时 5 秒）</Text>
          {data?.answer ? <Text style={s.body}>{data.answer}</Text> : <>
          <Text style={s.body}>
            “立刃角度”本质上就是滑雪时板刃（edge）与雪面之间的倾斜角度。角度越大，抓地力越强，刻滑（carving）越干净，但对技术要求也更高。
            {"\n"}
            下面我给你讲清楚怎么真正提高立刃角度（不是靠蛮力压，而是靠动作结构）：
          </Text>
          <View style={s.rule} />
          <Text style={s.h2}>一、核心思路（先纠正一个常见误区）</Text>
          <Text style={s.body}>
            很多人以为：{"\n"}👉 “用力压边 = 立刃角度大”{"\n\n"}其实不对。
            {"\n\n"}真正是：{"\n"}👉{" "}
            <Text style={s.bold}>
              身体侧倒（inclination）+ 关节调节（angulation）= 大立刃角
            </Text>
          </Text>
          <View style={s.rule} />
          <Text style={s.h2}>二、关键动作拆解</Text>
          <Text style={s.body}>
            1. <Text style={s.bold}>身体向内“倒”（Inclination）</Text>
          </Text>
          <View style={s.photos}>
            {["⛷️", "🎿", "⛷️"].map((x, i) => (
              <View
                key={i}
                style={[
                  s.photo,
                  { backgroundColor: ["#d8eeff", "#edf2f6", "#d2e4f3"][i] },
                ]}
              >
                <Text style={{ fontSize: 47 }}>{x}</Text>
              </View>
            ))}
          </View>
          <Text style={s.body}>
            ・进入弯道时，让身体整体向弯内“倒”{"\n"}・像骑摩托车过弯一样{"\n"}・
            <Text style={s.bold}>不是弯腰，是整个身体倾斜</Text>
            {"\n\n"}👉 作用：{"\n"}让滑雪板自然立起来（产生角度）
          </Text>
          </>}
        </ScrollView>
        <View style={s.inputRow}>
          <TextInput
            style={s.input}
            value={draft}
            onChangeText={setDraft}
            placeholder="按住说话或输入问题"
            placeholderTextColor="#9aaec0"
            onSubmitEditing={submit}
          />
          <TouchableOpacity
            style={s.send}
            onPress={submit}
          >
            <Text style={{ color: "#446480" }}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fff" },
  header: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#eef1f5",
  },
  avatar: {
    fontSize: 28,
    width: 48,
    height: 48,
    textAlign: "center",
    textAlignVertical: "center",
    backgroundColor: "#f4f8ff",
    borderRadius: 24,
  },
  name: { fontSize: 16, color: "#233951", fontWeight: "600" },
  sub: { fontSize: 12, color: "#a1b1c0", marginTop: 4 },
  chevron: { fontSize: 28, color: "#a3b3c1" },
  content: { padding: 20, paddingBottom: 32 },
  question: {
    alignSelf: "flex-end",
    backgroundColor: "#e5f2ff",
    padding: 14,
    borderRadius: 18,
    borderTopRightRadius: 4,
    color: "#293f57",
    fontSize: 16,
    marginBottom: 35,
  },
  thought: { fontSize: 14, color: "#99adbf", marginBottom: 20 },
  body: { fontSize: 16, lineHeight: 23, color: "#252b33" },
  rule: { height: 1, backgroundColor: "#edf0f3", marginVertical: 26 },
  h2: { fontSize: 16, fontWeight: "800", color: "#242b32", marginBottom: 24 },
  bold: { fontWeight: "800" },
  photos: { flexDirection: "row", gap: 7, marginVertical: 14 },
  photo: {
    width: "32%",
    height: 100,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eef1f5",
  },
  input: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#dbe5f1",
    borderRadius: 18,
    paddingHorizontal: 14,
    color: "#293e58",
    backgroundColor: "#f9fbff",
  },
  send: {
    height: 45,
    width: 45,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#dbe5f1",
    alignItems: "center",
    justifyContent: "center",
  },
});
