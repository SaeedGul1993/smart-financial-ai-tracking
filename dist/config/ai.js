"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const generativeAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const aiModel = generativeAI.getGenerativeModel({
    model: "gemini-flash-latest",
});
exports.default = aiModel;
