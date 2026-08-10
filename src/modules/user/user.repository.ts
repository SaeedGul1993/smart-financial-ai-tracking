import prisma from "../../config/database";

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
  monthlyIncome: number;
}

export class UserRepository {
  async findById(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        currency: true,
        monthlyIncome: true,
        password: false,
      },
    });
  }

  async updateProfile(userId: string, data: Partial<User>) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        currency: true,
        monthlyIncome: true,
        password: false,
      },
    });
  }
}
