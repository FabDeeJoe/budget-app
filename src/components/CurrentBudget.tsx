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

  // Obtenir le mois en cours en français
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

  // Grouper les catégories actives et inactives
  const activeCategories = categories.filter(category => {
    const budgeted = budget.categoryBudgets[category];
    const variableExpenses = getExpensesByCategory(category);
    const fixedExpenses = getFixedExpensesByCategory(category);
    const totalSpent = 
      variableExpenses.reduce((sum, exp) => sum + exp.amount, 0) +
      fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return budgeted > 0 || totalSpent > 0;
  });

  const inactiveCategories = categories.filter(category => !activeCategories.includes(category));

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-budget-danger';
    if (progress >= 50) return 'bg-budget-warning';
    return 'bg-budget-success';
  };

  // Calculer les pourcentages et trier les catégories actives
  const sortedActiveCategories = activeCategories.map(category => {
    const budgeted = budget.categoryBudgets[category];
    const variableExpenses = getExpensesByCategory(category);
    const fixedExpenses = getFixedExpensesByCategory(category);
    const totalSpent = 
      variableExpenses.reduce((sum, exp) => sum + exp.amount, 0) +
      fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const progress = (totalSpent / budgeted) * 100;
    return { category, progress, budgeted, totalSpent };
  }).sort((a, b) => a.progress - b.progress);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
          <p className="text-lg text-gray-600">{currentMonth}</p>
        </div>
        <Link
          to="/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Nouvelle dépense
        </Link>
      </div>

      <div className="card">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Budget Total</span>
            <span className="text-sm text-gray-600">
              {(totalExpenses + totalFixedExpenses).toFixed(2)} € / {totalBudget.toFixed(2)} €
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${getProgressColor((totalExpenses + totalFixedExpenses) / totalBudget * 100)}`}
              style={{ width: `${Math.min((totalExpenses + totalFixedExpenses) / totalBudget * 100, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>Restant: {remainingBudget.toFixed(2)} €</span>
            <span>{remainingPercentage.toFixed(1)}%</span>
          </div>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Catégories actives */}
          {sortedActiveCategories.map(({ category, progress, budgeted, totalSpent }) => {
            const remaining = budgeted - totalSpent;
            const remainingCatPercentage = (remaining / budgeted) * 100;

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
                    className={`h-2.5 rounded-full ${getProgressColor(progress)}`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Restant: {remaining.toFixed(2)} €</span>
                  <span>{remainingCatPercentage.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Catégories inactives */}
        {inactiveCategories.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-500 mb-3">Catégories inactives</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {inactiveCategories.map(category => (
                <div key={category} className="text-sm text-gray-400">
                  {category}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentBudget; 