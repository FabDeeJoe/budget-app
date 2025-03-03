import { useState, useEffect } from 'react';
import { useBudget } from '../hooks/useBudget';
import { Category } from '../types';

const CategoryBudgets = () => {
  const { budget, updateBudget } = useBudget();
  const [localBudgets, setLocalBudgets] = useState(budget.categoryBudgets);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalBudgets(budget.categoryBudgets);
  }, [budget.categoryBudgets]);

  const handleInputChange = (category: Category, value: string) => {
    const numValue = parseFloat(value) || 0;
    setLocalBudgets(prev => ({
      ...prev,
      [category]: numValue
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBudget({
        ...budget,
        categoryBudgets: localBudgets
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const categories = Object.keys(budget.categoryBudgets) as Category[];
  const totalBudget = categories.reduce((sum, category) => sum + localBudgets[category], 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Budget par Catégorie</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category} className="card">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {category}
            </label>
            <div className="relative rounded-md shadow-sm">
              <input
                type="number"
                value={localBudgets[category]}
                onChange={(e) => handleInputChange(category, e.target.value)}
                className="block w-full pr-12 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                min="0"
                step="0.01"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">€</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-2">Budget Total</h3>
        <p className="text-2xl font-bold text-budget-primary">{totalBudget.toFixed(2)} €</p>
      </div>
    </div>
  );
};

export default CategoryBudgets; 