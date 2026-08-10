"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAIJson = void 0;
const parseAIJson = (response) => {
    try {
        let cleaned = response.trim();
        cleaned = cleaned
            .replace(/^```json\s*/i, "")
            .replace(/^```\s*/i, "")
            .replace(/\s*```$/i, "")
            .trim();
        return JSON.parse(cleaned);
    }
    catch (error) {
        console.error("Failed to parse AI response");
        console.error("Raw AI response:", response);
        throw new Error("AI returned an invalid JSON response");
    }
};
exports.parseAIJson = parseAIJson;
