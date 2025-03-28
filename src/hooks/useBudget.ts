import { useState, useEffect } from 'react';
import { Budget, Expense, BudgetState, FixedExpense, Category } from '../types/index';
import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  deleteDoc,
  query,
  getDocs,
  updateDoc,
  where
} from 'firebase/firestore';
import { useMonth } from '../contexts/MonthContext';

const CATEGORIES: Category[] = [
  "Abonnements & téléphonie",
  "Auto",
  "Autres dépenses",
  "Cadeaux & solidarité",
  "Éducation & famille",
  "Impôts & taxes",
  "Logement",
  "Loisirs & sorties",
  "Retrait cash",
  "Santé",
  "Services financiers & professionnels",
  "Vie quotidienne",
  "Voyages",
  "Savings"
];

const defaultBudget: Budget = {
  fixedAmount: 0,
  variableAmount: 0,
  categoryBudgets: CATEGORIES.reduce((acc, category) => {
    acc[category] = 0;
    return acc;
  }, {} as Record<Category, number>)
};

const defaultState: BudgetState = {
  currentBudget: defaultBudget,
  expenses: [],
  fixedExpenses: []
};

export const useBudget = () => {
  const [state, setState] = useState<BudgetState>(defaultState);
  const { selectedMonth } = useMonth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le budget du mois sélectionné
        const budgetDoc = await getDoc(doc(db, 'budgets', selectedMonth));
        const budgetData = budgetDoc.exists() ? budgetDoc.data() as Budget : defaultBudget;

        // Récupérer les dépenses du mois sélectionné
        const expensesQuery = query(
          collection(db, 'expenses'),
          where('month', '==', selectedMonth)
        );
        const expensesSnapshot = await getDocs(expensesQuery);
        const expenses = expensesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Expense[];

        // Récupérer les dépenses fixes du mois sélectionné
        const fixedExpensesQuery = query(
          collection(db, 'fixedExpenses'),
          where('month', '==', selectedMonth)
        );
        const fixedExpensesSnapshot = await getDocs(fixedExpensesQuery);
        const fixedExpenses = fixedExpensesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as FixedExpense[];

        setState({
          currentBudget: budgetData,
          expenses,
          fixedExpenses
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const expenseWithMonth = {
        ...expense,
        month: selectedMonth
      };
      const docRef = await addDoc(collection(db, 'expenses'), expenseWithMonth);
      const newExpense: Expense = {
        ...expenseWithMonth,
        id: docRef.id
      };
      setState(prev => ({
        ...prev,
        expenses: [...prev.expenses, newExpense]
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense:', error);
    }
  };

  const updateExpense = async (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    try {
      const expenseWithMonth = {
        ...updatedExpense,
        month: selectedMonth
      };
      const expenseRef = doc(db, 'expenses', id);
      await updateDoc(expenseRef, expenseWithMonth);
      setState(prev => ({
        ...prev,
        expenses: prev.expenses.map(expense => 
          expense.id === id ? { ...expenseWithMonth, id } : expense
        )
      }));
      return true;
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const expenseRef = doc(db, 'expenses', id);
      await deleteDoc(expenseRef);
      setState(prev => ({
        ...prev,
        expenses: prev.expenses.filter(expense => expense.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const addFixedExpense = async (fixedExpense: Omit<FixedExpense, 'id'>) => {
    try {
      const fixedExpenseWithMonth = {
        ...fixedExpense,
        month: selectedMonth
      };
      const docRef = await addDoc(collection(db, 'fixedExpenses'), fixedExpenseWithMonth);
      const newFixedExpense: FixedExpense = {
        ...fixedExpenseWithMonth,
        id: docRef.id
      };
      setState(prev => ({
        ...prev,
        fixedExpenses: [...prev.fixedExpenses, newFixedExpense]
      }));
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense fixe:', error);
    }
  };

  const updateFixedExpense = async (id: string, updatedExpense: Omit<FixedExpense, 'id'>) => {
    try {
      const fixedExpenseWithMonth = {
        ...updatedExpense,
        month: selectedMonth
      };
      const expenseRef = doc(db, 'fixedExpenses', id);
      await updateDoc(expenseRef, fixedExpenseWithMonth);
      setState(prev => ({
        ...prev,
        fixedExpenses: prev.fixedExpenses.map(expense => 
          expense.id === id ? { ...fixedExpenseWithMonth, id } : expense
        )
      }));
    } catch (error) {
      console.error('Error updating fixed expense:', error);
    }
  };

  const deleteFixedExpense = async (id: string) => {
    try {
      const expenseRef = doc(db, 'fixedExpenses', id);
      await deleteDoc(expenseRef);
      setState(prev => ({
        ...prev,
        fixedExpenses: prev.fixedExpenses.filter(expense => expense.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting fixed expense:', error);
    }
  };

  const updateBudget = async (budget: Budget) => {
    try {
      await setDoc(doc(db, 'budgets', selectedMonth), budget);
      setState(prev => ({
        ...prev,
        currentBudget: budget
      }));
    } catch (error) {
      console.error('Erreur lors de la mise à jour du budget:', error);
    }
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
    updateExpense,
    deleteExpense,
    addFixedExpense,
    updateFixedExpense,
    deleteFixedExpense,
    updateBudget,
    getExpensesByCategory,
    getFixedExpensesByCategory,
    getTotalExpenses,
    getTotalFixedExpenses,
    getRemainingBudget,
    CATEGORIES
  };
}; 