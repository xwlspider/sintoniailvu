export interface UserProfile {
    username: string;
    password: string;
    name: string;
    partner: string;
    isUser1: boolean;
  }
  
  export const USERS: Record<string, UserProfile> = {
    "ale_x_chz": {
      username: "ale_x_chz",
      password: "Am0aMiNov14",
      name: "Alex",
      partner: "Emy",
      isUser1: true,
    },
    "emy.snt.p": {
      username: "emy.snt.p",
      password: "Am0aMiNov10",
      name: "Emy",
      partner: "Alex",
      isUser1: false,
    },
  };
  
  export type MoodType = "Feliz" | "Mimosa" | "Cansado" | "Enojado" | "Hambriento";
  
  export interface MoodOption {
    id: MoodType;
    emoji: string;
    label: string;
    color: string;
    desc: string;
  }
  
  export const MOODS: MoodOption[] = [
    { id: "Feliz",      emoji: "🌟", label: "Feliz",      color: "#FFD166", desc: "Todo está bien" },
    { id: "Mimosa",     emoji: "🥰", label: "Mimosa",     color: "#FF6B9D", desc: "Necesito mimos" },
    { id: "Cansado",    emoji: "😴", label: "Cansado",    color: "#74B9FF", desc: "Estoy agotado/a" },
    { id: "Enojado",    emoji: "🌧️", label: "Enojado",    color: "#A29BFE", desc: "Dame espacio" },
    { id: "Hambriento", emoji: "🍕", label: "Hambriento", color: "#55EFC4", desc: "¡Tengo hambre!" },
  ];
  export const JSONBIN_CONFIG = {
    API_KEY: process.env.EXPO_PUBLIC_JSONBIN_API_KEY || "", 
    BIN_ID: process.env.EXPO_PUBLIC_JSONBIN_BIN_ID || "",
    BASE_URL: "https://api.jsonbin.io/v3/b"
  };
  
  export const CATEGORIA_COLORS: Record<string, string> = {
    Aventura:    "#FF6B9D",
    Relajación:  "#74B9FF",
    Gastronomía: "#FFD166",
    Creatividad: "#A29BFE",
  };
  
  export const WHEEL_COLORS: string[] = [
    "#FF6B9D", "#FFD166", "#74B9FF", "#A29BFE",
    "#55EFC4", "#FDCB6E", "#FD79A8", "#6C5CE7",
  ];