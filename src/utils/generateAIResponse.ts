import aiModel from "../config/ai";

export const generateAIResponse = async (prompt: string) => {
  const result = await aiModel.generateContent(prompt);

  return result.response.text();
};
