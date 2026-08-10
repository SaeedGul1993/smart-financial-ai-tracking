"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanAIResponse = void 0;
const cleanAIResponse = (text) => {
    try {
        let cleaned = text.replace(/\\n/g, "\n").trim();
        return cleaned;
    }
    catch (error) {
        console.error("Failed to parse AI response");
        console.error("Raw AI response:", text);
        throw new Error("AI returned an invalid JSON response");
    }
};
exports.cleanAIResponse = cleanAIResponse;
