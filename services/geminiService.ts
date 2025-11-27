import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AlmanacData, JournalEntry, UserProfile, AIAnalysisResult } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Schema for Almanac Data
const almanacSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ganZhi: { type: Type.STRING, description: "The Year, Month, and Day pillars (e.g. 甲辰年 丙寅月 戊午日)" },
    solarTerm: { type: Type.STRING, description: "Current or nearest solar term" },
    yi: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of auspicious activities (Yi)" },
    ji: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of inauspicious activities (Ji)" },
    description: { type: Type.STRING, description: "A poetic, short description of the day's energy in Chinese." },
  },
  required: ["ganZhi", "yi", "ji", "description"],
};

// Schema for Analysis Data
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    baziAnalysis: { type: Type.STRING, description: "Detailed analysis of the interaction (Clash/Harm/Combine) between user birth chart and today." },
    advice: { type: Type.STRING, description: "Actionable advice based on the user's journal and the bazi analysis." },
    overallScore: { type: Type.INTEGER, description: "An overall luck score for the day from 0-100." },
  },
  required: ["baziAnalysis", "advice", "overallScore"],
};

export const fetchDailyAlmanac = async (date: Date): Promise<AlmanacData> => {
  const dateStr = date.toISOString().split('T')[0];
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate the traditional Chinese Almanac (Huangli) data for the date: ${dateStr}. 
      Ensure the GanZhi (干支) is astronomically accurate for this specific day.
      Output in Simplified Chinese.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: almanacSchema,
        temperature: 0.2
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        date: dateStr,
        ...data
      };
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Failed to fetch almanac:", error);
    // Fallback data if API fails
    return {
      date: dateStr,
      ganZhi: "未知",
      solarTerm: "",
      yi: ["静心", "休息"],
      ji: ["冲动", "大额投资"],
      description: "云深不知处，静待天时。"
    };
  }
};

export const generatePersonalAnalysis = async (
  user: UserProfile,
  date: Date,
  journal: JournalEntry,
  almanac: AlmanacData
): Promise<AIAnalysisResult> => {
  const dateStr = date.toISOString().split('T')[0];

  const prompt = `
    Role: Professional Bazi (Four Pillars of Destiny) Master and Psychologist.
    Task: Analyze the daily fortune for the user based on their birth data vs. today's date, and combine this with their daily journal entry to provide advice.

    User Birth Data:
    Date: ${user.birthDate}
    Time: ${user.birthTime}

    Current Date Context:
    Date: ${dateStr}
    Day GanZhi: ${almanac.ganZhi}
    Solar Term: ${almanac.solarTerm}

    User's Daily Journal Entry (What actually happened/felt today):
    Mood (1-5): ${journal.mood}
    Mood Notes: ${journal.moodNote}
    Relationships: ${journal.relationships}
    Financial: Income ${journal.financeIncome}, Expense ${journal.financeExpense}, Notes: ${journal.financeNote}
    Health: ${journal.healthStatus}, Notes: ${journal.healthNote}
    Other Events: ${journal.otherEvents}

    Analysis Requirements:
    1. **Bazi Analysis**: specific analysis of the "Day Pillar" of the user vs the "Day Pillar" of today. Look for Heavenly Stem clashes/combinations and Earthly Branch clashes/harms/combinations (e.g. 辰戌冲, 子午冲). Explain it simply.
    2. **Advice**: Combine the metaphysical analysis with their actual journal entry. If they had a bad day and the Bazi shows a clash, explain that it's temporary. If they spent too much money and there is a "Rob Wealth" (Jie Cai) star, point it out.
    3. **Tone**: Empathetic, wise, calming.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using flash for speed, sufficient for this level of analysis
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.7 
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    throw new Error("No analysis generated");
  } catch (error) {
    console.error("Analysis failed", error);
    return {
      baziAnalysis: "星象云雾缭绕，暂无法解读详细命盘。",
      advice: "今日只需跟随内心，保持平和即可。",
      overallScore: 60
    };
  }
};
