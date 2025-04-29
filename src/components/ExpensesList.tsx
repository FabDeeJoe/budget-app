import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { useMonth } from '../contexts/MonthContext';
import EditExpenseModal from './EditExpenseModal';
import { Category } from '../types';
import { Link } from 'react-router-dom';

const ExpensesList = () => {
  const { expenses, updateExpense, deleteExpense } = useBudget();
  const { selectedMonth } = useMonth();
  const [editingExpense, setEditingExpense] = useState<null | {
    id: string;
    amount: number;
    category: Category;
    description: string | null;
    date: string;
  }>(null);

  const handleEdit = async (updatedExpense: {
    amount: number;
    category: Category;
    description: string | null;
    date: string;
  }) => {
    if (!editingExpense) return;

    try {
      await updateExpense(editingExpense.id, {
        ...updatedExpense,
        month: selectedMonth
      });
      setEditingExpense(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dépense:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      return;
    }

    try {
      await deleteExpense(id);
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense:', error);
    }
  };

  const sortedExpenses = expenses
    .filter(expense => expense.month === selectedMonth)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold">Liste des dépenses</h1>
        <Link
          to="/new"
          className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nouvelle dépense
        </Link>
      </div>
      
      {/* Version mobile - Cards */}
      <div className="md:hidden space-y-4">
        {sortedExpenses.map((expense) => (
          <div key={expense.id} className="bg-white shadow rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">
                {new Date(expense.date).toLocaleDateString('fr-FR')}
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {expense.amount.toFixed(2)} €
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {expense.category}
              </span>
            </div>
            <div className="text-sm text-gray-600 italic">
              {expense.description || '-'}
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setEditingExpense({
                  id: expense.id,
                  amount: expense.amount,
                  category: expense.category,
                  description: expense.description || null,
                  date: expense.date
                })}
                className="text-sm text-blue-600 hover:text-blue-900"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDelete(expense.id)}
                className="text-sm text-red-600 hover:text-red-900"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Version desktop - Table */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {new Date(expense.date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {expense.amount.toFixed(2)} €
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 italic">
                  {expense.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                  <button
                    onClick={() => setEditingExpense({
                      id: expense.id,
                      amount: expense.amount,
                      category: expense.category,
                      description: expense.description || null,
                      date: expense.date
                    })}
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingExpense && (
        <EditExpenseModal
          expense={editingExpense}
          onClose={() => setEditingExpense(null)}
          onSave={handleEdit}
        />
      )}
    </div>
  );
};

export default ExpensesList; 