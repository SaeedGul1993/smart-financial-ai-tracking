import prisma from "../../config/database";
import { createRefreshTokenInput } from "../../types";

interface createUserInput {
  name: string;
  email: string;
  password: string;
}

export class AuthRepository {
  async findByEmail(email: string) {
    return await prisma.user.findUnique({ where: { email } });
  }

  async findById(userId: string) {
    return await prisma.user.findUnique({ where: { id: userId } });
  }

  async create(data: createUserInput) {
    return await prisma.user.create({ data });
  }

  async createRefreshToken(data: createRefreshTokenInput) {
    return await prisma.refreshToken.upsert({
      where: { userId: data.userId },
      update: {
        token: data.token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      create: {
        token: data.token,
        userId: data.userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  async findRefreshToken(token: string) {
    return await prisma.refreshToken.findUnique({ where: { token } });
  }
  async deleteRefreshToken(token: string) {
    return await prisma.refreshToken.delete({ where: { token } });
  }
  async updateFcmToken(token: string, userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { fcmToken: token },
    });
  }
}
