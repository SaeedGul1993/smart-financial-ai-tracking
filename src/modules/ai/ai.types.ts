export type SpendingInsightType =
  | "MAJOR_CATEGORY"
  | "HIGH_EXPENSE"
  | "MONTHLY_TREND";

export type RiskType =
  | "INCOME_CONCENTRATION"
  | "EXPENSE_GROWTH"
  | "CATEGORY_CONCENTRATION"
  | "OTHER";

export type Severity = "LOW" | "MEDIUM" | "HIGH";

export type SavingsStatus = "HEALTHY" | "MODERATE" | "LOW";

export type RecommendationPriority = "LOW" | "MEDIUM" | "HIGH";

export interface SpendingInsight {
  type: SpendingInsightType;
  category: string | null;
  amount: number | null;
  percentage: number | null;
  description: string | null;
  date: string | null;
  previousMonth: number | null;
  currentMonth: number | null;
  change: number | null;
  changePercentage: number | null;
  message: string;
}

export interface FinancialRisk {
  type: RiskType;
  severity: Severity;
  category: string | null;
  message: string;
}

export interface Recommendation {
  priority: RecommendationPriority;
  title: string;
  message: string;
}

export interface AIFinancialAnalysis {
  financialSummary: {
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
    savingsRate: number;
  };

  spendingInsights: SpendingInsight[];

  savingsAnalysis: {
    monthlySavings: number;
    savingsRate: number;
    status: SavingsStatus;
    message: string;
  };

  risks: FinancialRisk[];

  recommendations: Recommendation[];
}

export interface FinancialHealthInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  budgetUsagePercentage: number | null;
  incomeSourceCount: number;
  recurringExpenses: number | null;
}

export type FinancialHealthStatus =
  | "EXCELLENT"
  | "HEALTHY"
  | "FAIR"
  | "NEED_ATTENTION"
  | "CRITICAL";

export interface FinancialHealthScore {
  score: number;
  status: FinancialHealthStatus;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  breakdown: {
    savingsRate: {
      score: number;
      maxScore: number;
    };
    expenseControl: {
      score: number;
      maxScore: number;
    };
    budgetPerformance: {
      score: number;
      maxScore: number;
    };
    incomeStability: {
      score: number;
      maxScore: number;
    };
    recurringExpenseBurden: {
      score: number;
      maxScore: number;
    };
    metrics: {
      savingsRate: number;
      expenseRatio: number;
      recurringExpensesRatio: number | null;
    };
  };
}

export interface AIInsightInput {
  userId: string;
  period: string;
  result: object;
  model?: string;
  expiresAt?: Date;
}

export interface updateAIInsightsInputs {
  result: object;
  model?: string;
  expiresAt?: Date;
}

export type AIChatRole = "user" | "assistant";

export interface AIChatMessage {
  role: AIChatRole;
  content: string;
}

export interface AIChatInput {
  message: string;
  history?: AIChatMessage[];
}

export interface AIChatFinancialContext {
  income: {
    monthly: number;
    sources: {
      source: string;
      amount: number;
      percentage: number;
    }[];
  };

  expenses: {
    monthly: number;
    categories: {
      name: string;
      amount: number;
      percentage: number;
    }[];
    highestExpense: {
      amount: number;
      description: string | null;
      category: string;
    } | null;
  };

  savings: {
    monthly: number;
    rate: number;
  };

  budget: {
    totalBudget: number;
    totalUsed: number;
    usagePercentage: number;
  };

  recurring: {
    monthly: number;
  };
}
