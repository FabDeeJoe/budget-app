import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import type { Expense, Category } from '../types/index';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import EditExpenseModal from './EditExpenseModal';
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

const ExpensesList = () => {
  const { selectedMonth } = useMonth();
  const { expenses, deleteExpense, updateExpense } = useBudget();
  const [editingExpense, setEditingExpense] = useState<{
    id: string;
    amount: number;
    category: Category;
    description: string | null;
    date: string;
  } | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      await deleteExpense(id);
    }
  };

  const handleEdit = (expense: {
    id: string;
    amount: number;
    category: Category;
    description: string | null;
    date: string;
  }) => {
    setEditingExpense(expense);
  };

  const handleSave = async (
    expense: {
      amount: number;
      category: Category;
      description: string | null;
      date: string;
    }
  ) => {
    if (editingExpense) {
      try {
        await updateExpense(editingExpense.id, {
          ...expense,
          month: selectedMonth
        });
        setEditingExpense(null);
      } catch (error) {
        console.error('Error updating expense:', error);
        alert('Une erreur est survenue lors de la mise à jour de la dépense.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Liste des Dépenses</h1>
        <Link
          to="/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nouvelle dépense
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((expense) => (
            <li key={expense.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {expense.description || 'Sans description'}
                  </p>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="truncate">{expense.category}</span>
                    <span className="mx-2">•</span>
                    <span>{format(new Date(expense.date), 'dd MMMM yyyy', { locale: fr })}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-900">
                    {expense.amount.toFixed(2)} €
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(expense)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ExpensesList; 