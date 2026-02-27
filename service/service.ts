import { JSONBIN_CONFIG, MoodType } from "../data/constants";

export interface MoodData {
  usuario1: MoodType;
  usuario2: MoodType;
  ultimaActualizacion: string;
}

export const MoodService = {

  async getMoods(): Promise<MoodData | null> {
    console.log("BIN_ID:", JSONBIN_CONFIG.BIN_ID);
    console.log("API_KEY:", JSONBIN_CONFIG.API_KEY ? "existe" : "vacía");
    try {
      const res = await fetch(
        `${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}/latest`,
        { headers: { "X-Access-Key": JSONBIN_CONFIG.API_KEY } }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return data.record as MoodData;
    } catch (e) {
      console.error("getMoods error:", e);
      return null;
    }
  },

  async updateMyMood(newMood: MoodType, isUser1: boolean): Promise<boolean> {
    try {
      const current = await this.getMoods();
      if (!current) return false;
      const updated: MoodData = {
        ...current,
        [isUser1 ? "usuario1" : "usuario2"]: newMood,
        ultimaActualizacion: new Date().toISOString(),
      };
      const res = await fetch(
        `${JSONBIN_CONFIG.BASE_URL}/${JSONBIN_CONFIG.BIN_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Key": JSONBIN_CONFIG.API_KEY,
          },
          body: JSON.stringify(updated),
        }
      );
      return res.ok;
    } catch (e) {
      console.error("updateMyMood error:", e);
      return false;
    }
  },
};