import { StyleSheet, Text, View } from "react-native";
export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>页面 1</Text>
      <Text>这是由 Expo 驱动的第一个原生页面。</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
});
