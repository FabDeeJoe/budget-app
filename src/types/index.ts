export type Category =
  | "Abonnements & téléphonie"
  | "Auto"
  | "Autres dépenses"
  | "Cadeaux & solidarité"
  | "Éducation & famille"
  | "Impôts & taxes"
  | "Logement"
  | "Loisirs & sorties"
  | "Retrait cash"
  | "Santé"
  | "Services financiers & professionnels"
  | "Vie quotidienne"
  | "Voyages"
  | "Savings";

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  date: string;
  description?: string | null;
}

export interface FixedExpense {
  id: string;
  label: string;
  amount: number;
  category: Category;
}

export interface Budget {
  fixedAmount: number;
  variableAmount: number;
  categoryBudgets: Record<Category, number>;
}

export interface BudgetState {
  currentBudget: Budget;
  expenses: Expense[];
  fixedExpenses: FixedExpense[];
} 