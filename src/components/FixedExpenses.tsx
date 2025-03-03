import React, { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import type { Category, FixedExpense } from '../types/index';

const FixedExpenses = () => {
  const { fixedExpenses, addFixedExpense, deleteFixedExpense } = useBudget();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Vie quotidienne');
  const [label, setLabel] = useState('');

  const categories: Category[] = [
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFixedExpense: Omit<FixedExpense, 'id'> = {
      amount: parseFloat(amount),
      category,
      label
    };

    addFixedExpense(newFixedExpense);
    setAmount('');
    setLabel('');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette dépense fixe ?')) {
      await deleteFixedExpense(id);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Nouvelle Dépense Fixe</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-1">
              Label
            </label>
            <input
              type="text"
              id="label"
              required
              className="input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Montant (€)
            </label>
            <input
              type="number"
              id="amount"
              step="0.01"
              required
              className="input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              id="category"
              required
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Ajouter la dépense fixe
            </button>
          </div>
        </form>
      </div>

      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">Dépenses Fixes</h2>
        <div className="space-y-4">
          {fixedExpenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
              <div>
                <h3 className="font-medium">{expense.label}</h3>
                <p className="text-sm text-gray-500">{expense.category}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-semibold">{expense.amount.toFixed(2)} €</span>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="text-red-600 hover:text-red-900"
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