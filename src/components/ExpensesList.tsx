import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { useMonth } from '../contexts/MonthContext';
import EditExpenseModal from './EditExpenseModal';
import { Category } from '../types';

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

  const filteredExpenses = expenses.filter(expense => expense.month === selectedMonth);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Liste des dépenses</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(expense.date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {expense.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {expense.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {expense.amount.toFixed(2)} €
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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