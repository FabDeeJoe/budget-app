import { useBudget } from '../hooks/useBudget';
import { Category } from '../types';
import { Link } from 'react-router-dom';

const CurrentBudget = () => {
  const { 
    budget, 
    getTotalExpenses, 
    getTotalFixedExpenses,
    getExpensesByCategory,
    getFixedExpensesByCategory 
  } = useBudget();
  
  const categories = Object.keys(budget.categoryBudgets) as Category[];
  const totalBudget = categories.reduce((sum, category) => sum + budget.categoryBudgets[category], 0);
  const totalExpenses = getTotalExpenses();
  const totalFixedExpenses = getTotalFixedExpenses();
  const remainingBudget = totalBudget - (totalExpenses + totalFixedExpenses);
  const remainingPercentage = (remainingBudget / totalBudget) * 100;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
        <Link
          to="/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nouvelle dépense
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Budget Total</h3>
          <p className="text-2xl font-bold text-budget-primary">{totalBudget.toFixed(2)} €</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Dépenses Variables</h3>
          <p className="text-2xl font-bold text-budget-danger">{totalExpenses.toFixed(2)} €</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Dépenses Fixes</h3>
          <p className="text-2xl font-bold text-budget-warning">{totalFixedExpenses.toFixed(2)} €</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Reste à Dépenser</h3>
          <p className="text-2xl font-bold text-budget-success">{remainingBudget.toFixed(2)} €</p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Pourcentage Restant</h3>
          <p className="text-2xl font-bold text-budget-info">{remainingPercentage.toFixed(1)}%</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Détail par Catégorie</h3>
        <div className="space-y-4">
          {categories.map(category => {
            const budgeted = budget.categoryBudgets[category];
            const variableExpenses = getExpensesByCategory(category);
            const fixedExpenses = getFixedExpensesByCategory(category);
            const totalSpent = 
              variableExpenses.reduce((sum, exp) => sum + exp.amount, 0) +
              fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
            const remaining = budgeted - totalSpent;
            const progress = (totalSpent / budgeted) * 100;

            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{category}</span>
                  <span className="text-sm text-gray-600">
                    {totalSpent.toFixed(2)} € / {budgeted.toFixed(2)} €
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      progress > 100 ? 'bg-budget-danger' : 'bg-budget-primary'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  Restant: {remaining.toFixed(2)} €
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CurrentBudget; 