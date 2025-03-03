import { useState, useEffect } from 'react';
import { Budget, Expense, BudgetState, FixedExpense } from '../types';

const STORAGE_KEY = 'budget_app_state';

const defaultBudget: Budget = {
  fixedAmount: 0,
  variableAmount: 0,
  categoryBudgets: {
    "Abonnements & téléphonie": 0,
    "Auto": 0,
    "Autres dépenses": 0,
    "Cadeaux & solidarité": 0,
    "Éducation & famille": 0,
    "Impôts & taxes": 0,
    "Logement": 0,
    "Loisirs & sorties": 0,
    "Retrait cash": 0,
    "Santé": 0,
    "Services financiers & professionnels": 0,
    "Vie quotidienne": 0,
    "Voyages": 0,
    "Savings": 0
  }
};

const defaultState: BudgetState = {
  currentBudget: defaultBudget,
  expenses: [],
  fixedExpenses: []
};

export const useBudget = () => {
  const [state, setState] = useState<BudgetState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: crypto.randomUUID()
    };
    setState(prev => ({
      ...prev,
      expenses: [...prev.expenses, newExpense]
    }));
  };

  const addFixedExpense = (fixedExpense: Omit<FixedExpense, 'id'>) => {
    const newFixedExpense: FixedExpense = {
      ...fixedExpense,
      id: crypto.randomUUID()
    };
    setState(prev => ({
      ...prev,
      fixedExpenses: [...prev.fixedExpenses, newFixedExpense]
    }));
  };

  const removeFixedExpense = (id: string) => {
    setState(prev => ({
      ...prev,
      fixedExpenses: prev.fixedExpenses.filter(expense => expense.id !== id)
    }));
  };

  const updateBudget = (budget: Budget) => {
    setState(prev => ({
      ...prev,
      currentBudget: budget
    }));
  };

  const getExpensesByCategory = (category: string) => {
    return state.expenses.filter(expense => expense.category === category);
  };

  const getFixedExpensesByCategory = (category: string) => {
    return state.fixedExpenses.filter(expense => expense.category === category);
  };

  const getTotalExpenses = () => {
    return state.expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getTotalFixedExpenses = () => {
    return state.fixedExpenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getRemainingBudget = () => {
    const totalBudget = state.currentBudget.fixedAmount + state.currentBudget.variableAmount;
    return totalBudget - getTotalExpenses() - getTotalFixedExpenses();
  };

  return {
    budget: state.currentBudget,
    expenses: state.expenses,
    fixedExpenses: state.fixedExpenses,
    addExpense,
    addFixedExpense,
    removeFixedExpense,
    updateBudget,
    getExpensesByCategory,
    getFixedExpensesByCategory,
    getTotalExpenses,
    getTotalFixedExpenses,
    getRemainingBudget
  };
}; 