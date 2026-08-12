import aiModel from "../config/ai";

export const generateAIResponse = async (prompt: string, inlineData?: any) => {
  const result = await aiModel.generateContent([prompt, { inlineData }]);

  return result.response.text();
};
