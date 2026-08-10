import { AIFinancialAnalysis } from "../modules/ai/ai.types";

export const parseAIJson = (response: string): AIFinancialAnalysis => {
  try {
    let cleaned = response.trim();

    cleaned = cleaned
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return JSON.parse(cleaned) as AIFinancialAnalysis;
  } catch (error) {
    console.error("Failed to parse AI response");
    console.error("Raw AI response:", response);

    throw new Error("AI returned an invalid JSON response");
  }
};
