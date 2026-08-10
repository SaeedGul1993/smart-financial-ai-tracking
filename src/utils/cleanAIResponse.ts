export const cleanAIResponse = (text: string): string => {
  try {
    let cleaned = text.replace(/\\n/g, "\n").trim();

    return cleaned;
  } catch (error) {
    console.error("Failed to parse AI response");
    console.error("Raw AI response:", text);

    throw new Error("AI returned an invalid JSON response");
  }
};
