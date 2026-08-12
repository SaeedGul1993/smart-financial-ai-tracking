import prisma from "../../config/database";
import { CategoryType } from "../../generated/prisma/client";

export interface CreateCategoryDto {
  name: string;
  slug: string;
  type: CategoryType;
  isDefault?: boolean;
  userId?: string;
}

export class CategoryRepository {
  async findAll(userId: string) {
    return await prisma.category.findMany({
      where: { OR: [{ isDefault: true }, { userId }] },
      orderBy: {
        name: "asc",
      },
    });
  }

  async findById(id: string) {
    return await prisma.category.findUnique({
      where: { id },
    });
  }

  async create(data: CreateCategoryDto) {
    return await prisma.category.create({
      data,
    });
  }

  async update(id: string, data: Partial<CreateCategoryDto>) {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.category.delete({ where: { id } });
  }

  async findDuplicateCategory(slug: string, name: string) {
    return prisma.category.findFirst({
      where: {
        slug,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });
  }

  async findAllByUserId(userId: string) {
    return prisma.category.findMany({
      where: {
        OR: [{ isDefault: true }, { userId }],
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
