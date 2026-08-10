import { PrismaClient } from "@prisma/client/extension";
import { DEFAULT_CATEGORIES } from "./categories.data";

export async function seedCategories(prisma: PrismaClient) {
  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },

      update: {},

      create: {
        ...category,

        isDefault: true,
      },
    });
  }

  console.log("✅ Categories seeded successfully");
}
