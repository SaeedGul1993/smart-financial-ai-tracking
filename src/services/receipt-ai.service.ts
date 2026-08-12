import { HTTP_STATUS } from "../constants/httpStatus";
import { AppError } from "../errors/appError";
import { PaymentMethod } from "../generated/prisma/enums";
import { receiptPrompt } from "../prompts/extract-data-receipt.prompt";
import { generateAIResponse } from "../utils/generateAIResponse";

interface Category {
  id: string;
  name: string;
}

interface ReceiptExtractionResult {
  merchantName: string | null;
  amount: number | null;
  date: string | null;
  paymentMethod: PaymentMethod;
  categoryId: string | null;
  description: string | null;
}

export class ReceiptAIService {
  async extractReceipt(receiptUrl: string, categories: Category[]) {
    const categoryList = categories
      ?.map((category) => `ID: ${category.id} | Name: ${category.name}`)
      .join("\n");
    const prompt = receiptPrompt(categoryList);
    const response = await fetch(receiptUrl);
    if (!response.ok)
      throw new AppError(
        HTTP_STATUS.BAD_REQUEST,
        "Failed to download receipt image",
      );
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType =
      response.headers.get("content-type") || "image/jpeg" || "image/webp";
    console.log("mimetype", mimeType);
    const aiResponse = await generateAIResponse(prompt, {
      data: base64Image,
      mimeType,
    });
    const cleanedText = aiResponse
      .replaceAll(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const parsed: ReceiptExtractionResult = JSON.parse(cleanedText);
    return parsed;
  }
}
