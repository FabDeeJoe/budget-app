import React, { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { Category } from '../types';
import { useMonth } from '../contexts/MonthContext';

const FixedExpenses = () => {
  const { selectedMonth } = useMonth();
  const { fixedExpenses, addFixedExpense, updateFixedExpense, deleteFixedExpense, CATEGORIES } = useBudget();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<Category>(CATEGORIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const newFixedExpense = {
        label: newLabel,
        amount: parseFloat(newAmount),
        category: newCategory,
        month: selectedMonth
      };

      await addFixedExpense(newFixedExpense);
      setIsAdding(false);
      setNewLabel('');
      setNewAmount('');
      setNewCategory(CATEGORIES[0]);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dépense fixe:', error);
      alert('Une erreur est survenue lors de l\'ajout de la dépense fixe.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, updatedExpense: {
    label: string;
    amount: number;
    category: Category;
  }) => {
    try {
      await updateFixedExpense(id, {
        ...updatedExpense,
        month: selectedMonth
      });
      setEditingId(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la dépense fixe:', error);
      alert('Une erreur est survenue lors de la mise à jour de la dépense fixe.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense fixe ?')) {
      try {
        await deleteFixedExpense(id);
      } catch (error) {
        console.error('Erreur lors de la suppression de la dépense fixe:', error);
        alert('Une erreur est survenue lors de la suppression de la dépense fixe.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dépenses fixes</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Ajouter une dépense fixe
        </button>
      </div>

      {isAdding && (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Nouvelle dépense fixe</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700">
                Libellé
              </label>
              <input
                type="text"
                id="label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Montant
              </label>
              <input
                type="number"
                id="amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                step="0.01"
                min="0"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Catégorie
              </label>
              <select
                id="category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as Category)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                disabled={isSubmitting}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {fixedExpenses.map((expense) => (
            <li key={expense.id} className="px-4 py-4 sm:px-6">
              {editingId === expense.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdate(expense.id, {
                      label: expense.label,
                      amount: expense.amount,
                      category: expense.category
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Libellé
                    </label>
                    <input
                      type="text"
                      value={expense.label}
                      onChange={(e) => {
                        const updatedExpense = { ...expense, label: e.target.value };
                        fixedExpenses[fixedExpenses.findIndex(fe => fe.id === expense.id)] = updatedExpense;
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Montant
                    </label>
                    <input
                      type="number"
                      value={expense.amount}
                      onChange={(e) => {
                        const updatedExpense = { ...expense, amount: parseFloat(e.target.value) };
                        fixedExpenses[fixedExpenses.findIndex(fe => fe.id === expense.id)] = updatedExpense;
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Catégorie
                    </label>
                    <select
                      value={expense.category}
                      onChange={(e) => {
                        const updatedExpense = { ...expense, category: e.target.value as Category };
                        fixedExpenses[fixedExpenses.findIndex(fe => fe.id === expense.id)] = updatedExpense;
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
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
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{expense.label}</p>
                    <p className="text-sm text-gray-500">{expense.category}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-semibold text-gray-900">
                      {expense.amount.toFixed(2)} €
                    </span>
                    <button
                      onClick={() => setEditingId(expense.id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FixedExpenses; 