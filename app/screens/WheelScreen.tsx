import { useRef, useState } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, Easing, Platform, ScrollView,
} from "react-native";
import { DATE_IDEAS, DateIdea } from "../../data/dateIdeas";
import { CATEGORIA_COLORS, WHEEL_COLORS } from "../../data/constants";
import React from "react";


const WHEEL_SIZE  = 280;
const SLICE_COUNT = DATE_IDEAS.length;
const SLICE_DEG   = 360 / SLICE_COUNT;  // 45° por segmento
const RADIUS      = WHEEL_SIZE * 0.33;

function getPos(index: number) {
  const rad = ((index * SLICE_DEG) - 90) * (Math.PI / 180);
  return { x: RADIUS * Math.cos(rad), y: RADIUS * Math.sin(rad) };
}

export default function WheelScreen() {
  const [spinning, setSpinning] = useState(false);
  const [result,   setResult]   = useState<DateIdea | null>(null);
  const [hasSpun,  setHasSpun]  = useState(false);

  // Usamos un valor que siempre crece — nunca reseteamos a 0
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const currentDeg = useRef(0);

  const spin = () => {
    if (spinning) return;
  
    setSpinning(true);
    setResult(null);
  
    // Giro aleatorio libre (no forzamos índice)
    const extraSpin = 1440 + Math.random() * 360;
    const newDeg = currentDeg.current + extraSpin;
    currentDeg.current = newDeg;
  
    Animated.timing(rotateAnim, {
      toValue: newDeg,
      duration: 2400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
  
      

    const normalized = newDeg % 360;

    // Como la ruleta gira en sentido horario, calculamos la distancia inversa.
    // Usamos Math.round para seleccionar el elemento cuyo centro está más cerca del puntero.
    const index = Math.round((360 - normalized) / SLICE_DEG) % SLICE_COUNT;

setResult(DATE_IDEAS[index]);
      setSpinning(false);
      setHasSpun(true);
    });
  };

  // interpolate con el rango actual para que siempre sea correcto
  const rotate = rotateAnim.interpolate({
    inputRange:  [0, currentDeg.current === 0 ? 360 : currentDeg.current],
    outputRange: ["0deg", currentDeg.current === 0 ? "360deg" : `${currentDeg.current}deg`],
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>La Ruleta</Text>
      <Text style={styles.subtitle}>Sin indecisiones — el destino decide</Text>

      <View style={styles.wheelWrapper}>
        {/* Puntero arriba */}
        <View style={styles.pointer} />

        {/* Disco giratorio */}
        <Animated.View style={[styles.wheel, { transform: [{ rotate }] }]}>
          <View style={styles.disc} />
          {DATE_IDEAS.map((idea, i) => {
            const { x, y } = getPos(i);
            return (
              <View
                key={idea.id}
                style={[
                  styles.slice,
                  {
                    backgroundColor: WHEEL_COLORS[i % WHEEL_COLORS.length],
                    transform: [{ translateX: x }, { translateY: y }],
                  },
                ]}
              >
                <Text style={styles.sliceEmoji}>{idea.icono}</Text>
              </View>
            );
          })}
          <View style={styles.cap} />
        </Animated.View>

        {/* Botón central */}
        <TouchableOpacity
          style={styles.centerBtn}
          onPress={spin}
          disabled={spinning}
          activeOpacity={0.8}
        >
          <Text style={styles.centerBtnText}>{spinning ? "⏳" : "💫"}</Text>
        </TouchableOpacity>
      </View>

      {/* Botón girar */}
      <TouchableOpacity
        style={[styles.spinBtn, spinning && { opacity: 0.4 }]}
        onPress={spin}
        disabled={spinning}
        activeOpacity={0.8}
      >
        <Text style={styles.spinBtnText}>
          {spinning ? "Girando..." : hasSpun ? "Girar de nuevo" : "Girar la ruleta"}
        </Text>
      </TouchableOpacity>

      {/* Resultado */}
      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultIcon}>{result.icono}</Text>
          <Text style={[styles.resultCat, { color: CATEGORIA_COLORS[result.categoria] }]}>
            {result.categoria}
          </Text>
          <Text style={styles.resultText}>{result.actividad}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: "#0D0A0E" },
  content:       { paddingHorizontal: 28, paddingTop: 72, paddingBottom: 110, alignItems: "center" },
  title:         { fontSize: 36, fontWeight: "300", color: "#F0EBE3", fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", alignSelf: "flex-start", marginBottom: 4 },
  subtitle:      { fontSize: 13, color: "rgba(240,235,227,0.4)", alignSelf: "flex-start", marginBottom: 40 },
  wheelWrapper:  { width: WHEEL_SIZE, height: WHEEL_SIZE, alignItems: "center", justifyContent: "center", marginBottom: 32 },
  pointer:       { position: "absolute", top: -10, zIndex: 30, width: 0, height: 0, borderLeftWidth: 10, borderRightWidth: 10, borderTopWidth: 20, borderLeftColor: "transparent", borderRightColor: "transparent", borderTopColor: "#FF6B9D" },
  wheel:         { width: WHEEL_SIZE, height: WHEEL_SIZE, alignItems: "center", justifyContent: "center" },
  disc:          { position: "absolute", width: WHEEL_SIZE, height: WHEEL_SIZE, borderRadius: WHEEL_SIZE / 2, backgroundColor: "#1A1520", borderWidth: 2, borderColor: "rgba(255,255,255,0.06)" },
  slice:         { position: "absolute", width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", opacity: 0.9 },
  sliceEmoji:    { fontSize: 22 },
  cap:           { position: "absolute", width: 64, height: 64, borderRadius: 32, backgroundColor: "#0D0A0E", borderWidth: 2, borderColor: "rgba(255,255,255,0.08)", zIndex: 10 },
  centerBtn:     { position: "absolute", width: 56, height: 56, borderRadius: 28, backgroundColor: "#0D0A0E", borderWidth: 2, borderColor: "rgba(255,107,157,0.4)", alignItems: "center", justifyContent: "center", zIndex: 20 },
  centerBtnText: { fontSize: 22 },
  spinBtn:       { width: "100%", paddingVertical: 18, backgroundColor: "rgba(255,107,157,0.1)", borderWidth: 1, borderColor: "rgba(255,107,157,0.3)", borderRadius: 14, alignItems: "center", marginBottom: 24 },
  spinBtnText:   { color: "#FF6B9D", fontSize: 13, letterSpacing: 2, fontWeight: "500", textTransform: "uppercase" },
  resultCard:    { width: "100%", backgroundColor: "rgba(255,107,157,0.07)", borderWidth: 1, borderColor: "rgba(255,107,157,0.2)", borderRadius: 20, padding: 28, alignItems: "center" },
  resultIcon:    { fontSize: 40, marginBottom: 12 },
  resultCat:     { fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 },
  resultText:    { fontSize: 22, fontWeight: "300", color: "#F0EBE3", textAlign: "center", fontFamily: Platform.OS === "ios" ? "Georgia" : "serif", lineHeight: 30 },
});