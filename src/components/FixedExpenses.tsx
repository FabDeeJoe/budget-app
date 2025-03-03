import React, { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { Category } from '../types';

const FixedExpenses: React.FC = () => {
  const { fixedExpenses, addFixedExpense, removeFixedExpense } = useBudget();
  const [newExpense, setNewExpense] = useState({
    label: '',
    amount: 0,
    category: 'Vie quotidienne' as Category
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.label || !newExpense.amount || !newExpense.category) return;

    addFixedExpense({
      label: newExpense.label,
      amount: newExpense.amount,
      category: newExpense.category
    });

    setNewExpense({
      label: '',
      amount: 0,
      category: 'Vie quotidienne'
    });
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Dépenses Fixes</h2>
        
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
                Libellé
              </label>
              <input
                type="text"
                id="label"
                value={newExpense.label}
                onChange={(e) => setNewExpense(prev => ({ ...prev, label: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Montant
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="amount"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense(prev => ({ ...prev, amount: Number(e.target.value) }))}
                  min="0"
                  step="0.01"
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600 font-medium">€</span>
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                id="category"
                value={newExpense.category}
                onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value as Category }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Abonnements & téléphonie">Abonnements & téléphonie</option>
                <option value="Auto">Auto</option>
                <option value="Autres dépenses">Autres dépenses</option>
                <option value="Cadeaux & solidarité">Cadeaux & solidarité</option>
                <option value="Éducation & famille">Éducation & famille</option>
                <option value="Impôts & taxes">Impôts & taxes</option>
                <option value="Logement">Logement</option>
                <option value="Loisirs & sorties">Loisirs & sorties</option>
                <option value="Retrait cash">Retrait cash</option>
                <option value="Santé">Santé</option>
                <option value="Services financiers & professionnels">Services financiers & professionnels</option>
                <option value="Vie quotidienne">Vie quotidienne</option>
                <option value="Voyages">Voyages</option>
                <option value="Savings">Savings</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ajouter
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {fixedExpenses.map(expense => (
            <div key={expense.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <span className="text-lg font-medium text-gray-800">{expense.label}</span>
                  <span className="text-gray-600">{expense.category}</span>
                  <span className="text-lg font-semibold text-gray-900">{expense.amount.toFixed(2)}€</span>
                </div>
                <button
                  onClick={() => removeFixedExpense(expense.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 focus:outline-none"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FixedExpenses; 