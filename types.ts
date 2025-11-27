export interface UserProfile {
  name: string;
  birthDate: string; // ISO string
  birthTime: string; // HH:mm
  isSetup: boolean;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1-5
  moodNote: string;
  relationships: string;
  financeIncome: number;
  financeExpense: number;
  financeNote: string;
  healthStatus: string; // good, fair, poor
  healthNote: string;
  otherEvents: string;
}

export interface AlmanacData {
  date: string;
  ganZhi: string; // e.g., 甲辰年 丙寅月 戊午日
  solarTerm: string; // e.g., 雨水
  yi: string[]; // Auspicious
  ji: string[]; // Inauspicious
  description: string; // Short daily wisdom
}

export interface AIAnalysisResult {
  baziAnalysis: string; // Technical analysis
  advice: string; // Practical advice
  overallScore: number; // 0-100
}

export enum ViewState {
  HOME = 'HOME',
  JOURNAL = 'JOURNAL',
  SETTINGS = 'SETTINGS',
  ANALYSIS = 'ANALYSIS'
}