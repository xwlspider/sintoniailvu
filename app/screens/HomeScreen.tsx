import { View, Text, ScrollView, StyleSheet, Platform } from "react-native";
import { useAuth } from "../_layout";

export default function HomeScreen() {
  const { user } = useAuth();
  if (!user) return null;

  const hour    = new Date().getHours();
  const greeting =
    hour < 12 ? "Buenos días" :
    hour < 19 ? "Buenas tardes" :
    "Buenas noches";

  const dateStr = new Date().toLocaleDateString("es-ES", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.pre}>{greeting}</Text>
      <Text style={styles.greeting}>
        Hola, <Text style={styles.name}>{user.name}</Text>
      </Text>
      <Text style={styles.date}>{dateStr}</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>TU ESPACIO PRIVADO CON</Text>
        <Text style={styles.cardValue}>💕  {user.partner}</Text>
      </View>

      <Text style={styles.divider}>♡  ♡  ♡</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>SINTONÍA TE PERMITE</Text>
        {[
          ["🎡", "Decidir su próxima cita sin debatirlo"],
          ["🌈", "Comunicar cómo te sientes sin palabras"],
          ["🔒", "Solo dos personas, cero ruido"],
        ].map(([icon, text]) => (
          <View key={text} style={styles.row}>
            <Text style={styles.rowIcon}>{icon}</Text>
            <Text style={styles.rowText}>{text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0A0E" },
  content:   { paddingHorizontal: 28, paddingTop: 72, paddingBottom: 110 },
  pre:       { fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "rgba(240,235,227,0.35)", marginBottom: 6 },
  greeting:  { fontSize: 44, fontWeight: "300", color: "#F0EBE3", fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", marginBottom: 6 },
  name:      { fontStyle: "italic", color: "#FF6B9D" },
  date:      { fontSize: 13, color: "rgba(240,235,227,0.35)", textTransform: "capitalize", marginBottom: 48 },
  card:      { backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)", borderRadius: 20, padding: 24, marginBottom: 16 },
  cardLabel: { fontSize: 10, letterSpacing: 2, color: "rgba(240,235,227,0.35)", marginBottom: 12 },
  cardValue: { fontSize: 22, fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", color: "#F0EBE3" },
  divider:   { textAlign: "center", fontSize: 20, color: "rgba(240,235,227,0.15)", letterSpacing: 12, marginVertical: 24 },
  row:       { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  rowIcon:   { fontSize: 18 },
  rowText:   { fontSize: 14, color: "rgba(240,235,227,0.65)", flex: 1, lineHeight: 20 },
});