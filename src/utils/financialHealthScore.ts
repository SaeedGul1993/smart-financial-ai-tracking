import {
  FinancialHealthInput,
  FinancialHealthScore,
  FinancialHealthStatus,
} from "../modules/ai/ai.types";

export const calculateFinancialHealthScore = (
  data: FinancialHealthInput,
): FinancialHealthScore => {
  const {
    monthlyIncome,
    monthlyExpenses,
    budgetUsagePercentage,
    incomeSourceCount,
    recurringExpenses,
  } = data;

  // ------------------------------------
  // 1. Basic calculations
  // ------------------------------------

  const savings = monthlyIncome - monthlyExpenses;

  const savingsRate = monthlyIncome > 0 ? (savings / monthlyIncome) * 100 : 0;

  const expenseRatio =
    monthlyIncome > 0 ? (monthlyExpenses / monthlyIncome) * 100 : 100;

  const recurringExpenseRatio =
    recurringExpenses !== null && monthlyIncome > 0
      ? (recurringExpenses / monthlyIncome) * 100
      : null;

  // ------------------------------------
  // 2. Savings Rate — 30 points
  // ------------------------------------

  let savingsScore = 0;

  if (savingsRate >= 40) {
    savingsScore = 30;
  } else if (savingsRate >= 30) {
    savingsScore = 25;
  } else if (savingsRate >= 20) {
    savingsScore = 20;
  } else if (savingsRate >= 10) {
    savingsScore = 10;
  } else if (savingsRate >= 0) {
    savingsScore = 5;
  }

  // ------------------------------------
  // 3. Expense Control — 25 points
  // ------------------------------------

  let expenseScore = 0;

  if (expenseRatio <= 40) {
    expenseScore = 25;
  } else if (expenseRatio <= 50) {
    expenseScore = 20;
  } else if (expenseRatio <= 60) {
    expenseScore = 15;
  } else if (expenseRatio <= 70) {
    expenseScore = 10;
  } else if (expenseRatio <= 90) {
    expenseScore = 5;
  }

  // ------------------------------------
  // 4. Budget Performance — 20 points
  // ------------------------------------

  let budgetScore = 0;

  if (budgetUsagePercentage === null) {
    budgetScore = 0;
  } else if (budgetUsagePercentage <= 80) {
    budgetScore = 20;
  } else if (budgetUsagePercentage <= 100) {
    budgetScore = 15;
  } else if (budgetUsagePercentage <= 120) {
    budgetScore = 8;
  }

  // ------------------------------------
  // 5. Income Stability — 15 points
  // ------------------------------------

  let incomeScore = 0;

  if (incomeSourceCount >= 2) {
    incomeScore = 15;
  } else if (incomeSourceCount === 1) {
    incomeScore = 12;
  }

  // ------------------------------------
  // 6. Recurring Expense Burden — 10
  // ------------------------------------

  let recurringScore = 0;

  if (recurringExpenseRatio === null) {
    recurringScore = 0;
  } else if (recurringExpenseRatio <= 30) {
    recurringScore = 10;
  } else if (recurringExpenseRatio <= 40) {
    recurringScore = 8;
  } else if (recurringExpenseRatio <= 50) {
    recurringScore = 5;
  } else if (recurringExpenseRatio <= 70) {
    recurringScore = 2;
  }

  // ------------------------------------
  // 7. Calculate available maximum
  // ------------------------------------

  const availableMaxScore =
    30 +
    25 +
    (budgetUsagePercentage !== null ? 20 : 0) +
    15 +
    (recurringExpenses !== null ? 10 : 0);

  const rawScore =
    savingsScore +
    expenseScore +
    (budgetUsagePercentage !== null ? budgetScore : 0) +
    incomeScore +
    recurringScore;

  // ------------------------------------
  // 8. Normalize to 100
  // ------------------------------------

  const score =
    availableMaxScore > 0
      ? Math.round((rawScore / availableMaxScore) * 100)
      : 0;

  // ------------------------------------
  // 9. Status
  // ------------------------------------

  let status: FinancialHealthStatus;

  if (score >= 90) {
    status = "EXCELLENT";
  } else if (score >= 75) {
    status = "HEALTHY";
  } else if (score >= 60) {
    status = "FAIR";
  } else if (score >= 40) {
    status = "NEED_ATTENTION";
  } else {
    status = "CRITICAL";
  }

  // ------------------------------------
  // 10. Confidence
  // ------------------------------------

  const availableFactors =
    1 + // savings
    1 + // expense
    1 + // income
    (budgetUsagePercentage !== null ? 1 : 0) +
    (recurringExpenses !== null ? 1 : 0);

  let confidence: "HIGH" | "MEDIUM" | "LOW";

  if (availableFactors === 5) {
    confidence = "HIGH";
  } else if (availableFactors >= 3) {
    confidence = "MEDIUM";
  } else {
    confidence = "LOW";
  }

  return {
    score,
    status,
    confidence,

    breakdown: {
      savingsRate: {
        score: savingsScore,
        maxScore: 30,
      },

      expenseControl: {
        score: expenseScore,
        maxScore: 25,
      },

      budgetPerformance: {
        score: budgetScore,
        maxScore: 20,
      },

      incomeStability: {
        score: incomeScore,
        maxScore: 15,
      },

      recurringExpenseBurden: {
        score: recurringScore,
        maxScore: 10,
      },

      metrics: {
        savingsRate: Number(savingsRate.toFixed(2)),

        expenseRatio: Number(expenseRatio.toFixed(2)),

        recurringExpensesRatio:
          recurringExpenseRatio !== null
            ? Number(recurringExpenseRatio.toFixed(2))
            : null,
      },
    },
  };
};
