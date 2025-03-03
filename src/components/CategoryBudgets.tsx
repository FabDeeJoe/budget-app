import React from 'react';
import { useBudget } from '../hooks/useBudget';
import { Budget } from '../types';

const CategoryBudgets: React.FC = () => {
  const { budget, updateBudget } = useBudget();

  const handleCategoryBudgetChange = (category: string, value: number) => {
    const newBudget: Budget = {
      ...budget,
      categoryBudgets: {
        ...budget.categoryBudgets,
        [category]: value
      }
    };
    updateBudget(newBudget);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Budgets par Catégorie</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(budget.categoryBudgets).map(([category, amount]) => (
            <div key={category} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex flex-col gap-3">
                <label htmlFor={`budget-${category}`} className="text-lg font-medium text-gray-700">
                  {category}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    id={`budget-${category}`}
                    value={amount}
                    onChange={(e) => handleCategoryBudgetChange(category, Number(e.target.value))}
                    min="0"
                    step="0.01"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-600 font-medium">€</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBudgets; 