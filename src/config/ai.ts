import { GoogleGenerativeAI } from "@google/generative-ai";

const generativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const aiModel = generativeAI.getGenerativeModel({
  model: "gemini-flash-latest",
});

export default aiModel;
