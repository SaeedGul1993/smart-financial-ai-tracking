export interface createBudgetInput {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}

export interface updateBudgetInput {
  id: string;
  categoryId?: string;
  amount?: number;
  month?: number;
  year?: number;
}

export interface budgetFilters {
  month?: number;
  year?: number;
}
