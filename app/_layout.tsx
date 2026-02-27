import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { createContext, useContext, useState } from "react";
import { UserProfile } from "../data/constants";
import React from "react";

interface AuthContextType {
  user: UserProfile | null;
  setUser: (u: UserProfile | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function RootLayout() {
  const [user, setUser] = useState<UserProfile | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#0D0A0E" },
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="screens" />
      </Stack>
    </AuthContext.Provider>
  );
}