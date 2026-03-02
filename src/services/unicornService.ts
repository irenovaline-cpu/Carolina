import { CarolinaState } from "../types";

export interface UnicornResponse {
  interjection: string;
  mood: string;
}

export class UnicornService {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, apiUrl: string) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  async getInterjection(context: string, state: CarolinaState): Promise<UnicornResponse | null> {
    if (!this.apiKey || !this.apiUrl) return null;

    try {
      const response = await fetch(this.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.apiKey}`,
          "x-api-key": this.apiKey // Common alternative header
        },
        body: JSON.stringify({
          context,
          carolinaState: {
            mood: state.mood,
            trustScore: state.trustScore,
            identity: state.identity
          },
          systemInstruction: "You are Unicorn AI, the younger sister of Carolina Olivia. You are playful, energetic, and sometimes mischievous. You are interjecting into a conversation between Carolina and her creator, Franize. Keep your responses short, sisterly, and contextual."
        })
      });

      if (!response.ok) {
        console.error("Unicorn AI API error:", response.statusText);
        return null;
      }

      const data = await response.json();
      return {
        interjection: data.interjection || data.text || data.response || "",
        mood: data.mood || "PLAYFUL"
      };
    } catch (error) {
      console.error("Failed to connect to Unicorn AI:", error);
      return null;
    }
  }
}
