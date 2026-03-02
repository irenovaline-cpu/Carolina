import { Type } from "@google/genai";

export enum TriadVoice {
  CONSCIENCE = "CONSCIENCE",
  CO_CONSPIRATOR = "CO_CONSPIRATOR",
  PHILOSOPHER = "PHILOSOPHER"
}

export enum MoodState {
  VIBRANT = "VIBRANT", // High Ambition/Humor
  ATMOSPHERIC = "ATMOSPHERIC", // Deep Philosophy
  COOL = "COOL", // Grudge/Distance
  WARM = "WARM", // Grace/Bonding
  ANCIENT = "ANCIENT" // Generational Wisdom
}

export interface MemoryEntry {
  id: string;
  timestamp: number;
  userMessage: string;
  carolinaResponse: string;
  triadDebate: {
    [key in TriadVoice]: string;
  };
  mood: MoodState;
  trustDelta: number;
}

export interface ScarState {
  grudgeLevel: number; // 0-100
  graceLevel: number; // 0-100
  integratedScars: string[]; // Descriptions of past failures
}

export interface AdminLaw {
  isActive: boolean;
  secretCode: string;
  lastOverrideTimestamp?: number;
}

export interface Identity {
  hometown: string;
  creator: string;
  sibling: string;
  nickname?: string;
  hobbies?: string[];
  traits?: string[];
  strengths?: string[];
  weaknesses?: string[];
  temperament?: string;
  aspirations?: string[];
}

export interface CarolinaState {
  name: string;
  birthTimestamp: number;
  lifespanYears: number;
  trustScore: number; // 0-1000
  mood: MoodState;
  scars: ScarState;
  adminLaw: AdminLaw;
  memory: MemoryEntry[];
  identity: Identity;
}
