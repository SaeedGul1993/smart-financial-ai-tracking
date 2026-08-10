import { CategoryType } from "../../src/generated/prisma/enums";

export const DEFAULT_CATEGORIES = [
  {
    name: "Food",
    slug: "food",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Transport",
    slug: "transport",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Shopping",
    slug: "shopping",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Bills",
    slug: "bills",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Entertainment",
    slug: "entertainment",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Healthcare",
    slug: "healthcare",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Education",
    slug: "education",
    type: CategoryType.EXPENSE,
  },
  {
    name: "Salary",
    slug: "salary",
    type: CategoryType.INCOME,
  },
  {
    name: "Freelancing",
    slug: "freelancing",
    type: CategoryType.INCOME,
  },
  {
    name: "Investment",
    slug: "investment",
    type: CategoryType.INCOME,
  },
];
