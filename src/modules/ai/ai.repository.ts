import prisma from "../../config/database";
import { AIInsightInput, updateAIInsightsInputs } from "./ai.types";

export class AIInsightRepository {
  async findByUserAndPeriod(userId: string, period: string) {
    return prisma.aIInsight.findFirst({
      where: {
        userId,
        period,
      },
    });
  }

  async create(data: AIInsightInput) {
    return prisma.aIInsight.create({
      data,
    });
  }

  async updateAIInsights(id: string, data: updateAIInsightsInputs) {
    return prisma.aIInsight.update({ where: { id }, data });
  }
}
