export const getBudgetStatus = (percentage: number) => {
  if (percentage >= 100) return "EXCEEDED";
  if (percentage >= 90) return "WARNING";
  return "ON_TRACK";
};
