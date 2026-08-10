import prisma from "../src/config/database";
import { seedCategories } from "./seeds/category.seed";

async function main() {
  await seedCategories(prisma);
}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });
