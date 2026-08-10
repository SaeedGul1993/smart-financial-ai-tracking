"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAIResponse = void 0;
const ai_1 = __importDefault(require("../config/ai"));
const generateAIResponse = async (prompt) => {
    const result = await ai_1.default.generateContent(prompt);
    return result.response.text();
};
exports.generateAIResponse = generateAIResponse;
