import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, Animated,
} from "react-native";
import { useRef, useState } from "react";
import { router } from "expo-router";
import { USERS } from "../data/constants";
import { useAuth } from "./_layout";
import React from "react";

export default function LoginScreen() {
  const { setUser } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const shakeAnim               = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue:  10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:  -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue:   0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = () => {
    const found = USERS[username.trim()];
    if (found && found.password === password) {
      setUser(found);
      router.replace("/screens/HomeScreen");
    } else {
      setError("Usuario o contraseña incorrectos");
      shake();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.brand}>Sintonía</Text>
      <Text style={styles.tagline}>Solo nosotros dos</Text>

      <Animated.View style={[styles.form, { transform: [{ translateX: shakeAnim }] }]}>
        <Text style={styles.label}>USUARIO</Text>
        <TextInput
          style={styles.input}
          placeholder="tu_usuario"
          placeholderTextColor="rgba(240,235,227,0.2)"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>CONTRASEÑA</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••••••"
          placeholderTextColor="rgba(240,235,227,0.2)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onSubmitEditing={handleLogin}
        />

        {error !== "" && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity style={styles.btn} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.btnText}>ENTRAR</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.hearts}>♡  ♡  ♡</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0A0E",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  brand: {
    fontSize: 52,
    fontWeight: "300",
    color: "#F0EBE3",
    letterSpacing: 4,
    marginBottom: 6,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  tagline: {
    fontSize: 12,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "rgba(240,235,227,0.4)",
    marginBottom: 56,
  },
  form:  { width: "100%" },
  label: { fontSize: 10, letterSpacing: 2, color: "rgba(240,235,227,0.4)", marginBottom: 8 },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: "#F0EBE3",
    fontSize: 15,
  },
  error:   { color: "#FF6B9D", fontSize: 13, textAlign: "center", marginTop: 14 },
  btn:     { marginTop: 24, backgroundColor: "#FF6B9D", borderRadius: 14, paddingVertical: 18, alignItems: "center" },
  btnText: { color: "#fff", fontSize: 13, letterSpacing: 2, fontWeight: "600" },
  hearts:  { position: "absolute", bottom: 48, fontSize: 20, color: "rgba(240,235,227,0.12)", letterSpacing: 16 },
});