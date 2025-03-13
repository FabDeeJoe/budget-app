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
  updateDoc
} from 'firebase/firestore';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer le budget
        const budgetDoc = await getDoc(doc(db, 'budget', 'current'));
        const budgetData = budgetDoc.exists() ? budgetDoc.data() as Budget : defaultBudget;

        // Récupérer les dépenses
        const expensesQuery = query(collection(db, 'expenses'));
        const expensesSnapshot = await getDocs(expensesQuery);
        const expenses = expensesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Expense[];

        // Récupérer les dépenses fixes
        const fixedExpensesQuery = query(collection(db, 'fixedExpenses'));
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
  }, []);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'expenses'), expense);
      const newExpense: Expense = {
        ...expense,
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
      const expenseRef = doc(db, 'expenses', id);
      await updateDoc(expenseRef, updatedExpense);
      setState(prev => ({
        ...prev,
        expenses: prev.expenses.map(expense => 
          expense.id === id ? { ...updatedExpense, id } : expense
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
      const docRef = await addDoc(collection(db, 'fixedExpenses'), fixedExpense);
      const newFixedExpense: FixedExpense = {
        ...fixedExpense,
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
      const expenseRef = doc(db, 'fixedExpenses', id);
      await updateDoc(expenseRef, updatedExpense);
      setState(prev => ({
        ...prev,
        fixedExpenses: prev.fixedExpenses.map(expense => 
          expense.id === id ? { ...updatedExpense, id } : expense
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
      await setDoc(doc(db, 'budget', 'current'), budget);
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
    getRemainingBudget
  };
}; 