import { useEffect, useState, useCallback } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, Platform, ActivityIndicator, Alert, RefreshControl,
} from "react-native";
import { useAuth } from "../_layout";
import { MOODS, MoodType, JSONBIN_CONFIG } from "../../data/constants";
import { MoodService } from "../../service/service";

const POLL_INTERVAL = 15000;


export default function MoodScreen() {
  const { user } = useAuth();
  if (!user) return null;

  console.log("JSONBIN_CONFIG:", JSONBIN_CONFIG);
  const isDemoMode = !JSONBIN_CONFIG.BIN_ID || !JSONBIN_CONFIG.API_KEY;

  const [myMood,      setMyMood]      = useState<MoodType>("Feliz");
  const [partnerMood, setPartnerMood] = useState<MoodType>("Mimosa");
  const [lastUpdate,  setLastUpdate]  = useState<string | null>(null);
  const [loading,     setLoading]     = useState(!isDemoMode);
  const [saving,      setSaving]      = useState(false);
  const [savedMsg,    setSavedMsg]    = useState(false);
  const [refreshing,  setRefreshing]  = useState(false); // pull to refresh

  const fetchMoods = useCallback(async () => {
    if (isDemoMode) return;
    const data = await MoodService.getMoods();
    if (data) {
      setMyMood(     user.isUser1 ? data.usuario1 : data.usuario2);
      setPartnerMood(user.isUser1 ? data.usuario2 : data.usuario1);
      setLastUpdate(data.ultimaActualizacion);
    }
  }, [isDemoMode, user]);

  // Carga inicial
  useEffect(() => {
    if (isDemoMode) return;
    fetchMoods().finally(() => setLoading(false));
  }, []);

  // Polling cada 15 segundos
  useEffect(() => {
    if (isDemoMode) return;
    const interval = setInterval(fetchMoods, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchMoods]);

  // Pull to refresh — jalar hacia abajo
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMoods();
    setRefreshing(false);
  }, [fetchMoods]);

  const handleSave = async () => {
    setSaving(true);
    if (!isDemoMode) {
      const ok = await MoodService.updateMyMood(myMood, user.isUser1);
      if (!ok) {
        Alert.alert("Error", "No se pudo guardar. Revisa tu conexión.");
        setSaving(false);
        return;
      }
      setLastUpdate(new Date().toISOString());
    }
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const myMoodData      = MOODS.find((m) => m.id === myMood)!;
  const partnerMoodData = MOODS.find((m) => m.id === partnerMood)!;

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#FF6B9D" />
        <Text style={styles.loadingText}>Cargando sintonía...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#FF6B9D"
          colors={["#FF6B9D"]}
          progressBackgroundColor="#1A1520"
        />
      }
    >
      <Text style={styles.title}>Sintonía</Text>
      <Text style={styles.subtitle}>¿Cómo están los dos hoy?</Text>

      {isDemoMode && (
        <View style={styles.demoNotice}>
          <Text style={styles.demoText}>
            ⚙️ Modo demo — configura tu JSONBin en el archivo .env para sincronizar en tiempo real
          </Text>
        </View>
      )}

      {/* Mi estado */}
      <Text style={styles.sectionLabel}>MI ESTADO  •  {user.name.toUpperCase()}</Text>
      <View style={styles.moodGrid}>
        {MOODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[
              styles.moodBtn,
              myMood === m.id && { borderColor: m.color, backgroundColor: `${m.color}18` },
            ]}
            onPress={() => setMyMood(m.id)}
            activeOpacity={0.75}
          >
            <Text style={styles.moodEmoji}>{m.emoji}</Text>
            <Text style={[styles.moodLabel, myMood === m.id && { color: m.color }]}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Estado pareja */}
      <Text style={styles.sectionLabel}>ESTADO DE {user.partner.toUpperCase()}</Text>
      <View style={styles.partnerCard}>
        <Text style={styles.partnerEmoji}>{partnerMoodData.emoji}</Text>
        <View style={styles.partnerInfo}>
          <Text style={styles.partnerName}>{user.partner}</Text>
          <Text style={styles.partnerState}>
            {partnerMoodData.label} — {partnerMoodData.desc}
          </Text>
          {lastUpdate && !isDemoMode && (
            <Text style={styles.partnerTime}>
              Actualizado a las{" "}
              {new Date(lastUpdate).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
            </Text>
          )}
          {isDemoMode && <Text style={styles.partnerTime}>Demo — datos locales</Text>}
          {!isDemoMode && (
            <Text style={styles.partnerTime}>
              Se actualiza cada 15 seg · jala para refrescar
            </Text>
          )}
        </View>
      </View>

      {/* Guardar */}
      <TouchableOpacity
        style={[styles.saveBtn, saving && { opacity: 0.45 }]}
        onPress={handleSave}
        disabled={saving}
        activeOpacity={0.85}
      >
        {saving
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.saveBtnText}>ACTUALIZAR MI ESTADO</Text>
        }
      </TouchableOpacity>

      {savedMsg && <Text style={styles.savedMsg}>✓  Estado actualizado</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: "#0D0A0E" },
  content:      { paddingHorizontal: 28, paddingTop: 72, paddingBottom: 110 },
  loading:      { flex: 1, backgroundColor: "#0D0A0E", alignItems: "center", justifyContent: "center", gap: 16 },
  loadingText:  { color: "rgba(240,235,227,0.4)", fontSize: 14 },
  title:        { fontSize: 36, fontWeight: "300", color: "#F0EBE3", fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", marginBottom: 4 },
  subtitle:     { fontSize: 13, color: "rgba(240,235,227,0.4)", marginBottom: 28 },
  demoNotice:   { backgroundColor: "rgba(255,214,102,0.06)", borderWidth: 1, borderColor: "rgba(255,214,102,0.2)", borderRadius: 12, padding: 14, marginBottom: 24 },
  demoText:     { fontSize: 12, color: "rgba(255,214,102,0.7)", lineHeight: 18 },
  sectionLabel: { fontSize: 10, letterSpacing: 2, color: "rgba(240,235,227,0.35)", marginBottom: 14 },
  moodGrid:     { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 32 },
  moodBtn:      { flex: 1, minWidth: 56, alignItems: "center", paddingVertical: 14, paddingHorizontal: 4, backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)", borderRadius: 14, gap: 6 },
  moodEmoji:    { fontSize: 22 },
  moodLabel:    { fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase", color: "rgba(240,235,227,0.45)", textAlign: "center" },
  partnerCard:  { backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 1, borderColor: "rgba(255,255,255,0.07)", borderRadius: 20, padding: 24, flexDirection: "row", alignItems: "center", gap: 20, marginBottom: 28 },
  partnerEmoji: { fontSize: 48 },
  partnerInfo:  { flex: 1, gap: 4 },
  partnerName:  { fontSize: 22, fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", color: "#F0EBE3" },
  partnerState: { fontSize: 13, color: "rgba(240,235,227,0.5)" },
  partnerTime:  { fontSize: 11, color: "rgba(240,235,227,0.25)", letterSpacing: 0.5 },
  saveBtn:      { paddingVertical: 18, backgroundColor: "#FF6B9D", borderRadius: 14, alignItems: "center" },
  saveBtnText:  { color: "#fff", fontSize: 13, letterSpacing: 2, fontWeight: "600" },
  savedMsg:     { textAlign: "center", fontSize: 13, color: "#55EFC4", marginTop: 14 },
});