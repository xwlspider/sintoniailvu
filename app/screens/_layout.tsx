import { Tabs } from "expo-router";
import { View, Text, StyleSheet, Platform } from "react-native";

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={styles.tabItem}>
      <Text style={[styles.emoji, focused && styles.emojiFocused]}>{emoji}</Text>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      {focused && <View style={styles.dot} />}
    </View>
  );
}

export default function ScreensLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.bar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label=""   focused={focused} /> }}
      />
      <Tabs.Screen
        name="WheelScreen"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🎡" label=""   focused={focused} /> }}
      />
      <Tabs.Screen
        name="MoodScreen"
        options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🌈" label="" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: "rgba(13,10,14,0.96)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    height: Platform.OS === "ios" ? 84 : 68,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: -40,
    elevation: 0,
  },
  tabItem:      { alignItems: "center", justifyContent: "center", gap: 3, paddingTop: 4 },
  emoji:        { fontSize: 22, opacity: 0.4 },
  emojiFocused: { opacity: 1 },
  label:        { fontSize: 9, letterSpacing: 1, color: "rgba(240,235,227,0.3)" },
  labelFocused: { color: "#FF6B9D" },
  dot:          { width: 4, height: 4, borderRadius: 2, backgroundColor: "#FF6B9D", marginTop: 2 },
});