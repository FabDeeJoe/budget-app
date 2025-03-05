import { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import type { Expense, Category } from '../types/index';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';

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

const EditExpenseModal = ({ 
  expense, 
  onClose, 
  onSave 
}: { 
  expense: Expense; 
  onClose: () => void; 
  onSave: (updatedExpense: Omit<Expense, 'id'>) => void;
}) => {
  const [amount, setAmount] = useState(expense.amount.toString());
  const [category, setCategory] = useState<Category>(expense.category);
  const [description, setDescription] = useState(expense.description || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      amount: parseFloat(amount),
      category,
      description: description || undefined,
      date: expense.date
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Modifier la dépense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optionnelle)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Montant
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ExpensesList = () => {
  const { expenses, updateExpense, deleteExpense } = useBudget();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleSave = async (updatedExpense: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, updatedExpense);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
      await deleteExpense(id);
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